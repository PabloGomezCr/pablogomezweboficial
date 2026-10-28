import { openImageModal } from './modal.js';
import { storage } from './storage.js';

export const galleryItems = [
  {
    src: 'assets/images/gallery/493669318_23962920409982730_2067176512845344552_n.jpg',
    alt: 'Placeholder para fotografía de galería 1 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'NICCO FOTOGRAFIA',
    location: 'MOTEL PARIS PRIMERAVERA'
  },
  {
    src: 'assets/images/gallery/_DSC2548.jpg',
    alt: 'Placeholder para fotografía de galería 2 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'NICCO FOTOGRAFIA',
    location: 'ESPARZA PLAYGROUND'
  },
  {
    src: 'assets/images/gallery/_DSC2558.jpg',
    alt: 'Placeholder para fotografía de galería 3 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'NICCO FOTOGRAFIA',
    location: 'ESPARZA PLAYGROUND'
  },
  {
    src: 'assets/images/gallery/_DSC8921.jpg',
    alt: 'Placeholder para fotografía de galería 4 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: '[NICCO FOTOGRAFIA',
    location: 'BOULEVARD GASTRONOMICO'
  },
  {
    src: 'assets/images/gallery/_H4A9220 copia.jpg',
    alt: 'Placeholder para fotografía de galería 5 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'MIKE FOTOGRAFIA',
    location: 'SARAS'
  },
  {
    src: 'assets/images/gallery/465086230_18289153402238712_5103149462025517681_n.jpg',
    alt: 'Placeholder para fotografía de galería 6 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'VINCENT BEJARANO',
    location: 'LA ISLA CENTRO COMERCIAL, CANCUN'
  },
  {
    src: 'assets/images/gallery/469623304_18294214873238712_5853932323020931462_n.jpg',
    alt: 'Placeholder para fotografía de galería 6 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'PUERTO TV',
    location: 'PISO 5'
  },
  {
    src: 'assets/images/gallery/485054348_9918347951533212_4950170884593285730_n.jpg',
    alt: 'Placeholder para fotografía de galería 6 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'PAULO PPS',
    location: 'PARQUE MARINO, LA PERLA BRILLA'
  },
  {
    src: 'assets/images/gallery/485897705_9938633702837970_8162075425091859955_n.jpg',
    alt: 'Placeholder para fotografía de galería 6 de Pablo Gómez',
    description: '[AGREGAR DESCRIPCIÓN DE LA FOTOGRAFÍA]',
    photographer: 'RKL FOTOGRAFIA',
    location: 'SET DE FOTOGRAFIA RKL'
  }
];

const galleryStorageKey = 'gallery_items';

export function getGalleryItems() {
  const saved = storage.get(galleryStorageKey, null);
  const items = Array.isArray(saved) ? saved : galleryItems;
  return items.map((item, index) => ({ id: item.id || `gallery-${index + 1}`, ...item }));
}

export function saveGalleryItems(items) {
  return storage.set(galleryStorageKey, items);
}

function createCard(item, index) {
  const article = document.createElement('article');
  article.className = 'gallery-card';

  const button = document.createElement('button');
  button.className = 'gallery-open';
  button.type = 'button';
  button.setAttribute('aria-label', `Abrir fotografía ${index + 1}`);

  const imageWrap = document.createElement('span');
  imageWrap.className = 'gallery-image-wrap';

  const image = document.createElement('img');
  image.src = item.src;
  image.alt = item.alt;
  image.width = 720;
  image.height = 1280;
  image.loading = 'lazy';

  imageWrap.append(image);
  button.append(imageWrap);

  const meta = document.createElement('div');
  meta.className = 'gallery-meta';

  const description = document.createElement('p');
  description.textContent = item.description;

  const photographer = document.createElement('strong');
  photographer.className = 'photographer';
  photographer.textContent = item.photographer;

  const location = document.createElement('small');
  location.textContent = item.location;

  meta.append(description, photographer, location);
  article.append(button, meta);

  button.addEventListener('click', () => {
    openImageModal({
      title: `Fotografía ${index + 1}`,
      ...item,
      sourceElement: article
    });
  });

  return article;
}

export function initGallery() {
  const grid = document.querySelector('#gallery-grid');
  if (!grid) return;

  grid.replaceChildren();
  getGalleryItems().forEach((item, index) => {
    grid.append(createCard(item, index));
  });
}
