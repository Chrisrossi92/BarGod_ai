// lib/phonetics.js
import { loadCmuDict } from "./loadCmuDict";
import { cleanWord } from "./rhymeUtils";

let cmudict = {};

export async function initPhonetics() {
  cmudict = await loadCmuDict();
}

export function getPhonemes(word) {
  if (!cmudict || Object.keys(cmudict).length === 0) return null;
  const cleaned = cleanWord(word);
  return cmudict[cleaned] || null;
}

export function getPhonemeEnding(word, depth = 2) {
  const phones = getPhonemes(word);
  if (!phones) return null;
  return phones.slice(-depth).join("-");
}

export function getPhonemeWindows(word, windowSize = 2) {
  const phones = getPhonemes(word);
  if (!phones || phones.length < windowSize) return [];
  const windows = [];
  for (let i = 0; i <= phones.length - windowSize; i++) {
    windows.push(phones.slice(i, i + windowSize).join("-"));
  }
  return windows;
}

export function getPhoneticBuckets(words, depth = 2, internal = false) {
  const buckets = {};

  words.forEach((word) => {
    const keys = internal ? getPhonemeWindows(word, depth) : [getPhonemeEnding(word, depth)];
    keys.forEach((key) => {
      if (!key) return;
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(word);
    });
  });

  // 🚫 Remove orphan buckets (only one word = not a rhyme)
  for (const key in buckets) {
    if (buckets[key].length < 2) {
      delete buckets[key];
    }
  }

  return buckets;
}

