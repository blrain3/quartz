---
title: Git 分支
date: 2025-02-05
---

## 分支

### Git 如何保存数据

Git 保存的不是文件变化，而是一系列**快照**。每次提交会生成一个**提交对象**，包含：
- 指向暂存内容快照的指针
- 作者信息、提交信息
- 父对象指针（首次提交无父对象，普通提交有一个父对象，合并提交有多个）

### 分支的本质

**分支本质上是一个指向提交对象的可变指针。**
Git 默认分支名是 `master`，它会在每次提交时自动向前移动。

![](https://git-scm.com/book/zh/v2/images/basic-branching-1.png)

创建一个新分支 = 在一个文件中写入 41 个字节（40字符SHA-1哈希 + 换行），轻量到极致。

### HEAD 指针

`HEAD` 是一个**指向当前所在分支的指针**。
![](https://git-scm.com/book/zh/v2/images/head-to-master.png)

---

## 分支的新建与合并

### 命令

```bash
# 创建分支（不切换）
git branch <分支名>

# 创建并切换到新分支
git checkout -b <分支名>

# 切换分支
git checkout <分支名>

# 新版 Git 推荐写法（效果相同）
git switch <分支名>        # 切换
git switch -c <分支名>     # 创建并切换
```

![](https://git-scm.com/book/zh/v2/images/two-branches.png)

执行`git chekout testing`或`git switch testing`后，`HEAD`指针会移动
![](https://git-scm.com/book/zh/v2/images/head-to-testing.png)
### 合并的三种情况

#### 快进合并（Fast-forward）
当目标分支是当前分支的直接祖先时，Git 只需将指针前移。
![](https://r2.salix.eu.org/obsidian/20260516092952220.webp)
```bash
git checkout master
git merge hotfix
# 输出: Fast-forward
```

#### 三方合并（Recursive）
当两个分支走向分叉时，Git 使用两个分支的末端快照 + 公共祖先，进行三方合并，生成一个**合并提交**。
![](https://r2.salix.eu.org/obsidian/20260516093107678.webp)
![](https://git-scm.com/book/zh/v2/images/basic-merging-1.png)
![](https://git-scm.com/book/zh/v2/images/basic-merging-2.png)

```bash
git checkout master
git merge iss53
# 输出: Merge made by the 'recursive' strategy.
```

#### 冲突合并
当同一文件的同一部分被不同分支修改时，Git 无法自动合并，需要手动解决。

**冲突标记：**
```
<<<<<<< HEAD
当前分支的修改
=======
被合并分支的修改
>>>>>>> iss53
```

**解决步骤：**
```bash
# 编辑文件，手动解决冲突
# 标记为已解决
git add <冲突文件>

# 完成合并提交
git commit

# 或使用图形化工具
git mergetool
```

---

## 分支管理

### 查看分支

```bash
git branch              # 列出所有分支，* 表示当前分支
git branch -v           # 查看每个分支的最后一次提交
git branch -vv          # 查看跟踪关系、领先/落后状态
```

### 查看合并状态

```bash
git branch --merged     # 已合并到当前分支的分支（可安全删除）
git branch --no-merged   # 尚未合并的分支
```

### 删除分支

```bash
git branch -d <分支名>   # 删除已合并的分支
git branch -D <分支名>   # 强制删除未合并的分支
```

---

## 分支开发工作流

### 长期分支

保持多条长期分支，不同阶段存放不同稳定级别的代码。

```
master  ──────── 完全稳定（已发布/即将发布）
develop/next ── 后续开发/测试稳定性
proposed/pu ─── 包含不成熟内容
```

稳定分支指针落后，前沿分支指针靠前，形成流水线。

### 主题分支

短期分支，用于单一功能或实验。

```bash
# 示例：同时进行多个主题分支
C1 ── master
  └── iss91 分支（解决问题A）
       └── iss91v2 分支（尝试另一种方案）
  └── dumbidea 分支（实验性想法）
```

特点：
- 创建、合并、删除都非常轻量
- 一天内多次操作没问题
- 工作按特性隔离，上下文切换快
- 成熟后再合并，不需要的直接丢弃

---

## 远程分支

### 核心概念

- **远程引用**：对远程仓库的引用（指针）
- **远程跟踪分支**：`origin/master` 形式命名，反映上次与远程通信时的状态

### 推送 Push

```bash
# 推送本地分支到远程
git push origin serverfix

# 推送并指定远程分支名
git push origin serverfix:awesomebranch
```

> 注意：本地分支不会自动同步，必须显式推送

### 拉取 Fetch & Pull

```bash
git fetch origin       # 获取远程数据（不合并）
git pull               # fetch + merge
```

> 建议分开使用 `fetch` 和 `merge`，更清晰可控

### 跟踪分支（Upstream）

```bash
# 从远程跟踪分支创建本地分支
git checkout -b serverfix origin/serverfix

# 或使用简写（远程有且本地无此分支时自动创建）
git checkout serverfix

# 设置已有分支的跟踪关系
git branch -u origin/serverfix

# 查看所有跟踪分支及领先/落后情况
git branch -vv
# 输出示例：
# iss53     7e424c3 [origin/iss53: ahead 2] ...
#   ↑ ahead 2 = 本地有2个提交未推送
```

### 删除远程分支

```bash
git push origin --delete serverfix
```

---

## 变基 Rebase

### 核心概念

变基是整合分支的另一种方法，将提交"重新播放"到另一个分支上，使提交历史变成一条直线。

```
合并（三方合并）        变基（重新播放）
    C3                      C3'
     \                       \
      C4   →  合并结果 →    C4'
       /                       \
      C5                      C5'
```

### 基本用法

```bash
# 将当前分支变基到目标分支
git rebase master

# 之后快进合并
git checkout master
git merge experiment
```

### 高级用法：onto

```bash
# 将 client 分支中不在 server 分支的部分，变基到 master
git rebase --onto master server client
```

### 变基的风险 

> **黄金准则：不要对已推送的提交执行变基！**

如果提交已推送到公共仓库，别人可能基于这些提交进行了开发，此时变基会导致：
- 对方的提交历史出现混乱
- 重复合并、丢失提交

### 变基后恢复

如果真的遇到别人强制推送覆盖了你的基础提交，可以用变基来解决：
```bash
git pull --rebase
# 或
git fetch
git rebase teamone/master
```

Git 会通过 `patch-id` 识别哪些是你的修改，尽量正确应用。

### 变基 vs 合并

| 对比 | 变基 | 合并 |
|------|------|------|
| 历史 | 线性、整洁 | 保留分叉历史 |
| 结果 | 快照相同 | 快照相同 |
| 适用场景 | 本地整理、向他人贡献代码前 | 保留真实开发历史 |

- 只对**本地**尚未推送的提交执行变基
- 从不对已推送的公共提交执行变基
