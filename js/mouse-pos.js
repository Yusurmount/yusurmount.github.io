// MD3 按钮交互效果 - 支持点击波纹和悬停状态
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有MD3按钮元素
    const buttons = document.querySelectorAll('.button');

    if (!buttons.length) return; // 没有按钮时退出

    // 为每个按钮添加交互事件
    buttons.forEach(button => {
        // 点击波纹效果
        button.addEventListener('click', createRippleEffect);
        
        // 悬停状态效果
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
    });

    /**
     * 创建MD3风格的点击波纹效果
     * @param {MouseEvent} e - 鼠标事件对象
     */
    function createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 设置波纹位置CSS变量
        button.style.setProperty('--md3-ripple-x', `${x}px`);
        button.style.setProperty('--md3-ripple-y', `${y}px`);

        // 触发波纹动画
        button.classList.add('md3-ripple-active');
        setTimeout(() => button.classList.remove('md3-ripple-active'), 600);
    }

    /**
     * 处理鼠标悬停进入事件
     * @param {MouseEvent} e - 鼠标事件对象
     */
    function handleMouseEnter(e) {
        e.currentTarget.classList.add('md3-hover');
    }

    /**
     * 处理鼠标悬停离开事件
     * @param {MouseEvent} e - 鼠标事件对象
     */
    function handleMouseLeave(e) {
        e.currentTarget.classList.remove('md3-hover');
    }
});