class Search {
  constructor() {
      this.init();
  }

  init() {
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
              this.setupSearch();
          });
      } else {
          this.setupSearch();
      }
  }

  setupSearch() {
      this.searchInput = document.getElementById('searchInput');
      this.navList = document.querySelector('.menu');
      
      if (!this.searchInput || !this.navList) {
          return;
      }

      this.buildSearchIndex();
      this.setupEventListeners();
  }

  buildSearchIndex() {
      const links = document.querySelectorAll('.nav a');
      this.searchIndex = Array.from(links).map(link => ({
          element: link,
          text: link.textContent.toLowerCase(),
          path: link.getAttribute('data-path'),
          section: link.closest('.nav-section')?.querySelector('.section-title')?.textContent || 'Unknown'
      }));
  }

  setupEventListeners() {
      this.searchInput.addEventListener('input', this.debounce(() => {
          this.filterNavigation(this.searchInput.value.trim());
      }, 300));

      this.searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              this.clearSearch();
          }
      });

      const clearBtn = this.searchInput.parentElement.querySelector('.search-clear');
      if (clearBtn) {
          clearBtn.addEventListener('click', () => this.clearSearch());
      }
  }

  filterNavigation(query) {
      const searchTerm = query.toLowerCase();
      let hasVisibleItems = false;

      this.searchIndex.forEach(item => {
          item.element.parentElement.style.display = 'none';
      });

      this.searchIndex.forEach(item => {
          const isVisible = !searchTerm || 
              item.text.includes(searchTerm) || 
              item.section.toLowerCase().includes(searchTerm);
          
          if (isVisible) {
              item.element.parentElement.style.display = '';
              hasVisibleItems = true;
              
              const parentSection = item.element.closest('.nav-section');
              if (parentSection) {
                  parentSection.classList.remove('collapsed');
              }
              
              this.highlightText(item.element, searchTerm);
          }
      });

      this.toggleNoResultsMessage(!hasVisibleItems && searchTerm);
  }

  highlightText(element, query) {
      if (!query) return;
      
      const text = element.textContent;
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      element.innerHTML = text.replace(regex, '<mark>$1</mark>');
  }

  removeHighlight(element) {
      element.innerHTML = element.textContent;
  }

  toggleNoResultsMessage(show) {
      let message = document.getElementById('noResultsMessage');
      
      if (show && !message) {
          message = document.createElement('div');
          message.id = 'noResultsMessage';
          message.className = 'no-results';
          message.textContent = 'Ничего не найдено';
          this.navList.appendChild(message);
      } else if (!show && message) {
          message.remove();
      }
  }

  clearSearch() {
      this.searchInput.value = '';
      this.filterNavigation('');
      this.searchInput.focus();
      
      this.searchIndex.forEach(item => {
          item.element.parentElement.style.display = '';
          this.removeHighlight(item.element);
      });
      
      this.toggleNoResultsMessage(false);
  }

  debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }

  escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.search = new Search();
});