---
title: Claude Code 中值得使用的功能
date: 2025-12-05
tags:
  - 代码
  - 编程
  - AI
---
[CLaude Code](https://claude.com/product/claude-code) 是一款强大且质量不错的工具，我更喜欢 **「IDE + Agent」**（或者Editor + Agent）组合（有界面、能点按钮），概念可迁移到其他编程 Agent。Claude Code 的出现可谓让A\在人工智能时代杀出一条血路。

Claude Code中有一些实用的功能，我就使用情况对其进行锐评。

| 功能                    | 评级            | 要点                                                                                                                                                                                                                                                                                             |
| --------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/init` + `CLAUDE.md` | C/D（文件本身可升）   | 首次进项目分析代码库写入记忆文件；可 import 其他 md。内容建议写：项目简介、现状、编码风格、PR 语言、避免全大写等。不是刚需，Skills 往往更管用。                                                                                                                                                                                                             |
| Skills（`skill.md`）    | A→S（用得好）      | 可复用工作流指南。推荐使用TS大师 [Matt Pocock](https://github.com/mattpocock) 的 **[graph-docs-cli](https://github.com/mattpocock/graph-docs-cli)**改进架构；Cursor 的 [Thermonuclear code quality](https://github.com/cursor/plugins/blob/main/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md)。 |
| Plan Mode（Shift+Tab）  | 必备            | 先读代码、写完整计划再动手，方便审计划。适合大任务，小改动别用。                                                                                                                                                                                                                                                               |
| 验证（Verification）      | S / 三 S       | 工程基本功。先写测试再实现；别测每一行；用类型检查/linter；前端用截图/浏览器测试。让模型有办法自证「做完了」。                                                                                                                                                                                                                                    |
| MCP                   | A             | 只在需要与代码库外系统交互时用（GitHub、DB、浏览器等）。别把最佳实践塞进 MCP，那是 Skill 的事。少装、只装必要的。                                                                                                                                                                                                                             |
| `/voice`              | B             | 说话当 prompt，描述更自然。                                                                                                                                                                                                                                                                              |
| `/btw`                | C             | 任务中途提问，不打断主对话。                                                                                                                                                                                                                                                                                 |
| Teleport / 远程控制       | 视场景           | 手机↔网页↔终端迁移会话。                                                                                                                                                                                                                                                                                  |
| Shell 模式（`!` 开头）      | C（被低估）        | 跑终端命令且让 Claude 看到输出。                                                                                                                                                                                                                                                                           |
| `/radio`              | 氛围向           | 放 lo-fi。                                                                                                                                                                                                                                                                                       |
| `/context`            | B             | 看当前上下文占用。                                                                                                                                                                                                                                                                                      |
| `/compact`            | 自用 B / 自动触发 C | 自动 compact 常等于质量下滑，大任务中途出现就新开会话；需要时自己跑并指定保留内容。                                                                                                                                                                                                                                                 |
| `/loop`               | 实用            | 类似 AI cron：按间隔重复任务（实现 issue、安全扫描、功能头脑风暴等）。                                                                                                                                                                                                                                                     |
| 目标驱动持续工作              | B～A           | 给目标让它一直做到满足或需要人介入。                                                                                                                                                                                                                                                                             |
| Sub-agents            | A～S（看配额）      | 主 agent 派生有独立上下文的子 agent，适合研究/审查/调试；多 agent 很吃额度。                                                                                                                                                                                                                                              |
| Worktrees             | A             | 每聊天一个隔离工作树，适合并行 AI 开发。                                                                                                                                                                                                                                                                         |

**Claude Code 中的上下文 / Token 管理**

- 每个新任务新开会话。
- 别让它乱探索文件/网站。
- 提示要**蠢到具体**。
- 大约 10万～20万 token 后质量开始掉。
- 自动 `/compact` 中途出现 → 新开。