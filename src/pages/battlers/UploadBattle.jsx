// src/pages/battlers/UploadBattle.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";

// Treat only RFC4122 UUIDs as valid; everything else ("0", "new", empty) is ignored
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function ensureBattlerId(maybeId, maybeName) {
  const cleanedId = UUID_RE.test(maybeId || "") ? maybeId : null;
  if (cleanedId) return { id: cleanedId, created: false };

  const name = (maybeName || "").trim();
  if (!name) return { id: null, created: false };

  // Try to find existing by name (case-insensitive)
  const { data: existing, error: findErr } = await supabase
    .from("battlers")
    .select("id")
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing?.id) return { id: existing.id, created: false };

  // Create a new minimal battler row (RLS must allow this insert)
  const { data: created, error: insErr } = await supabase
    .from("battlers")
    .insert([{ name }])
    .select("id")
    .single();
  if (insErr) throw insErr;
  return { id: created.id, created: true };
}

export default function UploadBattle() {
  const nav = useNavigate();
  const { id: routeIdRaw } = useParams();
  const routeId = UUID_RE.test(routeIdRaw || "") ? routeIdRaw : null;

  // UI state
  const [activeTab, setActiveTab] = useState("transcript"); // "transcript" | "link"
  const [linkType, setLinkType] = useState("video"); // meta hint: "video" | "link"

  const [battlerName, setBattlerName] = useState("");
  const [opponentName, setOpponentName] = useState("");

  const [text, setText] = useState(""); // transcript text
  const [url, setUrl] = useState("");   // link url

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Prefill header context if a valid :id is present
  const [routeBattler, setRouteBattler] = useState(null);
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!routeId) return;
      const { data, error } = await supabase
        .from("battlers")
        .select("id,name,photo_url,bio,stats")
        .eq("id", routeId)
        .maybeSingle();
      if (!ignore) setRouteBattler(error ? null : data);
    })();
    return () => { ignore = true; };
  }, [routeId]);

  // Simple validation
  const canSubmit = useMemo(() => {
    if (activeTab === "transcript") return text.trim().length > 0;
    return /^https?:\/\//i.test(url.trim());
  }, [activeTab, text, url]);

  async function onSubmit(e) {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErr(null);

    try {
      // Ensure battler/opponent IDs (create by name if needed)
      const ensuredA = await ensureBattlerId(routeId, battlerName);
      const ensuredB = await ensureBattlerId(null, opponentName);

      const payload = {
        type: activeTab === "transcript" ? "transcript" : linkType,
        payload_text: activeTab === "transcript" ? text : null,
        payload_url: activeTab === "transcript" ? null : url.trim(),
        battler_id: ensuredA.id,
        battler_name: battlerName || null, // store raw input for provenance
        opponent_id: ensuredB.id,
        opponent_name: opponentName || null,
        status: "pending",
      };

      const { error } = await supabase
        .from("uploads")
        .insert([payload])
        .select("id")
        .single();
      if (error) throw error;

      // Navigate back with success flag (BrowseBattlers reads ?uploaded=true)
      nav("/battlers?uploaded=true");
    } catch (e) {
      setErr(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight">Upload a Battle</h1>
          <Link to="/battlers" className="text-zinc-300 hover:underline">Back to Browse</Link>
        </header>

        {routeBattler && (
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 mb-4">
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              {routeBattler.photo_url ? (
                <img src={routeBattler.photo_url} alt={routeBattler.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs opacity-70">No Img</span>
              )}
            </div>
            <div>
              <div className="text-sm opacity-70">Uploading for</div>
              <div className="text-lg font-semibold">{routeBattler.name}</div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-3 py-2 rounded-xl border text-sm font-bold ${
              activeTab === "transcript"
                ? "border-lime-400 bg-lime-400 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >Transcript</button>
          <button
            onClick={() => setActiveTab("link")}
            className={`px-3 py-2 rounded-xl border text-sm font-bold ${
              activeTab === "link"
                ? "border-lime-400 bg-lime-400 text-black"
                : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >Video / Link</button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-80">Battler Name {routeId ? <>(preselected)</> : <>(or pick later)</>}</label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder={routeId ? "(Optional — using selected ID)" : "e.g., Dizaster"}
                value={battlerName}
                onChange={(e) => setBattlerName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs opacity-80">Opponent Name (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="e.g., Pat Stay"
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
              />
            </div>
          </div>

          {activeTab === "transcript" ? (
            <div>
              <label className="text-xs opacity-80">Transcript Text *</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                rows={10}
                placeholder="Paste the battle transcript here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs opacity-80">Link Type</label>
                <select
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value)}
                >
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs opacity-80">URL *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="https://…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {err && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">{String(err)}</div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" disabled={!canSubmit || loading}>
              {loading ? "Saving…" : "Save Upload"}
            </Button>
            <Link to="/battlers" className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800">
              Cancel
            </Link>
          </div>

          <div className="text-xs opacity-60">
            v1: We’ll auto-create battlers by name if they don’t exist yet. Owner-only edits coming next.
          </div>
        </form>
      </div>
    </div>
  );
}




