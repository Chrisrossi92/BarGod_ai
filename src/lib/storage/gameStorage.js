function getLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function cloneFallback(fallback) {
  if (Array.isArray(fallback)) return [...fallback];
  if (fallback && typeof fallback === "object") return { ...fallback };
  return fallback;
}

export function getItem(key) {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getJson(key, fallback = null) {
  const raw = getItem(key);
  if (raw == null) return cloneFallback(fallback);

  try {
    return JSON.parse(raw);
  } catch {
    return cloneFallback(fallback);
  }
}

export function setJson(key, value) {
  try {
    return setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export default {
  getItem,
  setItem,
  removeItem,
  getJson,
  setJson,
};
