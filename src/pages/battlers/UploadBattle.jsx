import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const box = { border: "1px solid #222", borderRadius: 12, background: "#0b0b0b", padding: 16 };
const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #222", background: "#0f0f0f", color: "#fff" };
const label = { fontSize: 12, opacity: 0.8, marginBottom: 6, display: "block" };
const tabBtn = (active) => ({
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid " + (active ? "#b9ff66" : "#222"),
  background: active ? "#b9ff66" : "#111",
  color: active ? "#061700" : "#fff",
  fontWeight: 800,
  cursor: "pointer"
});

async function lazySupabase() {
  try { return (await import("@/lib/supabaseClient")).default; }
  catch { return (await import("../../lib/supabaseClient.js")).default; }
}

// Ensure a battler id exists:
// - If id provided, return it
// - Else if name provided, find by exact name (case-insensitive). If missing, create it.
// Returns { id, created:boolean }
async function ensureBattlerId(supabase, maybeId, maybeName) {
  if (maybeId) return { id: maybeId, created: false };
  const name = (maybeName || "").trim();
  if (!name) return { id: null, created: false };

  // Try to find by name (case-insensitive)
  const { data: existing, error: findErr } = await supabase
    .from("battlers")
    .select("id")
    .ilike("name", name)   // ilike = case-insensitive equality pattern
    .limit(1)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing?.id) return { id: existing.id, created: false };

  // Create new battler row
  const { data: created, error: insErr } = await supabase
    .from("battlers")
    .insert([{ name }])
    .select("id")
    .single();

  if (insErr) throw insErr;
  return { id: created.id, created: true };
}

export default function UploadBattle() {
  const { id } = useParams(); // optional battler id if coming from profile
  const nav = useNavigate();

  const [activeTab, setActiveTab] = useState("transcript"); // transcript | link
  const [battlers, setBattlers] = useState([]);
  const [loadingBattlers, setLoadingBattlers] = useState(true);

  // mapping (either select an existing battler OR type a name)
  const [battlerId, setBattlerId] = useState(id || "");
  const [battlerName, setBattlerName] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [opponentName, setOpponentName] = useState("");

  // transcript tab
  const [text, setText] = useState("");
  const [fileErr, setFileErr] = useState(null);

  // link tab
  const [linkType, setLinkType] = useState("youtube"); // youtube | genius
  const [url, setUrl] = useState("");

  // global
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // load battlers for selects
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingBattlers(true);
        const supabase = await lazySupabase();
        const { data, error } = await supabase
          .from("battlers")
          .select("id,name")
          .order("name", { ascending: true });

        if (ignore) return;
        if (error) throw error;
        setBattlers(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoadingBattlers(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // read .txt files into the textarea
  async function handleFile(e) {
    setFileErr(null);
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".txt")) {
      setFileErr("Please pick a .txt file.");
      return;
    }
    const content = await f.text();
    setText(content);
  }

  const canSubmit = useMemo(() => {
    if (activeTab === "transcript") {
      if (!text.trim()) return false;
    } else {
      if (!url.trim()) return false;
    }
    if (!battlerId && !battlerName.trim()) return false; // must identify at least one battler
    return true;
  }, [activeTab, text, url, battlerId, battlerName]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!canSubmit) return;

    setSaving(true);
    try {
      const supabase = await lazySupabase();

      // Ensure IDs exist (auto-create if name typed)
      const ensuredA = await ensureBattlerId(supabase, battlerId, battlerName);
      const ensuredB = await ensureBattlerId(supabase, opponentId, opponentName);

      const payload = {
        type: activeTab === "transcript" ? "transcript" : linkType,
        payload_text: activeTab === "transcript" ? text : null,
        payload_url: activeTab === "transcript" ? null : url.trim(),

        battler_id: ensuredA.id,
        battler_name: battlerName || null, // keep original for provenance
        opponent_id: ensuredB.id,
        opponent_name: opponentName || null,

        status: "pending"
      };

      const { data, error } = await supabase
        .from("uploads")
        .insert([payload])
        .select("id")
        .single();

      if (error) throw error;

      // After creating battler(s), jump to main list for now
      nav("/battlers?uploaded=1");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to={id ? `/battlers/${id}` : "/battlers"} style={{ color: "#fff", textDecoration: "none", opacity: 0.8 }}>← Back</Link>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Upload Battle</h1>
        <span />
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 16, ...box }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={tabBtn(activeTab === "transcript")} onClick={() => setActiveTab("transcript")}>
            Transcript
          </button>
          <button type="button" style={tabBtn(activeTab !== "transcript")} onClick={() => setActiveTab("link")}>
            Link
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div>
            <label style={label}>Battler (choose existing OR type name)</label>
            <select value={battlerId} onChange={(e) => setBattlerId(e.target.value)} style={{ ...input, marginBottom: 8 }}>
              <option value="">— Select existing —</option>
              {battlers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input placeholder="Or type battler name…" value={battlerName} onChange={(e) => setBattlerName(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Opponent (optional)</label>
            <select value={opponentId} onChange={(e) => setOpponentId(e.target.value)} style={{ ...input, marginBottom: 8 }}>
              <option value="">— Select existing —</option>
              {battlers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input placeholder="Or type opponent name…" value={opponentName} onChange={(e) => setOpponentName(e.target.value)} style={input} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          {activeTab === "transcript" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={label}>Paste transcript</label>
                <textarea
                  rows={10}
                  style={{ ...input, resize: "vertical", fontFamily: "ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace" }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="[Round 1: A] ...\n[Round 1: B] ..."
                />
              </div>
              <div>
                <label style={label}>Or upload .txt</label>
                <input type="file" accept=".txt" onChange={handleFile} />
                {fileErr && <div style={{ color: "#ffbfbf", marginTop: 6 }}>{fileErr}</div>}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={label}>Link type</label>
                <select value={linkType} onChange={(e) => setLinkType(e.target.value)} style={input}>
                  <option value="youtube">YouTube</option>
                  <option value="genius">Genius</option>
                </select>
              </div>
              <div>
                <label style={label}>URL</label>
                <input
                  style={input}
                  placeholder={linkType === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://genius.com/..."}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {err && (
          <div style={{ marginTop: 12, padding: 10, border: "1px solid #6b0000", borderRadius: 8, background: "#190000", color: "#ffbfbf" }}>
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="submit"
            disabled={!canSubmit || saving}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #b9ff66", background: "#b9ff66", color: "#061700", fontWeight: 800, opacity: !canSubmit || saving ? 0.6 : 1 }}
          >
            {saving ? "Submitting…" : "Submit Upload"}
          </button>
          <Link to={id ? `/battlers/${id}` : "/battlers"} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #222", background: "#111", color: "#fff", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>
          v1: Your upload is saved. We auto-created battlers if needed. Next phase will parse and score.
        </div>
      </form>
    </div>
  );
}



