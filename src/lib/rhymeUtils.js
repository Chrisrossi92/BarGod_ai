// src/lib/rhymeUtils.js

/**
 * Basic normalization: remove punctuation, lowercase, etc.
 */
export function cleanWord(word) {
  return word
    .toLowerCase()
    .replace(/[^a-z']/gi, "") // keep letters and apostrophes
    .trim();
}

/**
 * Check if two words rhyme based on phoneme suffix match
 * @param {string[]} phonemesA
 * @param {string[]} phonemesB
 * @param {number} depth
 */
export function doTheyRhyme(phonemesA, phonemesB, depth = 2) {
  if (!phonemesA || !phonemesB || phonemesA.length < depth || phonemesB.length < depth)
    return false;

  const endA = phonemesA.slice(-depth).join(" ");
  const endB = phonemesB.slice(-depth).join(" ");
  return endA === endB;
}

/**
 * Assign rhyme buckets to words using phonemes
 * Returns object: { bucketId: [word1, word2, ...] }
 */
export function buildRhymeBuckets(words, getPhonemesFn, depth = 2, internal = false) {
  const buckets = {};

  words.forEach((raw) => {
    const word = cleanWord(raw);
    const phonemes = getPhonemesFn(word);

    if (!phonemes || phonemes.length === 0) return;

    const rhymeKey = phonemes.slice(-depth).join("-");

    if (!buckets[rhymeKey]) buckets[rhymeKey] = [];
    buckets[rhymeKey].push(raw); // use original raw word for matching
  });

  // Remove buckets with only one word (no rhyme group)
  Object.keys(buckets).forEach((key) => {
    if (buckets[key].length < 2) delete buckets[key];
  });

  return buckets;
}
