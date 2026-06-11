import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBattlers from "@/lib/hooks/useBattlers";
import BuildCardWall from "@/components/therise/BuildCardWall";
import BackgroundEnvironment from "@/components/therise/BackgroundEnvironment";

export default function TheRiseHub() {
  const navigate = useNavigate();
  const { builds, loading, error } = useBattlers();
  const [query, setQuery] = useState("");

  const filteredBuilds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return builds;
    return builds.filter((b) => {
      const haystack = [
        b.name,
        b.archetypeLabel,
        b.hometownLabel,
        ...(b.signature || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [builds, query]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BackgroundEnvironment />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              The Rise
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Build, refine, and level up your battlers. Each card is a career in progress.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/therise/create")}
            className="px-4 py-2 rounded-full bg-lime-500 text-black text-sm font-semibold hover:bg-lime-400 transition"
          >
            + New Battler
          </button>
        </div>

        <div className="mt-6 mb-6 max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your battlers…"
            className="w-full rounded-2xl bg-zinc-900/80 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-400">Loading your battlers…</div>
        ) : filteredBuilds.length === 0 ? (
          <div className="text-sm text-gray-400">
            {query
              ? "No battlers match your search."
              : "You haven't created any battlers yet. Start by creating your first build."}
          </div>
        ) : (
          <BuildCardWall builds={filteredBuilds} />
        )}
      </div>
    </div>
  );
}
