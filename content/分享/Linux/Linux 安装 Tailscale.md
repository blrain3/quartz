---
title: Linux 安装 Tailscale
date: 2026-01-11
tags:
  - 分享
  - 组网
  - 教程
---
## 安装

在终端运行以下命令：

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```
<img src="https://tg.salix.eu.org/file/1788785775063_image.webp" alt="image.webp" width=100% />

等待安装完成，跳出提示：

<img src="https://tg.salix.eu.org/file/1788785664571_image.webp" alt="image.webp" width=100% />

点击链接登录，出现**Success**表示登陆成功：

<img src="https://tg.salix.eu.org/file/1788786055072_image.webp" alt="image.webp" width=100% />

## 设置出口节点(Exit Mode)

设置为[出口节点](https://tailscale.com/docs/features/exit-nodes)：

<img src="https://tg.salix.eu.org/file/1788786178087_image.webp" alt="image.webp" width=100% />

==必须启用 IP 转发==才能将 Linux 设备通告为出口节点。

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

启用 IP 转发时，请==确保防火墙默认拒绝流量转发==。许多 Linux 防火墙（例如`ufw`和`firewalld` ）默认使用此配置，以防止路由不必要的流量。

从计划用作出口节点的设备，运行[`tailscale set`](https://tailscale.com/docs/reference/tailscale-cli#set)或[`tailscale up`](https://tailscale.com/docs/reference/tailscale-cli/up)时，最好使用`--advertise-exit-node`标志：

```shell
sudo tailscale set --advertise-exit-node
```

如果将`--advertise-exit-node`标志传递给`tailscale set`命令，则之后**必须运行**`tailscale up` 。

```shell
sudo tailscale set --advertise-exit-node
sudo tailscale up
```

1. 打开管理控制台的[Machine](https://console.tailscale.com/admin/machines)页面，找到出口节点。
2. 在机器列表中找到**出口节点**徽章，或者使用[`property:exit-node`](https://console.tailscale.com/admin/machines?q=property%3Aexit-node)过滤器列出所有被宣传为出口节点的设备。
3. 在出口节点的菜单中，打开 **“编辑路由设置”** 面板，并启用 **“用作出口节点”** 。
4. 点击保存。

<img src="https://tg.salix.eu.org/file/1788786514655_image.webp" alt="image.webp" width=100% />

**测试**

以某台日本服务器为例，可以使用`ping`命令来测试流量代理情况，未超时即表示网络被出口节点成功代理：

<img src="https://tg.salix.eu.org/file/1788912392354_image.webp" alt="image.webp" width=100% />

## 设置对等中继（Peer Relays）

当由于网络条件（例如严格的 NAT 环境）而无法进行直接连接时，Tailscale 对等中继允许使用 Tailscale 网络（称为 **tailnet**）中的设备作为高吞吐量中继服务器。

通常情况下，当 Tailscale 无法在设备间建立直接连接时，会依赖其全球分布式的 **DERP** 服务器来转发流量。虽然 DERP 服务器能够有效地转发流量，但可能会引入额外的延迟，尤其是在高吞吐量应用中。

将设备配置为对等中继时，同一 **tailnet** 中的其他设备可以在无法建立直接连接时，使用该设备来转发彼此之间的流量。Tailscale 会首先尝试使用 **tailnet** 中任何可用的对等中继；如果无法使用，则会回退到 DERP 服务器。
### 前提条件

在启用对等中继功能前，请确认以下条件已满足：

**账户要求**
- 拥有可管理目标 tailnet 的 Tailscale 账户
- 账户角色为 Owner、Admin 或 Network admin
- tailnet 中至少有一台符合对等中继设备要求的设备

**对等中继设备要求**
- 运行受支持的操作系统（不支持 iOS、Android 及 Apple TV）
- Tailscale 客户端版本为 1.86 或更高
- 具备充足的网络带宽与较低延迟，能够有效转发其他设备的流量
- 至少可配置一个对 tailnet 内其他设备可访问的 UDP 端口

**使用对等中继的其他设备要求**
- 能够访问对等中继设备（通过相应的访问控制策略）
- Tailscale 客户端版本为 1.86 或更高
- 能够访问对等中继设备上配置的 UDP 端口  
  （使用对等中继的设备无操作系统限制，可运行包括 iOS 和 Apple TV 在内的任何受支持系统）
### 配置步骤

配置对等中继功能主要包含两个核心步骤：将设备配置为对等中继，以及创建允许其他设备使用该中继的授权策略。
#### 步骤 1：将设备配置为对等中继

1. 在拟作为对等中继的设备上启动 Tailscale 客户端，并完成登录认证。
2. 打开终端或命令提示符。
3. 使用 `tailscale set` 命令指定用于对等中继流量的 UDP 端口。例如，将端口设置为 40000：

```bash
tailscale set --relay-server-port=40000
```

如需指定额外的静态端点（适用于自动发现受限的环境），可同时使用 `--relay-server-static-endpoints` 参数：

```bash
tailscale set --relay-server-port=40000 --relay-server-static-endpoints="公网IP:40000"
```
#### 步骤 2：创建对等中继授权策略

在其他设备能够使用对等中继之前，必须创建相应的 grant 策略。该策略通过 `tailscale.com/cap/relay` 应用能力来授权设备使用对等中继功能。可使用管理控制台的 JSON 编辑器、可视化策略编辑器或 Tailscale API 进行配置。

使用 JSON 编辑器创建策略的步骤如下：

1. 打开管理控制台的 [Access controls](https://console.tailscale.com/admin/acls/file) 页面。
2. 切换至 **JSON editor** 选项卡。
3. 定位到策略文件中的 `grants` 部分。
4. 添加如下策略，指定 `src`（需要通过中继访问的设备）、`dst`（对等中继设备）以及 `tailscale.com/cap/relay` 能力。示例：允许带有 `tag:us-east-vpc` 标签的设备使用带有 `tag:us-east-relays` 标签的对等中继：

```json
{
  "grants": [
    {
      "src": ["tag:us-east-vpc"],
      "dst": ["tag:us-east-relays"],
      "app": {
        "tailscale.com/cap/relay": []
      }
    }
  ]
}
```

**说明**：
- `dst` 字段可使用标签、主机名、IP 集合或 Tailscale IP 地址引用对等中继设备。
- `app` 字段必须包含 `tailscale.com/cap/relay` 能力，且该能力无需额外参数。
- 建议避免在 `src` 字段使用过于宽松的目标（如 `*`）。过度宽松的规则可能导致大量设备集中使用中继，从而引发意外的流量路由与高延迟。应优先使用精确的标签、主机名或 IP 集合进行限制。
- 作为经验法则，`src` 设备通常应为位于严格 NAT 或防火墙后、物理位置相对固定的设备（例如企业网络或云环境中的设备），而非频繁变更位置与网络条件的移动设备或笔记本电脑。

策略保存后立即生效。当设备无法建立直接连接时，将优先尝试使用可用的对等中继；若无可用对等中继，则回退至 DERP 服务器。

#### 步骤 3：观察对等中继流量

生成测试流量后，可使用 `tailscale status` 命令监控设备状态，确认对等中继是否正常工作。当设备通过对等中继进行连接时，连接类型将显示为 `peer-relay`。

执行以下命令并筛选 `peer-relay` 相关条目：

```bash
tailscale status | grep peer-relay
```

典型输出示例

```
<tailscale-ip-address> <hostname> <user> <os> active; peer-relay <ip-address>:<udp-port>:vni:<vni-id>, tx <bytes-sent> rx <bytes-received>
```
实际测试：

<img src="https://tg.salix.eu.org/file/1788914051802_image.webp" alt="image.webp" width=100% />

亦可使用 `tailscale ping` 命令测试设备间连通性，并观察连接是否经由对等中继。
### 停用对等中继

如需停用某设备的对等中继功能，执行以下命令：

```bash
tailscale set --relay-server-port=""
```
### 安全与访问控制

对等中继仅可为同一 tailnet 内的设备转发流量。授予 `tailscale.com/cap/relay` 能力的 grant 规则本身即作为访问控制机制——未获得该授权的设备无法在对等中继上分配中继绑定。无需另行配置针对对等中继设备本身的网络授权。

所有流量仍采用端到端 WireGuard 加密。对等中继仅负责转发已加密的数据包，无法解密内容。

这只是简单的一步，值得一提的是，Tailscale 有开源自托管方案 [Handscale](https://github.com/juanfont/headscale)，关于 Tailscale 还有许多优秀的资源可以去学习和探索：
1. [How to get started with Tailscale in under 10 minutes](https://www.youtube.com/watch?v=sPdvyR7bLqI)
2. [官方文档](https://tailscale.com/docs/install/linux)
3. [韩风Talk](https://www.bilibili.com/video/BV1Wh411A73b/?vd_source=a2e9dc9137cfec266b0df4dd491d8a18)