import React from "react";

export default function RoundDisplay({ roundNumber, latest, loading }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm uppercase tracking-wider text-zinc-400">Round {roundNumber}</h3>
      {loading && (
        <div className="text-sm text-zinc-400">Cooking bars…</div>
      )}
      {!loading && latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BarCard title="Corner A" text={latest.a} />
          <BarCard title="Corner B" text={latest.b} />
        </div>
      )}
      {!loading && !latest && (
        <div className="text-sm text-zinc-400">Press “Start Round” to generate bars.</div>
      )}
    </section>
  );
}

function BarCard({ title, text }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <div className="text-xs text-zinc-400 mb-1">{title}</div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
    </div>
  );
}