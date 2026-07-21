---
title: DFS、BFS
date: 2025-10-13
---

#DFS、BFS

> **DFS（Depth First Search）深度优先搜索** = 一条路走到黑  
> **BFS（Breadth First Search）广度优先搜索** = 先把附近都逛完再走远

---

## DFS 深度优先搜索

### 核心思想

从一个起点出发，沿着一条路径走到尽头，然后回溯到上一个岔路口，继续走另一条路，直到遍历完所有节点。

### 递归实现（最常用）

```java
/* 递归 DFS——二叉树前序遍历 */
void dfs(TreeNode root) {
    if (root == null) return;
    System.out.println(root.val);  // 访问当前节点
    dfs(root.left);                // 递归左子树
    dfs(root.right);               // 递归右子树
}
```

### 栈实现（显式栈）

```java
/* 迭代 DFS——用栈模拟 */
void dfsStack(TreeNode root) {
    if (root == null) return;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        System.out.println(node.val);
        // 注意：先右后左，才能保证左子树先出栈
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
    }
}
```

### 图的 DFS（防止重复访问）

```java
void graphDfs(int[][] graph, int start) {
    boolean[] visited = new boolean[graph.length];
    dfsHelper(graph, start, visited);
}

void dfsHelper(int[][] graph, int v, boolean[] visited) {
    visited[v] = true;
    System.out.println("访问节点: " + v);

    for (int neighbor : graph[v]) {
        if (!visited[neighbor])
            dfsHelper(graph, neighbor, visited);
    }
}
```

---

## BFS 广度优先搜索

### 核心思想

从起点出发，先遍历与起点直接相邻的所有节点，再遍历这些节点的邻居，一层一层向外扩散。

### 队列实现（标准模板）

```java
/* BFS——二叉树层序遍历 */
void bfs(TreeNode root) {
    if (root == null) return;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        System.out.println(node.val);
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
}
```

### 图的 BFS（防止重复访问）

```java
void graphBfs(int[][] graph, int start) {
    boolean[] visited = new boolean[graph.length];
    Deque<Integer> queue = new ArrayDeque<>();

    visited[start] = true;
    queue.offer(start);

    while (!queue.isEmpty()) {
        int v = queue.poll();
        System.out.println("访问节点: " + v);

        for (int neighbor : graph[v]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}
```

### 按层遍历（带层数信息）

```java
void bfsLevelOrder(TreeNode root) {
    if (root == null) return;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    int level = 0;

    while (!queue.isEmpty()) {
        int size = queue.size();          // 当前层节点数
        System.out.print("第 " + level + " 层: ");
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            System.out.print(node.val + " ");
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        System.out.println();
        level++;
    }
}
```

---

## DFS vs BFS 对比

| 对比维度 | DFS | BFS |
|:--------|:----|:----|
| 数据结构 | 栈（递归/显式栈） | 队列 |
| 遍历方式 | 深度优先，一条路走到底 | 广度优先，一层层扩散 |
| 空间复杂度 | $O(h)$，$h$ 为树的高度 | $O(w)$，$w$ 为树的最大宽度 |
| 时间复杂度 | $O(V + E)$ | $O(V + E)$ |
| **何时用** | 路径问题、拓扑排序、连通性 | 最短路径、层序遍历、拓扑排序 |
| 最短路径 | 否 不能保证找到最短路径 | 是 **保证**找到最短路径（无权图） |
| 代码 | 递归简洁，迭代稍复杂 | 队列模板固定 |

> $V$ = 顶点数，$E$ = 边数，$h$ = 树高度，$w$ = 树最大宽度

---

## 应用场景

### DFS 典型应用
- **全排列 / 组合 / 子集**：回溯算法的核心
- **连通性判断**：图中两个节点是否连通
- **拓扑排序**：后序 DFS 实现
- **迷宫求解**：探索所有可能路径
- **二叉树遍历**：前序、中序、后序遍历

### BFS 典型应用
- **最短路径**：无权图中两节点之间的最短距离
- **层序遍历**：二叉树的按层打印
- **单词接龙**：从一个单词变为另一个单词的最小步数
- **连通分量**：图的连通区域标记
- **拓扑排序**：Kahn 算法基于 BFS

---

## 三种遍历顺序（二叉树）

| 遍历方式 | 访问顺序 | 代码特点 |
|:--------|:--------|:--------|
| **前序** | 根 → 左 → 右 | DFS 最自然的形式 |
| **中序** | 左 → 根 → 右 | 二叉搜索树中输出有序序列 |
| **后序** | 左 → 右 → 根 | 处理子问题（分治） |
| **层序** | 从上到下，从左到右 | BFS 的标准形式 |

图的数据结构参考 [[无涯/计算机科学/数据结构与算法/数据结构/笔记/图|图]]。