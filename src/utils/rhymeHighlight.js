// src/utils/rhymeHighlighter.js
/**
 * tokens = [{ text: string, rhymeGroupId: number|null }]
 * returns: [{ text, isMatch, key }]
 */
export function computeRhymeSpans(tokens = []) {
  return tokens.map((t, i) => ({
    key: `${i}-${t.text}`,
    text: t.text,
    isMatch: t.rhymeGroupId != null,
  }));
}