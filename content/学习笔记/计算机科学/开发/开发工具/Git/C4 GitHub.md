---
title: GitHub
date: 2025-02-15
tags:
  - Git
  - 版本控制
---

## 对项目做出贡献

### 派生（Fork）项目

当你没有某项目的推送权限时，点击项目页右上角的 **Fork** 按钮，GitHub 会为你在自己的账户下创建一份完全可写的副本。

### GitHub 协作流程（Hub Flow）

```
1. Fork 项目到自己的账户
2. 从 master 创建新分支
3. 提交修改
4. 将分支推送到 GitHub
5. 创建 Pull Request（拉取请求）
6. 讨论并根据反馈继续修改
7. 维护者合并或关闭 PR
8. 将更新后的 master 同步回你的 Fork
```

> **不必总是 Fork**：如果你对项目有写权限，可以直接推送分支，然后在 master 上发起 PR，无需 Fork。

### 创建 Pull Request 完整示例

```bash
# 克隆 Fork 后的仓库
git clone https://github.com/tonychacon/blink

# 创建特性分支
git checkout -b slow-blink

# 修改代码
sed -i '' 's/1000/3000/' blink.ino  # macOS
# Linux: sed -i 's/1000/3000/' blink.ino

# 检查改动
git diff

# 提交
git commit -a -m 'three seconds is better'

# 推送到自己的 Fork
git push origin slow-blink
```

之后在 GitHub 上会自动出现绿色按钮，可以直接创建 PR。

### 利用 Pull Request

- **逐行评论**：维护者可以点击代码任意行发表意见，提交者收到通知
- **继续追加提交**：PR 提交后仍可推送新提交（会自动追加到 PR 中）
- **合并 PR**：维护者点击 Merge 按钮，GitHub 会创建合并提交

### 与上游保持同步（解决冲突）

```bash
# 添加上游仓库为远程
git remote add upstream https://github.com/schacon/blink

# 抓取上游
git fetch upstream

# 合并上游 master 到你的分支（推荐方式）
git merge upstream/master
# 或变基（不推荐用于已提交的 PR）
# git rebase upstream/master

# 解决冲突后提交
git add blink.ino
git commit

# 推送回同一分支，PR 自动更新
git push origin slow-blink
```

> **推荐 merge 而非 rebase**：merge 保留完整历史，更易于追踪和回溯。

### 引用与交叉引用

| 语法 | 含义 |
|---|---|
| `#3` | 当前仓库的 #3 PR 或 Issue |
| `用户名#5` | 该用户 Fork 仓库的 #5 |
| `用户名/仓库#5` | 不同仓库的 #5 |
| `SHA` | 直接引用某次提交 |


---

## 维护项目

### 创建仓库

点击右上角 `+` → New repository，或 Dashboard 的 New repository 按钮。

### 合作者权限

Settings → Collaborators：添加其他 GitHub 用户，授予仓库的写权限。

### 管理 Pull Request（作为维护者）

- **收到 PR 通知**：邮件会显示改动统计和文件列表，以及 GitHub 和命令行操作链接
- **网页合并**：点击 Merge 按钮，GitHub 自动执行 non-fast-forward 合并并生成合并提交
- **本地合并**：`git pull` 合并后推送，PR 自动关闭

### 提醒与通知

- 在任何评论框输入 `@用户名` 提及合作者，系统自动补全
- **通知配置**：Settings → Notification Center，可选择邮件或网页通知方式

### 特殊文件

| 文件 | 作用 |
|---|---|
| `README.md` | 自动渲染在项目首页，包含项目说明、安装、使用示例、许可证 |
| `CONTRIBUTING.md` | 在开启 PR 前展示给贡献者，说明期望/不期望的贡献类型 |

### 项目管理

- **修改默认分支**：Settings → Options → Default branch，将 master 改为其他分支
- **移交项目**：Settings → Options → Transfer ownership，可将项目转移给其他用户或组织

---

## 管理组织

### 组织（Organization）vs 个人账户

组织账户适合团队/公司共同拥有多个项目，除了项目托管外还提供成员分组管理工具。

- **创建组织**：右上角 `+` → New organization
- **团队（Teams）**：组织内按功能/项目划分成员，设定每个团队对仓库的访问权限（Read / Write / Admin / Full control）
- **审计日志（Audit Log）**：记录组织内所有操作（谁、何时、在哪做了什么）

---

## 脚本 GitHub（API 与钩子）

### 仓库钩子（Hooks）

**服务（Service）**：仓库设置中的预设集成，支持 CI/CD（Travis CI、Jenkins）、聊天工具（Slack）、持续集成等。

**自定义 Webhook**：指定 URL，GitHub 在指定事件发生时发送 HTTP POST 请求：

```json
{
  "event": "push",
  "payload": {
    "repository": "...",
    "commits": [...]
  }
}
```

常用触发事件：`push`、`pull_request`、`issues`、`release`

### GitHub API

GitHub 提供 REST API 和 GraphQL API，可实现自动化操作（创建 Issue、评论、合并 PR 等）。

- **无需认证**：GET 请求可读取公开信息
- **需要认证**：操作私有内容或在 Issue/PR 上评论需要 Personal Access Token 或 OAuth App

```bash
# 示例：查看某仓库信息（无需认证）
curl https://api.github.com/repos/owner/repo

# 需要认证的操作
curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/user/repos
```
