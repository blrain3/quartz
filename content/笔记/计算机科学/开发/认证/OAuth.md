[**OAuth**](https://en.wikipedia.org/wiki/OAuth)（pen Authorization，**开放授权**）是一种用于访问[委托](https://en.wikipedia.org/wiki/Open_standard "Open standard")的[开放标准](https://en.wikipedia.org/wiki/Delegation_\(computer_security\) "Delegation (computer security)") ，通常作为互联网用户授权网站或应用程序访问其在其他网站上的信息，而无需提供密码的方式

>本质是让第三方应用在不拿到你密码的情况下，有限地访问你的数据。

---

假设你想使用Notion读取Google Drive文件，没有OAuth，你需要把Google密码给Notion，非常危险。
![|570x357](https://r2.matsumae.top/obsidian/{fileName}.{extName}/20260516201536222.webp)

有 OAuth，Notion 永远不知道你的 Google 密码。
![](https://r2.matsumae.top/obsidian/{fileName}.{extName}/20260516201732177.webp)

OAuth工作流程
![](https://r2.matsumae.top/obsidian/{fileName}.{extName}/20260516201939678.webp)

Resource Owner（资源拥有者）就是用户。
Client（客户端)，想访问数据的应用。
Authorization Server（授权服务器）负责登录、用户确认、发 Token。
Resource Server（资源服务器），真正存数据的地方。