---
title: DNS
date: 2025-02-20
tags:
  - 网络协议
---

关于域名的基本概念可参考 [[域名|域名]]。

Domain Name System（域名系统）将人类可读的域名转换为 IP 地址，可以理解为**互联网的"电话簿"或者"通讯录"。**

## DNS 的核心作用

就是把"网站名字"翻译成"IP地址"。
```
youtube.com
    ↓
142.250.xxx.xxx
```
浏览器才能真正找到网站服务器。

过程示例：

1. 在浏览器地址栏输入 `mozilla.org`。
2. 浏览器会先检查本地 DNS 缓存是否已识别此域名对应的 IP 地址。如果是，直接转换为 IP 地址，浏览器与 Web 服务器协商内容。
3. 如果电脑不知道 `mozilla.org` 域名背后的 IP，它会询问 DNS 服务器。
4. 现在电脑知道了要请求的 IP 地址，浏览器能够与 Web 服务器协商内容。

![获取 DNS 请求结果所需步骤的说明](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name/2014-10-dns-request2.png)

## DNS 污染

运营商或网络环境问题解析出错，可能返回错误 IP，这就是 DNS 污染。

## 资源

[DNS 工作原理](https://howdns.works/zh-hans/)