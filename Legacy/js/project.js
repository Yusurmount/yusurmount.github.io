/**
 * 项目页面入口文件
 */

import { loadAllComponents, setupMenuEvents } from './components.js';

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function setupLoadMoreProjects() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.disabled = true;

            setTimeout(() => {
                createMockProjectCards();
                this.classList.remove('loading');
                this.disabled = false;
                showLoadCompleteMessage();
            }, 1500);
        });
    }
}

function createMockProjectCards() {
    const projectGrid = document.querySelector('.project-grid');

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
        },
        {
            title: 'Leaf OS',
            description: '轻量级、环保、高效的操作系统，为未来计算而设计。',
            imageId: 106,
            category: 'system',
            date: '2024-07',
            tags: ['Linux', '操作系统', '开源']
        }
    ];

    mockProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);

        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        projectCard.innerHTML = `
            <div class="project-image">
                <img src="https://picsum.photos/id/${project.imageId}/600/400" alt="${project.title}">
                <div class="project-overlay">
                    <div class="overlay-content">
                        <a href="#" class="project-link">
                            <i class="bi bi-box-arrow-up-right"></i>
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
                <div class="project-tags">${tagsHtml}</div>
            </div>
        `;

        projectCard.style.opacity = '0';
        projectCard.style.transform = 'scale(0.8)';
        projectCard.style.transition = 'all 0.5s ease';

        projectGrid.appendChild(projectCard);

        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'scale(1)';
        }, 50);
    });
}

function getCategoryName(category) {
    const categoryMap = {
        'web': '网站开发',
        'app': '应用程序',
        'tool': '工具类'
    };
    return categoryMap[category] || category;
}

function showLoadCompleteMessage() {
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

    messageElement.textContent = '项目加载完成！';
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';

    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
    }, 3000);
}

async function initializeProjectPage() {
    await loadAllComponents();
    setupMenuEvents();
    setupProjectFilters();
    setupLoadMoreProjects();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProjectPage);
} else {
    initializeProjectPage();
}
