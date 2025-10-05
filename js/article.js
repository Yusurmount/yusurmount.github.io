/**
 * 文章页面入口文件
 * 包含所有功能模块的合并版本
 */

/**
 * 动态加载HTML组件到指定容器
 * @param {string} url - 组件文件的URL
 * @param {string} containerId - 容器元素的ID
 * @returns {Promise<void>} - 加载完成的Promise
 */
async function loadComponent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error(`Failed to load component: ${error}`);
    }
}

/**
 * 加载所有常用组件
 * @returns {Promise<void>} - 加载完成的Promise
 */
async function loadAllComponents() {
    await Promise.all([
        loadComponent('/context/header.html', 'header-container'),
        loadComponent('/context/footer.html', 'footer-container'),
        loadComponent('/context/sidebar.html', 'sidebar-container')
    ]);
}

/**
 * 设置菜单事件处理
 */
function setupMenuEvents() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // 打开侧边栏
    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // 关闭侧边栏的函数
    const closeSidebar = () => {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    // 点击关闭按钮或遮罩关闭侧边栏
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // 点击侧边栏链接后关闭侧边栏
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // 为当前页面的链接添加激活状态
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-link, .sidebar-link');
    
    navLinks.forEach(link => {
        // 处理根路径的特殊情况
        if (currentUrl === '/' && link.getAttribute('href') === '/') {
            link.classList.add('active');
            return;
        }
        
        // 检查其他页面的匹配情况
        if (link.getAttribute('href') && currentUrl.includes(link.getAttribute('href').replace(/^\//, ''))) {
            link.classList.add('active');
        }
    });
}

/**
 * 加载文章内容
 * @param {string} articleName - 文章名称
 * @returns {Promise<void>} - 加载完成的Promise
 */
async function loadArticleContent(articleName) {
    try {
        // 获取文章内容文件路径
        const articlePath = `/context/article/${articleName}.html`;
        
        // 加载文章内容到容器
        await loadComponent(articlePath, 'article-content-container');
        
        // 为文章内容添加动画效果
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.classList.add('fade-in-up');
        }
        
        console.log(`Article ${articleName} loaded successfully`);
    } catch (error) {
        console.error(`Failed to load article content: ${error}`);
        // 显示错误信息
        const container = document.getElementById('article-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>文章加载失败</h2>
                    <p>抱歉，该文章不存在或无法访问。</p>
                    <a href="/article/index.html" class="btn-primary">返回文章列表</a>
                </div>
            `;
        }
    }
}

/**
 * 获取URL中的文章名称
 * @returns {string} - 文章名称
 */
function getArticleNameFromUrl() {
    // 从URL路径中提取文章名称
    // 路径格式: /article/[article-name]/index.html
    const pathParts = window.location.pathname.split('/');
    // 查找'article'在路径中的位置
    const articleIndex = pathParts.indexOf('article');
    
    if (articleIndex !== -1 && pathParts.length > articleIndex + 1) {
        return pathParts[articleIndex + 1];
    }
    
    // 默认返回示例文章
    return 'example-article';
}

/**
 * 初始化文章页面
 * 加载组件和文章内容
 */
async function initializeArticlePage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 获取文章名称并加载文章内容
    const articleName = getArticleNameFromUrl();
    await loadArticleContent(articleName);
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticlePage);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    initializeArticlePage();
}