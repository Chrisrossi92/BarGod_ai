import { motion } from "framer-motion";

import { ARCHETYPES } from "@/logic/gameDesign";

import {
  getOpponentOverall,
  getOpponentSignatureMove,
} from "./progression";

export function MomentumMeter({ value }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/70 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide">
        <span className="text-zinc-500">Crowd Momentum</span>
        <motion.span
          key={clamped}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full bg-lime-400 px-2 py-1 text-black"
        >
          {clamped}/100
        </motion.span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-300 to-lime-400"
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPlayerOverall(player) {
  if (player?.ovr) return player.ovr;
  const values = Object.values(player?.attributes || {});
  if (!values.length) return "--";
  return Math.round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length);
}

export function StageBattlerCard({
  label,
  name,
  detail,
  align = "left",
  active = false,
  archetype,
  overall,
  record,
  tier,
  signature,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border p-3 ${
        active ? "border-lime-400/60 bg-lime-400/10" : "border-zinc-800 bg-zinc-950/90"
      } ${align === "right" ? "text-right" : "text-left"}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.16),transparent_52%)]" />
      <div className="relative">
        <div className={`flex items-start gap-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-sm font-black text-white">
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </div>
            <div className="mt-1 truncate text-lg font-black">{name}</div>
            <div className="truncate text-xs text-zinc-400">{detail}</div>
          </div>
          <div className="shrink-0 rounded-xl border border-white/10 bg-black px-2 py-1 text-center">
            <div className="text-[9px] font-black uppercase text-zinc-500">OVR</div>
            <div className="text-lg font-black leading-none text-white">{overall}</div>
          </div>
        </div>

        <div className={`mt-3 flex flex-wrap gap-1 ${align === "right" ? "justify-end" : ""}`}>
          {tier && (
            <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-black uppercase text-zinc-300">
              {tier}
            </span>
          )}
          {archetype && (
            <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-black uppercase text-red-100">
              {archetype}
            </span>
          )}
          {record && (
            <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-black uppercase text-zinc-300">
              {record}
            </span>
          )}
        </div>
        {signature && (
          <div className="mt-2 truncate rounded-xl border border-yellow-300/30 bg-yellow-300/10 px-2 py-1 text-[10px] font-black uppercase text-yellow-100">
            Sig: {signature}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function BattleStage({
  player,
  opponent,
  exchangeNumber,
  momentum,
  phase,
  signatureMoment,
  tierLabel = "Local Open Mic",
}) {
  const opponentSignature = getOpponentSignatureMove(opponent);
  const opponentArchetype = ARCHETYPES[opponent.archetype]?.label || opponent.archetype;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.18),transparent_38%),linear-gradient(180deg,rgba(127,29,29,0.24),transparent_55%)]" />
      {signatureMoment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.38, 0.18] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.42),transparent_48%)]"
        />
      )}
      <div className="absolute left-0 right-0 top-12 h-10 bg-gradient-to-r from-transparent via-zinc-700/25 to-transparent blur-sm" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              {tierLabel}
            </div>
            <div className="text-sm text-zinc-400">
              Exchange {Math.min(exchangeNumber, 3)} of 3 · {phase}
            </div>
          </div>
          <motion.div
            key={phase}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full border border-zinc-700 bg-black px-3 py-1 text-xs font-black uppercase text-zinc-200"
          >
            {signatureMoment ? "Crowd surge" : "Crowd live"}
          </motion.div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <StageBattlerCard
            label="You"
            name={player?.name || "No Battler"}
            detail={player?.archetypeLabel || "Choose a build"}
            archetype={player?.archetypeLabel}
            overall={getPlayerOverall(player)}
            tier="MyCareer"
            active={phase === "choosing"}
          />
          <motion.div
            animate={{ scale: phase === "reveal" ? [1, 1.16, 1] : 1 }}
            transition={{ duration: 0.45 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black"
          >
            VS
          </motion.div>
          <StageBattlerCard
            label="Opponent"
            name={opponent.label}
            detail={opponent.nickname || opponent.archetype}
            archetype={opponentArchetype}
            overall={getOpponentOverall(opponent)}
            record={opponent.record}
            tier={opponent.tier}
            signature={opponentSignature?.label}
            align="right"
            active={phase === "reveal"}
          />
        </div>

        <div className="mt-4">
          <MomentumMeter value={momentum} />
        </div>

        <div className="mt-3 flex justify-center gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index < exchangeNumber - 1 ? "bg-lime-400" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
