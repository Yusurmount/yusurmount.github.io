/**
 * Client-side router for seamless page transitions
 * Implements MD3 navigation with no page refresh
 */
class Router {
  constructor() {
    this.routes = {};
    this.contentContainer = document.getElementById('content-container');
    
    // Initialize router
    this.init();
  }
  
  /**
   * Initialize router event listeners
   */
  init() {
    // Handle navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        e.preventDefault();
        this.navigateTo(link.getAttribute('href'));
      }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
    
    // Initial route handling
    this.handleRouteChange();
  }
  
  /**
   * Define a route and its handler
   * @param {string} path - The route path
   * @param {Function} handler - The function to execute when route is matched
   */
  route(path, handler) {
    this.routes[path] = handler;
  }
  
  /**
   * Navigate to a specific path
   * @param {string} path - The path to navigate to
   */
  navigateTo(path) {
    // Update URL without page reload
    history.pushState({}, '', path);
    
    // Handle the route change
    this.handleRouteChange();
    
    // Update active nav item
    this.updateActiveNavItem(path);
    
    // Close mobile drawer if open
    const drawer = document.querySelector('md-drawer');
    if (drawer && drawer.open) {
      drawer.open = false;
    }
  }
  
  /**
   * Handle route changes and load appropriate content
   */
  handleRouteChange() {
    const path = window.location.pathname || '/';
    const handler = this.routes[path] || this.routes['404'];
    
    if (handler) {
      handler();
    }
  }
  
  /**
   * Update active navigation item based on current path
   * @param {string} path - Current path
   */
  updateActiveNavItem(path) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current path's nav item
    const activeItem = document.querySelector(`.nav-item[href="${path}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
  
  /**
   * Load page content from HTML file
   * @param {string} page - Page name to load
   */
  async loadPage(page) {
    try {
      // Show loading state
      this.contentContainer.innerHTML = '<div class="loading">Loading...</div>';
      
      // Fetch page content
      const response = await fetch(`/pages/${page}.html`);
      
      if (!response.ok) {
        throw new Error('Page not found');
      }
      
      const html = await response.text();
      
      // Add fade-in animation
      this.contentContainer.style.opacity = '0';
      
      setTimeout(() => {
        // Update content
        this.contentContainer.innerHTML = html;
        
        // Fade back in
        this.contentContainer.style.opacity = '1';
      }, 200);
      
    } catch (error) {
      this.contentContainer.innerHTML = '<div class="error">Page not found</div>';
      console.error('Error loading page:', error);
    }
  }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  
  // Define routes
  router.route('/', () => router.loadPage('home'));
  router.route('/about', () => router.loadPage('about'));
  router.route('/blog', () => router.loadPage('blog'));
  router.route('/contact', () => router.loadPage('contact'));
  router.route('404', () => router.loadPage('404'));
  
  // Add CSS for transitions
  const style = document.createElement('style');
  style.textContent = `
    #content-container {
      transition: opacity 0.2s ease-in-out;
    }
    .loading, .error {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      color: var(--md-sys-color-on-surface);
    }
  `;
  document.head.appendChild(style);
});