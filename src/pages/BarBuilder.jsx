// src/pages/BarBuilder.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Shared header logo (clicks to "/")
import BarGodLogo from "@/components/BarGodLogo";

// Existing builder UI bits
import SyllableCounter from "@/components/barbuilder/SyllableCounter";
import SaveStatus from "@/components/barbuilder/SaveStatus";
import RhymeSettingsPanel from "@/components/barbuilder/RhymeSettingsPanel";

// My Work (Vault) helpers
import { getById, upsertLyric } from "@/utils/myWorkStore";

/* ---------------- helpers: simple, reliable rhyme preview ---------------- */
// Tail from last vowel to end (rough end-rhyme key)
function rhymeTail(word) {
  const w = (word || "").toLowerCase().replace(/[^a-zà-öø-ÿ']/gi, "");
  const m = w.match(/[aeiouyà-öø-ÿ][a-zà-öø-ÿ']*$/i);
  return m ? m[0] : w || null;
}

function SimpleRhymePreview({ text }) {
  const lines = (text || "").split(/\r?\n/);

  // Collect last-word tails and counts
  const { tails, tally } = useMemo(() => {
    const lastWords = lines.map((line) => {
      const words = line.match(/[A-Za-zÀ-ÖØ-öø-ÿ']+(?:[-'][A-Za-zÀ-ÖØ-öø-ÿ']+)*/g);
      return words && words.length ? words[words.length - 1] : null;
    });
    const ts = lastWords.map((w) => (w ? rhymeTail(w) : null));
    const t = ts.reduce((acc, x) => (x ? ((acc[x] = (acc[x] || 0) + 1), acc) : acc), {});
    return { tails: ts, tally: t };
  }, [text]);

  // Choose most common tail if at least 2 lines share it
  const topTail = useMemo(() => {
    const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return entries.length && entries[0][1] >= 2 ? entries[0][0] : null;
  }, [tally]);

  return (
    <div data-test="rhyme-preview" className="whitespace-pre-wrap leading-7">
      {lines.map((line, li) => {
        const tokens = line.split(/(\s+)/); // keep spaces
        let lastWordIdx = -1;
        for (let i = tokens.length - 1; i >= 0; i--) {
          if (/[A-Za-zÀ-ÖØ-öø-ÿ']+/.test(tokens[i])) { lastWordIdx = i; break; }
        }

        if (lastWordIdx !== -1) {
          const raw = tokens[lastWordIdx];
          const tail = rhymeTail(raw);
          const shouldHighlight = topTail && tail === topTail;

          if (shouldHighlight) {
            tokens[lastWordIdx] = (
              <span
                key={`w-${li}-${lastWordIdx}`}
                className="rh inline-block"
                style={{
                  fontWeight: 800,
                  padding: "0 .2rem",
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  background: "rgba(163, 230, 53, .18)", // lime overlay for clarity
                  borderRadius: "4px",
                }}
              >
                {raw}
              </span>
            );
          }
        }

        return (
          <div key={`line-${li}`}>
            {tokens.map((t, i) => (
              <React.Fragment key={`frag-${li}-${i}`}>{t}</React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
}
/* ------------------------------------------------------------------------ */

export default function BarBuilder() {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const [itemId, setItemId] = useState(null);   // My Work id when editing an existing lyric
  const [title, setTitle] = useState("");       // title for My Work
  const [bars, setBars] = useState("");         // main textarea content
  const [syllables, setSyllables] = useState(0);
  const [saved, setSaved] = useState(true);

  // Settings (depth/internal toggle surfaced for future phoneme highlighter)
  const [depth, setDepth] = useState(2);
  const [internal, setInternal] = useState(false);

  // Load an existing lyric if ?open=id, else hydrate from local draft
  useEffect(() => {
    const openId = search.get("open");
    if (openId) {
      const item = getById(openId);
      if (item && item.type === "lyric") {
        setItemId(item.id);
        setTitle(item.title || "");
        setBars(item.content || "");
        return;
      }
    }
    const draft = localStorage.getItem("draft-bars");
    if (draft) setBars(draft);
  }, [search]);

  // Syllable count (basic heuristic)
  useEffect(() => {
    const words = bars.split(/\s+/);
    const count = words.reduce((acc, word) => {
      const matches = word.toLowerCase().match(/[aeiouy]+/g);
      return acc + (matches ? matches.length : 0);
    }, 0);
    setSyllables(count);
  }, [bars]);

  // Debounced autosave to localStorage + My Work (Vault)
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("draft-bars", bars);
      const id = upsertLyric({
        id: itemId || undefined,
        title: title || "Draft Bars",
        content: bars,
      });
      if (!itemId) setItemId(id); // capture id so subsequent edits update same record
      setSaved(true);
    }, 450);
    setSaved(false);
    return () => clearTimeout(t);
  }, [bars, title]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Top bar: Logo → Home, plus sub-nav buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        <BarGodLogo size="text-2xl" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/training-room")}
            className="text-sm bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 rounded-lg px-3 py-1.5"
          >
            Training Room
          </button>
          <button
            onClick={() => navigate("/my-work")}
            className="text-sm bg-white text-black rounded-lg px-3 py-1.5"
          >
            My Work
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">
        <h1 className="text-3xl font-bold text-center mb-1">Bar Builder</h1>
        <p className="text-center text-gray-400 text-sm mb-3">
          Write, analyze, and refine your bars.
        </p>

        {/* Title + status row */}
        <div className="flex items-center justify-between gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          />
          <SyllableCounter count={syllables} />
          <SaveStatus saved={saved} />
        </div>

        <RhymeSettingsPanel
          depth={depth}
          setDepth={setDepth}
          internal={internal}
          setInternal={setInternal}
        />

        <textarea
          value={bars}
          onChange={(e) => setBars(e.target.value)}
          placeholder="Start writing your bars here..."
          rows={10}
          className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-lime-400 shadow-md mb-4"
        />

        {/* Rhyme preview */}
        <div className="bg-zinc-800 p-4 mt-4 rounded-xl border border-zinc-700">
          <h3 className="text-lime-300 font-semibold mb-2">Rhyme Highlighting</h3>
          <p className="text-gray-300 text-sm mb-3">
            Preview of detected end rhymes. (We’ll swap in the phoneme-based version next.)
          </p>
          <SimpleRhymePreview text={bars} />
        </div>
      </div>
    </div>
  );
}



