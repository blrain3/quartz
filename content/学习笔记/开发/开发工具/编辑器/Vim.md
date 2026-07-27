---
title: Vim
date: 2025-03-01
tags:
  - 编辑器
---

**[Vim](https://en.wikipedia.org/wiki/Vim_(text_editor))** 是一个历史悠久的强大文本编辑器，起源于 1976 年的 `qed` 编辑器。1991 年由 Bram Moolenaar 发布初始版本。

##  主要模式：

| 模式                |          说明          |
| :---------------- | :------------------: |
| **普通模式**（Normal）  | 浏览、移动、执行操作（默认进入模式）。  |
| **插入模式**（Insert）  |        输入文本。         |
| **可视模式**（Visual）  |        选择文本。         |
| **命令模式**（Command） | 输入 `:` 执行命令（如保存、退出）。 |


## 教程：

- `vimtutor`命令 。
  - [Vim 从入门到精通（Vim Galore 中文版）](https://wsdjeg.net/vim-galore-zh-cn/)
  - [Vim 速查表（Cheat Sheet）](https://vim.rtorr.com/lang/zh_cn)

## Vim 基础操作

Vim 的核心在于熟练掌握模式切换和常用快捷键
基础操作可以查看[这篇文章](https://www.runoob.com/linux/linux-vim.html)

- `i` → 进入插入模式（Insert）
- `Esc` → 返回普通模式（Normal）
- `:` → 进入命令模式（保存 `:w`、退出 `:q`、保存退出 `:wq`、强制退出 `:q!`）
- `h j k l` → 左下上右移动光标
 ![|471|427x248](https://cdn.hashnode.com/res/hashnode/image/upload/v1719392462442/1a667ede-5f03-4acb-b40f-b10cefc64de3.png)
- `dd` → 删除当前行
- `yy` → 复制当前行
- `p` → 粘贴
- `u` → 撤销
- `Ctrl + r` → 重做

## Neovim —— Vim 的现代化版本

**Neovim** 是对 Vim 的重构与现代化改进版本，被称为“Vim 的未来”。

## LazyVim —— 把 Neovim 变成开箱即用的 IDE

**LazyVim** 是基于 `lazy.nvim` 插件管理器的 Neovim 配置发行版。它提供一套精选的默认配置和插件，让你快速获得接近 IDE 的体验，同时保留高度自定义能力。


**推荐学习资源**：
- [LazyVim 官网](https://www.lazyvim.org/)
- [Zero to IDE with LazyVim（视频）](https://www.youtube.com/watch?v=N93cTbtLCIM)
- [LazyVim 使用指南](https://abelxiaoxing.github.io/2024/01/01/LazyVim使用指南/)
- [LazyVim 从入门到精通](https://sven-chr.github.io/myblog/2025/10/25/2025-10-25-lazyvim-complete-guide/)
---
