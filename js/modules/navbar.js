export function initNavbar() {
  const nav = document.querySelector('.dynamic-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
