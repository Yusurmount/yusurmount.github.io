/**
 * 联系页面入口文件
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
 * 初始化联系表单验证
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // 添加表单提交事件监听
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 简单的表单验证
            if (validateForm()) {
                // 模拟表单提交
                submitForm();
            }
        });
        
        // 添加表单字段的实时验证
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    }
}

/**
 * 验证单个表单字段
 * @param {HTMLInputElement|HTMLTextAreaElement} field - 表单字段元素
 * @returns {boolean} - 验证结果
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    
    // 清除之前的错误状态
    field.classList.remove('error');
    
    // 根据字段类型进行验证
    switch(fieldName) {
        case 'name':
            if (fieldValue.length < 2) {
                field.classList.add('error');
                return false;
            }
            break;
            
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(fieldValue)) {
                field.classList.add('error');
                return false;
            }
            break;
            
        case 'subject':
            if (fieldValue.length < 3) {
                field.classList.add('error');
                return false;
            }
            break;
            
        case 'message':
            if (fieldValue.length < 10) {
                field.classList.add('error');
                return false;
            }
            break;
    }
    
    return true;
}

/**
 * 验证整个表单
 * @returns {boolean} - 表单验证结果
 */
function validateForm() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * 模拟表单提交
 */
function submitForm() {
    const contactForm = document.getElementById('contactForm');
    
    // 显示加载状态
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '发送中...';
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 重置表单
        contactForm.reset();
        
        // 恢复按钮状态
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // 显示成功消息
        showSuccessMessage();
        
        console.log('表单提交成功');
    }, 1500);
}

/**
 * 显示表单提交成功消息
 */
function showSuccessMessage() {
    // 检查是否已经存在成功消息元素
    let successMessage = document.querySelector('.form-success');
    
    if (!successMessage) {
        // 创建成功消息元素
        successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>消息发送成功！我们会尽快回复您。</span>
        `;
        
        // 添加到表单容器
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.appendChild(successMessage);
    }
    
    // 显示成功消息
    successMessage.classList.add('show');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

/**
 * 初始化联系页面
 */
async function initializeContactPage() {
    // 加载所有基础组件
    await loadAllComponents();
    
    // 设置菜单事件处理
    setupMenuEvents();
    
    // 设置联系表单
    setupContactForm();
    
    console.log('Contact page initialized');
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactPage);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    initializeContactPage();
}