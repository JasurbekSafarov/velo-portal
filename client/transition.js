// Fade the page out before following a link to another page of the site.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  e.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(() => { location.href = url.href; }, 220);
});
addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('leaving'); });
