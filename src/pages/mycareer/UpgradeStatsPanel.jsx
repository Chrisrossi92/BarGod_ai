import { useEffect, useState } from "react";

import { CORE_STAT_LIST } from "@/logic/gameDesign";

import {
  getBattlerUpgrades,
  getDisplayStats,
} from "./progression";
import { SectionCard } from "./ui";

export default function UpgradeStatsPanel({ battler, progress, onUpgrade }) {
  const [recentlyUpgraded, setRecentlyUpgraded] = useState("");

  useEffect(() => {
    if (!recentlyUpgraded) return undefined;

    const timeoutId = window.setTimeout(() => setRecentlyUpgraded(""), 650);
    return () => window.clearTimeout(timeoutId);
  }, [recentlyUpgraded]);

  if (!battler) return null;

  const displayStats = getDisplayStats(battler, progress);
  const upgrades = getBattlerUpgrades(progress, battler.id);
  const available = progress.statPoints || 0;

  function handleUpgrade(statId) {
    if (available <= 0) return;
    setRecentlyUpgraded(statId);
    onUpgrade(statId);
  }

  return (
    <SectionCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Upgrade Stats
          </div>
          <h2 className="text-xl font-black">Spend your points</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Local-only boosts for {battler.name}.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-lime-400/50 bg-lime-400/10 px-4 py-3 text-center shadow-lg shadow-lime-400/5">
          <div className="text-[10px] font-black uppercase tracking-wide text-lime-300">
            Available
          </div>
          <div className="text-3xl font-black leading-none text-white">{available}</div>
          <div className="mt-1 text-[10px] uppercase text-zinc-500">points</div>
        </div>
      </div>

      <div className="space-y-3">
        {CORE_STAT_LIST.map((stat) => {
          const upgradeValue = Number(upgrades[stat.id]) || 0;
          const activeFeedback = recentlyUpgraded === stat.id;

          return (
            <div
              key={stat.id}
              className={`rounded-2xl border p-3 transition-colors ${
                activeFeedback
                  ? "border-lime-400 bg-lime-400/10"
                  : "border-zinc-800 bg-black"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-black text-white">{stat.label}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
                      Current {displayStats[stat.id]}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 ${
                        upgradeValue > 0
                          ? "bg-lime-400/15 text-lime-200"
                          : "bg-zinc-900 text-zinc-500"
                      }`}
                    >
                      Local +{upgradeValue}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgrade(stat.id)}
                  disabled={available <= 0}
                  className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-2xl font-black text-black transition-transform active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  +
                </button>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-lime-400 transition-all"
                  style={{ width: `${Math.max(4, Math.min(100, displayStats[stat.id]))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
