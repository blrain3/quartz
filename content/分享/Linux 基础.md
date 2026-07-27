---
title: Linux 基础
date: 2025-07-20
tags:
  - Linux
---

[Linux](https://zh.wikipedia.org/wiki/Linux) 是一种自由和开放源码的类 Unix 操作系统。该操作系统的内核由林纳斯·托瓦兹在 1991 年首次发布。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784605986705_image.webp" width="20%" />
</p>

> Linux 的标志和吉祥物是一只名为 Tux 的企鹅。

<p style="text-align: center;">
  <img src="https://r2.salix.eu.org/obsidian/20260507152957767.webp" width="80%" />
</p>
<center><small>操作系统软硬件架构关系图，内核负责应用软件和计算机硬件的交互</small></center>

---

## 命令基础

### Shell 提示符

当 shell 以交互方式运行时，会显示提示符等待输入：
```
[username@host ~]$
```
以 `root` 身份运行时，`$` 会变为 `#`：
```
[root@host ~]#
```

### 命令结构

Linux 命令遵循统一语法：
```bash
command [options] [arguments]
```

- **command**：要执行的命令名称（如 `ls`、`cp`、`rm`）
- **options**：调整命令行为的标志，以 `-` 或 `--` 开头
- **arguments**：命令的输入对象，如文件名或路径

> [!TIP] 可以用 `man command` 查看某条指令的手册。

### 常用快捷键

| 操作 | 快捷键 |
|:---|:------|
| 查找上一条命令 | 上箭头 |
| 跳到上一个词开头 | Ctrl + 左箭头 |
| 清除光标到行尾 | Ctrl + K |
| 补全命令、文件名、选项 | Tab |
| 跳转到命令行开头 | Ctrl + A |
| 显示命令历史 | `history` |

### 查看系统信息

```bash
uname -a          # 打印所有系统信息
lscpu             # 查看 CPU 架构信息
whoami            # 查看当前登录用户名
```

---

## 文件系统

### 层级结构

Linux 文件系统以 `/` 为根目录的树形结构组织。`/` 同时也是路径中的目录分隔符。

![](https://r2.salix.eu.org/obsidian/20260507161515444.webp)

| 路径 | 用途 |
|:---|:----|
| `/bin` | 核心命令二进制文件 |
| `/boot` | 启动引导文件 |
| `/etc` | 系统配置文件 |
| `/home` | 用户主目录 |
| `/root` | 管理员主目录 |
| `/lib` | 共享库和内核模块 |
| `/mnt` | 临时挂载点 |
| `/opt` | 附加软件包 |
| `/usr` | 已安装软件和共享库 |
| `/var` | 持久化变量数据（日志等） |
| `/tmp` | 临时文件，所有用户可访问 |

> [!TIP] 用 `man hier` 了解更多文件系统层级信息。

### 路径

- **绝对路径**：从 `/` 开始，如 `/home/john/documents`
- **相对路径**：相对于当前目录，不以 `/` 开头

### 目录操作

```bash
pwd            # 显示当前目录
cd /path       # 切换目录
cd ..          # 返回上级
cd ../..       # 返回上两级
cd ~ 或 cd     # 前往主目录
cd -           # 返回上一个路径
```

---

## 文件和文件夹管理

### 创建

```bash
mkdir foo                    # 创建空目录
mkdir -p tools/help          # 递归创建
touch file.txt               # 创建空文件
touch f1.txt f2.txt          # 批量创建
```

### 查看

`ls -l` 的输出中，行首字符标识类型：`-` 代表文件，`d` 代表目录，`l` 代表符号链接。

```bash
ls -l
# total 24
# drwxr-xr-x 11 wen wen 4096 Apr 15 10:12 Code
# -rw-r--r--  1 wen wen 6156 Apr 14 17:00 bun.lock
```

![image.webp](https://tg.salix.eu.org/file/1778292977935_image.webp)
![image.webp](https://tg.salix.eu.org/file/1778292978895_image.webp)

### 删除

```bash
rm file.txt                  # 删除文件
rm -r directory              # 递归删除目录
rm -f file.txt               # 强制删除（无确认）
rmdir empty_dir              # 删除空目录
```

> [!WARNING] 使用 `rm -f` 时要谨慎，不会征求确认。在 root 下执行 rm 可能删掉系统文件。

### 复制

```bash
cp source.txt /path/dest/    # 复制到目标位置
cp file1.txt file2.txt       # 在同一目录创建副本
```

### 移动与重命名

```bash
mv file.txt backup/          # 移动文件到目录
mv dir1/ backup/             # 移动目录
mv old.txt new.txt           # 重命名文件
mv dir1 dir2                 # 重命名目录
```

### 搜索文件

`find` 命令的基本语法：
```bash
find /path -type f -name "filename"
```

- `-type f`：普通文件；`d`：目录；`l`：符号链接；`c`：字符设备；`b`：块设备
- `-name`：文件名模式（支持通配符）

```bash
find . -type f -name "*.html"    # 搜索 .html 文件
find . -type f -name ".*"        # 搜索隐藏文件
find / -size +250M               # 搜索大于 250MB 的文件
find /path -name "*.txt" -mtime -10  # 10天内修改的文件
```

---

## 查看文件内容

### 完整显示

```bash
cat file.txt          # 一次性显示全部内容
```

### 分页浏览

```bash
less file.txt         # 交互式浏览（space 翻页，q 退出）
more file.txt         # 精简版分页浏览
```

### 首尾部分

```bash
head file.txt         # 前 10 行
head -n 50 file.txt   # 前 50 行
tail file.txt         # 后 10 行
tail -n 50 file.txt   # 后 50 行
tail -f file.log      # 实时追踪文件写入（监控日志）
```

### 统计

```bash
wc file.txt           # 行数 / 词数 / 字符数
```

### 文件比较

```bash
diff file1 file2      # 对比两个文件
diff -u file1 file2   # 统一格式输出
diff -y file1 file2   # 并排对比
```
