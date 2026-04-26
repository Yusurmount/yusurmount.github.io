/**
 * 雨夌站 - 核心组件模块
 * 提供所有页面共享的功能
 */

export async function loadComponent(url, containerId) {
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

export async function loadAllComponents() {
    await Promise.all([
        loadComponent('/context/header.html', 'header-container'),
        loadComponent('/context/footer.html', 'footer-container'),
        loadComponent('/context/sidebar.html', 'sidebar-container')
    ]);
}

export function setupMenuEvents() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.header-link, .sidebar-link, .mobile-link');

    const closeMobileMenu = () => {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            const icon = menuToggle?.querySelector('svg');
            if (icon) {
                icon.classList.remove('bi-x');
                icon.classList.add('bi-list');
            }
            document.body.style.overflow = '';
        }
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.toggle('open');
                const icon = menuToggle.querySelector('svg');
                if (mobileMenu.classList.contains('open')) {
                    icon?.classList.remove('bi-list');
                    icon?.classList.add('bi-x');
                    document.body.style.overflow = 'hidden';
                } else {
                    icon?.classList.remove('bi-x');
                    icon?.classList.add('bi-list');
                    document.body.style.overflow = '';
                }
            } else {
                if (sidebar && sidebarOverlay) {
                    sidebar.classList.add('open');
                    sidebarOverlay.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    navLinks.forEach(link => link.classList.remove('active'));

    const currentUrl = window.location.pathname;
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        if (linkHref === '/') {
            if (currentUrl === '/') link.classList.add('active');
            return;
        }

        const normalizedLinkHref = linkHref.replace(/\/$/, '');
        if (currentUrl === normalizedLinkHref ||
            currentUrl === normalizedLinkHref + '.html' ||
            currentUrl.startsWith(normalizedLinkHref + '/')) {
            link.classList.add('active');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

export function initApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await loadAllComponents();
            setupMenuEvents();
        });
    } else {
        (async () => {
            await loadAllComponents();
            setupMenuEvents();
        })();
    }
}
