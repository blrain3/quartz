[Linux](https://zh.wikipedia.org/wiki/Linux),是一种[自由和开放源码](https://zh.wikipedia.org/wiki/%E8%87%AA%E7%94%B1%E5%8F%8A%E5%BC%80%E6%94%BE%E6%BA%90%E4%BB%A3%E7%A0%81%E8%BD%AF%E4%BB%B6 "自由及开放源代码软件")的[类Unix](https://zh.wikipedia.org/wiki/%E7%B1%BBUnix%E7%B3%BB%E7%BB%9F "类Unix系统")[操作系统](https://zh.wikipedia.org/wiki/%E4%BD%9C%E6%A5%AD%E7%B3%BB%E7%B5%B1 "操作系统")。该操作系统的[内核](https://zh.wikipedia.org/wiki/%E5%86%85%E6%A0%B8 "内核")由[林纳斯·托瓦兹](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%C2%B7%E6%89%98%E7%93%A6%E5%85%B9 "林纳斯·托瓦兹")在1991年10月5日首次发布。

<p style="text-align: center;">
  <img src="https://tg.salix.eu.org/file/1784605986705_image.webp" width="20%" />
</p>

>Linux的[标志](https://zh.wikipedia.org/wiki/%E6%A8%99%E8%AA%8C "标志")和[吉祥物](https://zh.wikipedia.org/wiki/%E5%90%89%E7%A5%A5%E7%89%A9 "吉祥物")是一只名字叫做[Tux](https://zh.wikipedia.org/wiki/Tux "Tux")的[企鹅](https://zh.wikipedia.org/wiki/%E4%BC%81%E9%B5%9D "企鹅")，标志的由来是因为Linus在澳洲时曾被一座动物园里的[小蓝企鹅](https://zh.wikipedia.org/wiki/%E5%B0%8F%E8%97%8D%E4%BC%81%E9%B5%9D "小蓝企鹅")咬了一口，便选择企鹅作为Linux的标志，但更容易被接受的说法是：企鹅代表南极，而南极又是全世界所共有的一块陆地。这也就代表Linux是所有人的Linux。

<p style="text-align: center;">
  <img src="https://r2.salix.eu.org/obsidian/20260507152957767.webp" width="80%" />
</p>
<center><small>电脑软硬之间的架构与关系图，可以看到内核进行的是应用软件和计算机硬件的交互工作</small></center>

---
## 提示符

当 shell 以交互方式运行时，它会在等待用户输入命令时显示一个 `$`，这就是所谓的 shell 提示符。
`[username@host ~]$`

如果 shell 以 `root` 身份运行，提示符会变成 `#` 。
`[root@host ~]#`

## 命令结构

命令是一个执行特定操作的程序。

一般来说，Linux命令的语法是这样的：
```bash
command [options] [arguments]
```

* `command`：**要执行的命令名称。**`ls`（列表）、`cp`（复制）和`rm`（删除）都是常见的 Linux 命令。
* `[options]`：**选项（也叫标志），通常前面的带一个短横线（-）或双短横线（--），用来调整命令的行为。它能改变命令的运行方式。** 比如`ls -a`用了`-a`这个选项来显示当前目录里的隐藏文件。
* `[arguments]`：**参数，指的是哪些需要输入的命令的输入内容，即额外信息或数据。可以是文件名或其他命令要处理的数据。** 比如命令 `cat access.log` 中，`cat` 是命令本身，`access.log` 就是输入。这样，`cat` 命令就会显示 `access.log` 文件的内容。

>[!TIP] 可以用 `man command` 命令查看某个指令的手册。


## Bash命令与键盘快捷键

|       操作       |   快捷方式   |
| :------------: | :------: |
|    查找上一条命令     |   上箭头    |
|   跳到上一个词的开头    | Ctrl+左箭头 |
| 清除从光标到命令行末尾的字符 |  Ctrl+K  |
|  补全命令、文件名和选项   |   Tab    |
|    跳转到命令行开头    |  Ctrl+A  |
|  显示之前输入过的命令列表  | history  |

可以用 `whoami` 命令查看当前登录的用户名。

## 查看Linux系统信息

### 使用 `uname` 命令打印系统信息

可以通过 `uname` 命令获取详细的系统信息。
当提供 `-a` 选项时，它会打印出所有系统信息。

```bash
wen@LAPTOP-P634H6KM:~/projects$ uname -a
Linux LAPTOP-P634H6KM 6.6.87.2-microsoft-standard-WSL2 #1 SMP PREEMPT_DYNAMIC Thu Jun  5 18:30:46 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
```

### 使用 `lscpu` 命令查看CPU架构详情

Linux 中的 `lscpu` 命令用来查看 CPU 架构信息。