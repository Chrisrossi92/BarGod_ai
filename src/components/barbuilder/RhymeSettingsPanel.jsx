import React from "react";

export default function RhymeSettingsPanel({ depth, setDepth, internal, setInternal }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4">
      <h3 className="text-white text-lg font-semibold mb-2">Rhyme Detection Settings</h3>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Syllable Depth: {depth}</label>
        <input
          type="range"
          min="1"
          max="4"
          value={depth}
          onChange={(e) => setDepth(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={internal}
          onChange={(e) => setInternal(e.target.checked)}
          id="internalToggle"
        />
        <label htmlFor="internalToggle" className="text-sm text-gray-300">
          Highlight Internal Rhymes
        </label>
      </div>
    </div>
  );
}