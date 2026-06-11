// src/components/battlers/RateBattlerPanel.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";

const ATTRS = [
  ["punches", "Punches"],
  ["schemes", "Schemes"],
  ["rebuttals", "Rebuttals"],
  ["delivery", "Delivery"],
  ["performance", "Performance"],
  ["humor", "Humor"],
  ["crowd_control", "Crowd Control"],
  ["freestyle", "Freestyle"],
  ["originality", "Originality"],
  ["intangibles", "Intangibles"],
];

const DEFAULT_SCORES = Object.fromEntries(ATTRS.map(([k]) => [k, 50]));
const clamp = (n) => {
  const v = Number(n);
  if (Number.isNaN(v)) return 50;
  return Math.max(0, Math.min(100, v));
};

export default function RateBattlerPanel({
  battlerId,
  onSaved,               // callback to refresh parent (profile)
  requireAuth = true,    // set false only if RLS allows anon inserts
  className = "",
}) {
  const [user, setUser] = React.useState(null);
  const [ratingId, setRatingId] = React.useState(null);
  const [scores, setScores] = React.useState(DEFAULT_SCORES);
  const [note, setNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Helper: load existing rating for this user (if any)
  const loadExisting = React.useCallback(async (u) => {
    if (!u?.id || !battlerId) return;
    const { data, error } = await supabase
      .from("battler_ratings")
      .select("id,scores,note")
      .eq("battler_id", battlerId)
      .eq("created_by", u.id)
      .maybeSingle();
    if (!error && data) {
      const merged = { ...DEFAULT_SCORES, ...(data.scores || {}) };
      for (const k of Object.keys(merged)) merged[k] = clamp(merged[k]);
      setScores(merged);
      setNote(data.note || "");
      setRatingId(data.id);
    }
  }, [battlerId]);

  // Initial session + subscription to auth changes
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      if (data?.user) await loadExisting(data.user);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      setRatingId(null);
      setScores(DEFAULT_SCORES);
      setNote("");
      if (u) await loadExisting(u);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [loadExisting]);

  function setScore(k, v) {
    setScores((prev) => ({ ...prev, [k]: clamp(v) }));
  }

  async function save() {
    try {
      setMsg("");

      if (requireAuth) {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) {
          navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
          return;
        }
      }

      setSaving(true);

      // sanitize payload (ensure ints 0–100)
      const clean = {};
      for (const [k] of ATTRS) clean[k] = clamp(scores[k]);

      if (ratingId) {
        const { error } = await supabase
          .from("battler_ratings")
          .update({ scores: clean, note })
          .eq("id", ratingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("battler_ratings")
          .insert([{ battler_id: battlerId, scores: clean, note }])
          .select("id")
          .single();
        if (error) throw error;
        setRatingId(data.id);
      }

      setMsg("Saved!");
      onSaved?.(); // recompute → parent refreshes battler stats & counts
      setTimeout(() => setMsg(""), 1200);
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setScores(DEFAULT_SCORES);
    setNote("");
    setMsg("");
  }

  return (
    <section className={`mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rate this Battler</h2>
        {requireAuth && !user && (
          <button
            type="button"
            onClick={() => navigate(`/login?next=${encodeURIComponent(location.pathname)}`)}
            className="text-xs text-zinc-300 underline"
          >
            Sign in to save your rating
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ATTRS.map(([key, label]) => {
          const val = clamp(scores[key]);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="opacity-80">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val}
                onChange={(e) => setScore(key, e.target.value)}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <label className="text-xs opacity-80">Note (optional)</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
          rows={3}
          placeholder="What stands out about this battler?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {msg && (
        <div className="mt-3 rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs">
          {msg}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={save} variant="primary" disabled={saving || !battlerId}>
          {saving ? "Saving…" : "Save Rating"}
        </Button>
        <Button onClick={reset} className="text-xs">
          Reset
        </Button>
      </div>
    </section>
  );
}

