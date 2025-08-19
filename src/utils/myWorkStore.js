// Simple localStorage-backed store for lyrics and takes.
// Shape: { items: [{ id, type, title, content, duration, beatName, updatedAt }] }

const KEY = "bargod.mywork.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getAll() {
  return load().items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function upsertLyric({ id, title, content }) {
  const db = load();
  const now = new Date().toISOString();
  if (!id) id = uid();
  const idx = db.items.findIndex((x) => x.id === id);
  const item = { id, type: "lyric", title: title || "Untitled Lyric", content: content || "", updatedAt: now };
  if (idx === -1) db.items.push(item);
  else db.items[idx] = { ...db.items[idx], ...item };
  save(db);
  return id;
}

export function upsertTake({ id, title, duration, beatName }) {
  const db = load();
  const now = new Date().toISOString();
  if (!id) id = uid();
  const idx = db.items.findIndex((x) => x.id === id);
  const item = { id, type: "take", title: title || "Untitled Take", duration: duration || 0, beatName: beatName || "", updatedAt: now };
  if (idx === -1) db.items.push(item);
  else db.items[idx] = { ...db.items[idx], ...item };
  save(db);
  return id;
}

export function removeItem(id) {
  const db = load();
  db.items = db.items.filter((x) => x.id !== id);
  save(db);
}

export function getById(id) {
  return load().items.find((x) => x.id === id) || null;
}

/** One-time migration of your existing 'draft-bars' into My Work */
export function migrateDraftBars() {
  const draft = localStorage.getItem("draft-bars");
  if (!draft) return;
  // Avoid duping if already migrated:
  const existing = getAll().some((x) => x.type === "lyric" && x.content === draft);
  if (!existing) {
    upsertLyric({ title: "Draft Bars", content: draft });
  }
}
