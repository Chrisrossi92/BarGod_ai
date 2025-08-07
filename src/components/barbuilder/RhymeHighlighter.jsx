import React from "react";
import usePhoneticMap from "../../lib/hooks/usePhoneticMap";

export default function RhymeHighlighter({ text, depth = 2, internal = false }) {
  const { coloredWords } = usePhoneticMap(text, { depth, internal });

  return (
    <div className="bg-zinc-800 p-4 mt-4 rounded-xl border border-zinc-700">
      <h2 className="text-lg font-semibold mb-2 text-white">Rhyme Highlighting</h2>
      <p className="text-sm text-gray-400 mb-1">Preview of detected rhymes:</p>
      <div className="text-base leading-relaxed flex flex-wrap">
        {coloredWords?.length > 0 ? coloredWords : (
          <span className="text-gray-500 italic">(no input or unmatched)</span>
        )}
      </div>
    </div>
  );
}
