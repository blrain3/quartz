---
title: Nano
date: 2025-03-08
---

**GNU nano**是一款适用[于类 Unix](https://en.wikipedia.org/wiki/Unix-like "类Unix系统")计算系统或操作系统环境的[文本编辑器，它使用](https://en.wikipedia.org/wiki/Text_editor "文本编辑器")[命令行界面](https://en.wikipedia.org/wiki/Command_line_interface "命令行界面")。它模拟了[Pine](https://en.wikipedia.org/wiki/Pine_\(email_client\) "Pine（电子邮件客户端）")邮件客户端中的[Pico](https://en.wikipedia.org/wiki/Pico_\(text_editor\) "Pico（文本编辑器）")[^1]文本编辑器，并提供了额外的功能。

[官方网站](https://www.nano-editor.org/)

要使用 Nano 创建新文件，请使用以下命令：

```bash
nano
```

要使用 Nano 开始编辑现有文件，请使用以下命令：

```bash
nano filename
```

## Nano 中的按键绑定列表

**写入文件并保存**

使用命令打开 Nano 后`nano`，即可开始编写文本。要保存文件，请按 Ctrl+C `Ctrl+O`。系统会提示您输入文件名。按 Ctrl+C`Enter`保存文件。

**退出Nano**

您可以按 键退出 Nano `Ctrl+X`。如果您有未保存的更改，Nano 会在退出前提示您保存更改。

**复制和粘贴**

要选择一个区域，请使用`ALT+A`。此时会显示一个标记。使用箭头键选择文本。选择完成后，使用 键退出标记`ALT+^`。

要复制选定的文本，请按`Ctrl+K`。要粘贴复制的文本，请按`Ctrl+U`。

**剪切和粘贴**

使用 选中区域`ALT+A`。选中后，使用 剪切文本`Ctrl+K`。要粘贴剪切的文本，请按`Ctrl+U`。

**导航**

用于`Alt \`移动到文件开头。

用于`Alt /`移动到文件末尾。

**查看行号**

使用 打开文件时`nano -l filename`，可以在文件左侧查看行号。

**搜索**

可以使用 . 来搜索特定的行号`ALt + G`。在提示符处输入行号，然后按`Enter`.

也可以使用 并按 Enter 键来搜索字符串`CTRL + W`。如果您想向后搜索，可以`Alt+W`在使用 开始搜索后按 键`Ctrl+W`。

[^1]:**Pico**（**Pine composer**）是一款适用于[Unix](https://en.wikipedia.org/wiki/Unix "Unix")和[类 Unix计算机系统的](https://en.wikipedia.org/wiki/Unix-like "Unix-like")[文本编辑器。它与](https://en.wikipedia.org/wiki/Text_editor "文本编辑器")[Pine](https://en.wikipedia.org/wiki/Pine_\(email_client\) "Pine (email client)")和Alpine集成， Pine 和[Alpine是最初由](https://en.wikipedia.org/wiki/Alpine_\(email_client\) "Alpine (email client)")[华盛顿大学](https://en.wikipedia.org/wiki/University_of_Washington "University of Washington")计算机与通信办公室设计的[电子邮件客户端](https://en.wikipedia.org/wiki/Email_client "Email client")。


