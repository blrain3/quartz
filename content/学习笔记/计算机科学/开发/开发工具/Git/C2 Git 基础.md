---
title: Git 基础
date: 2025-01-20
tags:
  - Git
  - 版本控制
---

记得刚开始使用Git的时候真是一头雾水，一出错就想着复制一份新的仓库拷贝，与下面的漫画十分相似：
<p style="text-align: center;">
  <img src="https://cloudflare-imgbed-wrn.pages.dev/file/obsidian/1774670919336_IMG-20260327234330178.webp" width="50%" />
</p>

---

## 获取 Git 仓库

### 初始化新仓库
```bash
cd /path/to/project
git init                    # 创建 .git 目录
```

### 克隆现有仓库
```bash
git clone https://github.com/user/repo          # 默认仓库名
git clone https://github.com/user/repo myname    # 自定义本地目录名
```

---

## 记录更新到仓库

### 基本工作流程

```
工作区修改文件
    ↓
git add <file>          # 暂存（把修改加入下次提交）
    ↓
git commit -m "message" # 提交到本地仓库
```

### 文件状态

一个文件在 Git 中有四种状态：

| 状态 | 说明 |
|------|------|
| **未跟踪**（Untracked） | Git 尚不认识的新文件 |
| **已修改**（Modified） | 文件有变化但未暂存 |
| **已暂存**（Staged） | 标记为待提交 |
| **已提交**（Committed） | 已保存在 Git 数据库 |
工作目录下的每一个文件都不外乎这两种状态：**已跟踪** 或 **未跟踪**。
![|697x315](https://r2.salix.eu.org/obsidian/20260516093318250.webp)

```bash
git status                      # 查看当前状态
git status -s                   # 简洁输出

git add <file>                  # 暂存指定文件
git add .                       # 暂存所有修改（包括新文件）
git add -p                      # 交互式暂存（选择文件的部分修改）

git commit -m "提交信息"        # 提交
git commit -am "提交信息"       # 跳过暂存区，直接提交已跟踪文件

git mv old_file new_file       # 重命名文件（Git 自动跟踪）
git rm <file>                   # 删除文件并暂存
git rm --cached <file>         # 从 Git 移除但保留文件（用于 .gitignore）
```

### Git 提交规范常用词

1. **feat** 新增功能 
2. **fix** 修复bug 
3. **chore** 杂项/配置/清理代码 
4. **docs** 修改文档 
5. **style** 格式调整（无逻辑改动） 
6. **refactor** 代码重构 
7. **test** 新增/修改测试 
8. **perf** 性能优化 
9. **build** 构建打包相关
10. **ci** 持续集成配置 

**例句 - feat: 新增搜索功能 - fix: 修复接口报错 - chore: 优化项目依赖**

### .gitignore

```bash
# 注释
*.log           # 忽略所有 .log 文件
node_modules/   # 忽略目录
!lib.js        # 但 lib.js 除外
```

---

## 查看提交历史

### git log

```bash
git log                        # 按时间倒序列出所有提交
git log -p -2                  # 显示最近2次提交的详细差异（-p = patch）
git log --stat                 # 显示简略统计信息（改了多少文件）
git log --oneline              # 每条提交一行（精简）
git log --pretty=oneline       # 同上，完整哈希值

# 格式化输出
git log --pretty=format:"%h - %an : %s"
```

**常用 format 占位符：**

| 占位符 | 说明 |
|--------|------|
| `%H` | 完整哈希值 |
| `%h` | 简短哈希值 |
| `%an` | 作者名字 |
| `%ar` | 相对时间（如 "2 days ago"） |
| `%s` | 提交说明 |

### 限制输出

```bash
git log -3                     # 只显示最近3条
git log --since=2.weeks        # 最近两周
git log --author="name"        # 筛选作者
git log --grep="keyword"       # 筛选提交说明含有关键字的
git log -S "function_name"     # 筛选添加/删除了某字符串的提交
git log -- path/to/file        # 只显示某文件的提交历史
```

### 可视化分支

```bash
git log --graph --oneline --all   # 图形化展示所有分支
```

---

## 五、撤消操作

### 修订最后一次提交

```bash
# 漏提交了文件，或者提交信息写错了
git commit -m 'initial commit'
git add forgotten_file
git commit --amend              # 替代最后一次提交，不会出现单独的小提交
```

> 相当于用新的提交替换旧的，旧提交会从历史中消失

### 取消暂存

```bash
git reset HEAD <file>           # 取消暂存某个文件（不丢失修改）
git reset HEAD                  # 取消暂存所有文件
```

### 撤消文件修改

```bash
git checkout -- <file>          # 丢弃工作区的修改（危险！会丢失修改）
# 新版 Git 推荐：
git restore <file>             # 丢弃工作区的修改
git restore --staged <file>     # 取消暂存
```

> 未提交的内容一旦丢失几乎无法找回，已提交的数据通常可以恢复

---

## 远程仓库

### 查看远程仓库

```bash
git remote                      # 列出所有远程仓库简写
git remote -v                   # 显示简写 + 对应 URL
git remote show <name>          # 查看某远程仓库的详细信息
```

### 添加 / 删除远程仓库

```bash
git remote add <shortname> <url>   # 添加远程仓库
git remote remove <name>           # 删除远程仓库
git remote rename <old> <new>      # 重命名
git remote set-url <name> <url>     # 修改 URL
```

### 抓取与拉取

```bash
git fetch <remote>              # 抓取远程数据（不自动合并）
git pull                        # 抓取 + 自动合并（= fetch + merge）
git pull --rebase               # 抓取 + 变基
```

> `fetch` 不会修改工作区，只是下载数据；`pull` 会自动合并

### 推送

```bash
git push <remote> <branch>      # 推送到远程
git push origin master          # 典型用法
git push -u origin <branch>     # 首次推送，设置上游跟踪
```

> 只有有写入权限且无人抢先推送时才会成功，否则需先拉取合并

### 远程仓库清理

```bash
git remote prune <name>         # 删除远程已删除分支的本地引用
```

---

## Git 标签

### 创建标签

```bash
# 轻量标签（仅名字）
git tag v1.0

# 附注标签（推荐，包含更多信息）
git tag -a v1.0 -m "版本1.0发布"
```

### 查看标签

```bash
git tag                        # 列出所有标签
git tag -l "v1.*"              # 筛选标签
git show <tag>                # 查看标签详情
```

### 推送标签

```bash
git push origin <tagname>       # 推送单个标签
git push origin --tags         # 推送所有标签
```

### 删除标签

```bash
git tag -d <tagname>            # 删除本地标签
git push origin --delete <tag>  # 删除远程标签
```


---
## git diff

```bash
git diff              # 工作区 vs 暂存区（未暂存的修改）
git diff --staged     # 暂存区 vs 上次提交（已暂存的修改）
git diff HEAD         # 工作区 vs 最新提交（全部修改）
git diff <commit1> <commit2>   # 两个提交之间的差异
git diff --stat               # 简略统计
```

下一步：[[C3 Git 分支|Git 分支]]。