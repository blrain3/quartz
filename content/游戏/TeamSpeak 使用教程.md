---
title: "TeamSpeak 连到哪，服务器怎么搭"
date: 2026-07-21
tags:
  - 游戏
  - 语音通信
  - 教程
  - TeamSpeak
---

我把客户端连接和服务端部署分开记，免得把 TS3、TS6 的步骤混成一套。TeamSpeak 有客户端与服务端，TS3、TS6 的下载、账号和管理方式不能混作一套。先从官方页面选定产品版本与操作系统，再按该版本的说明安装；截图和菜单文字可能随版本变化。
访问 [TeamSpeak 官方网站](https://www.teamspeak.com/en/)：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631226098_image.webp" width="80%" />
</p>

点击 **Downloads** 进入下载页面，选择对应版本和平台：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631993387_image.webp" width="80%" />
</p>

访问 [微软商店页面](https://apps.microsoft.com/detail/xpdcj80kgnrvss?hl=zh-CN&gl=CN)，点击安装即可。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784631717855_image.webp" width="80%" />
</p>

---

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

---

TS6 的账户要求按当前客户端流程确认；TS3 客户端连接服务器通常不要求注册 TeamSpeak 账号。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686450418_image.webp" width="80%" />
</p>

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686525364_image.webp" width="80%" />
</p>

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784686743328_image.webp" width="80%" />
</p>

点击添加书签，输入服务器地址进行连接：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784689716584_image.webp" width="80%" />
</p>

---

TS3 客户端连接服务器通常不需要注册账号。点击 **Connections**，填写可达的服务器地址、昵称及服务端要求的密码；连接仍取决于服务端状态、网络规则和认证设置。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687236623_image.webp" width="80%" />
</p>

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687310119_image.webp" width="80%" />
</p>

第三方中文语言包项目：[TS3-Translation_zh-CN](https://github.com/jitingcn/TS3-Translation_zh-CN)。这是第三方文件，安装前核对项目、客户端版本和文件来源；兼容性与安全性应按客户端版本和文件来源单独核对。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784687471748_image.webp" width="80%" />
</p>

---

要创建自己的语音房间，需要运行 TeamSpeak 服务端软件。可以选择以下方式：

- **个人电脑**：在自己电脑上运行服务端，适合小范围测试，但关机后其他人无法连接

- **云服务器**：适合需要持续运行的部署；在线率、带宽和延迟取决于具体服务与网络。

如果设备没有公网 IP，可以使用 [Tailscale](https://tailscale.com/) 或 [EasyTier](https://easytier.cn/) 等工具组建虚拟局域网，将服务端和客户端接入同一虚拟网络，实现外网访问。

以下厂商仅作搜索起点，不构成当前推荐；选购前比较地区、流量、价格和服务条款：

| 厂商  | 特点             |
| :-- | :------------- |
| 阿里云 | 国内市场份额最大，可选地域多 |
| 腾讯云 | 轻量应用服务器性价比高    |
| 华为云 | 稳定性好，政企客户多     |
| 青云  | 中小规模灵活部署       |
| 雨云  | 游戏服务器专长，性价比高     |

服务器规格不能只凭“数十人”保证；语音编解码、实例性能、网络、其他服务和当前 TS 版本都会影响容量。先按官方要求部署，再监控资源并逐步测试。

访问 [TeamSpeak 官网下载页面](https://www.teamspeak.com/en/downloads#server)，选择对应操作系统下载 Server 版本。

以下操作以 Ubuntu / Debian 为例：

```bash
# 本例固定 TS3 3.13.8；下载到自己的主目录
cd ~
# 下载前核对架构与当前适用许可
wget https://files.teamspeak-services.com/releases/server/3.13.8/teamspeak3-server_linux_amd64-3.13.8.tar.bz2  # 官方包链接；部署前阅读包内许可

## 解压
tar -xjf teamspeak3-server_linux_amd64-3.13.8.tar.bz2

## 进入目录
cd teamspeak3-server_linux_amd64

## 阅读包内 LICENSE，确认适用后再接受许可
touch .ts3server_license_accepted

## 启动服务端
./ts3server_minimal_runscript.sh
```

首次创建服务器时可能显示 ServerAdmin privilege key，用于取得服务器组权限。把它放在安全位置，不要写入仓库或公开日志；它和 ServerQuery 凭据、TS6 Recovery Key 不是同一种密钥。

也可以使用 [Termius](https://termius.com/index.html)、[FileZilla](https://filezilla-project.org/) 或 [WinSCP](https://winscp.net/eng/download.php) 等 SFTP 客户端将服务端文件上传到云服务器，上传后通过 SSH 登录执行启动命令：

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784688128674_image.webp" width="80%" />
</p>

服务端启动前，网络侧只开放实际需要的端口。

只开放客户端实际需要的端口，并按当前服务端版本文档确认协议和用途。管理接口不要直接暴露公网：

| 端口 | 用途 |
|:---|:----|
| 9987 | 语音通信（UDP） |
| 10011 | ServerQuery（TCP；限制来源或通过安全管理通道访问） |
| 30033 | 文件传输（TCP；仅启用相关功能时开放） |

云安全组与主机防火墙都要核对；不要为了“省事”放开所有管理端口或来源地址。语音端口是否应对公网开放，取决于你的部署方式。

让 TeamSpeak 在后台持续运行。先在前面的前台启动终端按 Ctrl+C 停止手动运行的实例，再切换到主目录；确认服务已退出后再移动文件和启动 systemd，避免同一实例重复运行：

```bash
cd ~

## 创建用户
sudo useradd -m -s /bin/bash teamspeak

## 将服务端文件移动到用户目录
sudo mv ~/teamspeak3-server_linux_amd64 /home/teamspeak/
sudo chown -R teamspeak:teamspeak /home/teamspeak/teamspeak3-server_linux_amd64

## 创建 systemd 服务
sudo tee /etc/systemd/system/teamspeak.service << 'EOF'
[Unit]
Description=TeamSpeak 3 Server
After=network.target

[Service]
User=teamspeak
Group=teamspeak
WorkingDirectory=/home/teamspeak/teamspeak3-server_linux_amd64
ExecStart=/home/teamspeak/teamspeak3-server_linux_amd64/ts3server_minimal_runscript.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

## 重新加载 unit 并启用、启动服务
sudo systemctl daemon-reload
sudo systemctl enable teamspeak
sudo systemctl start teamspeak
sudo systemctl status teamspeak
sudo journalctl -u teamspeak
```

在客户端中添加书签，填写服务器的可达地址和实际语音端口；能否连接还取决于服务端状态、网络规则和认证设置。TS3 初次启动会显示权限密钥等信息，按该版本的官方指引安全保存并使用；不要把密钥贴到公开日志或聊天中。

参考：[TeamSpeak 官方下载](https://www.teamspeak.com/en/downloads/) · [TS3 3.13.8 Linux amd64 包与 Quick Start](https://files.teamspeak-services.com/releases/server/3.13.8/teamspeak3-server_linux_amd64-3.13.8.tar.bz2) · [TeamSpeak 入门指南](https://www.teamspeak.com/en/support/get-started)。下载页与包内说明核对于 2026-10-14；尚未实机安装。
