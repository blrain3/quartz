[[无涯/计算机科学/计算机网络/协议/TCP|TCP]] 为 HTTP 提供可靠的传输层基础。

---
title: HTTP
date: 2025-06-05
---

[HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Overview)（HyperText Transfer Protocol，超文本传输协议）是浏览器（客户端）和服务器之间传递数据的一套规则。可以把它理解成：
>浏览器和网站服务器”聊天”时使用的语言。

![HTTP 作为应用层协议，处于 TCP（传输层）和 IP（网络层）之上，表示层之下。](https://mdn.github.io/shared-assets/images/diagrams/http/overview/http-layers.svg)

## HTTP作用

主要作用是**请求和响应**
![通过 HTTP 的客户/服务器连接的基本表示方法](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server/web-server.svg)

比如说点开视频网站，浏览器发送：“给我视频界面”的请求，服务器返回给HTML、图片、视频数据。
![由来自不同服务器的多个资源组成的单个 Web 文档。](https://mdn.github.io/shared-assets/images/diagrams/http/overview/fetching-a-page.svg)

请求大概长这样：
```http
GET /index.html HTTP/1.1
Host: example.com
```

其中`GET`为：“要获取的东西”，`HTTP/1.1`表示使用 HTTP1.1 协议。

一般服务器会返回成功信息：
```http
HTTP/1.1 200 OK
Content-Type: text/html
```

## HTTP方法

### GET

获取数据

### POST

提交数据

比如：
```
登录
注册
发评论
上传文件
```

向服务器发送登录请求：
```http
POST /login
```

### DELETE

删除数据

---

### HTTP状态码

|类别|含义|
|---|---|
|**1xx**|信息提示，表明临时响应，需要后续操作。|
|**2xx**|成功，表明请求已成功被接收和处理。|
|**3xx**|重定向，表明需要进一步操作。|
|**4xx**|客户端错误，表明请求语法错误或不合法。|
|**5xx**|服务器错误，表明服务器处理请求时发生内部错误。|
具体状态码可以参考[这篇文章](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Status)