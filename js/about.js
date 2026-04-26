/**
 * 关于页面入口文件
 */

import { loadAllComponents, setupMenuEvents } from './components.js';

async function initializeAboutPage() {
    await loadAllComponents();
    setupMenuEvents();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAboutPage);
} else {
    initializeAboutPage();
}
