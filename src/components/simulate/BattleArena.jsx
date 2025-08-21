import React, { useState } from "react";
import RoundDisplay from "./RoundDisplay";
import CrowdReaction from "./CrowdReaction";
import useBattleEngine from "../../hooks/useBattleEngine";

export default function BattleArena({ players, onFinish, onBack }) {
  const [round, setRound] = useState(1);
  const [log, setLog] = useState([]); // keep all bars for summary
  const { generateBars, isLoading } = useBattleEngine();

  const next = async () => {
    if (round > 3) return; // 3 rounds scaffold
    const bars = await generateBars({
      round,
      a: players?.a?.name || "Rapper A",
      b: players?.b?.name || "Rapper B",
    });
    setLog((prev) => [...prev, { round, ...bars }]);
    setRound((r) => r + 1);
  };

  const finish = () => {
    const scoreA = log.reduce((s) => s + 1, 0); // placeholder scoring
    const scoreB = log.reduce((s) => s + 1, 0);
    onFinish({ players, rounds: log, winner: scoreA >= scoreB ? players.a : players.b });
  };

  const hasMore = round <= 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white">← Back</button>
        <div className="text-xs text-zinc-400">Round {Math.min(round, 3)} / 3</div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 space-y-6">
        <header className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold truncate">{players.a?.name}</div>
            <div className="text-xs text-zinc-400">Corner A</div>
          </div>
          <div>
            <div className="text-lg font-semibold truncate">{players.b?.name}</div>
            <div className="text-xs text-zinc-400">Corner B</div>
          </div>
        </header>

        <RoundDisplay
          key={round}
          roundNumber={Math.min(round, 3)}
          latest={log[log.length - 1]}
          loading={isLoading}
        />

        <CrowdReaction seed={`${players.a?.id}-${players.b?.id}-${round}`} />

        <div className="flex gap-3">
          {hasMore ? (
            <button onClick={next} disabled={isLoading} className="px-3 py-2 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-50">
              {isLoading ? "Generating…" : log.length === 0 ? "Start Round" : "Next Round"}
            </button>
          ) : (
            <button onClick={finish} className="px-3 py-2 rounded-xl bg-white text-black font-semibold text-sm">Finish Battle</button>
          )}
        </div>
      </div>
    </div>
  );
}