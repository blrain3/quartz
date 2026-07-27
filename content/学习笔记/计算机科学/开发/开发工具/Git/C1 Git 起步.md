---
title: Git 起步
date: 2025-01-10
tags:
  - Git
  - 版本控制
---

后续章节：[[C2 Git 基础|Git 基础]] → [[C3 Git 分支|Git 分支]]。

Git 是目前最流行的分布式版本控制系统，用于跟踪文件的修改历史，方便多人协作。

## 安装 Git

### Windows

从 [git-scm.com](https://git-scm.com/) 下载安装包，一路默认安装即可。安装完成后可在命令行中使用 `git --version` 验证。

### macOS

```bash
brew install git
```

### Linux

```bash
sudo apt install git      # Debian/Ubuntu
sudo dnf install git      # Fedora
```

## 初次配置

安装后需要设置用户名和邮箱，这些信息会记录在每次提交中：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 基本概念

- **工作区（Working Directory）**：你当前编辑的文件目录
- **暂存区（Staging Area / Index）**：准备提交的更改
- **本地仓库（Local Repository）**：Git 保存历史版本的地方
- **远程仓库（Remote Repository）**：托管在服务器上的仓库（如 GitHub）