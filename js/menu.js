/**
 * 菜单模块
 * 提供菜单相关的事件处理功能
 */

/**
 * 设置菜单事件处理
 */
export function setupMenuEvents() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    // 移动设备菜单切换
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            // 切换图标样式
            const icon = menuToggle.querySelector('svg');
            if (mobileMenu.classList.contains('open')) {
                // 改变为关闭图标
                icon.classList.remove('bi-list');
                icon.classList.add('bi-x');
                document.body.style.overflow = 'hidden';
            } else {
                // 恢复为菜单图标
                icon.classList.remove('bi-x');
                icon.classList.add('bi-list');
                document.body.style.overflow = '';
            }
        });
    }

    // 点击移动菜单链接后关闭菜单
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                const icon = menuToggle?.querySelector('svg');
                if (icon) {
                    icon.classList.remove('bi-x');
                    icon.classList.add('bi-list');
                }
                document.body.style.overflow = '';
            }
        });
    });

    // 桌面端侧边栏菜单（保留原有功能）
    // 打开侧边栏
    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            // 仅在桌面端（视窗宽度大于768px）时打开侧边栏
            if (window.innerWidth > 768) {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
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
    const navLinks = document.querySelectorAll('.header-link, .sidebar-link, .mobile-link');
    
    // 重置所有链接的激活状态
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        // 获取链接的href属性
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;
        
        // 处理根路径的特殊情况 - 只有在首页时才激活首页链接
        if (linkHref === '/') {
            if (currentUrl === '/') {
                link.classList.add('active');
            }
            return;
        }
        
        // 处理其他页面的链接
        // 规范化链接href（去掉尾部斜杠）
        const normalizedLinkHref = linkHref.replace(/\/$/, '');
        
        // 检查多种可能的匹配情况：
        // 1. 完整URL路径完全匹配
        // 2. 去掉.html扩展名后匹配
        // 3. 作为子路径的开头
        if (currentUrl === normalizedLinkHref ||
            currentUrl === normalizedLinkHref + '.html' ||
            currentUrl.startsWith(normalizedLinkHref + '/')) {
            link.classList.add('active');
        }
    });

    // 监听窗口大小变化，在切换到桌面视图时关闭移动菜单
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            const icon = menuToggle?.querySelector('svg');
            if (icon) {
                icon.classList.remove('bi-x');
                icon.classList.add('bi-list');
            }
            document.body.style.overflow = '';
        }
    });
}