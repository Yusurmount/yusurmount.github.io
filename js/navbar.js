// js/navbar.js
// 加载导航栏并实现无缝页面切换
fetch('/elements/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        // 为所有导航链接添加点击事件监听器
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.getAttribute('href');
                loadPage(url);
            });
        });
    });

// 加载页面内容的函数
function loadPage(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            // 解析HTML并提取主内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('.main-content');
            
            if (newContent) {
                // 替换主内容
                document.querySelector('.main-content').innerHTML = newContent.innerHTML;
                // 更新页面标题
                document.title = doc.title;
                // 更新URL
                history.pushState({}, '', url);
                // 滚动到顶部
                window.scrollTo(0, 0);
            } else {
                console.error('页面中未找到.main-content元素');
                // 如果没有找到主内容，进行常规跳转
                window.location.href = url;
            }
        })
        .catch(error => {
            console.error('加载页面时出错:', error);
            // 出错时进行常规跳转
            window.location.href = url;
        });
}

// 处理浏览器前进/后退按钮
window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
});