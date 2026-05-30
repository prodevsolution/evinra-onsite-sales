/* Evinra · Theme toggle (persisted + respects prefers-color-scheme)
   Dispatches `themechange` CustomEvent so charts/widgets can rebuild. */
(function(){
  const KEY  = 'evinra-theme';
  const root = document.documentElement;
  const mql  = window.matchMedia('(prefers-color-scheme: light)');

  // Initialize theme immediately
  const saved = localStorage.getItem(KEY);
  const initialTheme = saved || (mql.matches ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);
  root.dataset.theme = initialTheme;

  function setTheme(next){
    root.setAttribute('data-theme', next);
    root.dataset.theme = next;
    localStorage.setItem(KEY, next);
    window.dispatchEvent(new CustomEvent('themechange', {detail:{theme:next}}));
  }

  function bind(){
    const buttons = document.querySelectorAll('[data-toggle-theme]');
    buttons.forEach((btn) => {
      if (btn.__themeBound) return;
      btn.__themeBound = true;
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    });
  }

  bind();
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bind, {once:true});
  }

  mql.addEventListener('change', e => {
    if (!localStorage.getItem(KEY)){
      const theme = e.matches ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      root.dataset.theme = theme;
      window.dispatchEvent(new CustomEvent('themechange'));
    }
  });

  window.Evinra = Object.assign(window.Evinra || {}, { setTheme });
})();
