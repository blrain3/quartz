# Quartz v5 项目维护优化方案

> 基于对项目源码的完整审查，以下整理出分优先级的维护优化清单。
> 每项均包含问题描述、影响评估和建议实施方案。

---

## 一、高优先级（应尽快处理）

### 1.1 Dockerfile 缺少补丁步骤

**问题**: `Dockerfile` 中构建阶段执行了 `npm ci; npx quartz plugin install`，但未运行补丁脚本（`patch-graph.mjs`、`patch-footer.mjs`、`patch-search.mjs`）。由于 `prebuild` 钩子在 `npx quartz build` 时自动触发，Docker 内最终构建（`CMD ["npx", "quartz", "build", "--serve"]`）的 `prebuild` 会覆盖已安装的插件文件。但如果 Docker 构建阶段单独运行 `plugin install` 后需要验证补丁效果，则补丁不在该阶段生效。

**影响**: Docker 容器中首次 `build` 时，`prebuild` 会正确执行补丁。但若容器内重新安装插件（如排障场景），补丁不会自动应用。此外 `patch-graph-output.mjs` 完全未集成到任何 npm script 中。

**建议方案**:

- 在 Dockerfile builder 阶段 `npm ci` 之后、`plugin install` 之后添加 `npm run patch` 步骤
- 将 `patch-graph-output.mjs` 集成到 `prebuild` 或 `postbuild` 脚本中
- 更新后的 Dockerfile builder 阶段：
  ```dockerfile
  RUN npm ci && npx quartz plugin install && npm run patch
  ```

### 1.2 `patch-graph-output.mjs` 未纳入构建流程

**问题**: `scripts/patch-graph-output.mjs` 负责修补构建产物 `public/postscript-*.js` 中的中文 URL slug 处理，但它既不在 `prebuild` 也不在 `patch` 脚本中。

**影响**: 构建产物中的 `postscript-*.js` 未被修补，可能导致图视图（如果重新启用）在中文 URL 页面上无法正确匹配当前页面。虽然图插件当前已禁用，但该脚本对应的 SPA 路由 slug 解析逻辑可能影响其他依赖 `window.location.pathname` 的功能。

**建议方案**:

- 添加 `"postbuild": "node scripts/patch-graph-output.mjs"` 到 `package.json`
- 或将 `patch-graph-output.mjs` 加入 `prebuild` 链（但注意此时 `public/` 尚未生成，需改为 `postbuild`）

### 1.3 补丁脚本的脆弱性 — 硬编码最小化函数名

**问题**: `patch-graph.mjs` 中匹配 `function we(){let u=window.location.pathname` — 其中 `we` 是 esbuild 最小化后的函数名。如果插件更新导致最小化结果变化（不同的函数名/结构），补丁将静默失败（输出 "No match in file, skipping"）。

同样，`patch-footer.mjs` 依赖 `u2("footer"` 这个最小化后的函数名，以及 `" ] })` 括号匹配逻辑。`patch-search.mjs` 依赖精确字符串匹配 `"No results."` 和 `"Try another search term?"`。

**影响**: 任何插件版本更新都可能导致补丁失效，且失效时仅输出日志警告，不会中断构建。用户可能在不察觉的情况下发布未修补的站点。

**建议方案**:

- 为每个补丁脚本添加 **版本检测**：在补丁前检查 `quartz.lock.json` 中对应插件的 commit SHA，与已知兼容的 SHA 比较，不匹配时输出明确警告
- 添加 **构建时断言**：如果补丁未找到匹配模式但文件存在，应返回非零退出码（至少在 CI 环境中）
- 考虑使用 **正则表达式** 替代精确字符串匹配，提高对最小化变化的容忍度
- 在 `CLAUDE.md` 或项目文档中记录补丁脚本与插件版本的对应关系

### 1.4 npm audit 高危漏洞

**问题**: `npm audit` 报告 1 个高危漏洞 — `brace-expansion`（`serve-handler` 的传递依赖）存在 DoS 漏洞。

**影响**: 开发服务器可能受到恶意输入的 DoS 攻击。生产环境（静态站点）不受影响，因为 `serve-handler` 仅用于本地开发服务器。

**建议方案**:

- 运行 `npm audit fix` 修复
- 如果 `serve-handler` 的上游未发布兼容修复，考虑在 `package.json` 中添加 `overrides` 字段强制使用修补后的 `brace-expansion` 版本

---

## 二、中优先级（应在下次迭代中处理）

### 2.1 `MyFooter.tsx` 返回 null — Footer 双重覆盖逻辑混乱

**问题**: `config-loader.ts` 第 682-683 行使用本地 `MyFooter` 组件替代插件 footer，但 `MyFooter` 返回 `null`（不渲染任何内容）。实际的 footer 文本 "blrain 2026" 通过 `patch-footer.mjs` 直接修改编译后的插件 footer 代码实现。

这形成了双重覆盖：

1. config-loader 层面：用空 `MyFooter` 替代插件 footer
2. 补丁层面：直接修改插件编译产物

由于 `MyFooter` 返回 null 且被设为默认 footer，插件 footer 的补丁实际不生效（被 MyFooter 覆盖了）。Footer 文本可能完全不会显示。

**影响**: 站点可能没有 footer 内容。或者如果 `MyFooter` 被旁路（如某些渲染路径直接使用插件 footer），则行为不一致。

**建议方案**:

- **方案 A（推荐）**: 让 `MyFooter.tsx` 直接返回包含 "blrain 2026" 的 JSX，移除 `patch-footer.mjs` 及其在 `prebuild` 中的引用。这是最干净的方案 — 不依赖修改编译产物。

  ```tsx
  export default (() => {
    const MyFooter: QuartzComponent = () => {
      return (
        <footer>
          <p>blrain 2026</p>
        </footer>
      )
    }
    return MyFooter
  }) satisfies QuartzComponentConstructor
  ```

- **方案 B**: 移除 `MyFooter.tsx` 覆盖逻辑，完全依赖 `patch-footer.mjs` 修改插件 footer。但这种方式更脆弱。

### 2.2 `GraphButton.tsx` — 孤立的图视图按钮组件

**问题**: `GraphButton.tsx` 是一个自定义的轻量级图视图触发按钮，在配置中图插件已禁用（`enabled: false`）的情况下，该组件未被任何布局引用。

**影响**: 死代码 — 组件存在但不被使用，增加维护负担。

**建议方案**:

- 如果确定不再使用图视图功能：删除 `GraphButton.tsx`
- 如果可能未来重新启用：在文件顶部添加注释说明其状态和用途，并确保它不会被误引用

### 2.3 `custom.scss` 为空 — 样式定制未集中管理

**问题**: `quartz/styles/custom.scss` 仅包含 `@use "./variables.scss" as *;` 和一行注释，没有任何实际自定义样式。所有样式定制通过配置文件中的 `theme.colors` 和 `theme.typography` 实现。

**影响**: 无功能影响，但如果有零散的 CSS 覆盖散落在各处，不利于维护。

**建议方案**:

- 在 `custom.scss` 中添加常用的自定义样式（如字体平滑、链接 hover 效果等），集中管理
- 可考虑添加：
  ```scss
  @use "./variables.scss" as *;

  // 平滑字体渲染
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // 中文排版优化
  :lang(zh) {
    word-break: break-all;
    line-height: 1.8;
  }
  ```

### 2.4 Dockerfile 优化 — 多阶段构建不完整

**问题**: 当前 Dockerfile 第二阶段 `COPY --from=builder /usr/src/app/ /usr/src/app/` 复制了整个构建目录（包括 `node_modules`、`.quartz` 等），然后又 `COPY . .` 复制当前目录覆盖源码。这导致：

1. builder 阶段的 `node_modules` 被完整复制（体积大）
2. `COPY . .` 可能覆盖 builder 阶段的文件（取决于 `.dockerignore` 配置）
3. 没有 `.dockerignore` 文件，`COPY . .` 会复制 `public/`、`node_modules/`、`.quartz/` 等不需要的目录

**影响**: Docker 镜像体积不必要地增大，构建时间延长，潜在缓存失效。

**建议方案**:

- 创建 `.dockerignore` 文件排除 `public/`、`node_modules/`、`.quartz/`、`.quartz-cache/`、`prof/`
- 精确控制 COPY 指令，只复制必要文件
- 考虑将 `content/` 单独复制以便热更新

---

## 三、低优先级（改善性优化）

### 3.1 `quartz.config.default.yaml` — 配置文件命名

**问题**: 项目使用 `quartz.config.default.yaml` 作为主配置文件。根据 `config-loader.ts` 的 `resolveConfigPath()` 逻辑，它会先查找 `quartz.config.yaml`，然后查找 `quartz.plugins.json`，再查找 `quartz.config.default.yaml`。使用 `default` 后缀意味着该文件是后备默认配置，预期用户会创建 `quartz.config.yaml` 覆盖它。

**影响**: 功能正常，但语义上 `default` 暗示存在一个非默认的覆盖配置。如果实际没有 `quartz.config.yaml`，建议直接使用标准命名。

**建议方案**:

- 重命名为 `quartz.config.yaml`（可选，取决于是否计划使用覆盖机制）
- 或保持现状但在 README 中说明配置策略

### 3.2 依赖版本管理 — GitHub 依赖指向固定 commit

**问题**: `package.json` 中两个 `@quartz-community/*` 包指向 GitHub 仓库的特定 commit：

```json
"@quartz-community/types": "github:quartz-community/types#d413569b02ff0cd9a7e8d74dee125d20a5e5ec72",
"@quartz-community/utils": "github:quartz-community/utils#e09d8b0bbccb46073b23c00affaf3e40a2c3b0c4",
```

**影响**: 这些依赖不会自动更新，需要手动更新 commit SHA。如果上游仓库有重要的 bug 修复或安全补丁，项目不会自动受益。

**建议方案**:

- 定期检查上游仓库的 release 和 commit
- 在项目文档中记录这些固定 commit 的原因（如果是为了稳定性）
- 考虑使用 `quartz.lock.json` 中已 pin 的社区插件 commit SHA 作为参考

**2026-08-26 检查结果**（已执行，暂不更新）:

| 包    | 当前 pin  | 日期       | 最新 commit | 日期       | 说明                                                                                                                                          |
| ----- | --------- | ---------- | ----------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| types | `d413569` | 2026-04-03 | `0f5711d`   | 2026-07-27 | 上游含 **破坏性变更**：`PageFrameProps.footer` 从单组件改为 `QuartzComponent[]` 数组                                                          |
| utils | `e09d8b0` | 2026-05-26 | `9da5e8d`   | 2026-07-23 | 上游含 `fix: decode URI in getFullSlugFromUrl for non-ASCII slugs` — 正是 patch-graph.mjs / patch-graph-output.mjs 补丁所针对的问题的上游修复 |

**不更新的原因**:

1. **types 的破坏性变更**需要代码适配（footer 布局相关），超出本次维护范围
2. **utils 的 URI 修复无法惠及现有补丁**：补丁针对的是 graph 插件 dist（`quartz.lock.json` pin 在 `46f0ba1`）中已编译内联的最小化代码，更新 npm 侧的 utils 包不会改变插件 dist 内容。真正受益需更新 graph 插件本身的 commit 并验证补丁可移除
3. 上游已迁移到 npm 发布流程（changesets），未来可考虑将 GitHub 依赖切换为 npm 版本以获得语义化版本管理

**后续行动项**（机会性）:

- 当 graph 插件发布包含 URI 解码修复的新版本时，更新 `quartz.lock.json` 并移除 `patch-graph.mjs`、`patch-graph-output.mjs`
- 当适配 `PageFrameProps.footer` 数组类型时，更新 types 到 `0f5711d`

### 3.3 构建产物 `public/` 被 gitignore 但存在本地文件

**问题**: `.gitignore` 中排除了 `public/`，但本地 `public/` 目录存在（2.3MB，包含 `postscript-20560601.js` 和 `prescript-2bfc6315.js`）。这是正常的 — 构建产物不纳入版本控制。

**影响**: 无问题，但需确保 CI/CD 流程中在部署前执行 `npx quartz build`。

**建议方案**: 无需改动，确认部署流程包含构建步骤即可。

### 3.4 `content/` 目录中的 `.obsidian` 和 `.claudian` 子目录

**问题**: `content/` 包含 `.obsidian`（Obsidian 配置）和 `.claudian` 目录。配置文件中 `ignorePatterns` 已排除 `.obsidian`，但未排除 `.claudian`。

**影响**: `.claudian` 目录的内容可能被构建系统处理（如果包含 `.md` 文件）。

**建议方案**:

- 在 `quartz.config.default.yaml` 的 `ignorePatterns` 中添加 `.claudian`
- 或确认 `.claudian` 中不包含会被构建系统处理的文件

### 3.5 TypeScript 类型检查通过 — 无类型问题

**发现**: `npx tsc --noEmit` 零错误通过。项目的 TypeScript 严格模式配置良好，类型安全有保障。无需额外维护操作。

---

## 四、维护操作建议清单

以下按执行顺序整理：

| 序号 | 优先级 | 操作项                                                    | 涉及文件                       | 工作量 |
| ---- | ------ | --------------------------------------------------------- | ------------------------------ | ------ |
| 1    | 高     | 修复 Dockerfile 补丁步骤                                  | `Dockerfile`                   | 小     |
| 2    | 高     | 集成 `patch-graph-output.mjs` 到构建流程                  | `package.json`                 | 小     |
| 3    | 高     | 运行 `npm audit fix` 修复漏洞                             | `package.json`                 | 小     |
| 4    | 高     | 为补丁脚本添加版本检测和失败断言                          | `scripts/patch-*.mjs`          | 中     |
| 5    | 中     | 重写 `MyFooter.tsx` 返回实际内容，移除 `patch-footer.mjs` | `MyFooter.tsx`, `package.json` | 小     |
| 6    | 中     | 处理 `GraphButton.tsx` 死代码                             | `GraphButton.tsx`              | 小     |
| 7    | 中     | 创建 `.dockerignore`                                      | `.dockerignore`                | 小     |
| 8    | 中     | 添加中文排版优化样式                                      | `custom.scss`                  | 小     |
| 9    | 低     | 在 `ignorePatterns` 中添加 `.claudian`                    | `quartz.config.default.yaml`   | 小     |
| 10   | 低     | 检查并更新 `@quartz-community/*` 依赖                     | `package.json`                 | 中     |

---

## 五、实施路线图

### 第一阶段（立即执行）

1. `npm audit fix` — 修复安全漏洞
2. 集成 `patch-graph-output.mjs` 到 `postbuild`
3. Dockerfile 添加 `npm run patch` 步骤

### 第二阶段（下次迭代）

4. 重写 `MyFooter.tsx`，移除 `patch-footer.mjs` 依赖
5. 为补丁脚本添加 SHA 版本检测
6. 创建 `.dockerignore`
7. 清理死代码（`GraphButton.tsx`）

### 第三阶段（机会性改善）

8. 添加中文排版样式
9. 更新 `ignorePatterns`
10. 检查上游依赖更新

---

_本方案基于 2026-08-26 的代码审查生成。执行任何变更前建议在本地验证构建通过。_
