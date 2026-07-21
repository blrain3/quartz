后续章节：[[无涯/计算机科学/开发/开发工具/Git/C2 Git 基础|Git 基础]]。

---
title: Git 起步
date: 2025-01-10
---

>在开始之前，请先了解并阅读 [《Pro Git》](https://git-scm.com/book/zh/v2/)的部分内容。
## 版本控制

### 本地版本控制系统（LVCS）

最早期的做法是复制整个项目目录并加上时间戳命名，简单但容易出错。后来出现了基于数据库的本地 VCS，最流行的是 **RCS**，通过在硬盘上保存"补丁集"（文件修订前后的差异）来记录历史。

```
┌─────────────┐
│  本地数据库  │
│  (RCS)      │
└─────────────┘
     ↑
  工作目录
```

### 集中化的版本控制系统（CVCS）

- **结构**：单一中央服务器 + 多个客户端
- **优点**：每个人可以看到他人的工作，管理员易于管理权限
- **缺点**：中央服务器是单点故障，一旦宕机则无法协同工作；中央数据库损坏则可能丢失全部历史

```
┌──────────────┐
│   中央服务器  │
│  (CVS/SVN)   │
└──────┬───────┘
       │
  ┌────┴────┐
  ↓    ↓    ↓
客户端1 客户端2 客户端3
```

### 分布式版本控制系统（DVCS）

客户端不只是提取最新版本，而是把**整个代码仓库完整镜像**下来。

- **核心优势**：每次克隆都是完整备份，任何一处服务器故障都可以用本地仓库恢复
- **支持多远端**：可以在同一个项目中与多个远端仓库交互，实现复杂的协作工作流

```
┌──────────────┐
│  远端仓库 A   │
└──────────────┘
       ↑
┌──────────────┐
│  远端仓库 B   │
└──────────────┘
       ↑
┌──────────────┐
│  本地完整镜像 │
│  (含完整历史) │
└──────────────┘
```

---

## 安装 Git

### Linux

```bash
# Fedora / RHEL / CentOS
sudo dnf install git-all

# Debian / Ubuntu
sudo apt install git-all
```

官网参考：https://git-scm.com/download/linux

### macOS

```bash
# 查看是否已安装
git --version

# 未安装会提示安装 Xcode Command Line Tools
```

官网安装包：https://git-scm.com/download/mac

### Windows

- **官方推荐**：下载 Git for Windows（msysGit）→ https://git-scm.com/download/win
- **Chocolatey**：`choco install git`（社区维护）
- **GitHub Desktop**：安装后自带命令行 Git → https://desktop.github.com/

> 注意：Git for Windows 和 msysGit 是同一个项目，与 Git 本身是两个独立项目。

### 从源码安装

需要依赖：autotools、curl、zlib、openssl、expat、libiconv

```bash
# Debian/Ubuntu
sudo apt-get install dh-autoreconf libcurl4-gnutls-dev libexpat1-dev \
  gettext libz-dev libssl-dev

# 编译安装
tar -zxf git-2.8.0.tar.gz
cd git-2.8.0
./configure --prefix=/usr
make all doc info
sudo make install install-doc install-html install-info
```

---

## 初次运行 Git 前的配置

### 配置的三个层级

| 文件 | 作用域 | 选项 |
|---|---|---|
| `/etc/gitconfig` | 系统所有用户和仓库 | `--system` |
| `~/.gitconfig` 或 `~/.config/git/config` | 当前用户所有仓库 | `--global` |
| `.git/config` | 当前仓库 | `--local`（默认） |

每个级别覆盖上一级：`.git/config` > `~/.gitconfig` > `/etc/gitconfig`

查看所有配置及来源：
```bash
git config --list --show-origin
```

### 设置用户名和邮箱

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

> 使用 `--global` 只需设置一次，之后所有提交都会使用此信息。  
> 针对单个项目使用不带 `--global` 的命令即可覆盖全局设置。

### 配置默认文本编辑器

```bash
# Emacs
git config --global core.editor emacs

# Windows Notepad++（32位或64位）
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

### 检查配置

```bash
# 列出所有配置
git config --list

# 查看某一项配置
git config user.name

# 查看配置原始值和来源文件
git config --show-origin rerere.autoUpdate
```