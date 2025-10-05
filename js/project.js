/**
 * 项目页面入口文件
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
 * 设置项目筛选功能
 */
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新筛选按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 筛选项目卡片
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    // 添加淡出动画
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * 设置加载更多功能
 */
function setupLoadMoreProjects() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 显示加载状态
            this.classList.add('loading');
            this.disabled = true;
            
            // 模拟加载延迟
            setTimeout(() => {
                // 在实际项目中，这里应该是从API获取更多项目
                // 这里仅做演示，创建一些模拟项目卡片
                createMockProjectCards();
                
                // 恢复按钮状态
                this.classList.remove('loading');
                this.disabled = false;
                
                // 显示加载完成消息（可选）
                showLoadCompleteMessage();
            }, 1500);
        });
    }
}

/**
 * 创建模拟项目卡片
 */
function createMockProjectCards() {
    const projectGrid = document.querySelector('.project-grid');
    
    // 模拟项目数据
    const mockProjects = [
        {
            title: '数据可视化仪表盘',
            description: '基于Chart.js的数据可视化仪表盘，支持多种图表类型和实时数据更新。',
            imageId: 5,
            category: 'web',
            date: '2024-06',
            tags: ['JavaScript', 'Chart.js', 'Bootstrap']
        },
        {
            title: '社交媒体分析工具',
            description: '用于分析社交媒体数据的工具，支持多平台数据导入和趋势分析。',
            imageId: 6,
            category: 'tool',
            date: '2024-05',
            tags: ['Python', 'Django', 'Pandas']
        },
        {
            title: '电商网站原型',
            description: '完整的电商网站原型，包含商品展示、购物车和结账功能。',
            imageId: 7,
            category: 'web',
            date: '2024-04',
            tags: ['React', 'Redux', 'Firebase']
        }
    ];
    
    // 创建并添加项目卡片
    mockProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        
        // 构建项目标签
        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // 设置卡片内容
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="https://picsum.photos/id/${project.imageId}/600/400" alt="${project.title}">
                <div class="project-overlay">
                    <div class="overlay-content">
                        <a href="#" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            查看详情
                        </a>
                    </div>
                </div>
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span class="project-category">${getCategoryName(project.category)}</span>
                    <span class="project-date">${project.date}</span>
                </div>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
        
        // 设置初始样式以实现淡入效果
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'scale(0.8)';
        projectCard.style.transition = 'all 0.5s ease';
        
        // 添加到网格
        projectGrid.appendChild(projectCard);
        
        // 触发重排后应用动画
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'scale(1)';
        }, 50);
    });
}

/**
 * 根据分类简写获取完整分类名称
 * @param {string} category - 分类简写
 * @returns {string} - 完整分类名称
 */
function getCategoryName(category) {
    const categoryMap = {
        'web': '网站开发',
        'app': '应用程序',
        'tool': '工具类'
    };
    
    return categoryMap[category] || category;
}

/**
 * 显示加载完成消息
 */
function showLoadCompleteMessage() {
    // 检查是否已存在消息元素
    let messageElement = document.querySelector('.load-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'load-message';
        messageElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 0.95rem;
            font-weight: 500;
        `;
        
        document.body.appendChild(messageElement);
    }
    
    // 设置消息内容
    messageElement.textContent = '项目加载完成！';
    
    // 显示消息
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';
    
    // 3秒后隐藏消息
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
    }, 3000);
}

/**
 * 初始化项目页面
 */
async function initializeProjectPage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 设置项目筛选功能
    setupProjectFilters();
    
    // 设置加载更多功能
    setupLoadMoreProjects();
    
    console.log('Project page initialized');
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProjectPage);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    initializeProjectPage();
}