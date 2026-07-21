---
title: Bash
date: 2025-03-15
---

**Bash**，[Unix shell](https://zh.wikipedia.org/wiki/Unix_shell "Unix shell")的一种，在1987年由[布莱恩·福克斯](https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E7%A6%8F%E5%85%8B%E6%96%AF "布莱恩·福克斯")为了[GNU计划](https://zh.wikipedia.org/wiki/GNU%E8%A8%88%E5%8A%83 "GNU计划")而编写。1989年发布第一个正式版本，原先是计划用在[GNU](https://zh.wikipedia.org/wiki/GNU "GNU")操作系统上，但能运行于大多数[类Unix系统](https://zh.wikipedia.org/wiki/%E7%B1%BBUnix%E7%B3%BB%E7%BB%9F "类Unix系统")的操作系统之上，包括[Linux](https://zh.wikipedia.org/wiki/Linux "Linux")与[Mac OS X v10.4](https://zh.wikipedia.org/wiki/Mac_OS_X_v10.4 "Mac OS X v10.4")起至[macOS Mojave](https://zh.wikipedia.org/wiki/MacOS_Mojave "MacOS Mojave")都将它作为默认shell，而自[macOS Catalina](https://zh.wikipedia.org/wiki/MacOS_Catalina "MacOS Catalina")，默认Shell以[zsh](https://zh.wikipedia.org/wiki/Zsh "Zsh")取代。

## Bash脚本

Bash脚本是一个包含一系列命令的文件，这些命令由Bash程序逐行执行。

可以使用`ps`命令确定 shell 类型:

```bash
~ $ ps
PID TTY          TIME CMD
20460 pts/0    00:00:00 /data/data/com.termux
20904 pts/0    00:00:00 bash
20920 pts/0    00:00:00 ps
```

## 创建和执行Bash脚本

### 脚本命名规则

bash脚本以`.sh`结尾，但是，没有这个拓展名，bash脚本也能正常运行。

### shebang

示例：

```bash
#!/bin/bash
```

查找bash shell路径：

```bash
which bash
```


### 执行bash脚本

要使脚本可执行，需要分配执行权限：

```bash
chmod u+x file.sh
```

`chmod`修改当前用户的文件所有权:`u`。
`+x`为当前用户添加执行权限。
`file.sh`是要运行的文件。

有三种方式运行脚本：
* `sh file.sh`
* `bash file.sh`
* `./file.sh`

Bash注释使用`#`:

```bash
# This is a comment
```

终端编辑器可参考 [[无涯/计算机科学/开发/开发工具/编辑器/Vim|Vim]]。