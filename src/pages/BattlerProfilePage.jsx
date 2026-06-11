import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useBattler from "@/lib/hooks/useBattler";
import BattlerCard from "@/components/therise/battlers/BattlerCard";

const ATTR_LABELS = {
  punchlines: "Punchlines",
  schemes: "Schemes",
  angles: "Angles",
  rebuttals: "Rebuttals",
  freestyle: "Freestyle",
  presence: "Presence",
  crowdControl: "Crowd Control",
  delivery: "Delivery",
};

export default function BattlerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { battler, loading, error } = useBattler(id);

  const attrs = battler?.attributes || {};

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-10 pb-16">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-xs text-zinc-400 hover:text-zinc-200"
        >
          ← Back
        </button>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {loading || !battler ? (
          <div className="text-sm text-gray-400">Loading battler…</div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold mb-4">
              {battler.name}
            </h1>

            {/* Big card at top */}
            <div className="mb-6">
              <BattlerCard
                name={battler.name}
                archetypeLabel={battler.archetypeLabel}
                archetypeId={battler.archetypeId}
                ovr={battler.ovr}
                signature={[]}
                level={battler.level}
                xp={battler.xp}
                hometownLabel={battler.hometownLabel}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attributes */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                  Attributes
                </div>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(ATTR_LABELS).map(([key, label]) => {
                    const val = attrs[key] ?? 60;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-zinc-300">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lime-400"
                              style={{
                                width: `${((val - 60) / 39) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right text-zinc-200">
                            {val}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Career summary placeholder */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                  Rise Career
                </div>
                <div className="text-sm text-zinc-200">
                  <div>
                    Level{" "}
                    <span className="font-semibold">
                      {battler.level}
                    </span>
                    {" · "}
                    XP{" "}
                    <span className="font-semibold">
                      {battler.xp}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">
                    This panel will later show career milestones, trophies,
                    and minigame stats as The Rise progression is built out.
                  </div>
                </div>
              </div>

              {/* Meta / notes */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                  Profile
                </div>
                <div className="text-sm text-zinc-200 space-y-1">
                  <div>
                    Archetype:{" "}
                    <span className="font-semibold">
                      {battler.archetypeLabel}
                    </span>
                  </div>
                  {battler.hometownLabel && (
                    <div>
                      Hometown:{" "}
                      <span className="font-semibold">
                        {battler.hometownLabel}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-zinc-400">
                    In future versions, this section can include lore, AI
                    style notes, and links to simulated battles featuring this
                    battler.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
