class Router {
  constructor() {
      this.cache = new Map();
      this.contentEl = document.getElementById('appContent');
      this.init();
  }

  init() {
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              this.setupRouter();
          });
      } else {
          this.setupRouter();
      }
  }

  setupRouter() {
      window.addEventListener('hashchange', () => this.handleRoute());
      
      if (!location.hash || location.hash === '#') {
          this.navigateTo('start.html');
      } else {
          setTimeout(() => this.handleRoute(), 10);
      }
  }

  normalizePath(raw) {
      if (!raw || raw === '#') return 'start.html';
      let path = raw.replace(/^#\/?/, '');
      if (path === '' || path === '/') return 'start.html';
      
      if (!path.includes('.') && !path.endsWith('/')) {
          path += '.html';
      }
      return path;
  }

  setActiveLink(path) {
      const links = document.querySelectorAll('.nav a');
      let activeLink = null;
      
      links.forEach(link => {
          const linkPath = link.getAttribute('data-path');
          if (linkPath === path) {
              link.classList.add('active');
              activeLink = link;
              
              const parentSection = link.closest('.nav-section');
              if (parentSection) {
                  parentSection.classList.remove('collapsed');
                  parentSection.classList.add('active-section');
              }
          } else {
              link.classList.remove('active');
          }
      });

      return activeLink;
  }

  createTopbar() {
      const content = document.querySelector('.content');
      const topbar = document.createElement('div');
      topbar.className = 'topbar';
      content.insertBefore(topbar, content.firstChild);
      return topbar;
  }

  async handleRoute() {
      const path = this.normalizePath(location.hash);
      const activeLink = this.setActiveLink(path);
      
      if (activeLink) {
          await this.loadContent(path);
      } else {
          this.showError(path, new Error('Страница не найдена'));
      }
  }

  async loadContent(path) {
      if (!this.contentEl) return;

      this.showLoading();

      try {
          if (this.cache.has(path)) {
              this.contentEl.innerHTML = this.cache.get(path);
              return;
          }

          const response = await fetch(`content/${path}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const html = await response.text();
          if (!html.trim()) throw new Error('Пустой ответ');

          this.cache.set(path, html);
          this.contentEl.innerHTML = html;

          window.scrollTo(0, 0);

      } catch (error) {
          this.showError(path, error);
      }
  }

  showLoading() {
      if (this.contentEl) {
          this.contentEl.innerHTML = `
              <div class="loading-spinner text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Загрузка...</span>
                  </div>
                  <p class="mt-3 text-muted">Загрузка документации...</p>
              </div>
          `;
      }
  }

  showError(path, error) {
      this.contentEl.innerHTML = `
          <div class="error">
              <h3>😕 Не удалось загрузить страницу</h3>
              <p><strong>Путь:</strong> ${path}</p>
              <p><strong>Ошибка:</strong> ${error.message}</p>
              <button onclick="router.loadContent('${path}')" class="retry-btn">
                  Повторить попытку
              </button>
              <button onclick="router.navigateTo('start.html')" class="home-btn">
                  На главную
              </button>
          </div>
      `;
  }

  navigateTo(path) {
      location.hash = `#/${path}`;
  }

  clearCache() {
      this.cache.clear();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.router = new Router();
});