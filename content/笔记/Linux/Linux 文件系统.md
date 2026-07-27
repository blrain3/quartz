---
title: Linux 文件系统
date: 2025-07-20
tags:
  - Linux
---

## Linux 文件系统层级结构

Linux 里的所有文件都存在文件系统里。它的结构像一棵倒过来的树，因为根在最顶上。

`/` 是根目录，也是文件系统的起点。根目录包含系统上所有其他目录和文件。`/` 字符还用作路径名之间的目录分隔符。
![](https://r2.salix.eu.org/obsidian/20260507161515444.webp)
<center><small>文件系统层级结构</center></small>

|位置|目的|
|---|---|
|/bin|核心命令二进制文件|
|/boot|启动引导器的静态文件，启动流程的必备组件。|
|/etc|主机专属系统配置|
|/home|用户主目录|
|/root|管理员的根用户主目录|
|/lib|必需的共享库和内核模块|
|/mnt|临时挂载文件系统的挂载点|
|/opt|附加应用软件包|
|/usr|已安装的软件和共享库|
|/var|跨启动间持久化的变量数据|
|/tmp|所有用户都能访问的临时文件|
>[!TIP] 可以用 `man hier` 命令来了解更多关于文件系统的信息。

可以用 `tree -d -L 1` 命令检查文件系统。调整 `-L` 参数就能改变树的显示深度。
不过得先安装`tree`包

## Linux 文件系统

### 绝对路径和相对路径

绝对路径是从根目录到文件或目录的完整路径，总是以 `/` 开头。比如 `/home/john/documents` 。

相对路径则是从当前目录到目标文件或目录的路径。它不以 `/` 开头。例如， `documents/work/project` 。

### 定位当前目录

可以用 `pwd` 命令来查看当前所在的目录。

```bash
wen@LAPTOP-P634H6KM:~/projects$ pwd
/home/wen/projects
```

### 切换目录

切换目录的命令是 `cd`，意思是 "change directory"。
可以用相对路径或绝对路径。

|命令|描述|
|---|---|
|`cd ..`|返回上一级目录|
|`cd ../..`|返回上级两级目录|
|`cd` 或 `cd ~`|前往主目录|
|`cd -`|前往上一条路径|

## 管理文件和文件夹

>[!Tip] `ls -l` 输出结果的首字母就能区分文件和文件夹。`'-'` 代表文件，`'d'` 代表文件夹。

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
![image.webp](https://tg.salix.eu.org/file/1778292978895_image.webp)
### 创建新目录

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

### 创建新文件

`touch` 命令可以创建一个**空文件**，用法如下：

```bash
touch file.txt
```


如果想用一条命令创建多个文件，可以把文件名连在一起写。

```bash
touch file1.txt file2.txt file3.txt
```


### 删除文件和目录

可以用 `rm` 命令来删除文件和非空目录。

|命令|描述|
|---|---|
|`rm file.txt`|删除文件`file.txt`|
|`rm -r directory`|删除目录`directory`及其内容|
|`rm -f file.txt`|直接删除文件 `file.txt`，不弹确认提示|
|`rmdir`目录|删除空目录|
>[!warning] 使用 `-f` 标记时要小心，因为删除文件前不会征求你的意见。另外，在 `root` 文件夹里执行 `rm` 命令也要谨慎，搞不好会删掉重要的系统文件。


### 复制文件

在 Linux 里复制文件，用 `cp` 命令就行。
-  **复制文件的语法：** `cp source_file destination_of_file`

此命令将名为 `file1.txt` 的文件复制到新位置 `/home/adam/logs`。

```bash
cp file1.txt /home/adam/logs
```

`cp` 命令还会用你给的名字创建一份文件**副本**。
将名为 `file1.txt` 的文件复制到同一文件夹下另一个名为 `file2.txt` 的文件中。

```bash
cp file1.txt file2.txt
```

### 移动和重命名文件和文件夹

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

### 定位文件和文件夹

`find`命令能高效搜索文件、文件夹、字符以及块。

 `find` 命令的基本语法：

```bash
find /path/ -type f -name file-to-search
```

- `/path` 是文件预期所在的路径，也是搜索文件的起点。路径也可以是 `/` 或 `.`，分别代表根目录和当前目录。
- `-type` 表示文件描述符，可以是以下几种之一：
- `f` – **普通文件**，比如文本文件、图片以及隐藏文件。
- `d` – **目录**。这些是正在考虑的文件夹。
- `l` – **符号链接**。符号链接指向文件，就跟快捷方式差不多。
- `c` – **字符设备**。用来访问字符设备的文件就叫字符设备文件。驱动程序通过发送和接收单个字符（字节、八位组）来和字符设备通信。例如键盘、声卡和鼠标。
- `b` – **块设备**。用来访问块设备的文件被称为块设备文件。驱动程序通过发送和接收整块数据来与块设备通信，比如USB和光盘就是典型的例子。
- `-name` 是你要搜索的文件类型名称。
### 按文件名或扩展名搜索文件

假设我们要找文件名里带"style"的文件。用这个命令就行：

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

### 搜索隐藏文件

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

### 搜索日志文件和配置文件

日志文件通常以 `.log` 结尾，我们可以这样找到它们：

```bash
 find . -type f -name "*.log"
```

同样地，我们可以这样搜索配置文件：

```bash
 find . -type f -name "*.conf"
```

### 按类型搜索其他文件

可以通过提供`c`到`-type`来搜索字符块文件：

```bash
find / -type c
```

同理，可以用 `b` 找到设备块文件：

```bash
find / -type b
```

### 搜索目录

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

### 按文件大小搜索

`find`命令的一个超实用功能，就是按特定大小来列出文件。

```bash
find / -size +250M
```

这里列出的是文件大小超过 `250MB` 的文件。

 其他单位包括：

-  `G`：吉字节
    
-  `M`：兆字节（MB）
    
-  `K`：千字节
    
-  `c`：字节。
    

直接替换成对应的单位就行。

```bash
find <directory> -type f -size +N<Unit Type>
```

### 按修改时间搜索文件

使用 `-mtime` 标志，就能根据修改时间来筛选文件和文件夹了。

```bash
find /path -name "*.txt" -mtime -10
```

- **`-mtime +10`** 意思是你找的是10天前修改过的文件。
- **`-mtime -10`** 表示不到10天。
- **`-mtime 10`** 如果没 `+` 或 `-`，就表示正好 10 天。

## 查看文件的基本命令

### 拼接并显示文件

Linux 中的 `cat` 命令用来查看文件内容，还能拼接文件或创建新文件。

基本语法：

```bash
cat [options] [file]
```

使用 `cat` 最简单的方法就是不加任何选项或参数，这样会在终端上显示文件内容。
例如，如果想查看名为 `file.txt` 的文件内容，可以使用以下命令：

```bash
cat file.txt
```

这会一次性在终端上显示文件的所有内容。

### 交互式查看文本文件

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

### 显示文件的最后部分

有时候可能只需要看文件最后几行，而不是整个文件。Linux里的`tail`命令就是用来显示文件末尾内容的。

例如，`tail file.txt` 默认会显示文件 `file.txt` 的最后 10 行。

如果想显示不同的行数，可以在后面加上 `-n` 选项，然后指定要显示的行数。

```bash
# Display the last 50 lines of the file file.txt
tail -n 50 file.txt
```

>[!tip] `tail` 还有个用法就是它的跟随（`-f`）功能。开启后能实时查看文件写入的内容，特别适合用来监控日志文件。

### 显示文件开头

就像 `tail` 显示文件末尾一样，可以用 Linux 的 `head` 命令来查看文件开头。

例如，`head file.txt` 默认会显示文件 `file.txt` 的前10行。

要修改显示的行数，你可以在 `-n` 选项后面加上想显示的行数。

### 统计字数、行数和字符数

可以用 `wc` 命令统计文件中的字数、行数和字符数。

比如，运行 `wc syslog.log` 之后我得到了这样的结果：

```bash
1669 9623 64367 syslog.log
```

 在上面的输出中，

- `1669` 表示文件 `syslog.log` 中的行数
- `9623`表示文件`syslog.log`中的字数
- `64367`表示文件`syslog.log`的字符数

命令 `wc syslog.log` 统计了文件 `syslog.log` 里的 `1669` 行、`9623` 个词和 `64367` 个字符。

### 逐行比较文件

直接用命令行里的 `diff` 命令就能对比两个文件。

`diff` 命令的基本语法是：

```bash
diff [options] file1 file2
```

这里有两个文件，`hello.py` 和 `also-hello.py`，用 `diff` 命令来对比它们：

```bash
# contents of hello.py

def greet(name):
    return f"Hello, {name}!"

user = input("Enter your name: ")
print(greet(user))
```

```bash
# contents of also-hello.py

more also-hello.py
def greet(name):
    return fHello, {name}!

user = input(Enter your name: )
print(greet(user))
print("Nice to meet you")
```

1. 检查这些文件是否相同

```bash
diff -q hello.py also-hello.py
# Output
Files hello.py and also-hello.py differ
```

2. 看看这些文件有啥不同。你可以用 `-u` 这个参数来查看统一输出格式：

```bash
diff -u hello.py also-hello.py
--- hello.py    2024-05-24 18:31:29.891690478 +0500
+++ also-hello.py    2024-05-24 18:32:17.207921795 +0500
@@ -3,4 +3,5 @@

 user = input(Enter your name: )
 print(greet(user))
+print("Nice to meet you")
```

 在上面的输出中：

- `--- hello.py 2024-05-24 18:31:29.891690478 +0500` 表示正在比对的文件及其时间戳。
- `+++ also-hello.py 2024-05-24 18:32:17.207921795 +0500`表示被比较的另一个文件及其时间戳。
- `@@ -3,4 +3,5 @@`显示了发生变更的行号。这里的意思是，原始文件中的第3到4行，在修改后的文件中变成了第3到5行。
- `user = input(Enter your name: )` 是原始文件中的一行。
- `print(greet(user))` 是原始文件中的另一行。
- `+print("Nice to meet you")` 是修改后的文件中新增的那一行。

3. 要以并排方式查看差异，可以使用 `-y` 这个参数：

```bash
diff -y hello.py also-hello.py
# Output
def greet(name):                        def greet(name):
    return fHello, {name}!                  return fHello, {name}!

user = input(Enter your name: )          user = input(Enter your name: )
print(greet(user))                       print(greet(user))
                                        > print("Nice to meet you")
```

- 两个文件中相同的行会并排显示。
- 不同的行会用 `>` 符号标记，表示该行只出现在其中一个文件里。