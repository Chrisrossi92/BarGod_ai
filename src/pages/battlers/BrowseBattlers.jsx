// src/pages/battlers/BrowseBattlers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";
import BattlerCard from "@/components/battlers/BattlerCard";
import BarGodLogo from "@/components/BarGodLogo";

export default function BrowseBattlers() {
  // data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // ui
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name_asc"); // "name_asc" | "name_desc"
  const [openAdd, setOpenAdd] = useState(false);

  // add battler form
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const uploadedFlag = searchParams.get("uploaded");

  // fetch battlers
  async function fetchBattlers() {
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from("battlers")
      .select(
        "id,name,bio,photo_url,stats,overall,rating_count,photo_focus_x,photo_focus_y"
      )
      .order("name", { ascending: true });
    if (error) setErr(error.message);
    else setRows(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchBattlers(); // eslint-disable-line
  }, []);

  // client filters/sort
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = rows;
    if (term) {
      list = list.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(term)) ||
          (r.bio && r.bio.toLowerCase().includes(term))
      );
    }
    if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [rows, q, sort]);

  // create battler (URL image for now)
  async function onCreate(e) {
    e?.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        photo_url: photoUrl.trim() || null,
        bio: bio.trim() || null,
      };
      const { data, error } = await supabase
        .from("battlers")
        .insert([payload])
        .select(
          "id,name,bio,photo_url,stats,overall,rating_count,photo_focus_x,photo_focus_y"
        )
        .single();
      if (error) throw error;
      setRows((prev) => [data, ...prev]);
      setOpenAdd(false);
      setName("");
      setPhotoUrl("");
      setBio("");
    } catch (e) {
      setErr(e.message || "Failed to create battler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* Header with BarGodLogo (acts as back-to-home button) + actions */}
        <header className="mb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* Your logo navigates home on click */}
              <BarGodLogo size="text-2xl" />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Browse Battlers</h1>
                <p className="text-sm text-zinc-400">Community-built roster & 2K-style ratings.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setOpenAdd((v) => !v)} variant="primary">
                {openAdd ? "Close" : "+ New Battler"}
              </Button>
              <Link
                to="/battlers/upload"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
              >
                Upload a Battle
              </Link>
            </div>
          </div>
        </header>

        {/* Success banner from upload flow */}
        {uploadedFlag && (
          <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-3 text-sm">
            ✅ Battle uploaded. Thanks for contributing!
          </div>
        )}

        {/* Inline Add Battler panel */}
        {openAdd && (
          <form onSubmit={onCreate} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs opacity-80">Name *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Dizaster"
                  required
                />
              </div>
              <div>
                <label className="text-xs opacity-80">Photo URL</label>
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs opacity-80">Bio</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short intro or notable battles"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving…" : "Save Battler"}
              </Button>
              <Button type="button" onClick={() => setOpenAdd(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search battlers…"
              className="w-full sm:w-80 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs opacity-70">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {err && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">Error: {err}</div>
        )}
        {loading ? (
          <div className="text-sm text-zinc-400">Loading battlers…</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BattlerCard key={b.id} battler={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

}








