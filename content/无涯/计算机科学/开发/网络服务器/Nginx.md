Nginx 常用于 [[无涯/计算机科学/计算机网络/托管|网站托管]] 场景。

---
title: Nginx
date: 2025-06-15
---

[**Nginx**](https://en.wikipedia.org/wiki/Nginx)是一种[网页服务器](https://en.wikipedia.org/wiki/Web_server "Web server") ，也可用作[反向代理](https://en.wikipedia.org/wiki/Reverse_proxy "Reverse proxy") 、 [负载均衡器](https://en.wikipedia.org/wiki/Load_balancer "Load balancer") 、邮件代理和 [HTTP 缓存](https://en.wikipedia.org/wiki/HTTP_cache "HTTP cache") 。

![](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516203633595.webp)

1. **入口层（用户 → Nginx）**  
   Nginx 作为唯一入口，接收所有用户请求。
2. **路由判断层（Nginx）**
   - **静态资源**（如 `.png`、`.js`、`.html`）：Nginx 直接返回文件，不经过后端。
   - **API 请求**（如 `/api/users`）：转发给后端的 Spring Boot 服务。
3. **应用层（Spring Boot 集群）**  
   多个 Spring Boot 实例提供业务逻辑（登录、订单等），Nginx 在它们之间进行负载均衡。
4. **数据层（MySQL）**  
   Spring Boot 读写 MySQL 数据库，完成数据持久化。

Nginx 作为反向代理和负载均衡器，既分担了静态资源的压力，又将动态请求分发给多个后端实例，从而提升系统的并发能力、稳定性和可扩展性。

反向代理
![](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516203855559.webp)
