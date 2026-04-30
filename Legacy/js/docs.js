/**
 * 文档页面入口文件
 */

import { loadAllComponents, setupMenuEvents } from './components.js';

async function fetchDocList() {
    try {
        const response = await fetch('/context/docs/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Fetched JSON text:', text);
        const docs = JSON.parse(text);
        console.log('Parsed docs:', docs);
        return docs.map(doc => ({
            ...doc,
            url: `/docs/${doc.name}/index.html`
        }));
    } catch (error) {
        console.error('Failed to fetch doc list:', error);
        // 失败时返回硬编码数据作为 fallback
        const fallbackDocs = [
            {
                "name": "test",
                "title": "测试文档",
                "date": "2025-10-05",
                "category": "测试",
                "excerpt": "这是一个测试文档，用于演示文档模块的动态加载功能。"
            },
            {
                "name": "update",
                "title": "更新日志",
                "date": "2026-04-26",
                "category": "维护",
                "excerpt": "雨夌站近期更新日志。"
            }
        ];
        console.log('Using fallback docs:', fallbackDocs);
        return fallbackDocs.map(doc => ({
            ...doc,
            url: `/docs/${doc.name}/index.html`
        }));
    }
}

function renderDocs(docs, container) {
    console.log('Rendering docs:', docs);
    console.log('Container:', container);
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

function setupLoadMoreDocs(allDocs, docsPerPage = 10) {
    const loadMoreButton = document.querySelector('.load-more-button');
    const docList = document.querySelector('.doc-list');

    if (!loadMoreButton || !docList) return;

    let currentPage = 1;
    let isLoading = false;

    const initialDocs = allDocs.slice(0, docsPerPage);
    renderDocs(initialDocs, docList);

    function updateButtonState() {
        const totalPages = Math.ceil(allDocs.length / docsPerPage);

        if (currentPage >= totalPages || allDocs.length === 0) {
            loadMoreButton.textContent = '没有更多文档了';
            loadMoreButton.disabled = true;
            loadMoreButton.classList.add('disabled');

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

    updateButtonState();

    loadMoreButton.addEventListener('click', async () => {
        if (isLoading) return;

        isLoading = true;
        loadMoreButton.classList.add('loading');
        loadMoreButton.textContent = '加载中...';

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

async function initializeDocListPage() {
    await loadAllComponents();
    setupMenuEvents();

    const allDocs = await fetchDocList();
    setupLoadMoreDocs(allDocs, 10);

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

function getDocPathFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const docsIndex = pathParts.indexOf('docs');

    if (docsIndex !== -1) {
        const docParts = pathParts.slice(docsIndex + 1);
        const cleanParts = docParts.filter(part => part !== 'index.html' && part !== '');

        if (cleanParts.length === 0) {
            return '/docs/index';
        }

        return `/docs/${cleanParts.join('/')}`;
    }

    return '/docs/index';
}

function generateTableOfContents() {
    const tocContainer = document.getElementById('generated-toc');
    if (!tocContainer) return;

    const docBody = document.querySelector('.doc-body');
    if (!docBody) return;

    const headings = docBody.querySelectorAll('h2, h3, h4, h5, h6');
    if (headings.length === 0) return;

    tocContainer.innerHTML = '';

    headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1)) - 1;
        const text = heading.textContent;

        const tocItem = document.createElement('li');
        tocItem.className = `toc-item level-${level}`;
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = text;
        link.className = 'toc-link';
        link._targetHeading = heading;

        tocItem.appendChild(link);
        tocContainer.appendChild(tocItem);
    });
}

function setupTocScrollSpy() {
    const tocItems = document.querySelectorAll('.toc-item');

    function handleScroll() {
        let currentHeading = null;
        let currentTocItem = null;

        tocItems.forEach(item => {
            const link = item.querySelector('a.toc-link');
            if (!link || !link._targetHeading) return;

            const heading = link._targetHeading;
            const headingTop = heading.offsetTop;

            if (pageYOffset >= headingTop - 200) {
                currentHeading = heading;
                currentTocItem = item;
            }
        });

        tocItems.forEach(item => item.classList.remove('active'));

        if (currentTocItem) {
            currentTocItem.classList.add('active');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function setupSmoothScroll() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a.toc-link');
        if (!link) return;

        e.preventDefault();

        const targetHeading = link._targetHeading;

        if (targetHeading) {
            window.scrollTo({
                top: targetHeading.offsetTop - 100,
                behavior: 'smooth'
            });

            history.pushState(null, null, '#');
        }
    });
}

async function loadDocContent(docPath) {
    try {
        if (!docPath || docPath === '/docs' || docPath === '/docs/index' || docPath === '/' || docPath.endsWith('/')) {
            return;
        }

        if (docPath === '/docs/' || docPath === '/context/docs/' || docPath === '/context/docs' || docPath.split('/').length <= 2) {
            return;
        }

        const markdownPath = `/context${docPath}.md`;
        const response = await fetch(markdownPath);

        if (response.ok) {
            const markdownText = await response.text();
            const htmlContent = marked.parse(markdownText);

            const docLayout = `
                <div class="doc-layout">
                    <div class="doc-sidebar">
                        <div class="doc-toc">
                            <h3 class="toc-title">目录</h3>
                            <ul class="toc-list" id="generated-toc"></ul>
                        </div>
                    </div>
                    <div class="doc-content">
                        <div class="doc-header"></div>
                        <div class="doc-body">${htmlContent}</div>
                    </div>
                </div>
            `;

            const container = document.getElementById('doc-content-container');
            if (container) {
                container.innerHTML = docLayout;

                const firstHeading = container.querySelector('h1');
                if (firstHeading) {
                    const docHeader = container.querySelector('.doc-header');
                    if (docHeader) {
                        docHeader.innerHTML = `<h1 class="doc-title">${firstHeading.textContent}</h1>`;
                        firstHeading.remove();
                    }
                }

                generateTableOfContents();

                const docContent = container.querySelector('.doc-content');
                if (docContent) {
                    docContent.classList.add('fade-in-up');
                }

                return;
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}, url: ${markdownPath}`);
        }
    } catch (error) {
        console.error(`Failed to load document content: ${error}`);
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>文档加载失败</h2>
                    <p>抱歉，该文档不存在或无法访问。</p>
                    <a href="/docs/index.html" class="btn-primary">返回文档列表</a>
                </div>
            `;
        }
    }
}

async function initializeDocsPage() {
    try {
        console.log('Initializing docs page...');
        await loadAllComponents();
        setupMenuEvents();

        const docPath = getDocPathFromUrl();
        console.log('Doc path:', docPath);

        if (docPath === '/docs/index' || docPath === '/docs') {
            console.log('Loading doc list...');
            const allDocs = await fetchDocList();
            console.log('All docs:', allDocs);
            setupLoadMoreDocs(allDocs, 10);

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
            await loadDocContent(docPath);
            setupTocScrollSpy();
            setupSmoothScroll();
        }
    } catch (error) {
        console.error('Failed to initialize documentation page:', error);
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>页面初始化失败</h2>
                    <p>抱歉，文档页面初始化过程中发生错误。</p>
                    <a href="/index.html" class="btn-primary">返回首页</a>
                </div>
            `;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocsPage);
} else {
    initializeDocsPage();
}
