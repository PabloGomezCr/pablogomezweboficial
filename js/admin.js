import { initSharedComponents } from './components/shared-components.js';
import { initNavbar } from './modules/navbar.js';
import { initSearch } from './modules/search.js';
import { initModal } from './modules/modal.js';
import { initGalleryAdmin } from './modules/gallery-admin.js';

document.addEventListener('DOMContentLoaded', () => {
  initSharedComponents();
  initNavbar();
  initSearch();
  initModal();
  initGalleryAdmin();
});
