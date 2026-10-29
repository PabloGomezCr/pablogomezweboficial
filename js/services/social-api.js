import { storage } from '../modules/storage.js';

const MANUAL_DATA = {
  instagram: { followers: 1994 },
  tiktok: { followers: 1362 },
  source: 'manual'
};

function getEndpoint() {
  return document.querySelector('meta[name="social-api-endpoint"]')?.content.trim() || '';
}

function isValidPayload(payload) {
  return Number.isFinite(payload?.instagram?.followers)
    && Number.isFinite(payload?.tiktok?.followers);
}

export async function getSocialMetrics() {
  const endpoint = getEndpoint();
  if (!endpoint) return MANUAL_DATA;

  if (endpoint) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const payload = await response.json();
      if (!isValidPayload(payload)) throw new Error('Respuesta social inválida');

      const safeData = {
        instagram: { followers: Number(payload.instagram.followers) },
        tiktok: { followers: Number(payload.tiktok.followers) },
        updatedAt: payload.updatedAt || new Date().toISOString(),
        source: 'api'
      };

      storage.set('social_cache', safeData);
      return safeData;
    } catch (error) {
      console.warn('No se pudieron actualizar las métricas sociales.', error);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const cached = storage.get('social_cache', null);
  return cached?.source === 'api' && isValidPayload(cached)
    ? { ...cached, source: 'cache' }
    : MANUAL_DATA;
}
