---
title: 写作指南
date: 2026-04-30
summary: 了解如何在博客中创建和管理文章
category: 进阶指南
tags: [写作, 文章, Markdown]
order: 3
---

# 写作指南

本文档介绍如何创建和管理博客文章。

## 文章结构

文章存放在 `src/content/posts/` 目录下，使用 Markdown 格式编写。

## 文章前置matter

每篇文章都需要在开头添加 YAML 前置matter：

```markdown
---
title: 文章标题
date: 2026-04-30
summary: 文章摘要
category: 分类
tags: [标签1, 标签2]
---
```

## 文章字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| title | 是 | 文章标题 |
| date | 是 | 发布日期 |
| summary | 否 | 文章摘要，用于列表展示 |
| category | 否 | 分类名称 |
| tags | 否 | 标签数组 |
| draft | 否 | 是否为草稿，默认 false |
| sticky | 否 | 置顶优先级，数字越大越靠前 |

## 使用脚本创建文章

项目提供了便捷的文章创建脚本：

```bash
pnpm new-post
```

这将交互式地引导你创建一篇新文章。