---
title: "别把 /root 当成 Linux 的根目录"
date: 2025-04-24
tags:
  - 技术
  - Linux
  - 操作系统
  - 文件系统
  - 命令行
---

我把这篇当命令参考来记；下面的路径、提示符和输出是示例，不是当前环境的运行记录。Linux 的路径从根目录 `/` 开始，目录层级常画成一棵倒树。这里说的是目录命名约定，不是磁盘分区或某一种文件系统实现。

`/` 是根目录，也是文件系统的起点。根目录包含系统上所有其他目录和文件。`/` 字符还用作路径名之间的目录分隔符。
![](https://r2.salix.eu.org/obsidian/20260507161515444.webp)

<center><small>文件系统层级结构</center></small>

| 位置  | 目的                                       |
| ----- | ------------------------------------------ |
| /bin  | 核心命令二进制文件                         |
| /boot | 启动引导器的静态文件，启动流程的必备组件。

|
| /etc  | 主机专属系统配置                           |
| /home | 普通用户的主目录（可选）                   |
| /root | root 用户的主目录（可选；不是 `/`）        |
| /lib  | 兼容路径；在 merged-/usr 系统上可能链接到 `/usr/lib` |
| /mnt  | 临时挂载文件系统的挂载点                   |
| /opt  | 附加应用软件包                             |
| /usr  | 已安装的软件和共享库                       |
| /var  | 可变数据，如日志、缓存或队列；部分内容可能是暂态数据 |
| /tmp  | 临时文件目录；文件不保证跨重启保留，权限仍限制其他用户访问 |

> [!TIP] 可以用 `man hier` 命令来了解更多关于文件系统的信息。

要查看根目录下一层目录，可用 `tree -d -L 1 /`；不带 `/` 时，命令从当前工作目录开始列。它只展示目录，不检查文件系统健康。
不过得先安装`tree`包

绝对路径是从根目录到文件或目录的完整路径，总是以 `/` 开头。比如 `/home/john/documents` 。

相对路径则是从当前目录到目标文件或目录的路径。它不以 `/` 开头。例如， `documents/work/project` 。

可以用 `pwd` 命令来查看当前所在的目录。

```bash
wen@LAPTOP-P634H6KM:~/projects$ pwd
/home/wen/projects
```

切换目录的命令是 `cd`，意思是 “change directory”。
可以用相对路径或绝对路径。

| 命令           | 描述             |
| -------------- | ---------------- |
| `cd ..`        | 返回上一级目录   |
| `cd ../..`     | 返回上级两级目录 |
| `cd` 或 `cd ~` | 前往主目录       |
| `cd -`         | 前往上一条路径   |

> [!Tip] `ls -l` 长格式开头的类型位可区分普通文件（`-`）、目录（`d`）、符号链接（`l`）以及设备、FIFO、socket 等其他类型。

```bash
wen@LAPTOP-P634H6KM:~/projects$ ls -l
total 24
drwxr-xr-x 11 wen wen 4096 Apr 15 10:12 Code
drwxr-xr-x  5 wen wen 4096 Apr 15 08:36 Project
-rw-r--r--  1 wen wen 6156 Apr 14 17:00 bun.lock
drwxr-xr-x  4 wen wen 4096 Apr 14 17:00 node_modules
-rw-r--r--  1 wen wen   71 Apr 14 17:00 package.json
```

![image.webp](https://tg.salix.eu.org/file/1778292977935_image.webp)
![image.webp|451x200](https://tg.salix.eu.org/file/1778292978895_image.webp)

可以用 `mkdir` 命令创建一个**空目录**。

```bash
mkdir foo
```

也可以使用 `-p` 选项来递归创建目录。

```bash
mkdir -p tools/index/helper-scripts
# output of tree
.
└── tools
    └── index
        └── helper-scripts

3 directories, 0 files
```

目标不存在时，`touch` 会创建空文件；目标已存在时，它更新时间戳，不会清空文件内容。

```bash
touch file.txt
```

如果想用一条命令创建多个文件，可以把文件名连在一起写。

```bash
touch file1.txt file2.txt file3.txt
```

删除前尤其要看清目标，因为 `rm` 没有回收站。`rm` 默认删除文件；删除目录及其内容需显式使用 `-r`。`-f` 忽略不存在的目标并且不提示，不会绕过权限检查。

| 命令              | 描述                                  |
| ----------------- | ------------------------------------- |
| `rm file.txt`     | 删除文件`file.txt`                    |
| `rm -r directory` | 删除目录`directory`及其内容           |
| `rm -f file.txt`  | 直接删除文件 `file.txt`，不弹确认提示 |
| `rmdir`目录       | 删除空目录                            |

> [!warning] `rm` 不提供回收站。使用递归参数前核对目标路径；`/` 是根目录，`/root` 是 root 用户主目录，两者不是一回事。

在 Linux 里复制文件，用 `cp` 命令就行。

-  **复制文件的语法：** `cp source_file destination_of_file`

若 `/home/adam/logs` 已是目录，`cp` 会把文件放入其中；若目标路径不存在，它可能被当成新文件名。

```bash
cp file1.txt /home/adam/logs
```

`cp` 命令还会用你给的名字创建一份文件**副本**。
将名为 `file1.txt` 的文件复制到同一文件夹下另一个名为 `file2.txt` 的文件中。

```bash
cp file1.txt file2.txt
```

`mv` 命令用于将文件和文件夹从一个目录移动到另一个目录。

 **移动文件的语法：** `mv source_file destination_directory`

**示例：** 将名为 `file1.txt` 的文件移动到名为 `backup` 的目录中：

```bash
mv file1.txt backup/
```

移动目录及其内容：

```bash
mv dir1/ backup/
```

在Linux中重命名文件和文件夹也是用 `mv` 命令搞定的。

 **重命名文件的语法：** `mv old_name new_name`

**示例：** 将文件从 `file1.txt` 重命名为 `file2.txt`

```bash
mv file1.txt file2.txt
```

将目录从 `dir1` 重命名为 `dir2`

```bash
mv dir1 dir2
```

`find` 从给定起点遍历文件条目，并按名称、类型、大小、时间等条件筛选；它不搜索文件正文。

 `find` 命令的基本语法：

```bash
find /path/ -type f -name file-to-search
```

- `/path` 是文件预期所在的路径，也是搜索文件的起点。路径也可以是 `/` 或 `.`，分别代表根目录和当前目录。
- `-type` 按文件类型筛选，可用以下常见类型字母：
- `f` — **普通文件**，比如文本文件、图片以及隐藏文件。
- `d` — **目录**。这些是正在考虑的文件夹。
- `l` — **符号链接**。符号链接指向文件，就跟快捷方式差不多。
- `c` — **字符设备文件**。具体设备与驱动的工作方式有关，不要把键盘、声卡等物理设备直接等同于某个文件条目。
- `b` — **块设备文件**，用于访问按块组织数据的设备。
- `-name` 按条目的 basename 匹配 shell 通配模式；例如 `"*.html"` 匹配以 `.html` 结尾的名称。

若要找以 `style` 开头的文件名，可用下面的模式；要匹配名称中任意位置含 `style`，改用 `*style*`：

```bash
find . -type f -name "style*"
#output
./style.css
./styles.css
```

假设我们要找特定扩展名的文件，比如 `.html`。我们可以这样改一下命令：

```bash
find . -type f -name "*.html"
# output
./services.html
./blob.html
./index.html
```

文件名开头的点代表隐藏文件。它们通常不显示，但可以用 `ls -a` 在当前目录中查看。

```bash
ls -la
total 32
drwxr-xr-x  5 wen wen 4096 May  7 17:28 .
drwxr-x--- 16 wen wen 4096 May  7 17:28 ..
drwxr-xr-x 11 wen wen 4096 Apr 15 10:12 Code
drwxr-xr-x  5 wen wen 4096 Apr 15 08:36 Project
-rw-r--r--  1 wen wen 6156 Apr 14 17:00 bun.lock
drwxr-xr-x  4 wen wen 4096 Apr 14 17:00 node_modules
-rw-r--r--  1 wen wen   71 Apr 14 17:00 package.json
```

可以像下面这样修改 `find` 命令来搜索隐藏文件：

```bash
find . -type f -name ".*"
```

输出示例：

```bash
find . -type f -name ".*"
./Code/Java/Java for IDEA/.idea/.gitignore
./Code/Java/Java for IDEA/BROCODE/HelloJava/.gitignore
./Code/Java/Java for IDEA/BROCODE/HelloJava/.idea/.gitignore
./Code/Java/Java for IDEA/homework/Student/.gitignore
./Code/Java/Java for IDEA/homework/Student/.idea/.gitignore
```

日志文件通常以 `.log` 结尾，我们可以这样找到它们：

```bash
 find . -type f -name "*.log"
```

同样地，我们可以这样搜索配置文件：

```bash
 find . -type f -name "*.conf"
```

可以通过提供`c`到`-type`来搜索字符设备文件：

```bash
find / -type c
```

同理，可以用 `b` 找到设备块文件：

```bash
find / -type b
```

用 `-type d` 这个参数来找文件夹。

```bash
ls -l
# list folder contents
drwxrwxr-x 2 zaira zaira 4096 Mar 26 14:22 hosts
-rw-rw-r-- 1 zaira zaira    0 Mar 26 14:23 hosts.txt
drwxrwxr-x 2 zaira zaira 4096 Mar 26 14:22 images
drwxrwxr-x 2 zaira zaira 4096 Mar 26 14:23 style
drwxrwxr-x 2 zaira zaira 4096 Mar 26 14:22 webp

find . -type d
# find directory output
.
./webp
./images
./style
./hosts
```

`find`命令的一个超实用功能，就是按特定大小来列出文件。

```bash
find / -size +250M
```

GNU `find` 中 `-size +250M` 表示逻辑大小大于 250 MiB；`M` 是二进制单位。要只找普通文件，可加 `-type f`。

 其他单位包括：

- `G`、`M`、`k`：GiB、MiB、KiB
- `c`：字节。GNU `find` 使用小写 `k`，具体实现请查看本机手册。

直接替换成对应的单位就行。

```bash
find <directory> -type f -size +N<Unit Type>
```

使用 `-mtime` 标志，就能根据修改时间来筛选文件和文件夹了。

```bash
find /path -name "*.txt" -mtime -10
```

- `-mtime -10`：不足 10 个完整的 24 小时周期。
- `-mtime 10`：至少 10 且不足 11 个完整周期。
- `-mtime +10`：至少 11 个完整周期。它们不是按日历日期匹配。

`cat` 把指定文件或标准输入复制到标准输出。创建输出文件通常是 shell 重定向的作用，例如 `cat file > copy`；不是 `cat` 单独提供了创建命令。

基本语法：

```bash
cat [options] [file]
```

运行 `cat file.txt` 会输出指定文件。若不提供文件参数，`cat` 从标准输入读取，通常会等待输入直到收到 EOF。
例如，如果想查看名为 `file.txt` 的文件内容，可以使用以下命令：

```bash
cat file.txt
```

这会一次性在终端上显示文件的所有内容。

`cat`一次性显示整个文件，而`less`和`more`则可以交互式地查看文件内容。这在浏览大文件或搜索特定内容时特别有用。

`less` 命令的语法是：

```bash
less [options] [file]
```

`more` 命令跟 `less` 差不多，但功能少点。它用来一屏一屏地显示文件内容。

`more` 命令的语法是：

```bash
more [options] [file]
```

对于这两个命令，你可以使用 `spacebar` 向下翻一页，用 `Enter` 键向下滚动一行，按 `q` 键退出查看器。

后退按 `b` 键，前进按 `f` 键。

有时候可能只需要看文件最后几行，而不是整个文件。Linux里的`tail`命令就是用来显示文件末尾内容的。

例如，`tail file.txt` 默认会显示文件 `file.txt` 的最后 10 行。

如果想显示不同的行数，可以在后面加上 `-n` 选项，然后指定要显示的行数。

```bash
# Display the last 50 lines of the file file.txt
tail -n 50 file.txt
```

> [!tip] `tail` 还有个用法就是它的跟随（`-f`）功能。开启后能实时查看文件写入的内容，特别适合用来监控日志文件。

就像 `tail` 显示文件末尾一样，可以用 Linux 的 `head` 命令来查看文件开头。

例如，`head file.txt` 默认会显示文件 `file.txt` 的前10行。

要修改显示的行数，你可以在 `-n` 选项后面加上想显示的行数。

`wc` 默认依次输出换行符数量、按空白分隔的词数和字节数。原笔记中的 `64367` 因此应标作字节数，不能据此称为字符数；要统计字符可用 `-m`，统计字节可用 `-c`：

```bash
wc syslog.log
wc -l -w -m syslog.log
```

`1669 9623 64367` 是无法由现有文件复核的旧记录，不代表当前测试结果。

`diff` 比较两个文件。下面只展示常见调用形式；具体差异由输入文件决定。

```bash
diff -q file1 file2
diff -u file1 file2
diff -y file1 file2
```

`-q` 只报告是否不同；`-u` 用统一格式显示差异，行首空格表示上下文，`-` 表示左侧文件删除的行，`+` 表示右侧新增的行；`-y` 并排显示，`|` 表示两侧对应行不同，`<` 或 `>` 表示该行只在一侧出现。

统一格式的 `@@ -3,4 +3,5 @@` 表示旧文件从第 3 行起有 4 行，新文件从第 3 行起有 5 行；逗号后是行数，不是结束行号。

参考：[GNU `find` 手册](https://man7.org/linux/man-pages/man1/find.1.html) · [GNU `wc` 手册](https://www.gnu.org/software/coreutils/manual/html_node/wc-invocation.html) · [GNU Diffutils unified 格式](https://ftp.gnu.org/old-gnu/Manuals/diffutils-2.8.1/html_node/Detailed-Unified.html)
> 本文中的路径、提示符和输出是示例，不构成当前环境的运行记录。GNU `find`、`ls` 等细节不一定适用于所有非 GNU 实现。
