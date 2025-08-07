// hooks/usePhoneticMap.jsx
import React from "react";
import { useMemo } from "react";
import { getPhoneticBuckets } from "../../lib/phonetics";

export default function usePhoneticMap(text, { depth = 2, internal = false } = {}) {
  return useMemo(() => {
    if (!text || typeof text !== "string") return { coloredWords: [], buckets: {} };

    const words = text.trim().split(/\s+/);
    const buckets = getPhoneticBuckets(words, depth, internal);

    const coloredWords = words.map((word, i) => {
      const key = Object.entries(buckets).find(([_, list]) => list.includes(word))?.[0];
      const colorClass = key ? `text-rhyme-${(key.charCodeAt(0) + key.charCodeAt(1)) % 6}` : '';
      const isMatched = key && buckets[key].length > 1;

      return (
        <span key={i} className={`mr-1 ${isMatched ? colorClass + ' font-bold' : ''}`}>
          {word}
        </span>
      );
    });

    return { coloredWords, buckets };
  }, [text, depth, internal]);
}