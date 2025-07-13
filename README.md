# 雨夌站

这是一个基于 Material Design 3 的静态个人网页

## 项目结构

```
/                   # 根目录
├── index.html      # 主页
├── components/     # 可复用组件
│   ├── header.html # 页头
│   ├── menu.html   # 侧栏菜单
│   └── footer.html # 页脚
├── css/            # 样式文件
│   └── md3-theme.css # MD3 主题样式
├── js/             # JavaScript 文件
│   └── router.js   # 路由脚本，实现无缝页面切换
└── pages/          # 页面内容 
    ├── about/
    │   ├── index.html  # 关于页面
    ├── blog/
    │   ├── id/          # 文章目录
    │   ├── index.html   # 博客页面
    ├── contact/
    └── ├── index.html # 联系页面
    
```

## 特点

- 采用 MD3 设计规范
- 淡蓝色主题配色方案
- 动态加载组件（页头、侧栏菜单、页脚）
- 无缝页面切换，无闪屏
- 响应式设计，适配各种设备

## 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 在仓库设置中，导航到 "Pages" 选项
3. 选择分支（通常为 main 或 master）
4. 设置根目录作为网站源
5. 点击保存，等待几分钟后即可访问

## 技术栈

- HTML5
- CSS3
- JavaScript
- Material Design 3
- GitHub Pages

---
## 许可证
[CC BY-NC-SA 4.0](LICENSE)