// src/workers/rhymeWorker.js

const VOWELS = /[aeiouy]/;

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function makeRhymeKey(word, depth) {
  const w = normalizeWord(word);
  if (!w) return "";
  const d = Math.max(2, Math.min(depth || 2, 6));
  return w.slice(-d);
}

function makeMultiKey(words, depth) {
  const cleaned = words
    .map((w) => normalizeWord(w))
    .filter((w) => w.length > 0);
  if (!cleaned.length) return "";

  // take last up-to-3 words
  const tail = cleaned.slice(-3);
  const d = Math.max(2, Math.min(depth || 2, 6));
  const parts = tail.map((w) => w.slice(-d));
  const key = parts.join("-");

  // require at least one vowel overall so we don't group on pure consonant junk
  if (!VOWELS.test(key)) return "";
  return key;
}

function analyze(text, depth = 2, multiDepth = 2) {
  const lines = text.split(/\r?\n/);

  const lineInfos = lines.map((raw, index) => {
    const line = normalizeLine(raw);
    if (!line) {
      return {
        index,
        raw,
        text: raw,
        words: [],
        rhymeKey: "",
        multiKey: "",
      };
    }

    const words = line.split(" ");
    const lastWord = words[words.length - 1];

    const rhymeKey = makeRhymeKey(lastWord, depth);
    const multiKey = makeMultiKey(words, multiDepth);

    return {
      index,
      raw,
      text: raw,
      words,
      rhymeKey,
      multiKey,
    };
  });

  // Build group maps
  const multiMap = new Map();
  const singleMap = new Map();

  for (const info of lineInfos) {
    if (info.multiKey) {
      if (!multiMap.has(info.multiKey)) multiMap.set(info.multiKey, []);
      multiMap.get(info.multiKey).push(info.index);
    }
    if (info.rhymeKey) {
      if (!singleMap.has(info.rhymeKey)) singleMap.set(info.rhymeKey, []);
      singleMap.get(info.rhymeKey).push(info.index);
    }
  }

  // Only keep multi groups that have 2+ lines
  const multiGroups = [];
  const lineToMultiGroup = new Map();
  for (const [key, indices] of multiMap.entries()) {
    if (indices.length < 2) continue;
    const id = multiGroups.length;
    multiGroups.push({ id, key, indices });
    indices.forEach((i) => lineToMultiGroup.set(i, id));
  }

  // Build single groups, skipping lines already in a multi group
  const singleGroups = [];
  const lineToSingleGroup = new Map();
  for (const [key, indices] of singleMap.entries()) {
    const remaining = indices.filter((i) => !lineToMultiGroup.has(i));
    if (remaining.length < 2) continue;
    const id = singleGroups.length;
    singleGroups.push({ id, key, indices: remaining });
    remaining.forEach((i) => lineToSingleGroup.set(i, id));
  }

  const resultLines = lineInfos.map((info) => ({
    index: info.index,
    text: info.text,
    multiGroup: lineToMultiGroup.has(info.index)
      ? lineToMultiGroup.get(info.index)
      : -1,
    singleGroup: lineToSingleGroup.has(info.index)
      ? lineToSingleGroup.get(info.index)
      : -1,
  }));

  return {
    lines: resultLines,
    multiGroups,
    singleGroups,
  };
}

self.onmessage = (event) => {
  const { text, depth, multiDepth } = event.data || {};
  const safeText = typeof text === "string" ? text : "";

  const result = analyze(safeText, depth, multiDepth);
  self.postMessage(result);
};
