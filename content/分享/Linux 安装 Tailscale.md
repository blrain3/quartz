---
title: Linux 安装 Tailscale
date: 2026-01-11
tags:
  - 分享
  - 组网
  - 教程
---
运行以下命令：`curl -fsSL https://tailscale.com/install.sh | sh`
<img src="https://tg.salix.eu.org/file/1788785775063_image.webp" alt="image.webp" width=100% />

等待安装完成，跳出提示：
<img src="https://tg.salix.eu.org/file/1788785664571_image.webp" alt="image.webp" width=100% />

登录，出现**Success**表示登陆成功。
<img src="https://tg.salix.eu.org/file/1788786055072_image.webp" alt="image.webp" width=100% />

设置为[出口节点](https://tailscale.com/docs/features/exit-nodes)：
<img src="https://tg.salix.eu.org/file/1788786178087_image.webp" alt="image.webp" width=100% />

必须启用 IP 转发才能将 Linux 设备通告为出口节点。

如果 Linux 系统有`/etc/sysctl.d`目录，使用：
```shell
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

否则，使用：
```shell
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

启用 IP 转发时，请确保防火墙默认拒绝流量转发。许多 Linux 防火墙（例如`ufw`和`firewalld` ）默认使用此配置，以防止路由不必要的流量。

从计划用作出口节点的设备，运行[`tailscale set`](https://tailscale.com/docs/reference/tailscale-cli#set)或[`tailscale up`](https://tailscale.com/docs/reference/tailscale-cli/up)时，最好使用`--advertise-exit-node`标志：
```shell
sudo tailscale set --advertise-exit-node
```

如果将`--advertise-exit-node`标志传递给`tailscale set`命令，则之后必须运行`tailscale up` 。
```shell
sudo tailscale set --advertise-exit-node
sudo tailscale up
```

1. 打开管理控制台的[“机器”](https://console.tailscale.com/admin/machines)页面，找到出口节点。
2. 在机器列表中找到**出口节点**徽章，或者使用[`property:exit-node`](https://console.tailscale.com/admin/machines?q=property%3Aexit-node)过滤器列出所有被宣传为出口节点的设备。
3. 在出口节点的菜单中，打开 **“编辑路由设置”** 面板，并启用 **“用作出口节点”** 。
<img src="https://tg.salix.eu.org/file/1788786514655_image.webp" alt="image.webp" width=100% />

这只是简单的一步，值得一提的是，Tailscale 有开源自托管方案 [Handscale](https://github.com/juanfont/headscale)，感兴趣的可以去了解一下，关于 Tailscale 还有许多优秀的资源可以去学习和探索：
1. [How to get started with Tailscale in under 10 minutes](https://www.youtube.com/watch?v=sPdvyR7bLqI)
2. [官方文档](https://tailscale.com/docs/install/linux)
3. [韩风Talk](https://www.bilibili.com/video/BV1Wh411A73b/?vd_source=a2e9dc9137cfec266b0df4dd491d8a18)