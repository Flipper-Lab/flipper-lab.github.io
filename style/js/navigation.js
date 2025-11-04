class Navigation {
  constructor() {
      this.sidebar = null;
      this.mobileMenuToggle = null;
      this.mobileOverlay = null;
      this.sidebarClose = null;
      this.init();
  }

  init() {
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              this.setupNavigation();
          });
      } else {
          this.setupNavigation();
      }
  }

  setupNavigation() {
      this.setupMobileMenu();
      this.setupNavLinks();
      this.setupSectionToggles();
      this.setupGlobalHotkeys();
      this.setupContentLinks();
      this.restoreSectionState();
  }

  setupMobileMenu() {
      this.sidebar = document.getElementById('sidebar');
      this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
      this.mobileOverlay = document.getElementById('mobileOverlay');
      this.sidebarClose = document.getElementById('sidebarClose');

      if (this.mobileMenuToggle) {
          this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
      }

      if (this.mobileOverlay) {
          this.mobileOverlay.addEventListener('click', () => this.hideMobileMenu());
      }

      if (this.sidebarClose) {
          this.sidebarClose.addEventListener('click', () => this.hideMobileMenu());
      }

      document.addEventListener('click', (e) => {
          if (window.innerWidth <= 920 && e.target.closest('.nav a')) {
              this.hideMobileMenu();
          }
      });

      window.addEventListener('resize', () => this.handleResize());
  }

  toggleMobileMenu() {
      if (this.sidebar && this.mobileOverlay) {
          this.sidebar.classList.toggle('active');
          this.mobileOverlay.classList.toggle('active');
          document.body.style.overflow = this.sidebar.classList.contains('active') ? 'hidden' : '';
      }
  }

  hideMobileMenu() {
      if (this.sidebar && this.mobileOverlay) {
          this.sidebar.classList.remove('active');
          this.mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
      }
  }

  showMobileMenu() {
      if (this.sidebar && this.mobileOverlay) {
          this.sidebar.classList.add('active');
          this.mobileOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
      }
  }

  handleResize() {
      if (window.innerWidth > 920) {
          this.hideMobileMenu();
      }
  }

  setupNavLinks() {
      document.addEventListener('click', (e) => {
          const link = e.target.closest('.nav a');
          if (link) {
              e.preventDefault();
              const path = link.getAttribute('data-path');
              if (path && window.router) {
                  window.router.navigateTo(path);
              }
          }
      });
  }

  setupSectionToggles() {
      document.addEventListener('click', (e) => {
          const header = e.target.closest('.section-header');
          if (header) {
              e.preventDefault();
              this.toggleSection(header);
          }
      });
  }

  toggleSection(header) {
      const section = header.parentElement;
      
      section.classList.toggle('collapsed');
      
      this.saveSectionState(section, header.getAttribute('data-section'));
  }

  highlightActiveSection(activeLink) {
      if (!activeLink) return;

      document.querySelectorAll('.nav-section').forEach(section => {
          section.classList.remove('active-section');
      });
      
      const parentSection = activeLink.closest('.nav-section');
      if (parentSection) {
          parentSection.classList.add('active-section');
          
          parentSection.classList.remove('collapsed');
      }
  }

  saveSectionState(section, sectionId) {
      const isCollapsed = section.classList.contains('collapsed');
      const state = JSON.parse(localStorage.getItem('sectionStates') || '{}');
      state[sectionId] = isCollapsed;
      localStorage.setItem('sectionStates', JSON.stringify(state));
  }

  restoreSectionState() {
      const state = JSON.parse(localStorage.getItem('sectionStates') || '{}');
      
      Object.keys(state).forEach(sectionId => {
          const section = document.querySelector(`[data-section="${sectionId}"]`)?.parentElement;
          if (section && state[sectionId]) {
              section.classList.add('collapsed');
          }
      });
    }

  setupContentLinks() {
      document.addEventListener('click', (e) => {
          if (e.target.matches('#appContent a')) {
              const href = e.target.getAttribute('href');
              if (href && href.startsWith('#/')) {
                  e.preventDefault();
                  const path = href.replace('#/', '');
                  if (window.router) {
                      window.router.navigateTo(path);
                  }
              }
          }
      });
  }

  setupGlobalHotkeys() {
      document.addEventListener('keydown', (e) => {
          // Alt + ← для навигации назад
          if (e.altKey && e.key === 'ArrowLeft') {
              e.preventDefault();
              window.history.back();
          }
          // Alt + → для навигации вперед
          if (e.altKey && e.key === 'ArrowRight') {
              e.preventDefault();
              window.history.forward();
          }
          // Ctrl + K для фокуса на поиске
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
              e.preventDefault();
              const searchInput = document.getElementById('searchInput');
              if (searchInput) {
                  searchInput.focus();
                  searchInput.select();
              }
          }

          if (e.key === 'Escape' && window.innerWidth <= 920) {
              this.hideMobileMenu();
          }
      });
  }

  expandAllSections() {
      document.querySelectorAll('.nav-section.collapsed').forEach(section => {
          section.classList.remove('collapsed');
      });
  }

  collapseAllSections() {
      document.querySelectorAll('.nav-section:not(.collapsed)').forEach(section => {
          section.classList.add('collapsed');
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();
});