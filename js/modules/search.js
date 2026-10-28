import { storage } from './storage.js';

const searchIndex = [
  { title: 'Pablo Gómez', type: 'Inicio', page: 'index.html', anchor: 'hero', text: 'Pablo Gómez sitio oficial artista música presentación 2026' },
  { title: 'Live Performances', type: 'Video', page: 'index.html', anchor: 'live', text: 'presentaciones en vivo live videos música' },
  { title: 'El Inicio', type: 'Biografía', page: 'biografia.html', anchor: 'el-inicio', text: 'Pablo Gómez biografía historia inicio artista' },
  { title: 'El Proceso', type: 'Biografía', page: 'biografia.html', anchor: 'el-proceso', text: 'proceso carrera evolución artística' },
  { title: 'Pablo Gómez', type: 'Biografía', page: 'biografia.html', anchor: 'pablo-gomez', text: 'Pablo Gómez actualidad carrera' },
  { title: 'Eventos y presentaciones', type: 'Eventos', page: 'eventos.html', anchor: 'eventos', text: 'eventos conciertos fechas 2026 @evento 123 calendario' },
  { title: 'Booking', type: 'Booking', page: 'eventos.html', anchor: 'booking', text: 'booking contratación contratar Pablo Gómez fecha disponible evento' },
  { title: 'Galería oficial', type: 'Galería', page: 'galeria.html', anchor: 'galeria', text: 'fotografías fotógrafo lugar galería Pablo Gómez' }
];

function normalize(value) {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function createResult(item, index) {
  const link = document.createElement('a');
  link.className = 'search-result';
  link.href = `${item.page}#${item.anchor}`;
  link.setAttribute('role', 'option');
  link.dataset.resultIndex = String(index);

  const heading = document.createElement('strong');
  heading.textContent = item.title;

  const type = document.createElement('span');
  type.textContent = item.type;

  const snippet = document.createElement('small');
  snippet.textContent = item.text;

  link.append(heading, type, snippet);
  return link;
}

export function initSearch() {
  const toggle = document.querySelector('.search-toggle');
  const panel = document.querySelector('#global-search');
  const input = document.querySelector('#site-search');
  const close = document.querySelector('.search-close');
  const results = document.querySelector('#search-results');

  if (!toggle || !panel || !input || !close || !results) return;

  let activeIndex = -1;
  let currentResults = [];

  const closeSearch = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
    toggle.focus();
  };

  const render = () => {
    const query = normalize(input.value);
    results.replaceChildren();
    activeIndex = -1;

    if (!query) {
      const message = document.createElement('p');
      message.className = 'search-empty';
      message.textContent = 'Escribe una palabra, número o término para buscar.';
      results.append(message);
      currentResults = [];
      return;
    }

    currentResults = searchIndex.filter((item) => {
      const haystack = normalize(`${item.title} ${item.type} ${item.text}`);
      return haystack.includes(query);
    });

    if (!currentResults.length) {
      const message = document.createElement('p');
      message.className = 'search-empty';
      message.textContent = `No encontramos resultados para “${input.value.trim()}”.`;
      results.append(message);
      return;
    }

    currentResults.forEach((item, index) => results.append(createResult(item, index)));

    const history = storage.get('search_history', []);
    const term = input.value.trim();
    if (term.length > 1 && !history.includes(term)) {
      storage.set('search_history', [term, ...history].slice(0, 8));
    }
  };

  const moveActive = (direction) => {
    const links = [...results.querySelectorAll('.search-result')];
    if (!links.length) return;

    activeIndex = (activeIndex + direction + links.length) % links.length;
    links.forEach((link, index) => link.classList.toggle('is-keyboard-active', index === activeIndex));
    links[activeIndex].focus();
  };

  toggle.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    if (opening) {
      input.focus();
      render();
    }
  });

  close.addEventListener('click', closeSearch);
  input.addEventListener('input', render);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Escape') {
      closeSearch();
    } else if (event.key === 'Enter' && currentResults.length) {
      event.preventDefault();
      const target = currentResults[Math.max(activeIndex, 0)];
      window.location.href = `${target.page}#${target.anchor}`;
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSearch();
  });
}
