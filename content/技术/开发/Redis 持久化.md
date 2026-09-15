---
title: Redis 持久化：RDB 与 AOF 的取舍
date: 2026-09-15
tags:
  - 技术
  - 开发
  - Redis
---

Redis 的持久化机制是它从「缓存」走向「数据库」的关键分水岭。当初我把它当一个更快的 Memcached 用，直到一次服务器重启丢了两小时的会话数据，才回头认真读了一遍 `redis.conf` 里那几行注释。这篇把 RDB 和 AOF 的取舍摊开讲，附上我实际跑过的配置和性能数据。

### 两种机制在做什么

RDB（Redis Database）做的是**时间点快照**。它通过 `fork()` 出一个子进程，把当前内存里的数据集原封不动地序列化成一个压缩的二进制文件。父进程继续服务客户端，不清楚磁盘 I/O 的痛苦。这个文件紧凑、可复制、适合做灾备——你甚至可以每小时一份保留 24 小时、每天一份保留 30 天。

AOF（Append Only File）做的是**写命令日志**。每个写命令都被追加到文件末尾，重启时重放这些命令来恢复数据。它的代价是文件会持续变大，所以 Redis 会定期执行 `BGREWRITEAOF`——这也是一次 fork——把当前数据集用最小命令集重写一遍。

### fork 的代价

RDB 和 AOF 都依赖 `fork()`。现代操作系统用 copy-on-write 让 fork 开始很快（页表复制），但脏页会随写操作增加。数据集越大，fork 越慢。Redis 官方文档说：

> fork() can be time consuming if the dataset is big, and may result in Redis stopping serving clients for some milliseconds or even for one second if the dataset is very big and the CPU performance is not great.

一次 fork 能让主进程卡住数百毫秒，这正是高并发场景下最容易忽视的延迟尖刺来源。

### 耐久性对比

默认策略 `appendfsync everysec` 意味着 OS 每秒 fsync 一次，崩溃最多丢 **1 秒写入**。改成 `appendfsync always` 则每个写命令都 fsync，延迟直接翻倍；`appendfsync no` 让 OS 自己决定，最快但崩溃时可能丢几秒甚至几分钟数据。Redis 官方原文：

> With the default policy of fsync every second, write performance is still great. fsync is performed using a background thread and the main thread will try hard to perform writes when no fsync is in progress, so you can only lose one second worth of writes.

默认的 `save` 策略（`save 900 1`、`save 300 10`、`save 60 10000`）意味着 RDB 可能丢失数分钟数据。这不是缺陷，这是设计取舍——RDB 的目标不是零丢失，而是紧凑、快恢复、好备份。

### 恢复速度

RDB 恢复时是纯二进制加载，比 AOF 的单线程逐条重放快得多。对于 10GB 级别的数据集，AOF 恢复可能需要几分钟，而 RDB 只需要几秒。但 Redis 7+ 的 **hybrid 模式**改变了这个等式——重写后的 AOF 文件开头是 RDB 快照段落，后面追加增量命令。启动时先加载 RDB 段落，再重放尾巴上的命令。官方称之为 `aof-use-rdb-preamble yes`，这是现代 Redis 的默认值。

### 写放大与性能

RDB 的写放大几乎为零——父进程在 fork 之后只做内存拷贝，磁盘 I/O 全在子进程完成。AOF 则在每次写命令时至少写一次 page cache（不一定落盘）。用 `appendfsync everysec` 时，fsync 虽然由后台线程执行，但它会阻塞主线程短时间。实际压测下来，`everysec` 的吞吐量衰减通常在 **5-15%** 之间，取决于 SSD 的 IOPS 能力；`always` 模式则会掉 30-50%。

### 推荐配置

生产环境的标准做法是**两者都开**：

```ini
# AOF
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-use-rdb-preamble yes

# RDB
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
```

这套组合的数据丢失窗口是 **1 秒**（来自 `everysec`），恢复时走 RDB 段落，启动速度接近纯 RDB，同时保留了紧凑的快照文件用于备份。Stack Harbor 在他们的 Managed Operations 运行手册里只给一个 primary-store Redis 配置：`appendonly yes` + `aof-use-rdb-preamble yes` + 独立数据盘。其余的全是这个组合的变体。

### 一个 .gitignore 之外的坑

`stop-writes-on-bgsave-error yes` 经常被忽视。它的意思是：快照失败时拒绝客户端写入。初看像过度保守——不就是一次备份失败吗，为什么不继续服务？但继续服务的代价是：你在不知情的情况下把数据丢失从「快照间隔内已落盘的部分」扩大到「从上次成功快照之后的所有写入」。对一个 Redis 来说，磁盘满或者权限丢失导致 BGSAVE 连续失败，意味着你最后能用的恢复点可能是几小时前的。

正确姿势是监控 `rdb_last_bgsave_status`，把它接到告警里。数据丢失窗口是显式配置，快照失败是静默漂移。

---

参考：[Redis persistence docs](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) · [Redis Persistence and Durability: RDB Snapshots & AOF](https://redis.io/tutorials/operate/redis-at-scale/persistence-and-durability)
