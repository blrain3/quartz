---
title: Nginx
date: 2025-06-15
---

Nginx 常用于 [[无涯/计算机科学/计算机网络/托管|网站托管]] 场景。

[**Nginx**](https://en.wikipedia.org/wiki/Nginx) 是一种[网页服务器](https://en.wikipedia.org/wiki/Web_server)，也可用作[反向代理](https://en.wikipedia.org/wiki/Reverse_proxy)、[负载均衡器](https://en.wikipedia.org/wiki/Load_balancer)、邮件代理和 [HTTP 缓存](https://en.wikipedia.org/wiki/HTTP_cache)。

## 典型架构

1. **入口层（用户 → Nginx）**：Nginx 作为唯一入口，接收所有用户请求。
2. **路由判断层（Nginx）**：静态资源（如 `.png`、`.js`、`.html`）由 Nginx 直接返回；API 请求转发给后端服务。
3. **应用层（Spring Boot 集群）**：多个后端实例提供业务逻辑，Nginx 在它们之间进行负载均衡。
4. **数据层（MySQL）**：后端读写数据库，完成数据持久化。

Nginx 作为反向代理和负载均衡器，既分担了静态资源的压力，又将动态请求分发给多个后端实例，从而提升系统的并发能力和可扩展性。

## 反向代理示意

![Nginx 反向代理](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516203855559.webp)