---
title:
---
## 环境要求

- 操作系统：支持主流 Linux 发行版本（基于 Debian / RedHat，包括国产操作系统）
- 服务器架构：x86_64、aarch64、armv7l、ppc64le、s390x、riscv64
- 内存要求：建议可用内存在 1GB 以上
- 浏览器要求：请使用 Chrome、Firefox、IE 10+、Edge 等现代浏览器
- **可访问互联网**
- 如果是内网环境，推荐使用 [离线安装](https://1panel.cn/docs/v2/installation/enterprise_installation/) 方式进行部署，可参考[[Linux 安装 Tailscale]]。

## 安装部署

>GitHub Release 链接：[https://github.com/1Panel-dev/1Panel/releases](https://github.com/1Panel-dev/1Panel/releases)

### 2.1 交互式安装

执行以下安装脚本，根据命令行提示完成安装。

```
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

<img src="https://tg.salix.eu.org/file/1788826446728_image.webp" alt="image.webp" width=100% />

按照步骤操作即可
<img src="https://tg.salix.eu.org/file/1788826555965_image.webp" alt="image.webp" width=100% />

安装成功后，控制台会打印面板访问信息，可通过浏览器访问 1Panel：

`http://目标服务器 IP 地址:目标端口/安全入口`

- **如果使用的是云服务器，请在安全组中开放对应的目标端口**
- **ssh 登录 1Panel 服务器后，执行 `1pctl user-info` 命令可获取安全入口（entrance）**

<img src="https://tg.salix.eu.org/file/1788826964225_image.webp" alt="image.webp" width=50% />

**登录**
<img src="https://tg.salix.eu.org/file/1788827032090_image.webp" alt="image.webp" width=100% />

### 2.2 非交互安装

如需在批量部署、云服务器初始化脚本、CI/CD 等自动化场景中安装 1Panel，可以通过环境变量提前配置安装参数，并启用非交互模式。

```
# 如需由安装脚本自动安装 Docker，请显式开启 
PANEL_NON_INTERACTIVE=true \ 
PANEL_LANG=zh \ 
PANEL_INSTALL_DIR=/opt \ 
PANEL_PORT=18080 \
PANEL_ENTRANCE=panelEntrance \
PANEL_USERNAME=panelAdmin \ 
PANEL_PASSWORD='ChangeMe_123456' \ 
PANEL_INSTALL_DOCKER=y \ 
PANEL_DOCKER_MODE=auto \ 
PANEL_CONFIGURE_ACCELERATOR=n \ 
PANEL_REPLACE_DAEMON_JSON=n \ 
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

宝塔面板同理
<img src="https://tg.salix.eu.org/file/1788828457154_image.webp" alt="image.webp" width=100% />