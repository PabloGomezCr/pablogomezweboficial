import { getGalleryItems, saveGalleryItems } from './gallery.js';

const sessionKey = 'pg_admin_authenticated';
const demoPassword = 'PG2026';

function isAuthenticated() {
  return sessionStorage.getItem(sessionKey) === 'true';
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', reject);
    reader.readAsDataURL(file);
  });
}

function renderAdminGallery() {
  const list = document.querySelector('#admin-gallery-list');
  if (!list) return;
  list.replaceChildren();

  getGalleryItems().forEach((item) => {
    const card = document.createElement('article');
    card.className = 'admin-gallery-card';
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = '';
    const meta = document.createElement('div');
    const photographer = document.createElement('strong');
    const location = document.createElement('p');
    photographer.textContent = item.photographer;
    location.textContent = item.location;
    meta.append(photographer, location);
    const actions = document.createElement('div');
    actions.className = 'admin-card-actions';
    const edit = document.createElement('button');
    edit.className = 'text-button';
    edit.type = 'button';
    edit.dataset.edit = item.id;
    edit.textContent = 'Editar';
    const remove = document.createElement('button');
    remove.className = 'text-button danger';
    remove.type = 'button';
    remove.dataset.delete = item.id;
    remove.textContent = 'Eliminar';
    actions.append(edit, remove);
    card.append(image, meta, actions);
    list.append(card);
  });
}

function showPanel() {
  document.querySelector('#admin-login').hidden = true;
  document.querySelector('#admin-panel').hidden = false;
  renderAdminGallery();
}

export function initGalleryAdmin() {
  const login = document.querySelector('#admin-login-form');
  const form = document.querySelector('#gallery-admin-form');
  const list = document.querySelector('#admin-gallery-list');
  const status = document.querySelector('#admin-status');
  if (!login || !form || !list || !status) return;

  if (isAuthenticated()) showPanel();

  login.addEventListener('submit', (event) => {
    event.preventDefault();
    const password = new FormData(login).get('password');
    if (password !== demoPassword) {
      document.querySelector('#login-status').textContent = 'Clave incorrecta.';
      return;
    }
    sessionStorage.setItem(sessionKey, 'true');
    showPanel();
  });

  document.querySelector('#admin-logout').addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    location.reload();
  });

  document.querySelector('#admin-cancel').addEventListener('click', () => {
    form.reset();
    form.elements.id.value = '';
    form.elements.currentSrc.value = '';
    status.textContent = '';
  });

  list.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit]');
    const deleteButton = event.target.closest('[data-delete]');
    const items = getGalleryItems();

    if (editButton) {
      const item = items.find(({ id }) => id === editButton.dataset.edit);
      if (!item) return;
      Object.entries(item).forEach(([key, value]) => {
        if (form.elements[key] && key !== 'src') form.elements[key].value = value;
      });
      form.elements.currentSrc.value = item.src;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (deleteButton && window.confirm('¿Eliminar esta fotografía de la galería?')) {
      saveGalleryItems(items.filter(({ id }) => id !== deleteButton.dataset.delete));
      renderAdminGallery();
      status.textContent = 'Fotografía eliminada.';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const file = data.get('image');
    const currentSrc = data.get('currentSrc');

    if (file?.size > 1_500_000) {
      status.textContent = 'La imagen debe pesar menos de 1.5 MB para guardarse localmente.';
      return;
    }

    const src = file?.size ? await fileToDataUrl(file) : currentSrc;
    if (!src) {
      status.textContent = 'Selecciona una imagen.';
      return;
    }

    const item = {
      id: data.get('id') || `gallery-${Date.now()}`,
      src,
      alt: data.get('alt').trim(),
      description: data.get('description').trim(),
      photographer: data.get('photographer').trim(),
      location: data.get('location').trim()
    };
    const items = getGalleryItems();
    const existingIndex = items.findIndex(({ id }) => id === item.id);
    if (existingIndex >= 0) items[existingIndex] = item;
    else items.unshift(item);

    if (!saveGalleryItems(items)) {
      status.textContent = 'No hubo espacio suficiente en el navegador para guardar la imagen.';
      return;
    }

    form.reset();
    form.elements.id.value = '';
    form.elements.currentSrc.value = '';
    status.textContent = existingIndex >= 0 ? 'Fotografía actualizada.' : 'Fotografía agregada.';
    renderAdminGallery();
  });
}
