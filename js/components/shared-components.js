import whatsappIcon from '../../assets/icons/whatsapp.svg?raw';
import facebookIcon from '../../assets/icons/facebook.svg?raw';
import instagramIcon from '../../assets/icons/instagram.svg?raw';
import tiktokIcon from '../../assets/icons/tiktok.svg?raw';
import youtubeIcon from '../../assets/icons/youtube.svg?raw';

const footerIcons = {
  'whatsapp.svg': whatsappIcon,
  'facebook.svg': facebookIcon,
  'instagram.svg': instagramIcon,
  'tiktok.svg': tiktokIcon,
  'youtube.svg': youtubeIcon
};

const navItems = [
  ['inicio', 'Inicio', 'index.html'],
  ['biografia', 'Biografía', 'biografia.html'],
  ['eventos', 'Eventos', 'eventos.html'],
  ['galeria', 'Galería', 'galeria.html']
];

function headerTemplate(activePage) {
  const links = navItems.map(([page, label, href]) => {
    const active = page === activePage ? ' is-active' : '';
    const current = page === activePage ? ' aria-current="page"' : '';
    return `<a class="nav-link${active}"${current} data-nav="${page}" href="${href}">${label}</a>`;
  }).join('');

  return `<nav class="dynamic-nav" aria-label="Navegación principal">
    <a class="brand-mini" href="index.html" aria-label="Pablo Gómez — Inicio">PG</a>
    <div class="nav-links">${links}</div>
    <button class="search-toggle" type="button" aria-label="Abrir buscador" aria-expanded="false" aria-controls="global-search"><img src="assets/icons/search.svg" alt="" width="22" height="22"></button>
  </nav>
  <section class="search-panel" id="global-search" aria-label="Buscador global" hidden>
    <div class="search-field">
      <label class="sr-only" for="site-search">Buscar en el sitio</label>
      <input id="site-search" type="search" autocomplete="off" placeholder="Buscar Pablo, 2026, eventos, @...">
      <button class="search-close" type="button" aria-label="Cerrar buscador">×</button>
    </div>
    <p class="search-hint">Busca títulos, secciones, eventos, números y palabras clave.</p>
    <div id="search-results" class="search-results" role="listbox" aria-live="polite"></div>
  </section>`;
}

function footerTemplate() {
  const socials = [
    ['https://wa.me/50664774940', 'WhatsApp', 'whatsapp.svg'],
    ['https://www.facebook.com/bejarano.gomez1', 'Facebook', 'facebook.svg'],
    ['https://www.instagram.com/palolo_gomez/', 'Instagram', 'instagram.svg'],
    ['https://www.tiktok.com/@palolo_gomez?is_from_webapp=1&sender_device=pc', 'TikTok', 'tiktok.svg'],
    ['https://www.youtube.com/@Palolo_Gomez', 'YouTube', 'youtube.svg']
  ];
  const socialLinks = socials.map(([href, label, icon]) => {
    const svg = footerIcons[icon]
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
      .replaceAll('#c8a96b', 'currentColor');
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${svg}<span>${label}</span></a>`;
  }).join('');

  return `<div class="footer-grid">
    <div class="footer-social" aria-label="Redes sociales">${socialLinks}</div>
    <div class="footer-copy"><p>© 2026 Pablo Gómez. Todos los derechos reservados.</p></div>
    <div class="footer-legal">
      <button class="text-button" type="button" data-legal="policies">Políticas de uso</button>
      <button class="text-button" type="button" data-legal="terms">Términos y condiciones</button>
    </div>
  </div>`;
}

export function initSharedComponents() {
  const activePage = document.documentElement.dataset.page;
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  const contact = document.querySelector('.floating-contact');

  if (header) header.innerHTML = headerTemplate(activePage);
  if (footer) footer.innerHTML = footerTemplate();
  if (contact) {
    contact.href = 'https://wa.me/50664774940';
    contact.innerHTML = '<span class="contact-spark" aria-hidden="true"></span><img src="assets/icons/whatsapp.svg" alt="" width="26" height="26"><span>Contáctame</span><small>WhatsApp</small>';
  }
}
