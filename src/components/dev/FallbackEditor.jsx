import React, { useState } from "react";
import { fallbackPhonemes } from "../../config/fallbackPhonemes";
import { saveFallbackOverride } from "../../lib/saveFallbackToStorage";

export default function FallbackEditor() {
  const [word, setWord] = useState("");
  const [phonemes, setPhonemes] = useState("");
  const [entries, setEntries] = useState({ ...fallbackPhonemes });

  const handleAdd = () => {
    if (!word || !phonemes) return;
    const clean = word.trim().toLowerCase();
    const phonemeArray = phonemes.trim().split(/\s+/);
    setEntries((prev) => ({ ...prev, [clean]: phonemeArray }));
    setWord("");
    setPhonemes("");
  };

  const handleCopy = () => {
    const json = JSON.stringify(entries, null, 2);
    navigator.clipboard.writeText(`export const fallbackPhonemes = ${json};`);
    alert("Copied to clipboard!");
  };

  const handleInject = () => {
    const success = saveFallbackOverride(entries);
    alert(success ? "Injected into localStorage!" : "Failed to inject.");
  };

  const handleClearCache = () => {
    localStorage.removeItem("cmudict-cache");
    alert("CMUdict cache cleared. Reload the app to reinitialize.");
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Fallback Phoneme Editor</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="p-2 rounded bg-zinc-800 border border-zinc-600"
        />
        <textarea
          placeholder="Enter phonemes (space-separated)..."
          value={phonemes}
          onChange={(e) => setPhonemes(e.target.value)}
          className="p-2 rounded bg-zinc-800 border border-zinc-600"
        ></textarea>
        <button
          onClick={handleAdd}
          className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-4 rounded"
        >
          Add Entry
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Fallback Entries</h2>
        <pre className="bg-zinc-800 p-4 rounded overflow-auto text-sm text-lime-300">
{`export const fallbackPhonemes = ${JSON.stringify(entries, null, 2)};`}
        </pre>
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={handleInject}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded"
          >
            Inject into LocalStorage
          </button>
          <button
            onClick={handleClearCache}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Clear Local Cache
          </button>
        </div>
      </div>
    </div>
  );
}