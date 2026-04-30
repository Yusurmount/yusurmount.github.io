/**
 * 文章页面入口文件
 */

import { loadAllComponents, setupMenuEvents } from './components.js';

async function fetchArticleList() {
    try {
        const response = await fetch('/context/article/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Fetched article JSON text:', text);
        const articles = JSON.parse(text);
        console.log('Parsed articles:', articles);
        return articles.map(article => ({
            ...article,
            url: `/article/${article.name}/index.html`
        }));
    } catch (error) {
        console.error('Failed to fetch article list:', error);
        // 失败时返回硬编码数据作为 fallback
        const fallbackArticles = [
            {
                "name": "welcome",
                "title": "欢迎来到雨夌站",
                "date": "2025-10-05",
                "category": "公告",
                "excerpt": "雨夌站正在重建中，这是一个个人博客、文档与项目展示网站。"
            }
        ];
        console.log('Using fallback articles:', fallbackArticles);
        return fallbackArticles.map(article => ({
            ...article,
            url: `/article/${article.name}/index.html`
        }));
    }
}

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

function setupLoadMore(allArticles, articlesPerPage = 10) {
    const loadMoreButton = document.querySelector('.load-more-button');
    const articleList = document.querySelector('.article-list');

    if (!loadMoreButton || !articleList) return;

    let currentPage = 1;
    let isLoading = false;

    const initialArticles = allArticles.slice(0, articlesPerPage);
    renderArticles(initialArticles, articleList);

    function updateButtonState() {
        const totalPages = Math.ceil(allArticles.length / articlesPerPage);

        if (currentPage >= totalPages || allArticles.length === 0) {
            loadMoreButton.textContent = '没有更多文章了';
            loadMoreButton.disabled = true;
            loadMoreButton.classList.add('disabled');

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

    updateButtonState();

    loadMoreButton.addEventListener('click', async () => {
        if (isLoading) return;

        isLoading = true;
        loadMoreButton.classList.add('loading');
        loadMoreButton.textContent = '加载中...';

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

async function initializeArticleListPage() {
    await loadAllComponents();
    setupMenuEvents();

    const allArticles = await fetchArticleList();
    setupLoadMore(allArticles, 10);

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

function getArticleNameFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const articleIndex = pathParts.indexOf('article');

    if (articleIndex !== -1 && pathParts.length > articleIndex + 1) {
        return pathParts[articleIndex + 1];
    }

    return 'example-article';
}

async function loadArticleContent(articleName) {
    try {
        const markdownPath = `/context/article/${articleName}.md`;
        const response = await fetch(markdownPath);

        if (response.ok) {
            const markdownText = await response.text();
            const htmlContent = marked.parse(markdownText);

            const articleLayout = `
                <div class="doc-layout">
                    <div class="doc-content">
                        <div class="doc-header"></div>
                        <div class="doc-body">${htmlContent}</div>
                    </div>
                </div>
            `;

            const container = document.getElementById('doc-content-container');
            if (container) {
                container.innerHTML = articleLayout;

                const firstHeading = container.querySelector('h1');
                if (firstHeading) {
                    const docHeader = container.querySelector('.doc-header');
                    if (docHeader) {
                        docHeader.innerHTML = `<h1 class="doc-title">${firstHeading.textContent}</h1>`;
                        firstHeading.remove();
                    }
                }

                const headings = container.querySelectorAll('h2, h3, h4, h5, h6');
                headings.forEach((heading, index) => {
                    if (!heading.id) {
                        heading.id = heading.textContent.trim()
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-');
                    }
                });

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
        console.error(`Failed to load article content: ${error}`);
        const container = document.getElementById('doc-content-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>文章加载失败</h2>
                    <p>抱歉，该文章不存在或无法访问。</p>
                    <p>错误详情: ${error.message}</p>
                    <a href="/article/index.html" class="btn-primary">返回文章列表</a>
                </div>
            `;
        }
    }
}

async function initializeArticlePage() {
    await loadAllComponents();
    setupMenuEvents();

    const articleName = getArticleNameFromUrl();
    await loadArticleContent(articleName);
}

if (document.querySelector('.article-list')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeArticleListPage);
    } else {
        initializeArticleListPage();
    }
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeArticlePage);
    } else {
        initializeArticlePage();
    }
}
