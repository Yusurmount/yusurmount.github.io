---
title: 配置指南
date: 2026-04-30
summary: 了解如何配置网站的基本信息、主题颜色、菜单等
category: 入门指南
tags: [配置, 自定义]
order: 2
---

# 配置指南

本文档介绍如何配置网站的基本信息。

## 配置文件

网站的主要配置文件位于 `src/config.json`，包含了站点的大部分配置项。

## 基本信息

```json
{
  "site": {
    "url": "https://yusurmount.github.io",
    "title": "雨夌站",
    "description": "雨夌的个人博客，记录技术学习与生活感悟。",
    "lang": "zh-CN"
  }
}
```

## 作者信息

```json
{
  "author": {
    "name": "雨夌",
    "twitterId": "@yusurmount",
    "avatar": "/avatar.jpg"
  }
}
```

## 菜单配置

```json
{
  "menus": [
    {
      "name": "首页",
      "link": "/",
      "icon": "icon-pantone"
    }
  ]
}
```

## 主题颜色

```json
{
  "color": {
    "accent": [
      { "light": "#F55555", "dark": "#FCCF31" }
    ]
  }
}
```