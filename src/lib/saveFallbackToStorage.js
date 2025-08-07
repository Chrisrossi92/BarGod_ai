// lib/saveFallbackToStorage.js

export function saveFallbackOverride(overrideObject) {
  try {
    const stored = localStorage.getItem("cmudict-cache");
    if (!stored) return false;

    const dict = JSON.parse(stored);

    for (const [word, phonemes] of Object.entries(overrideObject)) {
      dict[word.toLowerCase()] = phonemes;
    }

    localStorage.setItem("cmudict-cache", JSON.stringify(dict));
    return true;
  } catch (err) {
    console.error("Failed to save fallback override:", err);
    return false;
  }
}