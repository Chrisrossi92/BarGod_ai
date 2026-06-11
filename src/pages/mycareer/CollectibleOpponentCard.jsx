import { Lock, ShieldCheck, Star, Swords } from "lucide-react";

import { ARCHETYPES } from "@/logic/gameDesign";

import {
  getOpponentOverall,
  getOpponentSignatureMove,
} from "./progression";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRarityStyle(opponent) {
  const reputation = opponent.reputationTier || "";
  const overall = getOpponentOverall(opponent);

  if (reputation.includes("Final Boss") || overall >= 75) {
    return {
      label: "Epic",
      frame: "border-yellow-300/60 bg-yellow-300/10",
      glow: "from-yellow-300/30 via-red-500/15 to-transparent",
      badge: "border-yellow-300/60 bg-yellow-300/15 text-yellow-100",
    };
  }

  if (opponent.tier === "Regional Circuit" || overall >= 68) {
    return {
      label: "Rare",
      frame: "border-violet-400/50 bg-violet-400/10",
      glow: "from-violet-400/30 via-lime-400/10 to-transparent",
      badge: "border-violet-300/60 bg-violet-400/15 text-violet-100",
    };
  }

  return {
    label: "Common",
    frame: "border-zinc-700 bg-zinc-950",
    glow: "from-lime-400/20 via-zinc-700/10 to-transparent",
    badge: "border-zinc-700 bg-zinc-900 text-zinc-200",
  };
}

export default function CollectibleOpponentCard({
  opponent,
  battleNumber,
  selected,
  locked,
  status,
  rival,
  history,
  onSelect,
}) {
  const rarity = getRarityStyle(opponent);
  const archetype = ARCHETYPES[opponent.archetype];
  const signatureMove = getOpponentSignatureMove(opponent);
  const defeated = status === "defeated";

  return (
    <button
      type="button"
      onClick={() => {
        if (!locked) onSelect(opponent.id);
      }}
      disabled={locked}
      className={`relative w-full overflow-hidden rounded-3xl border p-3 text-left shadow-lg shadow-black/30 transition-transform active:scale-[0.99] ${
        selected ? "border-lime-400 bg-lime-400/10" : rarity.frame
      } disabled:opacity-65`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${rarity.glow}`} />
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_48%)]" />
              <div className="relative text-2xl font-black text-white">
                {getInitials(opponent.label)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Battle {battleNumber} · {opponent.tier}
              </div>
              <div className="mt-1 truncate text-xl font-black text-white">
                {opponent.label}
              </div>
              <div className="text-sm font-bold text-lime-200">
                {opponent.nickname}
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-black px-3 py-2 text-center">
            <div className="text-[10px] font-black uppercase text-zinc-500">OVR</div>
            <div className="text-2xl font-black leading-none text-white">
              {getOpponentOverall(opponent)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${rarity.badge}`}>
            {rarity.label}
          </span>
          <span className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-100">
            {archetype?.label || opponent.archetype}
          </span>
          <span className="rounded-full border border-zinc-700 bg-black px-3 py-1 text-xs font-black uppercase tracking-wide text-zinc-300">
            {opponent.record}
          </span>
          {rival && (
            <span className="rounded-full border border-red-400/60 bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-100">
              Rival · {history.wins}-{history.losses}
            </span>
          )}
          {defeated && (
            <span className="inline-flex items-center gap-1 rounded-full border border-lime-400/50 bg-lime-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-lime-100">
              <ShieldCheck size={13} />
              Defeated
            </span>
          )}
          {locked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-black px-3 py-1 text-xs font-black uppercase tracking-wide text-zinc-400">
              <Lock size={13} />
              Locked
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-white/10 bg-black/70 p-3">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
              Signature
            </div>
            <div className="mt-1 truncate text-sm font-black text-white">
              {signatureMove?.label || "Unknown"}
            </div>
            <div className="mt-1 truncate text-xs text-zinc-500">
              {opponent.reputationTier}
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-zinc-950 px-3 text-xs font-black uppercase text-zinc-300">
            {selected ? <Star size={14} /> : <Swords size={14} />}
            {status}
          </div>
        </div>
      </div>
    </button>
  );
}
