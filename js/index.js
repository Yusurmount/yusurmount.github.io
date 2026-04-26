/**
 * 主页入口文件
 */

import { loadAllComponents, setupMenuEvents, loadComponent } from './components.js';

async function initializeApp() {
    await loadAllComponents();
    setupMenuEvents();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
