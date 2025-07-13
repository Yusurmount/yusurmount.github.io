// 获取所有按钮元素
const buttons = document.querySelectorAll('.button');

// 为每个按钮添加点击事件
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 获取鼠标点击位置相对于按钮的坐标
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 将坐标设置为 CSS 变量
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});