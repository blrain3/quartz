---
title: JWT
date: 2025-05-28
---

[**JSON Web Token**](https://en.wikipedia.org/wiki/JSON_Web_Token)，是一项[拟定的互联网标准](https://en.wikipedia.org/wiki/Internet_Standard#Proposed_Standard "Internet Standard") ，用于创建带有可选[签名](<https://en.wikipedia.org/wiki/Signature_(cryptography)> "Signature (cryptography)")和/或可选[加密](https://en.wikipedia.org/wiki/Encryption "Encryption")的数据，其[载荷](<https://en.wikipedia.org/wiki/Payload_(computing)> "Payload (computing)")包含 [JSON](https://en.wikipedia.org/wiki/JSON "JSON")，用于声明若干[声明](https://en.wikipedia.org/wiki/Claims-based_identity "Claims-based identity") 。这些令牌使用[私有密钥](https://en.wikipedia.org/wiki/Shared_secret "Shared secret")或[公钥/私钥](https://en.wikipedia.org/wiki/Public-key_cryptography "Public-key cryptography")进行签名。

例如，服务器可以生成一个包含"以管理员身份登录"声明的令牌，并将其提供给客户端。随后，客户端可使用该令牌来证明其以管理员身份登录。令牌可由一方（通常是服务器）的私钥进行签名，以便任何一方都能随后验证令牌是否合法。如果另一方通过某种合适且可信的方式拥有相应的公钥，他们也能验证令牌的合法性。
JWT 声明通常可用于在[身份提供者](https://en.wikipedia.org/wiki/Identity_provider "Identity provider")和[服务提供者](https://en.wikipedia.org/wiki/Service_provider "Service provider")之间传递已认证用户的身份，或传递业务流程所需的其他任何类型的声明

> **JWT 是服务器签名的用户身份证，客户端携带它访问 API，服务器通过验证签名来确认身份，而不需要保存登录状态。**

---

## JWT格式

`xxxxx.yyyyy.zzzzz`（三部分，点号分隔）
示例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

---

## JWT 的三部分

| 部分          | 作用                                   | 内容示例                                            |
| ------------- | -------------------------------------- | --------------------------------------------------- |
| **Header**    | 声明签名算法和 token 类型              | `{"alg": "HS256", "typ": "JWT"}`                    |
| **Payload**   | 存放实际数据（用户ID、角色、过期时间） | `{"userId": 1, "role": "admin", "exp": 1710003600}` |
| **Signature** | 对 Header+Payload 用密钥签名，防止篡改 | 由算法生成的哈希值                                  |

> [!WARNING] Payload 默认只是 **Base64Url 编码**，并非加密！**禁止存放敏感信息**（密码、银行卡等）。

---

## JWT 工作流程

1. 客户端发送用户名/密码到服务器登录接口
2. 服务器验证凭证，生成 JWT（含用户标识、过期时间等）
3. 服务器返回 JWT 给客户端
4. 客户端保存 JWT（通常在 localStorage 或 cookie）
5. 客户端后续请求在 HTTP Header 中携带： `Authorization: Bearer <JWT>`
6. 服务器从 Header 取出 token，验证签名和有效期，确认用户身份后返回数据
   ![](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516200037311.webp)
   类似给你一个盖章身份证，你自己带着。服务器只需要检查章是真的假的，不用存你信息。

### Session工作流程

类似酒店前台帮你保存身份信息，你只拿房卡。
![](https://r2.salix.eu.org/obsidian/{fileName}.{extName}/20260516200346763.webp)

授权协议可参考 [[无涯/计算机科学/开发/认证/OAuth|OAuth]]。