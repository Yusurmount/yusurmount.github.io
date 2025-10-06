/**
 * 文档页面入口文件
 * 包含所有功能模块的合并版本
 */

/**
 * 获取文档列表
 * @returns {Promise<Array>} - 文档数据数组
 */
async function fetchDocList() {
    try {
        // 从 context/docs/index.json 获取文档列表
        const response = await fetch('/context/docs/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const docs = JSON.parse(text);
        
        // 为每个文档添加URL
        return docs.map(doc => ({
            ...doc,
            url: `/docs/${doc.name}/index.html`
        }));
    } catch (error) {
        console.error('Failed to fetch doc list:', error);
        return [];
    }
}

/**
 * 渲染文档列表
 * @param {Array} docs - 要渲染的文档数组
 * @param {HTMLElement} container - 文档列表容器
 */
function renderDocs(docs, container) {
    docs.forEach((doc, index) => {
        const docElement = document.createElement('div');
        docElement.className = 'doc-item fade-in-up';
        docElement.style.animationDelay = `${index * 0.05}s`;
        
        docElement.innerHTML = `
            <div class="doc-preview">
                <p class="doc-title"><a href="${doc.url}">${doc.title}</a></p>
                <p class="doc-desc">${doc.excerpt}</p>
            </div>
        `;
        
        container.appendChild(docElement);
    });
}

/**
 * 设置加载更多功能
 * @param {Array} allDocs - 所有文档数据
 * @param {number} docsPerPage - 每页显示的文档数量
 */
function setupLoadMoreDocs(allDocs, docsPerPage = 10) {
    const loadMoreButton = document.querySelector('.load-more-button');
    const docList = document.querySelector('.doc-list');
    
    if (!loadMoreButton || !docList) return;
    
    let currentPage = 1;
    let isLoading = false;
    
    // 初始加载第一页
    const initialDocs = allDocs.slice(0, docsPerPage);
    renderDocs(initialDocs, docList);
    
    // 更新按钮状态
    function updateButtonState() {
        const totalPages = Math.ceil(allDocs.length / docsPerPage);
        
        if (currentPage >= totalPages || allDocs.length === 0) {
            loadMoreButton.textContent = '没有更多文档了';
            loadMoreButton.disabled = true;
            loadMoreButton.classList.add('disabled');
            
            // 如果没有文档，隐藏按钮
            if (allDocs.length === 0) {
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
    
    // 加载更多文档
    loadMoreButton.addEventListener('click', async () => {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreButton.classList.add('loading');
        loadMoreButton.textContent = '加载中...';
        
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        currentPage++;
        const startIndex = (currentPage - 1) * docsPerPage;
        const endIndex = Math.min(startIndex + docsPerPage, allDocs.length);
        const newDocs = allDocs.slice(startIndex, endIndex);
        
        renderDocs(newDocs, docList);
        updateButtonState();
        
        isLoading = false;
        loadMoreButton.classList.remove('loading');
    });
}

/**
 * 初始化文档列表页面
 */
async function initializeDocListPage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 获取文档列表
    const allDocs = await fetchDocList();
    
    // 设置加载更多功能
    setupLoadMoreDocs(allDocs, 10);
    
    // 如果没有文档，显示提示信息
    if (allDocs.length === 0) {
        const docList = document.querySelector('.doc-list');
        if (docList) {
            docList.innerHTML = `
                <div class="no-docs">
                    <p>暂无文档，敬请期待！</p>
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
        console.log(`Loading component from: ${url} into container: ${containerId}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
        }
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
            console.log(`Component loaded successfully into container: ${containerId}`);
        } else {
            console.error(`Container element not found: ${containerId}`);
        }
    } catch (error) {
        console.error(`Failed to load component: ${error}`);
        throw error; // 重新抛出错误，让调用者处理
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
 * 加载文档内容
 * @param {string} docPath - 文档路径
 * @returns {Promise<void>} - 加载完成的Promise
 */
async function loadDocContent(docPath) {
    try {
        // 加载Markdown文件
        const markdownPath = `/context${docPath}.md`;
        console.log(`Attempting to load Markdown document from path: ${markdownPath}`);
        
        const response = await fetch(markdownPath);
        if (response.ok) {
            const markdownText = await response.text();
            
            // 使用marked.js将Markdown转换为HTML
            const htmlContent = marked.parse(markdownText);
            
            // 创建文档布局结构
            const docLayout = `
                <div class="doc-layout">
                    <!-- 文档侧边导航 -->
                    <div class="doc-sidebar">
                        <div class="doc-toc">
                            <h3 class="toc-title">目录</h3>
                            <ul class="toc-list" id="generated-toc">
                                <!-- 目录将通过JavaScript动态生成 -->
                            </ul>
                        </div>
                    </div>
                    
                    <!-- 文档内容区域 -->
                    <div class="doc-content">
                        <div class="doc-header">
                            <!-- 标题将从内容中提取 -->
                        </div>
                        
                        <!-- 文档正文 -->
                        <div class="doc-body">
                            ${htmlContent}
                        </div>
                    </div>
                </div>
            `;
            
            // 将内容加载到容器
            const container = document.getElementById('doc-content-container');
            if (container) {
                container.innerHTML = docLayout;
                
                // 提取标题并设置到文档头部
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
                
                // 生成目录（不再使用索引，直接使用DOM引用）
                generateTableOfContents();
                
                // 为文档内容添加动画效果
                const docContent = container.querySelector('.doc-content');
                if (docContent) {
                    docContent.classList.add('fade-in-up');
                }
                
                console.log(`Markdown document ${docPath} loaded and rendered successfully`);
                return;
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}, url: ${markdownPath}`);
        }
    } catch (error) {
        console.error(`Failed to load document content: ${error}`);
        // 显示错误信息
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>文档加载失败</h2>
                    <p>抱歉，该文档不存在或无法访问。</p>
                    <p>错误详情: ${error.message}</p>
                    <p>尝试加载的路径: /context${docPath}.md</p>
                    <a href="/docs/index.html" class="btn-primary">返回文档列表</a>
                </div>
            `;
        }
    }
}

/**
 * 生成文档目录
 * 使用直接DOM引用，避免ID或索引定位问题
 */
function generateTableOfContents() {
    const tocContainer = document.getElementById('generated-toc');
    if (!tocContainer) return;
    
    const docBody = document.querySelector('.doc-body');
    if (!docBody) return;
    
    // 获取所有标题元素
    const headings = docBody.querySelectorAll('h2, h3, h4, h5, h6');
    if (headings.length === 0) return;
    
    // 清空目录
    tocContainer.innerHTML = '';
    
    // 为每个标题创建目录项
    headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1)) - 1; // h2 -> level 1, h3 -> level 2, etc.
        const text = heading.textContent;
        
        // 创建目录项，使用直接引用而不是索引
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item level-${level}`;
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = text;
        link.className = 'toc-link';
        
        // 存储对标题的直接引用
        link._targetHeading = heading;
        
        tocItem.appendChild(link);
        tocContainer.appendChild(tocItem);
    });
}

/**
 * 获取URL中的文档路径
 * @returns {string} - 文档路径
 */
function getDocPathFromUrl() {
    // 从URL路径中提取文档路径
    // 路径格式: /docs/[doc-name]/index.html 或 /docs/index.html
    const pathParts = window.location.pathname.split('/');
    // 查找'docs'在路径中的位置
    const docsIndex = pathParts.indexOf('docs');
    
    if (docsIndex !== -1 && pathParts.length > docsIndex + 1) {
        // 构建文档路径，排除最后的'index.html'
        const docParts = pathParts.slice(docsIndex + 1);
        // 移除可能的'index.html'
        const cleanParts = docParts.filter(part => part !== 'index.html');
        
        // 如果清理后的部分为空，说明访问的是/docs/index.html
        if (cleanParts.length === 0) {
            return '/docs/index';
        }
        
        // 确保路径以'docs'开头，与context/docs结构匹配
        return `/docs/${cleanParts.join('/')}`;
    }
    
    // 默认返回文档首页
    return '/docs/index';
}

/**
 * 设置文档目录的滚动监听
 * 高亮当前阅读的章节，使用直接DOM引用
 */
function setupTocScrollSpy() {
    const tocItems = document.querySelectorAll('.toc-item');
    
    // 处理滚动事件
    function handleScroll() {
        let currentHeading = null;
        let currentTocItem = null;
        
        // 遍历所有目录项
        tocItems.forEach(item => {
            const link = item.querySelector('a.toc-link');
            if (!link || !link._targetHeading) return;
            
            const heading = link._targetHeading;
            const headingTop = heading.offsetTop;
            
            // 检查当前滚动位置是否超过此标题
            if (pageYOffset >= headingTop - 200) {
                currentHeading = heading;
                currentTocItem = item;
            }
        });
        
        // 更新目录项的活动状态
        tocItems.forEach(item => {
            item.classList.remove('active');
        });
        
        if (currentTocItem) {
            currentTocItem.classList.add('active');
        }
    }
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始执行一次
    handleScroll();
}

/**
 * 平滑滚动到锚点位置
 * 使用直接DOM引用，避免ID或索引定位问题
 */
function setupSmoothScroll() {
    // 使用事件委托处理动态生成的目录链接
    document.addEventListener('click', function(e) {
        // 检查点击的是否是目录链接
        const link = e.target.closest('a.toc-link');
        if (!link) return;
        
        // 阻止默认行为
        e.preventDefault();
        
        // 使用存储的直接引用获取目标标题
        const targetHeading = link._targetHeading;
        
        if (targetHeading) {
            window.scrollTo({
                top: targetHeading.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // 更新URL，但不刷新页面
            history.pushState(null, null, '#');
        }
    });
}

/**
 * 初始化文档页面
 * 加载组件和设置特定功能
 */
async function initializeDocsPage() {
    try {
        console.log('Initializing documentation page...');
        
        // 加载所有基础组件
        console.log('Loading all components...');
        await loadAllComponents();
        console.log('All components loaded successfully');
        
        // 设置菜单事件处理
        console.log('Setting up menu events...');
        setupMenuEvents();
        console.log('Menu events set up successfully');
        
        // 从URL获取文档路径
        console.log('Getting document path from URL...');
        const docPath = getDocPathFromUrl();
        console.log(`Document path extracted: ${docPath}`);
        
        // 判断是否为文档列表页面
        if (docPath === '/docs/index') {
            console.log('Initializing document list page...');
            // 获取文档列表
            const allDocs = await fetchDocList();
            
            // 设置加载更多功能
            setupLoadMoreDocs(allDocs, 10);
            
            // 如果没有文档，显示提示信息
            if (allDocs.length === 0) {
                const docList = document.querySelector('.doc-list');
                if (docList) {
                    docList.innerHTML = `
                        <div class="no-docs">
                            <p>暂无文档，敬请期待！</p>
                        </div>
                    `;
                }
            }
        } else {
            // 加载文档内容
            console.log('Loading document content...');
            await loadDocContent(docPath);
            console.log('Document content loaded successfully');
            
            // 设置文档目录滚动监听（内容加载后执行）
            console.log('Setting up TOC scroll spy...');
            setupTocScrollSpy();
            console.log('TOC scroll spy set up successfully');
            
            // 设置平滑滚动（内容加载后执行）
            console.log('Setting up smooth scroll...');
            setupSmoothScroll();
            console.log('Smooth scroll set up successfully');
        }
        
        console.log('Documentation page initialized successfully');
    } catch (error) {
        console.error('Failed to initialize documentation page:', error);
        // 显示全局错误信息
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>页面初始化失败</h2>
                    <p>抱歉，文档页面初始化过程中发生错误。</p>
                    <p>错误详情: ${error.message}</p>
                    <a href="/index.html" class="btn-primary">返回首页</a>
                </div>
            `;
        }
    }
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocsPage);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    initializeDocsPage();
}