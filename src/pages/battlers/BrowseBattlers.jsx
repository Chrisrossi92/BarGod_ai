import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";
import BattlerCard from "@/components/battlers/BattlerCard";

export default function BrowseBattlers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [searchParams] = useSearchParams();

  const uploadedFlag = searchParams.get("uploaded");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("battlers")
          .select("id,name,bio,photo_url,stats")
          .order("name", { ascending: true });

        if (ignore) return;
        if (error) throw error;
        setRows(data || []);
      } catch (e) {
        if (!ignore) setErr(String(e.message || e));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const hasRows = rows && rows.length > 0;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Browse Battlers</h1>
            <p className="text-sm text-zinc-400">Community-built roster & 2K-style ratings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/upload">
              <Button variant="primary" size="sm">+ Upload Battle</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
          </div>
        </header>

        {/* Upload confirmation */}
        {uploadedFlag && (
          <div className="rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-200 px-3 py-2 text-sm">
            Upload received. We’ll process and update battlers soon.
          </div>
        )}

        {/* Error */}
        {err && (
          <div className="rounded-xl border border-red-500/30 bg-red-900/40 text-red-200 px-3 py-2 text-sm">
            Supabase error: {err}
          </div>
        )}

        {/* Loading */}
        {loading && !err && (
          <div className="text-sm text-zinc-400">Loading battlers…</div>
        )}

        {/* Empty state */}
        {!loading && !err && !hasRows && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-sm text-zinc-300">No battlers yet.</p>
            <div className="mt-3">
              <Link to="/upload">
                <Button variant="primary" size="sm">Be the first to upload</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Grid using your BattlerCard component */}
        {!loading && !err && hasRows && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((b) => (
              <BattlerCard key={b.id} battler={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}







