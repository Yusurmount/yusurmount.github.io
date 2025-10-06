# 测试文档

这是一个用于测试文档模块动态加载功能的示例文档。

## 1. 介绍

这个测试文档展示了DOCS模块的动态加载机制。通过这种机制，我们可以实现文档内容的按需加载，提高页面加载性能。

动态加载机制的核心是使用JavaScript异步加载HTML内容，并将其插入到页面的特定容器中。

## 2. 功能特点

- **按需加载：** 只有在用户访问特定页面时才加载对应的文档内容
- **组件复用：** 共享header、footer、sidebar等公共组件
- **平滑过渡：** 加载内容时应用淡入动画效果
- **错误处理：** 当文档不存在时显示友好的错误信息

## 3. 使用方法

使用文档模块非常简单，只需按照以下步骤操作：

1. 在浏览器中访问文档页面
2. 从文档列表中选择您感兴趣的文档
3. 阅读文档内容，可以使用目录快速导航
4. 点击页面顶部或侧边栏的导航链接返回其他页面

## 4. 示例代码

以下是实现文档动态加载的核心JavaScript代码示例：

```javascript
// 加载文档内容
async function loadDocContent(docPath) {
    try {
        const fullDocPath = `/context${docPath}.html`;
        await loadComponent(fullDocPath, 'doc-content-container');
        
        const docContent = document.querySelector('.doc-content');
        if (docContent) {
            docContent.classList.add('fade-in-up');
        }
    } catch (error) {
        console.error(`Failed to load document content: ${error}`);
        // 显示错误信息
    }
}

// 初始化文档页面
async function initializeDocsPage() {
    await loadAllComponents();
    setupMenuEvents();
    
    const docPath = getDocPathFromUrl();
    await loadDocContent(docPath);
    
    setupTocScrollSpy();
    setupSmoothScroll();
}
```