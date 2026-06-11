import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBattlers from "@/lib/hooks/useBattlers";
import BattlerCard from "@/components/therise/battlers/BattlerCard";

export default function BattlersPage() {
  const navigate = useNavigate();
  const { builds, loading, error } = useBattlers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
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
    <div className="min-h-screen bg-black text-white px-4 pt-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          All Battlers
        </h1>

        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search battlers by name, archetype, hometown, or strengths…"
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-gray-400 text-center">
            Loading battlers…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-gray-400 text-center">
            No battlers found. Try a different search, or create a new battler
            in The Rise.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((build) => (
              <BattlerCard
                key={build.id}
                name={build.name}
                archetypeLabel={build.archetypeLabel}
                archetypeId={build.archetypeId}
                ovr={build.ovr}
                signature={build.signature}
                level={build.level}
                xp={build.xp}
                hometownLabel={build.hometownLabel}
                onClick={() => navigate(`/battlers/${build.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
