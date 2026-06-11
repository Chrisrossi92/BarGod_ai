// src/components/battlers/UploadsList.jsx
import React from "react";
import supabase from "@/lib/supabaseClient";

function TypeBadge({ type }) {
  const label = (type || "").toUpperCase();
  return (
    <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] tracking-wide">
      {label || "UNKNOWN"}
    </span>
  );
}

function StatusDot({ status }) {
  const color =
    status === "approved" ? "bg-lime-500" :
    status === "rejected" ? "bg-red-500" :
    "bg-zinc-500";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}

export default function UploadsList({ battlerId, className = "" }) {
  const id = typeof battlerId === "string" ? battlerId : battlerId?.toString?.() ?? null;

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let ignore = false;

    async function load() {
      if (!id) {
        if (!ignore) { setRows([]); setErr(""); setLoading(false); }
        return;
      }
      try {
        setLoading(true);
        setErr("");

        const [a, b] = await Promise.all([
          supabase
            .from("uploads")
            .select("id,created_at,type,status,payload_url,payload_text,battler_id,battler_name,opponent_id,opponent_name")
            .eq("battler_id", id)
            .order("created_at", { ascending: false })
            .limit(50),
          supabase
            .from("uploads")
            .select("id,created_at,type,status,payload_url,payload_text,battler_id,battler_name,opponent_id,opponent_name")
            .eq("opponent_id", id)
            .order("created_at", { ascending: false })
            .limit(50),
        ]);

        const error = a.error || b.error || null;
        if (error) throw error;

        const merged = [...(a.data || []), ...(b.data || [])]
          .sort((x, y) => (new Date(y.created_at) - new Date(x.created_at)))
          .slice(0, 50);

        if (!ignore) { setRows(merged); setLoading(false); }
      } catch (e) {
        if (!ignore) { setErr(e.message || String(e)); setRows([]); setLoading(false); }
      }
    }

    load();
    return () => { ignore = true; };
  }, [id]);

  if (loading) {
    return (
      <section className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
        <div className="text-sm text-zinc-400">Loading uploads…</div>
      </section>
    );
  }

  if (err) {
    return (
      <section className={`rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm ${className}`}>
        Error: {err}
      </section>
    );
  }

  if (!id || rows.length === 0) {
    return (
      <section className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
        <h2 className="mb-1 text-lg font-semibold">Battles / Uploads</h2>
        <div className="text-sm text-zinc-400">No uploads yet.</div>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      <h2 className="mb-3 text-lg font-semibold">Battles / Uploads</h2>
      <ul className="space-y-2">
        {rows.map((r) => {
          const viewingAsA = r?.battler_id === id;
          const opponent = viewingAsA ? (r?.opponent_name || "Opponent") : (r?.battler_name || "Opponent");
          const created = r?.created_at ? new Date(r.created_at).toLocaleDateString() : "";
          const preview = r?.payload_text
            ? (r.payload_text.length > 160 ? r.payload_text.slice(0, 160) + "…" : r.payload_text)
            : null;

          return (
            <li key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={r?.status} />
                  <TypeBadge type={r?.type} />
                  <span className="text-xs text-zinc-400">vs</span>
                  <span className="text-xs font-semibold">{opponent}</span>
                </div>
                <div className="text-[10px] text-zinc-500">{created}</div>
              </div>

              {preview && (
                <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{preview}</p>
              )}

              {r?.payload_url && (
                <div className="mt-2">
                  <a
                    href={r.payload_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs hover:bg-zinc-800"
                  >
                    Watch
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}


