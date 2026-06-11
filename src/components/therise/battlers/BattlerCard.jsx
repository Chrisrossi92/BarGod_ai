import React, { useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// Helper to generate initials from name
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Map archetype id to card gradient
const ARCHETYPE_GRADIENTS = {
  punchliner: "from-lime-500/20 via-lime-900/60 to-black",
  schemer: "from-sky-500/20 via-sky-900/60 to-black",
  controller: "from-amber-500/20 via-amber-900/60 to-black",
  wildcard: "from-fuchsia-500/20 via-fuchsia-900/60 to-black",
  default: "from-zinc-800 via-zinc-900 to-black",
};

export default function BattlerCard({
  name,
  archetypeLabel,
  archetypeId,
  ovr,
  signature = [],
  level,
  xp,
  hometownLabel,
  onClick,
}) {
  const cardRef = useRef(null);
  const initials = getInitials(name);
  const gradient =
    ARCHETYPE_GRADIENTS[archetypeId] || ARCHETYPE_GRADIENTS.default;

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020617", // slate-950-ish fallback
        scale: 2, // higher res
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = (name || "battler").replace(/[^a-z0-9]+/gi, "_");
      link.download = `${safeName}_BarGod_card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export battler card", err);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: onClick ? 1.03 : 1.01, y: onClick ? -2 : 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border border-zinc-700/80
        bg-gradient-to-br ${gradient} shadow-xl flex flex-col
        p-4
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />

      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="
              h-12 w-12 rounded-2xl border border-zinc-300/40 bg-zinc-900/80
              flex items-center justify-center text-lg font-bold shadow-inner
            "
          >
            {initials}
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">{name}</div>
            <div className="text-[0.7rem] uppercase tracking-wide text-zinc-300">
              {archetypeLabel}
            </div>
            {hometownLabel && (
              <div className="text-[0.65rem] text-zinc-400 mt-0.5">
                {hometownLabel}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[0.6rem] uppercase tracking-wide text-zinc-300">
            Overall
          </div>
          <div className="text-3xl font-extrabold text-lime-400 leading-none">
            {ovr}
          </div>
          <div className="text-[0.65rem] text-zinc-300 mt-1">
            Lvl {level ?? 1}
            {typeof xp === "number" ? ` · XP ${xp}` : null}
          </div>
        </div>
      </div>

      {/* Signature strengths */}
      {signature && signature.length > 0 && (
        <div className="relative z-10 mb-3">
          <div className="text-[0.65rem] uppercase tracking-wide text-zinc-300 mb-1">
            Signature strengths
          </div>
            <div className="flex flex-wrap gap-1.5">
              {signature.map((tag, i) => (
                <span
                  key={i}
                  className="
                    inline-flex items-center justify-center
                    px-3 py-1 rounded-full
                    bg-black/40 border border-zinc-500/70
                    text-[0.7rem] text-zinc-100 leading-none
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
        </div>
      )}

      {/* Footer strip */}
      <div className="relative z-10 mt-auto pt-2 border-t border-zinc-700/70 flex items-center justify-between text-[0.65rem] text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
          <span>{onClick ? "Rise Career · View profile" : "Rise Career"}</span>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="px-2 py-0.5 rounded-full border border-zinc-500/70 bg-black/40 hover:border-lime-400 hover:text-lime-200 transition"
        >
          Download
        </button>
      </div>
    </motion.div>
  );
}
