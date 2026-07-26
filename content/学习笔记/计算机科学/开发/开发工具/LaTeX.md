---
title: LaTeX
date: 2025-04-10
---

> *"Every time I read a LaTeX document, I think, wow, this must be correct!"*
---

[LaTeX](https://en.wikipedia.org/wiki/LaTeX) 是一种基于 TeX 的排版系统，广泛用于生成高质量的科技和数学文档，由美国计算机科学家[Leslie Lamport](https://en.wikipedia.org/wiki/Leslie_Lamport) 在 20 世纪 80 年代开发。它特别擅长处理复杂的数学公式、参考文献和结构化文档。

---

## 文档基本结构

一个最简单的 [LaTeX](https://www.latex-project.org/) 文档：

```latex
\documentclass{article}       % 文档类型
\usepackage[UTF8]{ctex}       % 中文支持

\title{我的第一篇文档}
\author{作者名}
\date{\today}

\begin{document}

\maketitle                     % 生成标题
\tableofcontents               % 生成目录

\section{引言}
这是正文内容。

\end{document}
```

| 文档类 | 用途 |
|--------|------|
| `article` | 短文、论文、报告 |
| `report` | 长篇报告、毕业论文 |
| `book` | 书籍 |
| `beamer` | 幻灯片/演示文稿 |
| `ctexart` | 中文短文（自带中文支持） |

---

## 文本格式

### 字体样式

```latex
\textbf{粗体}
\textit{斜体}
\underline{下划线}
\texttt{等宽字体}（适合代码）
\emph{强调}（在正文中为斜体，在斜体环境中为正体）
```

### 字号

```latex
{\tiny 极小}
{\scriptsize 很小}
{\footnotesize 脚注大小}
{\small 小}
{\normalsize 正常}
{\large 大}
{\Large 更大}
{\LARGE 很大}
{\huge 极大}
{\Huge 最大}
```

### 对齐方式

```latex
\begin{center}    居中    \end{center}
\begin{flushleft} 左对齐  \end{flushleft}
\begin{flushright} 右对齐 \end{flushright}
```

### 换行与换页

```latex
\\              % 强制换行
\newline        % 强制换行（段内）
\newpage        % 强制换页
\par            % 另起一段（等同于空一行）
\noindent       % 取消段首缩进
```

---

## 章节与层级结构

```latex
\part{部分}              % 最高层级（book/report）
\chapter{章}             % 章（仅 book/report）
\section{节}
\subsection{小节}
\subsubsection{小小节}
\paragraph{段落标题}
\subparagraph{子段落标题}
```

> **提示：** 在标题命令后加 `*` 可以取消编号，例如 `\section*{不编号的节}`。

---

## 数学公式

### 行内公式与行间公式

```latex
行内公式：$E = mc^2$

行间公式（无编号）：
\[ E = mc^2 \]

行间公式（有编号）：
\begin{equation}
    E = mc^2
\end{equation}
```

### 常用数学符号（基础）

| 语法                    | 效果  | 说明   |
| --------------------- | --- | ---- |
| `x^{2}`               | x²  | 上标   |
| `x_{i}`               | xᵢ  | 下标   |
| `\frac{a}{b}`         | a/b | 分数   |
| `\sqrt{x}`            | √x  | 平方根  |
| `\sqrt[n]{x}`         | ⁿ√x | n次根号 |
| `\sum_{i=1}^{n}`      | 求和  | 求和符号 |
| `\prod_{i=1}^{n}`     | 连乘  | 连乘符号 |
| `\int_{a}^{b}`        | 积分  | 定积分  |
| `\lim_{x \to \infty}` | 极限  | 极限符号 |
| `\infty`              | ∞   | 无穷大  |
| `\partial`            | ∂   | 偏导符号 |
| `\nabla`              | ∇   | 梯度符号 |

### 箭头符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| → | `\rightarrow` 或 `\to` | 右箭头 |
| ← | `\leftarrow` | 左箭头 |
| ↔ | `\leftrightarrow` | 双向箭头 |
| ⇒ | `\Rightarrow` | 双线右箭头（推出） |
| ⇐ | `\Leftarrow` | 双线左箭头 |
| ⇔ | `\Leftrightarrow` | 双线双向（等价） |
| ↑ | `\uparrow` | 上箭头 |
| ↓ | `\downarrow` | 下箭头 |
| ↗ | `\nearrow` | 右上箭头 |
| ↘ | `\searrow` | 右下箭头 |
| ↙ | `\swarrow` | 左下箭头 |
| ↖ | `\nwarrow` | 左上箭头 |
| ⟶ | `\longrightarrow` | 长右箭头 |
| ⟹ | `\Longrightarrow` | 长双线右箭头 |
| ↦ | `\mapsto` | 映射符号 |
| ⟼ | `\longmapsto` | 长映射符号 |
| ⊸ | `\multimap` | 多重映射 |
| ⇢ | `\dasharrow` | 虚线箭头 |

### 几何符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ∠ | `\angle` | 角 |
| ∠ABC | `\angle ABC` | 表示角 ABC |
| ⊥ | `\perp` | 垂直 |
| ∥ | `\parallel` | 平行 |
| ∦ | `\nparallel` | 不平行 |
| △ | `\triangle` | 三角形 |
| □ | `\square` | 正方形 |
| ◦ | `\circ` | 度数符号 |
| ⌢ | `\frown` | 弧形（下） |
| ⌣ | `\smile` | 弧形（上） |
| ◇ | `\diamond` | 菱形 |
| ▽ | `\triangledown` | 倒三角 |

### 杂项符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ∞ | `\infty` | 无穷 |
| ∂ | `\partial` | 偏导 |
| ∇ | `\nabla` | 梯度/劈形 |
| √ | `\surd` | 根号（数学直立） |
| ℵ | `\aleph` | 阿列夫（集合基数） |
| ℏ | `\hbar` | 约化普朗克常数 |
| ℓ | `\ell` | 脚本小写 L |
| ∅ | `\emptyset` 或 `\varnothing` | 空集 |
| … | `\dots` | 省略号（自适应） |
| ⋯ | `\cdots` | 水平省略（中间） |
| ⋮ | `\vdots` | 垂直省略 |
| ⋱ | `\ddots` | 对角省略 |
| ′ | `'` 或 `^{\prime}` | 一阶导 |
| ″ | `''` 或 `^{\prime\prime}` | 二阶导 |
| ‴ | `'''` 或 `^{\prime\prime\prime}` | 三阶导 |
| ∴ | `\therefore` | 因此 |
| ∵ | `\because` | 因为 |
| ∎ | `\qed` 或 `\blacksquare` | 证明结束符 |

### 上下标与装饰符号

| 效果 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| x̂ | `\hat{x}` | 尖帽 |
| x̄ | `\bar{x}` | 横线 |
| x̃ | `\tilde{x}` | 波浪号 |
| x⃗ | `\vec{x}` | 向量箭头 |
| x˙ | `\dot{x}` | 单点（导数） |
| x¨ | `\ddot{x}` | 双点 |
| x⃛ | `\dddot{x}` | 三点 |
| x̅ | `\overline{x}` | 长横线（整体） |
| x̲ | `\underline{x}` | 长下划线（整体） |
| x← | `\overleftarrow{x}` | 左箭头 |
| x→ | `\overrightarrow{x}` | 右箭头 |
| x↔ | `\overleftrightarrow{x}` | 双箭头 |
| x̂̂ | `\widehat{xxx}` | 宽尖帽 |
| x̃̃ | `\widetilde{xxx}` | 宽波浪 |
| x∗ | `x^*` 或 `x^{\star}` | 星号 |
| x† | `x^{\dagger}` |  dagger |
| x⊤ | `x^{\top}` |  top |
| x⊥ | `x^{\perp}` |  perpendicular |

### 特殊运算符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ± | `\pm` | 加减 |
| ∓ | `\mp` | 减加 |
| × | `\times` | 乘号/叉乘 |
| ÷ | `\div` | 除号 |
| ⋅ | `\cdot` | 点乘 |
| ∘ | `\circ` | 复合/合成 |
| ⊙ | `\odot` | 点圈 |
| ⊗ | `\otimes` | 张量积 |
| ⊕ | `\oplus` | 直和 |
| ⊖ | `\ominus` | 环减 |
| ⊙ | `\circledcirc` | 环内圈 |
| ⊛ | `\circledast` | 环内星 |

### 集合符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ∈ | `\in` | 属于 |
| ∉ | `\notin` | 不属于 |
| ∋ | `\ni` 或 `\owns` | 包含 |
| ∌ | `\notni` | 不包含 |
| ⊂ | `\subset` | 真子集 |
| ⊆ | `\subseteq` | 子集 |
| ⊄ | `\not\subset` | 非子集 |
| ⊃ | `\supset` | 真超集 |
| ⊇ | `\supseteq` | 超集 |
| ⊈ | `\nsubseteq` | 非子集等于 |
| ⊉ | `\nsupseteq` | 非超集等于 |
| ⊊ | `\subsetneq` | 真子集不等于 |
| ⊋ | `\supsetneq` | 真超集不等于 |
| ∪ | `\cup` | 并集 |
| ∩ | `\cap` | 交集 |
| ∖ | `\setminus` | 集合差 |
| ⊔ | `\sqcup` | 不相交并 |
| ⊓ | `\sqcap` | 不相交交 |
| ⊔̇ | `\dotcup` | 带点并集 |
| ∅ | `\emptyset` 或 `\varnothing` | 空集 |
| ℕ | `\mathbb{N}` | 自然数集 |
| ℤ | `\mathbb{Z}` | 整数集 |
| ℚ | `\mathbb{Q}` | 有理数集 |
| ℝ | `\mathbb{R}` | 实数集 |
| ℂ | `\mathbb{C}` | 复数集 |
| ℙ | `\mathbb{P}` | 素数集/概率 |

### 逻辑符号

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ∧ | `\land` 或 `\wedge` | 逻辑与 |
| ∨ | `\lor` 或 `\vee` | 逻辑或 |
| ¬ | `\neg` 或 `\lnot` | 逻辑非 |
| ⇒ | `\Rightarrow` 或 `\implies` | 蕴含/推出 |
| ⇐ | `\Leftarrow` | 反向蕴含 |
| ⇔ | `\Leftrightarrow` 或 `\iff` | 等价/当且仅当 |
| ⊨ | `\models` | 满足 |
| ⊢ | `\vdash` | 推出/语法推 |
| ⊭ | `\nmodels` | 不满足 |
| ⊬ | `\nvdash` | 不能推出 |
| ∀ | `\forall` | 全称量词 |
| ∃ | `\exists` | 存在量词 |
| ∄ | `\nexists` | 不存在 |
| ⊦ | `\dashv` | 逆向推出 |

### 算子与函数

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| sin | `\sin` | 正弦 |
| cos | `\cos` | 余弦 |
| tan | `\tan` | 正切 |
| cot | `\cot` | 余切 |
| sec | `\sec` | 正割 |
| csc | `\csc` | 余割 |
| log | `\log` | 对数 |
| ln | `\ln` | 自然对数 |
| exp | `\exp` | 指数 |
| lim | `\lim` | 极限 |
| max | `\max` | 最大值 |
| min | `\min` | 最小值 |
| sup | `\sup` | 上确界 |
| inf | `\inf` | 下确界 |
| gcd | `\gcd` | 最大公约数 |
| lcm | `\lcm` | 最小公倍数 |
| det | `\det` | 行列式 |
| dim | `\dim` | 维度 |
| ker | `\ker` | 核 |
| Im | `\operatorname{Im}` | 虚部 |
| Re | `\operatorname{Re}` | 实部 |
| arg | `\arg` | 幅角 |
| mod | `\bmod` | 模（binary） |
| deg | `\deg` | 度 |
| hom | `\hom` | 同态 |
| exp | `\exp` | 指数函数 |

### 二元关系符（带竖线版本）

| 符号 | LaTeX代码 | 说明 |
|:---:|:---:|:---:|
| ≤ | `\leq` 或 `\le` | 小于等于 |
| ≥ | `\geq` 或 `\ge` | 大于等于 |
| ⩽ | `\leqslant` | 粗体小于等于 |
| ⩾ | `\geqslant` | 粗体大于等于 |
| ⪅ | `\lessapprox` | 约小于等于 |
| ⪆ | `\gtrapprox` | 约大于等于 |
| ≲ | `\lesssim` | 约小于 |
| ≳ | `\gtrsim` | 约大于 |
| ≪ | `\ll` | 远小于 |
| ≫ | `\gg` | 远大于 |
| ⊂ | `\subset` | 真子集 |
| ⊃ | `\supset` | 真超集 |
| ≈ | `\approx` | 约等于 |
| ≃ | `\simeq` | 近似等于 |
| ≅ | `\cong` | 全等于/同余 |
| ∼ | `\sim` | 相似于 |
| ∝ | `\propto` | 成正比 |
| ≡ | `\equiv` | 恒等于 |
| ≢ | `\not\equiv` | 不恒等于 |
| ≠ | `\neq` 或 `\ne` | 不等于 |
| ≺ | `\prec` | 先于 |
| ⪯ | `\preceq` | 先于等于 |
| ≻ | `\succ` | 优于 |
| ⪰ | `\succeq` | 优于等于 |
| ⊑ | `\sqsubseteq` | 方子集 |
| ⊒ | `\sqsupseteq` | 方超集 |

### 希腊字母（完整版）

#### 小写希腊字母

| 符号 | LaTeX | 符号 | LaTeX | 符号 | LaTeX | 符号 | LaTeX |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| α | `\alpha` | β | `\beta` | γ | `\gamma` | δ | `\delta` |
| ε | `\epsilon` | ζ | `\zeta` | η | `\eta` | θ | `\theta` |
| ι | `\iota` | κ | `\kappa` | λ | `\lambda` | μ | `\mu` |
| ν | `\nu` | ξ | `\xi` | ο | `o` | π | `\pi` |
| ρ | `\rho` | σ | `\sigma` | τ | `\tau` | υ | `\upsilon` |
| φ | `\phi` | χ | `\chi` | ψ | `\psi` | ω | `\omega` |

#### 大写希腊字母

| 符号 | LaTeX | 符号 | LaTeX | 符号 | LaTeX | 符号 | LaTeX |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Α | `A` | Β | `B` | Γ | `\Gamma` | Δ | `\Delta` |
| Ε | `E` | Ζ | `Z` | Η | `H` | Θ | `\Theta` |
| Ι | `I` | Κ | `K` | Λ | `\Lambda` | Μ | `M` |
| Ν | `N` | Ξ | `\Xi` | Ο | `O` | Π | `\Pi` |
| Ρ | `P` | Σ | `\Sigma` | Τ | `T` | Υ | `\Upsilon` |
| Φ | `\Phi` | Χ | `\Chi` | Ψ | `\Psi` | Ω | `\Omega` |

> **注意**：大写希腊字母中，只有部分需要用 `\Gamma`、`\Delta` 等命令，其余与英文字母相同。

#### 变体希腊字母（数学专用）

| 符号 | LaTeX | 说明 |
|:---:|:---:|:---|
| ε | `\varepsilon` | 圆润 epsilon |
| θ | `\vartheta` | 圆润 theta |
| ϑ | （同上） | 圆润 theta（另一种写法） |
| π | `\varpi` | 圆润 pi |
| ρ | `\varrho` | 圆润 rho |
| σ | `\varsigma` | 圆润 sigma |
| φ | `\varphi` | 圆润 phi |
| φ | `\phi` | 标准 phi |
| ϕ | （同上） | phi 变体 |

#### 其他希伯来/特殊字母

| 符号 | LaTeX | 说明 |
|:---:|:---:|:---|
| ℵ | `\aleph` | 阿列夫（希伯来字母） |
| ℶ | `\beth` | 贝特（希伯来字母） |
| ℸ | `\daleth` | 达利特（希伯来字母） |
| ℏ | `\hbar` | 约化普朗克常数 |
| ℓ | `\ell` | 脚本小写 L |
| ℑ | `\Im` | 花体 I（虚部） |
| ℜ | `\Re` | 花体 R（实部） |
| ℘ | `\wp` | 魏尔斯特拉斯 P |
| ∅ | `\emptyset` | 空集符号 |

### 关系与运算符号

```latex
\leq      ≤        \geq      ≥
\neq      ≠        \approx   ≈
\equiv    ≡        \sim      ~
\times    ×        \div      ÷
\pm       ±        \mp       ∓
\cdot     ·        \circ     ∘
\in       ∈        \notin    ∉
\subset   ⊂        \supset   ⊃
\cup      ∪        \cap      ∩
\forall   ∀        \exists   ∃
\Rightarrow  ⇒     \Leftarrow  ⇐
\leftrightarrow ↔
```

### 矩阵（完整版）

```latex
% 圆括号矩阵
\begin{pmatrix}
    a & b \\
    c & d
\end{pmatrix}

% 方括号矩阵
\begin{bmatrix}
    a & b \\
    c & d
\end{bmatrix}

% 行列式（大竖线）
\begin{vmatrix}
    a & b \\
    c & d
\end{vmatrix}

% 大括号矩阵
\begin{Bmatrix}
    a & b \\
    c & d
\end{Bmatrix}

% 无括号矩阵
\begin{matrix}
    a & b \\
    c & d
\end{matrix}

% 双竖线矩阵（范数）
\begin{Vmatrix}
    a & b \\
    c & d
\end{Vmatrix}
```

### 常见矩阵写法

```latex
% 列向量
\begin{pmatrix}
    x_1 \\ x_2 \\ x_3
\end{pmatrix}

% 行向量
\begin{pmatrix}
    x_1 & x_2 & x_3
\end{pmatrix}

% 对角矩阵
\operatorname{diag}(a_1, a_2, a_3)

% 分块矩阵
\left(
    \begin{array}{cc|c}
        a & b & e \\
        c & d & f \\ \hline
        g & h & i
    \end{array}
\right)

% 省略号矩阵
\begin{pmatrix}
    1      & 2      & \cdots & n      \\
    0      & 1      & \cdots & n-1    \\
    \vdots & \vdots & \ddots & \vdots \\
    0      & 0      & \cdots & 1
\end{pmatrix}
```

### smallmatrix（行内矩阵）

```latex
行内矩阵：$\bigl(\begin{smallmatrix}
    a & b \\ c & d
\end{smallmatrix}\bigr)$
```

### 多行公式环境对比

| 环境 | 说明 | 对齐 |
|------|------|:---:|
| `gather` | 每行居中，可编号 | 居中 |
| `gather*` | 每行居中，不编号 | 居中 |
| `align` | 按 `&` 对齐 | 自选 |
| `align*` | 同上，不编号 | 自选 |
| `flalign` | 拉伸对齐 | 自选 |
| `flalign*` | 同上，不编号 | 自选 |
| `multline` | 首左尾中 | 左→居中 |
| `multline*` | 同上，不编号 | 左→居中 |
| `aligned` | 用于行内多行 | 自选 |
| `gathered` | 用于行内多行 | 居中 |

### 多行公式对齐

```latex
\begin{align}
    f(x) &= x^2 + 2x + 1 \\
         &= (x + 1)^2
\end{align}
```

> **提示：** `&` 用于指定对齐位置，通常放在 `=` 前面。

### 分段函数

```latex
f(x) = \begin{cases}
    x^2,  & \text{if } x \geq 0 \\
    -x,   & \text{if } x < 0
\end{cases}
```

---

## 列表

### 无序列表

```latex
\begin{itemize}
    \item 第一项
    \item 第二项
    \item 第三项
\end{itemize}
```

### 有序列表

```latex
\begin{enumerate}
    \item 第一步
    \item 第二步
    \item 第三步
\end{enumerate}
```

### 描述列表

```latex
\begin{description}
    \item[Git] 分布式版本控制系统
    \item[Make] 自动化构建工具
\end{description}
```

---

## 表格

```latex
\begin{table}[htbp]
    \centering
    \caption{示例表格}
    \label{tab:example}
    \begin{tabular}{|l|c|r|}
        \hline
        左对齐 & 居中 & 右对齐 \\
        \hline
        A & B & C \\
        D & E & F \\
        \hline
    \end{tabular}
\end{table}
```

### 列格式说明

| 符号 | 含义 |
|------|------|
| `l` | 左对齐 |
| `c` | 居中 |
| `r` | 右对齐 |
| `|` | 竖线分隔 |
| `\hline` | 水平线 |

> **提示：** 推荐使用 `booktabs` 宏包获得更美观的三线表：`\toprule`、`\midrule`、`\bottomrule`。

---

## 图片

需要先引入宏包：`\usepackage{graphicx}`

```latex
\begin{figure}[htbp]
    \centering
    \includegraphics[width=0.8\textwidth]{image.png}
    \caption{图片标题}
    \label{fig:example}
\end{figure}
```

### 位置参数说明

| 参数 | 含义 |
|------|------|
| `h` | 当前位置（here） |
| `t` | 页面顶部（top） |
| `b` | 页面底部（bottom） |
| `p` | 单独一页（page） |
| `!` | 强制忽略排版限制 |

---

## 交叉引用与超链接

### 交叉引用

```latex
如图 \ref{fig:example} 所示……
如表 \ref{tab:example} 所示……
如公式 \eqref{eq:example} 所示……
```

> **注意：** 需要编译两次才能正确显示引用编号。

### 超链接

需要引入宏包：`\usepackage{hyperref}`

```latex
\href{https://www.overleaf.com}{Overleaf 官网}
\url{https://www.overleaf.com}
```

---

## 代码展示

### 行内代码

```latex
\verb|git commit -m "message"|
```

### 代码块

```latex
\usepackage{listings}

\begin{lstlisting}[language=Python]
def hello():
    print("Hello, World!")
\end{lstlisting}
```

### minted 宏包（语法高亮更美观）

```latex
\usepackage{minted}

\begin{minted}{python}
def hello():
    print("Hello, World!")
\end{minted}
```

---

## 参考文献

### 简单方式

```latex
\begin{thebibliography}{99}
    \bibitem{knuth} Donald Knuth, \textit{The Art of Computer Programming}, 1968.
    \bibitem{lamport} Leslie Lamport, \textit{LaTeX: A Document Preparation System}, 1986.
\end{thebibliography}

正文中引用：\cite{knuth}
```

### 使用 BibTeX（推荐）

创建 `references.bib` 文件：

```bibtex
@article{einstein1905,
    author  = {Albert Einstein},
    title   = {On the Electrodynamics of Moving Bodies},
    journal = {Annalen der Physik},
    year    = {1905}
}
```

在文档中引用：

```latex
\bibliographystyle{plain}
\bibliography{references}

正文中引用：\cite{einstein1905}
```

---

## 常用宏包

| 宏包 | 用途 | 引入方式 |
|------|------|---------|
| `ctex` | 中文支持 | `\usepackage[UTF8]{ctex}` |
| `amsmath` | 增强数学公式 | `\usepackage{amsmath}` |
| `amssymb` | 更多数学符号 | `\usepackage{amssymb}` |
| `graphicx` | 插入图片 | `\usepackage{graphicx}` |
| `hyperref` | 超链接与书签 | `\usepackage{hyperref}` |
| `geometry` | 页面边距设置 | `\usepackage[a4paper, margin=2.5cm]{geometry}` |
| `listings` | 代码展示 | `\usepackage{listings}` |
| `booktabs` | 美观三线表 | `\usepackage{booktabs}` |
| `xcolor` | 颜色支持 | `\usepackage{xcolor}` |
| `enumitem` | 自定义列表样式 | `\usepackage{enumitem}` |
| `fancyhdr` | 自定义页眉页脚 | `\usepackage{fancyhdr}` |
| `tikz` | 绘图 | `\usepackage{tikz}` |

---

## Obsidian / Markdown 中使用 LaTeX

在 Obsidian 和大多数 Markdown 编辑器中，可以直接使用 LaTeX 数学语法：

```markdown
行内公式：$E = mc^2$

行间公式：
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

> **提示：** Obsidian 使用 MathJax 渲染 LaTeX 公式，支持大部分 `amsmath` 语法，但不支持 LaTeX 的文档结构命令（如 `\section`、`\begin{document}` 等）。

---

## 常见问题与技巧

### 特殊字符转义

以下字符在 LaTeX 中有特殊含义，使用时需要转义：

| 字符 | 转义写法 |
|------|---------|
| `#` | `\#` |
| `$` | `\$` |
| `%` | `\%` |
| `&` | `\&` |
| `_` | `\_` |
| `{` | `\{` |
| `}` | `\}` |
| `~` | `\textasciitilde` |
| `^` | `\textasciicircum` |
| `\` | `\textbackslash` |

### 常见编译错误

| 错误信息 | 可能原因 |
|---------|---------|
| `Missing $ inserted` | 在正文中使用了数学符号（如 `_`），需要用 `$...$` 包裹 |
| `Undefined control sequence` | 命令拼写错误或缺少宏包 |
| `Missing \begin{document}` | 文档缺少 `\begin{document}` |
| `File not found` | 图片路径错误或文件名不对 |
| `Extra alignment tab` | 表格中 `&` 数量与列数不匹配 |

---

## 数学公式进阶技巧

### 公式编号控制

```latex
% 取消单行编号
\begin{equation*}
    E = mc^2
\end{equation*}

% 子编号（使用 subequations）
\begin{subequations}
    \begin{align}
        a &= b \\
        c &= d
    \end{align}
\end{subequations}
% 生成 a.1, a.2 格式编号

% 手动指定编号
\begin{equation}
    \label{eq:custom}
    E = mc^2
\end{equation}
\tag{*}  % 自定义编号
\tag{**(}
\tag{手工编号}
```

### 字体样式（数学模式）

| 语法 | 效果 | 说明 |
|:---:|:---:|:---|
| `\mathrm{R}` | ℝ | 直立罗马体 |
| `\mathbf{R}` | **R** | 直立粗体 |
| `\mathit{R}` | *R* | 斜体 |
| `\mathsf{R}` | R | 无衬线体 |
| `\mathtt{R}` | R | 等宽体 |
| `\mathcal{R}` | 𝒜 | 花体 |
| `\mathbb{R}` | ℝ | 黑板粗体 |
| `\mathfrak{R}` | ℜ | 哥特体 |
| `\boldsymbol{R}` | **R** | 粗体向量/矩阵 |

### 括号大小控制

| 命令 | 说明 |
|:---:|:---|
| `\bigl(` `\bigr)` | 小号自适应 |
| `\Bigl(` `\Bigr)` | 中号自适应 |
| `\biggl(` `\biggr)` | 大号自适应 |
| `\Biggl(` `\Biggr)` | 特大号自适应 |
| `\left.` `\right|` | 单边括号（配合空括号） |

```latex
\left(              % 自动大括号
    \frac{1}{2} + 
    \left(\frac{3}{4}\right)
\right)

% 单边括号示例
\left\{
    \begin{array}{ll}
        x, & x > 0
    \end{array}
\right.
```

### 间距控制

| 命令 | 宽度 | 说明 |
|:---:|:---:|:---|
| `\,` | 3/18 em | 紧 |
| `\:` | 4/18 em | 中等 |
| `\ ` | 5/18 em | 标准 |
| `\;` | 5/18 em | 较宽 |
| `\quad` | 1 em | 宽 |
| `\qquad` | 2 em | 双宽 |
| `\!` | -3/18 em | 负间距（收紧） |

### 交换图（使用 amscd）

```latex
\usepackage{amscd}

\begin{CD}
    A @>>> B \\
    @VVV @AAA \\
    C @= D
\end{CD}
```

### 化学式（使用 mhchem）

```latex
\usepackage[version=4]{mhchem}

\ce{H2O}           % H₂O
\ce{CO2 + C -> 2CO}% CO₂ + C → 2CO
\ce{Fe^{2+} + O2}   % 带电离子
```

---

## 常用宏包组合

### 论文写作

```latex
\usepackage{amsmath, amssymb}  % 数学
\usepackage{graphicx}           % 图片
\usepackage{hyperref}           % 超链接（最后加载）
\usepackage{booktabs}           % 表格
\usepackage{cite}               % 引用
\usepackage{geometry}           % 页面设置
\geometry{a4paper, margin=2.5cm}
```

### 中文论文

```latex
\usepackage[UTF8]{ctex}         % 中文支持
\usepackage{amsmath}             % 数学
\usepackage{hyperref}           % 超链接
\usepackage{zhnumber}           % 中文数字
```

### 数学专业

```latex
\usepackage{amsmath, amssymb, amsthm}  % 数学全套
\usepackage{mathtools}                   % amsmath 增强
\usepackage{mathrsfs}                    % 额外花体
\DeclareMathOperator{\diag}{diag}        % 自定义算子
```

### 代码展示

```latex
\usepackage{listings}            % 代码块
\lstset{
    language=Python,
    basicstyle=\ttfamily,
    frame=shadowbox
}
% 或使用 minted（需要 Python）
\usepackage{minted}
```
