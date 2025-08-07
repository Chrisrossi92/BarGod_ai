import React from "react";

export default function RhymeFamilyLegend({ buckets }) {
  if (!buckets || Object.keys(buckets).length === 0) return null;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-6">
      <h3 className="text-white text-lg font-semibold mb-2">Rhyme Families</h3>
      <ul className="text-sm text-gray-300 space-y-2">
        {Object.entries(buckets).map(([key, words], index) => {
          const colorClass = `text-rhyme-${(key.charCodeAt(0) + key.charCodeAt(1)) % 6}`;
          return (
            <li key={key} className={`${colorClass}`}>
              <span className="font-bold mr-2">{key}</span>
              → {Array.from(new Set(words)).join(", ")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}