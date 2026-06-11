// src/pages/battlers/BattlerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/common/Button";
import FocalImage from "@/components/common/FocalImage";
import RateBattlerPanel from "@/components/battlers/RateBattlerPanel";
import UploadsList from "@/components/battlers/UploadsList";

/** Error boundary to keep a single bad section from blanking the page */
class SectionBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || String(err) };
  }
  componentDidCatch(err, info) {
    // eslint-disable-next-line no-console
    console.error("[SectionBoundary]", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs">
          {this.props.fallback || "Something went wrong in this section."}
          <div className="mt-1 opacity-70">{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BattlerProfile() {
  const { id } = useParams();
  const [battler, setBattler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function fetchBattler() {
    try {
      setLoading(true);
      setErr(null);
      const { data, error } = await supabase
        .from("battlers")
        .select(
          "id,name,bio,photo_url,stats,photo_focus_x,photo_focus_y,overall,rating_count"
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      setBattler(data || null);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBattler(); // eslint-disable-line
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 py-6 text-white">
        <div className="mx-auto w-full max-w-5xl">Loading…</div>
      </div>
    );
  }

  if (err || !battler) {
    return (
      <div className="min-h-screen bg-black px-4 py-6 text-white">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            {err || "Not found"}
          </div>
          <div className="mt-3">
            <Link to="/battlers" className="text-zinc-300 underline">
              ← Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fx = Number.isFinite(battler.photo_focus_x) ? battler.photo_focus_x : 50;
  const fy = Number.isFinite(battler.photo_focus_y) ? battler.photo_focus_y : 35;

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white" data-test-id="battler-profile-safe">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        {/* Header */}
        <header>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{battler?.name || "Battler"}</h1>
              {battler?.bio && (
                <p className="mt-1 max-w-3xl text-sm text-zinc-400">{battler.bio}</p>
              )}
              <div className="mt-1 text-xs text-zinc-400">
                {Number.isFinite(battler?.overall) ? (
                  <>Overall: <span className="font-semibold text-white">{battler.overall}</span></>
                ) : "No ratings yet"}
                {Number.isFinite(battler?.rating_count) && (
                  <> {" · "} <span className="font-semibold text-white">{battler.rating_count}</span> ratings</>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/battlers/${battler.id}/upload`}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
              >
                Upload a Battle
              </Link>
              <Link
                to="/battlers"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
              >
                Back to Browse
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <SectionBoundary fallback="Could not render image.">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <FocalImage
              src={battler?.photo_url || ""}
              alt={battler?.name || ""}
              focusX={fx}
              focusY={fy}
              aspect="16/7"
              className="rounded-none"
            />
          </div>
        </SectionBoundary>

        {/* Focus adjustment */}
        <SectionBoundary fallback="Focus controls failed to load.">
          <FocusControls
            row={battler}
            onSaved={(next) => setBattler((prev) => ({ ...prev, ...next }))}
          />
        </SectionBoundary>

        {/* Aggregated stats */}
        <SectionBoundary fallback="Attributes section failed to load.">
          <AttributesSection stats={battler?.stats} />
        </SectionBoundary>

        {/* Rate panel */}
        <SectionBoundary fallback="Rating panel failed to load.">
          <RateBattlerPanel battlerId={battler.id} onSaved={fetchBattler} />
        </SectionBoundary>

        {/* Battles / Uploads list */}
        <SectionBoundary fallback="Uploads list failed to load.">
          <UploadsList battlerId={battler.id} />
        </SectionBoundary>
      </div>
    </div>
  );
}

/** Attributes grid (safe when stats missing) */
function AttributesSection({ stats }) {
  if (!stats || typeof stats !== "object" || !Object.keys(stats).length) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <h2 className="mb-1 text-lg font-semibold">Attributes (community average)</h2>
        <div className="text-sm text-zinc-400">No ratings yet.</div>
      </section>
    );
  }
  const entries = Object.entries(stats);
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-3 text-lg font-semibold">Attributes (community average)</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entries.map(([k, v]) => {
          const n = Math.max(0, Math.min(100, Number(v) || 0));
          const label = k.replace(/_/g, " ");
          return (
            <div key={k}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="capitalize opacity-80">{label}</span>
                <span className="font-semibold">{n}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-lime-500" style={{ width: `${n}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Inline focus sliders (stores in battlers.photo_focus_x/y) */
function FocusControls({ row, onSaved }) {
  const [fx, setFx] = React.useState(row?.photo_focus_x ?? 50);
  const [fy, setFy] = React.useState(row?.photo_focus_y ?? 35);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  async function save() {
    try {
      setSaving(true);
      setMsg("");
      if (!row?.id) return;
      const payload = { photo_focus_x: fx, photo_focus_y: fy };
      const { error } = await supabase.from("battlers").update(payload).eq("id", row.id);
      if (error) throw error;
      onSaved?.(payload);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 1200);
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-2 text-sm opacity-80">Adjust Photo Focus</div>
      <div className="grid grid-cols-6 items-center gap-3">
        <label className="col-span-1 text-xs">X</label>
        <input
          className="col-span-4"
          type="range"
          min="0"
          max="100"
          value={fx}
          onChange={(e) => setFx(+e.target.value)}
        />
        <span className="text-xs">{fx}%</span>

        <label className="col-span-1 text-xs">Y</label>
        <input
          className="col-span-4"
          type="range"
          min="0"
          max="100"
          value={fy}
          onChange={(e) => setFy(+e.target.value)}
        />
        <span className="text-xs">{fy}%</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button onClick={save} disabled={saving || !row?.id} variant="primary">
          {saving ? "Saving…" : "Save Focus"}
        </Button>
        {msg && <span className="text-xs opacity-70">{msg}</span>}
      </div>
    </section>
  );
}





