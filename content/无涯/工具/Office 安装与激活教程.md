---
title: Office 安装与激活教程
date: 2026-01-20
tags:
  - 工具
  - Office
  - 教程
created: 
---

> 从下载安装到激活，完整的 Office 部署指南。
---

## 准备工作

在开始之前，请确认以下几点：

- **Windows 系统**：Windows 8.1 / 10 / 11
- **网络连接**：安装和激活需要联网
- **管理员权限**：后续步骤需要以管理员身份运行 PowerShell

---

## 下载安装 Office

### 使用 Office Tool Plus 安装

[Office Tool Plus](http://otp.landian.vip/redirect/download.php) 是一款免费的 Office 部署工具，可以自定义下载和安装 Office。

**操作步骤：**

1. 在 [官网下载 Office Tool Plus](http://otp.landian.vip/redirect/download.php)
2. 将下载的压缩包**完整解压**到正常位置（例如桌面）
3. 双击运行 `Office Tool Plus.exe`
4. 在工具中选择想要安装的 Office **版本、位数和语言**
5. 点击 **开始部署**，等待下载和安装完成

> 建议选择 Office 2021 Professional Plus 或 Microsoft 365。

具体可见[新手教程](https://blog.yerong.org/archives/42)

---

## 清除旧版激活信息（可选）

> 如果你之前安装过其他版本的 Office，建议在激活新版本之前先清除旧的激活信息，否则可能导致新旧许可证冲突。

**在 Office Tool Plus 中操作：**

1. 切换到 **激活** 页面
2. 点击 **清除许可证** 按钮
3. 再点击 **清除激活状态** 按钮

完成后即可继续下一步激活。

---

## 激活 Office

下面提供两种激活方式，任选其一即可。

### 方法一：使用 Office Tool Plus 激活（KMS）

> 适合已安装 Office Tool Plus 的用户，直接在工具内完成。

**操作步骤：**

1. 打开 Office Tool Plus，切换到 **激活** 页面
2. 在 **许可证管理** 中选择你安装的 Office 版本，点击 **安装许可证**
3. 在 **KMS 管理** 中填入可用的 KMS 服务器地址（例如 `kms.lotro.cc`）
4. 点击 **设置主机地址**
5. 点击 **激活**

> 如果 KMS 服务器失效，可以搜索最新的可用 KMS 服务器地址。

---

### 方法二：使用 Microsoft Activation Scripts（MAS）

[MAS（Microsoft Activation Scripts）](https://massgrave.dev/) 是一款**开源**的 Windows 和 Office 激活脚本，支持 HWID、Ohook、Online KMS 等多种激活方式。

**操作步骤（PowerShell 在线方式，推荐）：**

1. 点击 **开始菜单**，输入 `PowerShell`，右键选择 **以管理员身份运行**
2. 复制粘贴以下命令，按 **回车** 执行：

```powershell
irm https://massgrave.dev/get | iex
```

3. 在弹出的菜单中，选择对应的 Office 激活选项（通常输入 `2` 选择 Ohook 激活）
4. 等待执行完成即可

> MAS 也支持传统离线方式激活，详见 [MAS 官网](https://massgrave.dev/)。