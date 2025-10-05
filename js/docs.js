/**
 * 文档页面入口文件
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
 * 设置文档目录的滚动监听
 * 高亮当前阅读的章节
 */
function setupTocScrollSpy() {
    const sections = document.querySelectorAll('.doc-section');
    const tocItems = document.querySelectorAll('.toc-item');
    
    // 处理滚动事件
    function handleScroll() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        // 更新目录项的活动状态
        tocItems.forEach(item => {
            item.classList.remove('active');
            if (item.querySelector('a').getAttribute('href') === current) {
                item.classList.add('active');
            }
        });
    }
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始执行一次
    handleScroll();
}

/**
 * 平滑滚动到锚点位置
 */
function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 初始化文档页面
 * 加载组件和设置特定功能
 */
async function initializeDocsPage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 设置文档目录滚动监听
    setupTocScrollSpy();
    
    // 设置平滑滚动
    setupSmoothScroll();
    
    console.log('Docs page initialized');
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocsPage);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    initializeDocsPage();
}