- GitHub Pages 现在会自动在您的分支中执行此操作

你需要前往 DNS 提供商→高级 DNS →创建新的 CNAME 记录

[管理自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain)

之前，每次域名变更，我们都必须手动修改 CNAME 文件……

一般来说，对于使用 GitHub Pages 的域名和子域名，你需要创建一个新的 A 记录，并将其指向 GitHub Pages 的 IP 地址。然后进入你的 GitHub 仓库设置，并输入你的新子域名。