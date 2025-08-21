import React from "react";
import { Link } from "react-router-dom";
import useBattlersQuery from "@/hooks/useBattlersQuery";
import BattlerCard from "@/components/battlers/BattlerCard";
import Button from "@/components/common/Button";

export default function BrowseBattlers() {
  const { battlers, loading, error } = useBattlersQuery();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Browse Battlers</h1>
            <p className="text-sm text-zinc-400">Community-built roster & 2K-style ratings.</p>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
        </header>

        {error && (
          <div className="text-red-400 text-sm border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-zinc-400">Loading battlers…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {battlers.map(b => <BattlerCard key={b.id} battler={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
