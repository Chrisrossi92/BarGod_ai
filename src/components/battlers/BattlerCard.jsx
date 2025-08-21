import React from "react";
import { Link } from "react-router-dom";

function overallFromStats(stats) {
  if (!stats || typeof stats !== "object") return null;
  // simple average across present numeric fields; tune later
  const values = Object.values(stats).filter(v => typeof v === "number");
  if (!values.length) return null;
  const avg = values.reduce((a,b)=>a+b,0) / values.length;
  return Math.round(avg);
}

export default function BattlerCard({ battler }) {
  const overall = overallFromStats(battler.stats);
  return (
    <Link
      to={`/battlers/${battler.id}`}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 transition block overflow-hidden"
    >
      <div className="aspect-[16/9] bg-zinc-950">
        {battler.photo_url ? (
          <img
            src={battler.photo_url}
            alt={battler.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold truncate">{battler.name}</h3>
          {overall !== null && (
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-lime-500 text-black">
              {overall}
            </span>
          )}
        </div>
        {battler.bio && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{battler.bio}</p>
        )}
      </div>
    </Link>
  );
}
