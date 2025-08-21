import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";

export default function BattlerProfile() {
  const { id } = useParams();
  const [battler, setBattler] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let ignore = false;
    (async ()=>{
      setLoading(true);
      const { data, error } = await supabase
        .from("battlers")
        .select("id,name,bio,photo_url,stats")
        .eq("id", id)
        .single();
      if (!ignore) {
        if (error) console.error(error);
        setBattler(data || null);
        setLoading(false);
      }
    })();
    return ()=>{ ignore = true; };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-6">Loading…</div>;
  }
  if (!battler) {
    return <div className="min-h-screen bg-black text-white p-6">Not found.</div>;
  }

  const stats = battler.stats || {};
  const statKeys = Object.keys(stats);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <Link to="/battlers"><Button variant="ghost" size="sm">← Back</Button></Link>
          <Link to={`/battlers/${battler.id}/upload`}>
            <Button variant="primary" size="md">Upload Battle</Button>
          </Link>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          {battler.photo_url && (
            <div className="aspect-[16/7] bg-zinc-950">
              <img src={battler.photo_url} alt={battler.name} className="w-full h-full object-cover"/>
            </div>
          )}
          <div className="p-4 space-y-2">
            <h1 className="text-2xl font-extrabold">{battler.name}</h1>
            {battler.bio && <p className="text-sm text-zinc-300">{battler.bio}</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-lg font-semibold mb-3">Ratings</h2>
          {statKeys.length === 0 ? (
            <p className="text-sm text-zinc-400">No ratings yet.</p>
          ) : (
            <div className="space-y-2">
              {statKeys.map(k => (
                <div key={k}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="uppercase tracking-wide text-zinc-400">{k}</span>
                    <span className="font-semibold">{stats[k]}</span>
                  </div>
                  <div className="h-2 rounded bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-lime-500"
                      style={{ width: `${Math.min(100, Number(stats[k]) || 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Battles list section goes here in Phase 2 */}
      </div>
    </div>
  );
}
