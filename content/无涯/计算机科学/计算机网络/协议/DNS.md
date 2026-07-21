---
title: DNS
date: 2025-02-20
description: 域名系统（DNS）—— 将域名转换为 IP 地址的互联网”电话簿”。
tags:
  - 网络
  - 协议
---

Domain Name System（域名系统） 将人类可读的域名转换为 IP 地址，可以理解为**互联网的”电话簿”或者”通讯录”。**

## DNS 的核心作用

就是**把“网站名字”翻译成“IP地址”。**
例如：
```
youtube.com
    ↓
142.250.xxx.xxx
```
浏览器才能真正找到网站服务器。

过程示例：

1. 在浏览器地址栏输入 `mozilla.org`。
2. 浏览器会询问计算机是否已经识别此域名所确定的 IP 地址（使用本地 DNS 缓存）。如果是的话，这个域名被转换为 IP 地址，然后浏览器与 Web 服务器协商内容，结束。
3. 如果电脑不知道 `mozilla.org` 域名背后的 IP，它会询问 DNS 服务器，这个服务器的工作就是告诉电脑已经注册的域名所匹配的 IP。
4. 现在电脑知道了要请求的 IP 地址，浏览器能够与 Web 服务器协商内容。
![获取 DNS 请求结果所需步骤的说明](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name/2014-10-dns-request2.png)

---
##  DNS 污染

运营商或网络环境问题解析出错，可能返回错误 IP，这就是DNS污染。

---
## 资源

[DNS 工作原理](https://howdns.works/zh-hans/)