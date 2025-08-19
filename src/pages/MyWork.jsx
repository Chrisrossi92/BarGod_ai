import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll, removeItem, migrateDraftBars } from "@/utils/myWorkStore";

export default function MyWork() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all | lyric | take
  const [query, setQuery] = useState("");

  useEffect(() => {
    migrateDraftBars(); // safe no-op if already migrated
    setItems(getAll());
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((it) => (filter === "all" ? true : it.type === filter))
      .filter((it) =>
        (it.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (it.content || "").toLowerCase().includes(query.toLowerCase())
      );
  }, [items, filter, query]);

  const openItem = (it) => {
    if (it.type === "lyric") {
      // Pass id so Builder can load content later (optional enhancement)
      navigate(`/bar-builder?open=${it.id}`);
    } else {
      navigate(`/recording-studio?open=${it.id}`);
    }
  };

  const onDelete = (id) => {
    removeItem(id);
    setItems(getAll());
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">My Work</h1>
            <p className="text-sm text-gray-400">Your saved lyrics and recorded takes.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/bar-builder")} className="bg-white text-black px-3 py-1.5 rounded-lg text-sm">
              + New Lyric
            </button>
            <button onClick={() => navigate("/recording-studio")} className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm">
              + New Take
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700">
            {["all", "lyric", "take"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm ${filter === f ? "bg-zinc-800" : ""}`}
              >
                {f === "all" ? "All" : f === "lyric" ? "Lyrics" : "Takes"}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles & content…"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm w-full sm:w-72"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-400 italic col-span-full">Nothing saved yet.</div>
          ) : (
            filtered.map((it) => (
              <div key={it.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800">
                      {it.type === "lyric" ? "Lyric" : "Take"}
                    </span>
                    <h3 className="text-lg font-semibold">{it.title || "Untitled"}</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(it.updatedAt).toLocaleString()}
                  </span>
                </div>

                {it.type === "lyric" ? (
                  <p className="text-sm text-gray-300 line-clamp-3 whitespace-pre-wrap">{it.content}</p>
                ) : (
                  <p className="text-sm text-gray-300">
                    {it.beatName ? `Beat: ${it.beatName}` : "No beat info"}
                    {typeof it.duration === "number" ? ` • ${Math.round(it.duration)}s` : ""}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => openItem(it)}
                    className="bg-white text-black px-3 py-1.5 rounded-lg text-sm"
                  >
                    Open in {it.type === "lyric" ? "Builder" : "Studio"}
                  </button>
                  <button
                    onClick={() => onDelete(it.id)}
                    className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
