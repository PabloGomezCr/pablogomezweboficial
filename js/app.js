import { initNavbar } from './modules/navbar.js';
import { initSearch } from './modules/search.js';
import { initModal } from './modules/modal.js';
import { initCarousel } from './modules/carousel.js';
import { initEvents } from './modules/events.js';
import { initGallery } from './modules/gallery.js';
import { getSocialMetrics } from './services/social-api.js';
import { initSharedComponents } from './components/shared-components.js';

function formatFollowers(value) {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0
  }).format(value);
}

async function initSocialMetrics() {
  const instagram = document.querySelector('#instagram-followers');
  const tiktok = document.querySelector('#tiktok-followers');
  const status = document.querySelector('#social-status');

  if (!instagram || !tiktok || !status) return;

  status.textContent = 'Actualizando métricas…';

  const data = await getSocialMetrics();

  instagram.textContent = formatFollowers(data.instagram.followers);
  tiktok.textContent = formatFollowers(data.tiktok.followers);

  if (data.source === 'manual') {
    status.textContent = '';
    return;
  }

  const updated = new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(data.updatedAt));

  const sourceLabel = data.source === 'api'
    ? 'Datos obtenidos desde endpoint seguro'
    : 'Datos guardados en caché local';

  status.textContent = `${sourceLabel} · Última actualización: ${updated}`;
}

function preventPlaceholderSocialLinks() {
  document.querySelectorAll('.footer-social a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
}

function init() {
  initSharedComponents();
  initNavbar();
  initSearch();
  initModal();
  preventPlaceholderSocialLinks();

  const page = document.documentElement.dataset.page;

  if (page === 'inicio') {
    initCarousel();
    initSocialMetrics();
  }

  if (page === 'eventos') {
    initEvents();
  }

  if (page === 'galeria') {
    initGallery();
  }
}

document.addEventListener('DOMContentLoaded', init);
