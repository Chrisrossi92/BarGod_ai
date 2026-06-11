// src/components/studio/BeatPicker.jsx
import React, { useEffect, useState, useRef } from "react";

// Simple default beats. These paths assume you’ll eventually drop MP3s
// into /public/beats; they won’t break the build if missing.
const DEFAULT_BEATS = [
  {
    id: "ny-grit-90",
    name: "NY Grit (90 BPM)",
    src: "/beats/ny-grit-90.mp3",
  },
  {
    id: "boom-bap-92",
    name: "Classic Boom Bap (92 BPM)",
    src: "/beats/boom-bap-92.mp3",
  },
  {
    id: "trap-140",
    name: "Trap Energy (140 BPM)",
    src: "/beats/trap-energy-140.mp3",
  },
];

const RECENTS_KEY = "bargod_recent_beats_v1";

function loadRecents() {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 6);
  } catch {
    return [];
  }
}

function saveRecents(recents) {
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, 6)));
  } catch {
    // ignore
  }
}

export default function BeatPicker({ beatURL, beatName, onPick, onClear }) {
  const [showMenu, setShowMenu] = useState(false);
  const [recents, setRecents] = useState([]);
  const previewAudioRef = useRef(null);
  const [previewId, setPreviewId] = useState(null);

  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  const currentLabel = beatName || "No beat selected.";

  function handlePickBeat(beat) {
    // If it’s a default beat, we just use its src; if it’s a recent upload,
    // it should already have src set.
    const payload = { url: beat.src, name: beat.name };
    onPick?.(payload);

    // Update recents
    setRecents((prev) => {
      const next = [
        { id: beat.id || beat.src, name: beat.name, src: beat.src, type: beat.type || "default" },
        ...prev.filter((b) => (b.id || b.src) !== (beat.id || beat.src)),
      ];
      saveRecents(next);
      return next;
    });
    setShowMenu(false);
  }

  function handleUploadChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const beat = {
      id: `upload-${file.name}-${file.size}-${file.lastModified}`,
      name: file.name.replace(/\.[a-z0-9]+$/i, ""),
      src: url,
      type: "upload",
    };
    handlePickBeat(beat);
  }

  const hasSelection = !!beatName;

  function togglePreview(beat) {
    const id = beat.id || beat.src;
    const src = beat.src;
    if (!src) return;

    // If we’re already previewing this beat, stop it
    if (previewId === id && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
      setPreviewId(null);
      return;
    }

    // Stop any existing preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    try {
      const audio = new Audio(src);
      audio.volume = 0.9;
      audio.play().catch(() => {
        // ignore play errors (browser autoplay rules)
      });
      previewAudioRef.current = audio;
      setPreviewId(id);

      audio.onended = () => {
        if (previewAudioRef.current === audio) {
          previewAudioRef.current = null;
          setPreviewId((current) => (current === id ? null : current));
        }
      };
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs text-zinc-400 mb-1">Beat</div>
          <div className="text-sm px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-between gap-3">
            <span className="truncate">{currentLabel}</span>
            <div className="flex items-center gap-2">
              {hasSelection && (
                <button
                  type="button"
                  onClick={() => {
                    onClear?.();
                  }}
                  className="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowMenu((v) => !v)}
                className="text-xs px-2 py-1 rounded-lg bg-white text-black hover:bg-zinc-100"
              >
                Pick a Beat
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="mt-2 rounded-xl border border-zinc-700 bg-zinc-950 shadow-lg p-3 space-y-3 z-20">
          <div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
              Default Packs
            </div>
            <div className="flex flex-col gap-1">
              {DEFAULT_BEATS.map((beat) => {
                const id = beat.id;
                const isPreviewing = previewId === id;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => handlePickBeat({ ...beat, type: "default" })}
                      className="flex-1 text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-lime-400 hover:bg-zinc-800 transition text-left truncate"
                    >
                      {beat.name}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePreview({ ...beat, type: "default" });
                      }}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        isPreviewing
                          ? "border-emerald-400 text-emerald-300"
                          : "border-zinc-700 text-zinc-300"
                      } hover:border-emerald-400 hover:text-emerald-300 transition`}
                    >
                      {isPreviewing ? "⏸" : "▶"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
              Recent Beats
            </div>
            {recents.length === 0 ? (
              <div className="text-xs text-zinc-600">No recent beats yet.</div>
            ) : (
              <div className="flex flex-col gap-1">
                {recents.map((beat) => {
                  const id = beat.id || beat.src;
                  const isPreviewing = previewId === id;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => handlePickBeat(beat)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-sky-400 hover:bg-zinc-800 transition text-left truncate"
                      >
                        {beat.name}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreview(beat);
                        }}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          isPreviewing
                            ? "border-emerald-400 text-emerald-300"
                            : "border-zinc-700 text-zinc-300"
                        } hover:border-emerald-400 hover:text-emerald-300 transition`}
                      >
                        {isPreviewing ? "⏸" : "▶"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="text-xs text-zinc-400 inline-flex items-center gap-2 cursor-pointer">
              <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition">
                Upload beat…
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleUploadChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
