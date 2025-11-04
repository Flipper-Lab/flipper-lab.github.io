(function() {
    function initApp() {
      console.log('Docs initializing...');
      
      if (!window.router) {
        console.error('Router not found!');
        return;
      }
  
      if (!location.hash || location.hash === '#') {
        window.router.navigateTo('start.html');
      } else {
        window.router.router();
      }
  
      window.showLoading = function() {
        const contentEl = document.getElementById('appContent');
        if (contentEl) {
          contentEl.innerHTML = '<div class="loading">Загрузка...</div>';
        }
      };
  
      console.log('Docs initialized');
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  })();