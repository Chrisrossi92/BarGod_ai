import React from "react";

export default function BattleResult({ summary, onRematch, onHome }) {
  if (!summary) return null;
  const { players, rounds, winner } = summary;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-4">
      <h2 className="text-xl font-semibold">Battle Result</h2>
      <p className="text-sm text-zinc-300">
        Winner: <span className="font-bold">{winner?.name}</span>
      </p>

      <div className="space-y-3">
        {rounds.map((r) => (
          <div key={r.round} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="text-xs text-zinc-400 mb-1">Round {r.round}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-zinc-500 mb-1">{players.a.name}</div>
                <p className="whitespace-pre-wrap">{r.a}</p>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">{players.b.name}</div>
                <p className="whitespace-pre-wrap">{r.b}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onRematch} className="px-3 py-2 rounded-xl bg-white text-black font-semibold text-sm">Run It Back</button>
        <button onClick={onHome} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm">Home</button>
      </div>
    </div>
  );
}