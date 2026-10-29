import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { galleryItems } from '../data/gallery.js';
globalThis.window = { matchMedia: () => ({ matches: false }) };
const { getGalleryItems, saveGalleryItems } = await import('../js/modules/gallery.js');

const provenance = JSON.parse(readFileSync('data/gallery-provenance.json', 'utf8'));
const legacy = JSON.parse(readFileSync('data/gallery-legacy.json', 'utf8'));
let store = {};
globalThis.localStorage = { getItem: (key) => store[key] ?? null, setItem: (key, value) => { store[key] = value; } };

test('31 unique source photographs, preserved original bytes, descriptions and previews', () => {
  assert.equal(galleryItems.length, 31);
  assert.equal(new Set(galleryItems.map((i) => i.src)).size, 31);
  assert.equal(new Set(galleryItems.map((i) => i.id)).size, 31);
  for (const item of galleryItems) {
    assert(existsSync(item.src));
    assert(existsSync(item.thumbnailSrc));
    const record = provenance.items.find((r) => item.src.endsWith('/' + r.file));
    assert.equal(createHash('sha256').update(readFileSync(item.src)).digest('hex'), record.sha256);
    assert.equal(item.photographer, record.photographer);
    assert.equal(item.location, record.location);
    assert(!/placeholder|AGREGAR/i.test(item.alt + item.description));
  }
});

test('local catalog migration preserves edited fields and adds missing source items once', () => {
  store = { pg_gallery_items: JSON.stringify([{ ...legacy[0], id: 'custom-id', description: 'Mi descripción editada' }]) };
  const items = getGalleryItems();
  assert.equal(items.length, 31);
  assert.equal(items[0].id, 'custom-id');
  assert.equal(items[0].description, 'Mi descripción editada');
  assert(!items[0].alt.startsWith('Placeholder'));
  saveGalleryItems(items.slice(1));
  assert.equal(getGalleryItems().length, 30); // Respect deletion; do not re-add on subsequent loads.
});
