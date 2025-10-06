/**
 * 文章页面入口文件
 * 包含所有功能模块的合并版本
 */

/**
 * 获取文章列表
 * @returns {Promise<Array>} - 文章数据数组
 */
async function fetchArticleList() {
    try {
        // 从 context/article/index.json 获取文章列表
        const response = await fetch('/context/article/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const articles = JSON.parse(text);
        
        // 为每篇文章添加URL
        return articles.map(article => ({
            ...article,
            url: `/article/${article.name}/index.html`
        }));
    } catch (error) {
        console.error('Failed to fetch article list:', error);
        return [];
    }
}

/**
 * 渲染文章列表
 * @param {Array} articles - 要渲染的文章数组
 * @param {HTMLElement} container - 文章列表容器
 */
function renderArticles(articles, container) {
    articles.forEach((article, index) => {
        const articleElement = document.createElement('article');
        articleElement.className = 'article-item fade-in-up';
        articleElement.style.animationDelay = `${index * 0.05}s`;
        
        articleElement.innerHTML = `
            <div class="article-preview">
                <h2 class="article-item-title"><a href="${article.url}">${article.title}</a></h2>
                <div class="article-item-meta">
                    <span class="article-item-date">${article.date}</span>
                    <span class="article-item-category">${article.category}</span>
                </div>
                <p class="article-item-excerpt">${article.excerpt}</p>
            </div>
        `;
        
        container.appendChild(articleElement);
    });
}

/**
 * 设置加载更多功能
 * @param {Array} allArticles - 所有文章数据
 * @param {number} articlesPerPage - 每页显示的文章数量
 */
function setupLoadMore(allArticles, articlesPerPage = 10) {
    const loadMoreButton = document.querySelector('.load-more-button');
    const articleList = document.querySelector('.article-list');
    
    if (!loadMoreButton || !articleList) return;
    
    let currentPage = 1;
    let isLoading = false;
    
    // 初始加载第一页
    const initialArticles = allArticles.slice(0, articlesPerPage);
    renderArticles(initialArticles, articleList);
    
    // 更新按钮状态
    function updateButtonState() {
        const totalPages = Math.ceil(allArticles.length / articlesPerPage);
        
        if (currentPage >= totalPages || allArticles.length === 0) {
            loadMoreButton.textContent = '没有更多文章了';
            loadMoreButton.disabled = true;
            loadMoreButton.classList.add('disabled');
            
            // 如果没有文章，隐藏按钮
            if (allArticles.length === 0) {
                loadMoreButton.style.display = 'none';
            }
        } else {
            loadMoreButton.textContent = '加载更多';
            loadMoreButton.disabled = false;
            loadMoreButton.classList.remove('disabled');
            loadMoreButton.style.display = 'block';
        }
    }
    
    // 初始更新按钮状态
    updateButtonState();
    
    // 加载更多文章
    loadMoreButton.addEventListener('click', async () => {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreButton.classList.add('loading');
        loadMoreButton.textContent = '加载中...';
        
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        currentPage++;
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = Math.min(startIndex + articlesPerPage, allArticles.length);
        const newArticles = allArticles.slice(startIndex, endIndex);
        
        renderArticles(newArticles, articleList);
        updateButtonState();
        
        isLoading = false;
        loadMoreButton.classList.remove('loading');
    });
}

/**
 * 初始化文章列表页面
 */
async function initializeArticleListPage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 获取文章列表
    const allArticles = await fetchArticleList();
    
    // 设置加载更多功能
    setupLoadMore(allArticles, 10);
    
    // 如果没有文章，显示提示信息
    if (allArticles.length === 0) {
        const articleList = document.querySelector('.article-list');
        if (articleList) {
            articleList.innerHTML = `
                <div class="no-articles">
                    <p>暂无文章，敬请期待！</p>
                </div>
            `;
        }
    }
}

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
 * 生成文章目录
 * @returns {void}
 */
function generateTableOfContents() {
    const tocContainer = document.getElementById('generated-toc');
    if (!tocContainer) return;
    
    // 清空现有目录
    tocContainer.innerHTML = '';
    
    // 获取文章内容区域中的所有标题
    const contentArea = document.querySelector('.doc-body');
    if (!contentArea) return;
    
    const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
    if (headings.length === 0) return;
    
    // 创建目录项
    headings.forEach((heading, index) => {
        // 确保标题有ID
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录项
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item toc-level-${heading.tagName.substring(1)}`;
        
        // 创建目录链接
        const tocLink = document.createElement('a');
        tocLink.href = `#${heading.id}`;
        tocLink.className = 'toc-link';
        tocLink.textContent = heading.textContent;
        
        // 添加点击事件，平滑滚动到对应标题
        tocLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新URL哈希
            history.pushState(null, null, `#${heading.id}`);
        });
        
        tocItem.appendChild(tocLink);
        tocContainer.appendChild(tocItem);
    });
    
    // 设置目录滚动监听
    setupTocScrollSpy();
}

/**
 * 设置目录滚动监听，高亮当前阅读的章节
 * @returns {void}
 */
function setupTocScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        // 获取所有标题的位置
        const headings = Array.from(document.querySelectorAll('.doc-body h2, .doc-body h3, .doc-body h4, .doc-body h5, .doc-body h6'));
        
        // 找出当前视口中的标题
        let currentHeading = null;
        
        for (const heading of headings) {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) { // 100px的偏移量，可以根据需要调整
                currentHeading = heading;
            } else {
                break;
            }
        }
        
        // 如果没有找到合适的标题，使用第一个
        if (!currentHeading && headings.length > 0) {
            currentHeading = headings[0];
        }
        
        // 更新目录高亮
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (currentHeading && link.getAttribute('href') === `#${currentHeading.id}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 加载文章内容
 * @param {string} articleName - 文章名称
 * @returns {Promise<void>} - 加载完成的Promise
 */
async function loadArticleContent(articleName) {
    try {
        // 加载Markdown文件
        const markdownPath = `/context/article/${articleName}.md`;
        console.log(`Attempting to load Markdown article from path: ${markdownPath}`);
        
        const response = await fetch(markdownPath);
        if (response.ok) {
            const markdownText = await response.text();
            
            // 使用marked.js将Markdown转换为HTML
            const htmlContent = marked.parse(markdownText);
            
            // 创建文章布局结构
            const articleLayout = `
                <div class="doc-layout">
                    <!-- 文章内容区域 -->
                    <div class="doc-content">
                        <div class="doc-header">
                            <!-- 标题将从内容中提取 -->
                        </div>
                        
                        <!-- 文章正文 -->
                        <div class="doc-body">
                            ${htmlContent}
                        </div>
                    </div>
                </div>
            `;
            
            // 将内容加载到容器
            const container = document.getElementById('doc-content-container');
            if (container) {
                container.innerHTML = articleLayout;
                
                // 提取标题并设置到文章头部
                const firstHeading = container.querySelector('h1');
                if (firstHeading) {
                    const docHeader = container.querySelector('.doc-header');
                    if (docHeader) {
                        const title = firstHeading.textContent;
                        docHeader.innerHTML = `
                            <h1 class="doc-title">${title}</h1>
                        `;
                        // 移除原始标题，避免重复
                        firstHeading.remove();
                    }
                }
                
                // 为所有标题添加ID，以便目录导航
                const headings = container.querySelectorAll('h2, h3, h4, h5, h6');
                headings.forEach((heading, index) => {
                    if (!heading.id) {
                        // 创建一个基于标题文本的ID
                        const id = heading.textContent.trim()
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '') // 移除特殊字符
                            .replace(/\s+/g, '-') // 替换空格为连字符
                            .replace(/-+/g, '-'); // 替换多个连字符为单个连字符
                        
                        heading.id = id;
                    }
                });
                
                // 为文章内容添加动画效果
                const docContent = container.querySelector('.doc-content');
                if (docContent) {
                    docContent.classList.add('fade-in-up');
                }
                
                console.log(`Markdown article ${articleName} loaded and rendered successfully`);
                return;
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}, url: ${markdownPath}`);
        }
    } catch (error) {
        console.error(`Failed to load article content: ${error}`);
        // 显示错误信息
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>文章加载失败</h2>
                    <p>抱歉，该文章不存在或无法访问。</p>
                    <p>错误详情: ${error.message}</p>
                    <p>尝试加载的路径: /context/article/${articleName}.md</p>
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

// 自动初始化文章页面
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticlePage);
} else {
    initializeArticlePage();
}