---
title: "把手机当终端用：Termux 的安装与配置"
date: 2025-08-12
related: "[[Linux 文件系统]] [[Linux 安装 Tailscale]]"
tags:
  - 技术
  - Linux
  - Termux
  - Android
---


**Termux** 在 Android 上提供终端和软件包环境，常用于命令行工具、编程与脚本。它不是完整的 Linux 发行版；Android 的权限和后台管理仍然适用。

> [!note] 官方参考
> [Termux 中文官网](https://termux.dev/cn/) · [Termux Wiki](https://wiki.termux.com/wiki/Main_Page) · [learn-termux](https://github.com/yxd1024/learn-termux)

### 安装与初始化

1. 从 Termux 官方列出的渠道选择安装包。F-Droid 与 GitHub 发布渠道的签名不能混装更新；先确认当前安装来源，再从同一来源升级。Google Play 渠道也不能简单概括为“已停更”，不同发布轨道状态有差异。
2. 首次打开执行：

```bash
termux-setup-storage              # 请求共享存储访问权限
pkg update && pkg upgrade -y      # 更新软件源与全部软件包
```

### 包管理

| 命令                              | 说明                |
| --------------------------------- | ------------------- |
| `pkg search <name>`               | 搜索软件包          |
| `pkg install <name>`              | 安装                |
| `pkg uninstall <name>`            | 卸载                |
| `pkg list-installed` | 列出已安装包 |
| `pkg list-all` | 列出软件源中的可用包 |
| `pkg show <name>` | 查看包信息 |
| `pkg update`                      | 更新软件源          |
| `pkg upgrade -y`                  | 升级全部软件包      |

> [!note] `pkg` 是 Termux 对包管理操作的封装。Termux 环境与 proot 里的 Ubuntu 等环境各有自己的软件包，命令要在对应环境里运行。

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

Tmux 可让会话在终端分离后继续运行，但 Android 可能限制或回收 Termux 后台进程；它不能保证关闭 App 或系统休眠后任务一直存活。

### Windows 游戏（Mobox）

**Mobox** 是基于 Wine 与 Box64 的项目，尝试在部分 Android 设备上运行 Windows 软件或游戏。兼容性取决于设备和软件；这里保留项目链接，不把它写成普遍可用的游戏方案：[Mobox](https://github.com/olegos2/mobox)。

### Neovim + LazyVim

```bash
pkg update && pkg upgrade -y
pkg install neovim -y

# 备份原有配置（重要）
mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null
mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null

# 克隆 LazyVim Starter 配置
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git        # 删除克隆目录的 Git 元数据；执行前确认路径
nvim                              # 首次启动自动下载插件
```

参考配置：[dotLazyVim](https://github.com/Veha0001/dotLazyVim)

> 这篇保留的是命令参考，不是 Android 设备上的逐条实测记录。Proot 的稳定版与 main 分支可能有行为差异，遇到问题先核对自己安装的版本。
