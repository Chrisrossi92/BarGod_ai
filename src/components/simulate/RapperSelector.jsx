import React, { useState } from "react";

const DEFAULTS = [
  { id: "iron-solomon", name: "Iron Solomon" },
  { id: "rone", name: "Rone" },
  { id: "dna", name: "DNA" },
  { id: "charron", name: "Charron" },
  { id: "dizaster", name: "Dizaster" },
  { id: "kid-twist", name: "Kid Twist" },
  { id: "pat-stay", name: "Pat Stay (RIP)" },
  { id: "dumbfoundead", name: "Dumbfoundead" },
];

export default function RapperSelector({ onStart }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const start = () => {
    if (!a || !b || a === b) return;
    const pick = (id) => DEFAULTS.find((x) => x.id === id);
    onStart({ a: pick(a), b: pick(b) });
  };

  const randomize = () => {
    const idxA = Math.floor(Math.random() * DEFAULTS.length);
    let idxB = Math.floor(Math.random() * DEFAULTS.length);
    while (idxB === idxA) idxB = Math.floor(Math.random() * DEFAULTS.length);
    setA(DEFAULTS[idxA].id);
    setB(DEFAULTS[idxB].id);
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-4">
      <h2 className="text-xl font-semibold">Pick Your Matchup</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Rapper A" value={a} onChange={setA} />
        <Select label="Rapper B" value={b} onChange={setB} />
      </div>
      <div className="flex gap-3">
        <button onClick={randomize} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm">Randomize</button>
        <button onClick={start} className="px-3 py-2 rounded-xl bg-white text-black font-semibold text-sm">Start Battle</button>
      </div>
      <p className="text-xs text-zinc-400">You can add AI-generated rappers later. This is just a scaffold.</p>
    </div>
  );
}

function Select({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-zinc-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
      >
        <option value="">Select…</option>
        <option value="iron-solomon">Iron Solomon</option>
        <option value="rone">Rone</option>
        <option value="dna">DNA</option>
        <option value="charron">Charron</option>
        <option value="dizaster">Dizaster</option>
        <option value="kid-twist">Kid Twist</option>
        <option value="pat-stay">Pat Stay (RIP)</option>
        <option value="dumbfoundead">Dumbfoundead</option>
      </select>
    </label>
  );
}