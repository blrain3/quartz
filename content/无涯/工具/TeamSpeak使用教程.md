---
title: TeamSpeak 使用教程
date: 2026-07-21
---

TeamSpeak 是一款跨平台的语音通信软件，广泛应用于游戏、线上会议等场景。目前主要有 **TeamSpeak 3（TS3）** 和 **TeamSpeak 6（TS6）** 两个版本，支持 Windows、macOS 和 Linux。

---

## 下载客户端

### 官网下载（TS3 / TS6）

访问 [TeamSpeak 官方网站](https://www.teamspeak.com/en/)：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631226098_image.webp" width="80%" />
</p>

点击 **Downloads** 进入下载页面，选择对应版本和平台：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631993387_image.webp" width="80%" />
</p>

### 微软商店下载（仅 TS6）

访问 [微软商店页面](https://apps.microsoft.com/detail/xpdcj80kgnrvss?hl=zh-CN&gl=CN)，点击安装即可。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631717855_image.webp" width="80%" />
</p>

---

## 安装步骤

运行安装包，按以下步骤操作：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784632060238_image.webp" width="80%" />
</p>

1. 点击 **Next**
2. 勾选同意许可协议，点击 **Next**
3. 点击 **Install**

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784632370353_image.webp" width="80%" />
</p>

安装完成后即可启动软件。

---

## 首次配置

### 创建账户

打开软件后，填写注册信息创建账户：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686450418_image.webp" width="80%" />
</p>

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686525364_image.webp" width="80%" />
</p>

### 更改语言

在设置中将界面切换为中文：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686743328_image.webp" width="80%" />
</p>

### 连接服务器

点击添加书签，输入服务器地址进行连接：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687043403_image.webp" width="80%" />
</p>

---

## TS3 说明

TS3 无需注册账号。点击 **Connections**，输入服务器名称、用户名即可连接（密码可选）。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687236623_image.webp" width="80%" />
</p>

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687310119_image.webp" width="80%" />
</p>

TS3 官方客户端**不包含中文**。需要额外安装 [汉化包](https://github.com/jitingcn/TS3-Translation_zh-CN) 来启用中文界面。下载汉化包后安装，重启 TS3 客户端即可。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687471748_image.webp" width="80%" />
</p>

---

## 搭建服务器

要创建自己的语音房间，需要运行 TeamSpeak 服务端软件。可以选择以下方式：

- **个人电脑**：在自己电脑上运行服务端，适合小范围测试，但关机后其他人无法连接
- **手机（Termux）**：Android 手机可安装 [Termux](https://termux.dev/en/) 运行服务端，适合临时使用
- **云服务器**：推荐方案。24 小时在线、带宽稳定、延迟低

如果设备没有公网 IP，可以使用 [Tailscale](https://tailscale.com/) 或 [EasyTier](https://easytier.cn/) 等工具组建虚拟局域网，将服务端和客户端接入同一虚拟网络，实现外网访问。

目前国内比较推荐的云服务器厂商包括：

| 厂商  | 特点             |
| :-- | :------------- |
| 阿里云 | 国内市场份额最大，可选地域多 |
| 腾讯云 | 轻量应用服务器性价比高    |
| 华为云 | 稳定性好，政企客户多     |
| 青云  | 中小规模灵活部署       |
| 雨云  | 游戏服务器专长，性价比高     |

对于 TeamSpeak 使用场景，入门配置（1 核 1G）即可满足数十人同时在线。

### 下载服务端

访问 [TeamSpeak 官网下载页面](https://www.teamspeak.com/en/downloads#server)，选择对应操作系统下载 Server 版本。

### 部署到 Linux 服务器（推荐）

以下操作以 Ubuntu / Debian 为例：

```bash
# 下载服务端（以 TS3 为例，替换为最新版本号）
wget https://files.teamspeak-services.com/releases/server/3.13.7/teamspeak3-server_linux-amd64-3.13.7.tar.bz2

# 解压
tar -xjf teamspeak3-server_linux-amd64-*.tar.bz2

# 进入目录
cd teamspeak3-server_linux-amd64

# 同意许可协议
touch .ts3server_license_accepted

# 启动服务端
./ts3server_minimal_runscript.sh
```

首次启动会输出管理员密钥（ServerAdmin Privilege Key），**务必保存下来**，用于后续获取管理员权限。

也可以使用 [Termius](https://termius.com/index.html)、[FileZilla](https://filezilla-project.org/) 或 [WinSCP](https://winscp.net/eng/download.php) 等 SFTP 客户端将服务端文件上传到云服务器，上传后通过 SSH 登录执行启动命令：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784688128674_image.webp" width="80%" />
</p>

### 开放端口

TeamSpeak 服务端默认使用以下端口，需要在防火墙中放行：

| 端口 | 用途 |
|:---|:----|
| 9987 | 语音通信（UDP） |
| 10011 | ServerQuery（TCP） |
| 30033 | 文件传输（TCP） |

如果使用云服务器，还需在云平台的安全组中添加入站规则放行这些端口。

### 设置为系统服务（可选）

让 TeamSpeak 在后台持续运行：

```bash
# 创建用户
sudo useradd -m -s /bin/bash teamspeak

# 将服务端文件移动到用户目录
sudo mv ~/teamspeak3-server_linux-amd64 /home/teamspeak/
sudo chown -R teamspeak:teamspeak /home/teamspeak/teamspeak3-server_linux-amd64

# 创建 systemd 服务
sudo tee /etc/systemd/system/teamspeak.service << 'EOF'
[Unit]
Description=TeamSpeak 3 Server
After=network.target

[Service]
User=teamspeak
Group=teamspeak
WorkingDirectory=/home/teamspeak/teamspeak3-server_linux-amd64
ExecStart=/home/teamspeak/teamspeak3-server_linux-amd64/ts3server_minimal_runscript.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# 启用并启动服务
sudo systemctl enable teamspeak
sudo systemctl start teamspeak
```

### 客户端连接

在客户端中添加书签，输入服务器 IP 地址和端口（默认 9987）即可连接。首次连接后，使用启动时生成的管理员密钥获取管理员权限。