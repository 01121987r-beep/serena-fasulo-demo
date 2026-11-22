// I collegamenti diretti alle sezioni e il ritorno dal blog portano al contenuto richiesto.
(() => {
  const intro = document.getElementById('paper-intro');
  if (location.hash || performance.getEntriesByType('navigation')[0]?.type === 'back_forward'
      || typeof intro.showModal !== 'function') return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let exitTimer;
  let closeTimer;
  function enterSite() {
    clearTimeout(exitTimer);
    clearTimeout(closeTimer);
    if (!intro.open) return;
    intro.close();
    document.getElementById('hero-name')?.focus({ preventScroll: true });
  }
  intro.querySelector('button').addEventListener('click', enterSite);
  intro.addEventListener('cancel', event => {
    event.preventDefault();
    enterSite();
  });
  window.addEventListener('pagehide', enterSite, { once: true });
  window.addEventListener('hashchange', enterSite, { once: true });

  intro.showModal();
  exitTimer = setTimeout(() => {
    if (motion.matches) return enterSite();
    intro.classList.add('leaving');
    closeTimer = setTimeout(enterSite, 430);
  }, motion.matches ? 1600 : 4350);
})();
