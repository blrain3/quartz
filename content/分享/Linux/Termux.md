---
title: Termux
related: "[[Linux 文件系统]] [[Linux 安装 Tailscale]]"
date: 2025-08-12
tags:
  - 计算机
  - 开发工具
  - Termux
  - Android
---

**Termux**是无需 Root 的 Android 终端模拟器与 Linux 环境，提供完整命令行体验，支持包管理、编程与脚本运行。核心价值是把手机变成便携 Linux 电脑。

> [!note] 官方参考
> [Termux 中文官网](https://termux.dev/cn/) · [Termux Wiki](https://wiki.termux.com/wiki/Main_Page) · [learn-termux](https://github.com/yxd1024/learn-termux)

### 安装与初始化

1. 从 **F-Droid** 下载安装（Google Play 版已停更）。
2. 首次打开执行：

```bash
termux-setup-storage              # 授予存储权限
pkg update && pkg upgrade -y      # 更新软件源与全部软件包
```

### 包管理

| 命令                              | 说明                |
| --------------------------------- | ------------------- |
| `pkg search <name>`               | 搜索软件包          |
| `pkg install <name>`              | 安装                |
| `pkg uninstall <name>`            | 卸载                |
| `pkg list` / `pkg list-installed` | 列出全部 / 已安装包 |
| `pkg show <name>`                 | 查看包信息          |
| `pkg update`                      | 更新软件源          |
| `pkg upgrade -y`                  | 升级全部软件包      |

> [!note] `pkg` 是 `apt` 的 Termux 优化封装，日常优先使用 `pkg`；`apt` 命令同样可用。

### 安装 Linux 发行版（proot-distro）

```bash
pkg install proot-distro          # 安装容器工具
proot-distro install ubuntu       # 安装发行版（ubuntu/debian/arch 等）
proot-distro login ubuntu         # 登录进入
exit                              # 退出回 Termux
proot-distro list                 # 查看已安装发行版
```

### 按键与补全

- **音量上键 + Q**：呼出功能键条（输入法上方显示常用按键）
- **TAB 键**：自动补全命令、路径、文件名
- **音量上键 + K**：临时切换工具栏

### 配置与美化

**去除启动欢迎语**：

```bash
touch ~/.hushlogin        # 重启后生效
```

**关闭底部工具栏**：

```bash
mkdir -p ~/.termux
cat > ~/.termux/termux.properties << EOF
extra-keys = []
EOF
# 保存后重启 Termux 生效
```

**安装 ZSH + oh-my-zsh**：

```bash
pkg install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s zsh               # 设为默认 shell，重启生效
```

### Tmux 终端复用

```bash
pkg install tmux           # Termux 主环境
apt install tmux -y        # proot 的 Ubuntu 环境内
```

| 按键                    | 功能                 |
| ----------------------- | -------------------- |
| `tmux`                  | 启动会话             |
| `Ctrl+b` 然后 `d`       | 分离会话（后台运行） |
| `Ctrl+b` 然后 `%`       | 垂直分割窗口         |
| `Ctrl+b` 然后 `"`       | 水平分割窗口         |
| `Ctrl+b` 然后 `c`       | 新建窗口             |
| `Ctrl+b` 然后 `n` / `p` | 切换窗口             |

Tmux 使多个任务可同时运行，关闭 App 不中断进程。

### Windows 游戏（Mobox）

**Mobox**：基于 Wine + Box64 的开源项目，无需 Root 在 Android 运行 Windows PC 游戏，[项目地址](https://github.com/olegos2/mobox)。

### Neovim + LazyVim

```bash
pkg update && pkg upgrade -y
pkg install neovim -y

# 备份原有配置（重要）
mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null
mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null

# 克隆 LazyVim Starter 配置
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git        # 删除 .git 便于自定义
nvim                              # 首次启动自动下载插件
```

参考配置：[dotLazyVim](https://github.com/Veha0001/dotLazyVim)
