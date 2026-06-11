import React, { useMemo, useState } from "react";
import { runTurn } from "@/logic/TurnEngine";
import BattleLog from "@/components/BattleLog";
import useBattlers from "@/lib/hooks/useBattlers";
import BattlerCard from "@/components/therise/battlers/BattlerCard";
import { MOVE_IDS } from "@/logic/gameDesign";

export default function BattleSimScreen() {
  const { builds, loading, error } = useBattlers();
  const [selectedAId, setSelectedAId] = useState("");
  const [selectedBId, setSelectedBId] = useState("");
  const [turns, setTurns] = useState([]);
  const [info, setInfo] = useState("");

  const battlerA = useMemo(
    () => builds.find((b) => b.id === selectedAId) || null,
    [builds, selectedAId]
  );
  const battlerB = useMemo(
    () => builds.find((b) => b.id === selectedBId) || null,
    [builds, selectedBId]
  );

  const canSimulate = !!battlerA && !!battlerB;

  const handleSimTurn = () => {
    if (!battlerA || !battlerB) {
      setInfo("Select both battlers before simulating a turn.");
      return;
    }
    setInfo("");

    const moveA = MOVE_IDS[Math.floor(Math.random() * MOVE_IDS.length)];
    const moveB = MOVE_IDS[Math.floor(Math.random() * MOVE_IDS.length)];

    const simA = {
      name: battlerA.name,
      attributes: battlerA.attributes || {},
      archetypeId: battlerA.archetypeId,
    };
    const simB = {
      name: battlerB.name,
      attributes: battlerB.attributes || {},
      archetypeId: battlerB.archetypeId,
    };

    const previousMomentum = turns[turns.length - 1]?.crowdMomentum?.after;
    const turnResult = runTurn(simA, moveA, simB, moveB, {
      currentMomentum: previousMomentum,
    });

    // Ensure names are set on the result for BattleLog
    if (turnResult.battlerA) {
      turnResult.battlerA.name = battlerA.name;
    }
    if (turnResult.battlerB) {
      turnResult.battlerB.name = battlerB.name;
    }

    setTurns((prev) => [...prev, turnResult]);
  };

  const handleReset = () => {
    setTurns([]);
    setInfo("");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-10 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 text-center">
          Battle Simulation
        </h1>
        <p className="text-sm text-gray-300 text-center mb-8">
          Pick two battlers from your roster and simulate a matchup. This is a
          first look at how builds stack up before The Rise minigame and AI
          bars are fully wired in.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-400 text-center">
            Loading battlers…
          </div>
        ) : builds.length === 0 ? (
          <div className="text-sm text-gray-400 text-center">
            You don&apos;t have any battlers yet. Create one in The Rise to try
            the sim.
          </div>
        ) : (
          <>
            {/* Battler selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-200">
                    Battler A
                  </h2>
                  <select
                    value={selectedAId}
                    onChange={(e) => setSelectedAId(e.target.value)}
                    className="text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option value="">Select battler…</option>
                    {builds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.archetypeLabel} (OVR {b.ovr})
                      </option>
                    ))}
                  </select>
                </div>
                {battlerA ? (
                  <BattlerCard
                    name={battlerA.name}
                    archetypeLabel={battlerA.archetypeLabel}
                    archetypeId={battlerA.archetypeId}
                    ovr={battlerA.ovr}
                    signature={battlerA.signature}
                    level={battlerA.level}
                    xp={battlerA.xp}
                    hometownLabel={battlerA.hometownLabel}
                  />
                ) : (
                  <div className="h-40 rounded-2xl border border-dashed border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                    No battler selected.
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-200">
                    Battler B
                  </h2>
                  <select
                    value={selectedBId}
                    onChange={(e) => setSelectedBId(e.target.value)}
                    className="text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="">Select battler…</option>
                    {builds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.archetypeLabel} (OVR {b.ovr})
                      </option>
                    ))}
                  </select>
                </div>
                {battlerB ? (
                  <BattlerCard
                    name={battlerB.name}
                    archetypeLabel={battlerB.archetypeLabel}
                    archetypeId={battlerB.archetypeId}
                    ovr={battlerB.ovr}
                    signature={battlerB.signature}
                    level={battlerB.level}
                    xp={battlerB.xp}
                    hometownLabel={battlerB.hometownLabel}
                  />
                ) : (
                  <div className="h-40 rounded-2xl border border-dashed border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                    No battler selected.
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={handleSimTurn}
                disabled={!canSimulate}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                  ${
                    canSimulate
                      ? "bg-lime-500 text-black hover:bg-lime-400"
                      : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  }`}
              >
                Simulate Next Turn
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
              >
                Reset Battle
              </button>
            </div>

            {info && (
              <div className="text-xs text-amber-300 text-center mb-4">
                {info}
              </div>
            )}

            <BattleLog turns={turns} />
          </>
        )}
      </div>
    </div>
  );
}
