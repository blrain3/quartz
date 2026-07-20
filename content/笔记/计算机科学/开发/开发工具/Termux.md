Termux 是一款**无需 Root 权限**的 Android 终端模拟器和 Linux 环境应用。它能在手机上提供完整的 Linux 命令行体验，支持包管理、编程、脚本运行等。

- **[termux-x11](https://github.com/termux/termux-x11)**：Termux 官方的 X Window System 服务，用于在 Android 上运行 Linux 图形界面（GUI）程序。
- **核心价值**：把 Android 手机变成一台便携的 Linux 电脑。

**官方参考**：
- [Termux 中文官网](https://termux.dev/cn/)
- [Termux Wiki](https://wiki.termux.com/wiki/Main_Page)
- [learn-termux 项目](https://github.com/yxd1024/learn-termux)

## 安装

1. 从 **F-Droid** 下载最新 Termux。
2. 首次打开后执行以下命令：

```bash
termux-setup-storage     # 授予存储权限
pkg update && pkg upgrade -y    # 更新软件源和所有软件包
```

## 基础命令操作

```bash
clear                    # 清屏
pkg list                 # 查看所有可安装的软件包
pkg install <软件名>     # 安装软件（推荐使用 pkg）
apt update && apt upgrade -y    # 更新软件源（可经常执行）
```

- `pkg` 是 Termux 优化后的包管理器，优先使用。
- `apt` 也可以使用，但 `pkg` 更适配 Termux 环境。

## 安装 Linux 发行版（proot-distro）

```bash
pkg install proot-distro          # 安装容器工具
proot-distro install ubuntu       # 安装 Ubuntu（推荐）
```

**登录 Ubuntu**：
```bash
proot-distro login ubuntu
```

**退出 Linux 环境**：
```bash
exit
```

## 命令自动补全

- 按 **音量上键 + Q** 显示功能键条（输入法上方会出现常用按键）。
- 之后使用 **TAB 键** 即可自动补全命令、路径、文件名。

## 美化 Termux

### 去除启动欢迎信息

```bash
touch ~/.hushlogin
```
创建后重启 Termux，欢迎语消失。

### 安装 ZSH + oh-my-zsh

```bash
pkg install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s zsh                    # 设置 zsh 为默认 Shell
```
重启 Termux 后即可使用美观强大的 ZSH 环境。

### 关闭底部工具栏

```bash
mkdir -p ~/.termux
cat > ~/.termux/termux.properties << EOF
extra-keys = []
EOF
```
保存后**重启 Termux** 生效。

**临时切换工具栏**：音量上键 + K

## Tmux 终端复用器

### 安装

```bash
# 在 Termux 主环境安装
pkg install tmux

# 在 Ubuntu 环境中安装
apt install tmux -y
```

### 基本使用

- 启动：`tmux`
- 分离会话（后台运行）：`Ctrl + b` 然后按 `d`
- 垂直分割窗口：`Ctrl + b` 然后 `%`
- 水平分割窗口：`Ctrl + b` 然后 `"`
- 新建窗口：`Ctrl + b` 然后 `c`
- 切换窗口：`Ctrl + b` 然后 `n` 或 `p`

Tmux 允许你在 Termux 中同时运行多个任务，即使关闭 App 也不会中断进程。

**教程**：
- [Tmux教程（一文就够）](https://blog.csdn.net/CSSDCC/article/details/121231906)
- [tmux 完全指南](https://zhuanlan.zhihu.com/p/1953886323011215929)

## Mobox

Mobox 是一个开源项目，基于 **Wine + Box64**，可以在 Android 设备上运行 Windows PC 游戏，无需 Root。

- **[Mobox 项目地址](https://github.com/olegos2/mobox)**
---
## 在 Termux（Android）中安装 Neovim + LazyVim

1. **安装 Neovim**（在 Termux 中）：
   ```bash
   pkg update && pkg upgrade -y
   pkg install neovim -y
   ```

2. **安装 LazyVim（推荐使用 Starter 模板）**：
   ```bash
   # 备份原有配置（重要！）
   mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null
   mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null

   # 克隆 Starter 配置
   git clone https://github.com/LazyVim/starter ~/.config/nvim

   # 删除 .git 文件夹（便于后续自定义）
   rm -rf ~/.config/nvim/.git

   # 启动 Neovim，LazyVim 会自动下载插件
   nvim
   ```

**Termux LazyVim 配置**：
- 项目地址：[dotLazyVim](https://github.com/Veha0001/dotLazyVim)