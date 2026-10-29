import { openImageModal } from './modal.js';
import { storage } from './storage.js';

import { galleryItems } from '../../data/gallery.js';
import legacyGallery from '../../data/gallery-legacy.json' with { type: 'json' };
export { galleryItems } from '../../data/gallery.js';

const galleryStorageKey = 'gallery_items';

export function getGalleryItems() {
  const saved = storage.get(galleryStorageKey, null);
  if (!Array.isArray(saved)) return galleryItems.map((item) => ({ ...item }));
  if (storage.get('gallery_catalog_version', 0) < 1) {
    // One-time import: keep custom edits and existing IDs; add missing source photos.
    const merged = saved.map((item) => {
      const source = galleryItems.find(({ src }) => src === item.src);
      const old = legacyGallery.find(({ src }) => src === item.src);
      if (!source) return item;
      const updated = { ...source, ...item, thumbnailSrc: source.thumbnailSrc };
      for (const field of ['alt', 'description', 'photographer', 'location']) {
        if (!item[field] || item[field] === old?.[field]
          || (field === 'alt' && item[field].startsWith('Placeholder para fotografía de galería'))) {
          updated[field] = source[field];
        }
      }
      return updated;
    });
    const missing = galleryItems.filter((source) => !saved.some(({ src }) => src === source.src));
    const result = [...merged, ...missing];
    if (storage.set(galleryStorageKey, result)) storage.set('gallery_catalog_version', 1);
    return result;
  }
  return saved.map((item, index) => ({ id: item.id || `gallery-${index + 1}`, ...item }));
}

export function saveGalleryItems(items) {
  const saved = storage.set(galleryStorageKey, items);
  if (saved) storage.set('gallery_catalog_version', 1);
  return saved;
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
  image.src = item.thumbnailSrc || item.src;
  image.alt = item.alt;
  image.width = 720;
  image.height = 1280;
  image.loading = 'lazy';

  imageWrap.append(image);
  button.append(imageWrap);

  const meta = document.createElement('div');
  meta.className = 'gallery-meta';

  const photographer = document.createElement('strong');
  photographer.className = 'photographer';
  photographer.textContent = item.photographer;

  const location = document.createElement('small');
  location.textContent = item.location;

  meta.append(photographer, location);
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
