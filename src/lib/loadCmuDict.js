// lib/loadCmuDict.js
import { fallbackPhonemes } from "../config/fallbackPhonemes";

let cache = null;

export async function loadCmuDict() {
  if (cache) return cache;

  const stored = localStorage.getItem("cmudict-cache");
  if (stored) {
    try {
      cache = JSON.parse(stored);
      applyFallbackEntries(cache);
      return cache;
    } catch {
      // fail silently and fall back to fetch
    }
  }

  const response = await fetch("https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict-0.7b");
  const text = await response.text();

  const dict = {};
  text.split("\n").forEach((line) => {
    if (!line || line.startsWith(";;;")) return;
    const [word, ...phonemes] = line.trim().split(/\s+/);
    const cleanWord = word.toLowerCase().replace(/\(\d\)/, "");
    dict[cleanWord] = phonemes;
  });

  applyFallbackEntries(dict);

  cache = dict;
  localStorage.setItem("cmudict-cache", JSON.stringify(dict));
  return dict;
}

function applyFallbackEntries(dict) {
  for (const [word, phonemes] of Object.entries(fallbackPhonemes)) {
    dict[word] = phonemes;
  }
}

export function getCmuDict() {
  return cache;
}