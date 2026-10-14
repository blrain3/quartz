---
title: "Tailscale 连上了，流量走哪儿？"
date: 2026-01-11
tags:
  - 技术
  - Linux
  - 组网
  - Tailscale
---


## 安装

在终端运行以下命令：

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```
<img src="https://tg.salix.eu.org/file/1788785775063_image.webp" alt="image.webp" width=100% />

安装脚本适用于官方列出的发行版。安装完成后还要启动并登录客户端；在 Linux 上通常运行 `sudo tailscale up`，再打开终端显示的认证链接。

等待安装完成，跳出提示：

<img src="https://tg.salix.eu.org/file/1788785664571_image.webp" alt="image.webp" width=100% />

点击链接登录，出现**Success**表示登陆成功：

<img src="https://tg.salix.eu.org/file/1788786055072_image.webp" alt="image.webp" width=100% />

## 配置出口节点

设置为[出口节点](https://tailscale.com/docs/features/exit-nodes)：

<img src="https://tg.salix.eu.org/file/1788786178087_image.webp" alt="image.webp" width=100% />

Linux 出口节点需要启用 IP 转发。下面两种写法按系统配置方式选一种；追加配置前先检查文件，重复执行 `tee -a` 会留下重复行。

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

设备已启动并登录时，可以用 `tailscale set --advertise-exit-node` 修改这项设置；刚安装或尚未认证时，先完成 `tailscale up`。

1. 打开管理控制台的[Machine](https://console.tailscale.com/admin/machines)页面，找到出口节点。
2. 在机器列表中找到**出口节点**徽章，或者使用[`property:exit-node`](https://console.tailscale.com/admin/machines?q=property%3Aexit-node)过滤器列出所有被宣传为出口节点的设备。
3. 在出口节点的菜单中，打开 **“编辑路由设置”** 面板，并启用 **“用作出口节点”** 。
4. 点击保存。

管理员批准通告后，使用出口节点的设备还要自行选择它。Linux 客户端可按官方说明设置 `--exit-node`；这会改变该设备的默认路由，执行前确认流量应经过该节点。

<img src="https://tg.salix.eu.org/file/1788786514655_image.webp" alt="image.webp" width=100% />

**测试**

普通 `ping` 成功只说明目标对 ICMP 有响应，不能证明公网流量经过了出口节点。要验证出口，应先确认客户端已选择该节点，再比较使用前后的公网出口地址；IPv4 和 IPv6 分别检查。下图为历史测试记录：

<img src="https://tg.salix.eu.org/file/1788912392354_image.webp" alt="image.webp" width=100% />

## 设置对等中继（Peer Relays）

当直连失败时，Tailscale Peer Relay 可以让同一 tailnet 中获授权的设备转发加密流量。它是否比 DERP 更快取决于网络和节点，本文没有吞吐或延迟测试。

通常情况下，当 Tailscale 无法在设备间建立直接连接时，会依赖其全球分布式的 **DERP** 服务器来转发流量。虽然 DERP 服务器能够有效地转发流量，但可能会引入额外的延迟，尤其是在高吞吐量应用中。

将设备配置为对等中继时，同一 **tailnet** 中的其他设备可以在无法建立直接连接时，使用该设备来转发彼此之间的流量。Tailscale 会首先尝试使用 **tailnet** 中任何可用的对等中继；如果无法使用，则会回退到 DERP 服务器。
### 前提条件

在启用对等中继功能前，请确认以下条件已满足：

**账户要求**
- 拥有可管理目标 tailnet 的 Tailscale 账户
- 账户角色为 Owner、Admin 或 Network admin
- tailnet 中至少有一台符合中继条件的设备

**对等中继设备要求**
- 中继设备运行受支持的操作系统（iOS、Android 与 Apple TV 不能充当 relay；这些系统仍可作为使用端）
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
4. 添加授权策略，`src` 是允许分配 relay binding、可经中继被访问的设备，`dst` 是中继设备。此规则授权使用 relay 能力，不代替业务流量本身的访问规则。以下仅是合并进现有策略的片段，不能直接替换整份策略：

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
- `src` 应只包含确实需要获得 relay binding 的设备；不要未经审查就扩大范围。业务访问权限仍需由 tailnet 的其他策略控制。
- 作为经验法则，`src` 设备通常应为位于严格 NAT 或防火墙后、物理位置相对固定的设备（例如企业网络或云环境中的设备），而非频繁变更位置与网络条件的移动设备或笔记本电脑。

策略保存后立即生效。当设备无法建立直接连接时，将优先尝试使用可用的对等中继；若无可用对等中继，则回退至 DERP 服务器。

#### 步骤 3：观察对等中继流量

生成测试流量后，可使用 `tailscale status` 命令监控设备状态，确认对等中继是否正常工作。当设备通过对等中继进行连接时，连接类型将显示为 `peer-relay`。

执行以下命令并筛选 `peer-relay` 相关条目：

```bash
tailscale status | grep peer-relay
```

输出格式示意（未执行命令）：

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

`tailscale.com/cap/relay` 控制设备能否分配中继绑定；它不授权所有业务连接。承载 UDP 的底层网络仍须可达，overlay 中的业务访问也仍受原有策略控制。中继转发的是端到端 WireGuard 加密的数据包。

Tailscale 生态里还有自托管控制服务器实现 [Headscale](https://github.com/juanfont/headscale)。它不等于 Tailscale 全部功能的替代品，具体兼容能力需按对应版本核对。更多资料：
1. [How to get started with Tailscale in under 10 minutes](https://www.youtube.com/watch?v=sPdvyR7bLqI)
2. [官方文档](https://tailscale.com/docs/install/linux)
3. [韩风Talk](https://www.bilibili.com/video/BV1Wh411A73b/?vd_source=a2e9dc9137cfec266b0df4dd491d8a18)

> 图片和测试记录为历史记录；命令、客户端版本与管理界面应按实际发行版和当前官方文档复核。
