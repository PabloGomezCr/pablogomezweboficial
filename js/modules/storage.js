const namespace = 'pg_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`${namespace}${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn(`No fue posible leer LocalStorage: ${key}`, error);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`${namespace}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`No fue posible guardar LocalStorage: ${key}`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`${namespace}${key}`);
    } catch (error) {
      console.warn(`No fue posible eliminar LocalStorage: ${key}`, error);
    }
  }
};
