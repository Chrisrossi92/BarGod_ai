// src/components/studio/BeatPicker.jsx
import React, { useEffect, useId } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function BeatPicker({ beatURL, beatName, onPick, onClear }) {
  const inputId = useId();

  useEffect(() => {
    return () => {
      if (beatURL) URL.revokeObjectURL(beatURL);
    };
  }, [beatURL]);

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onPick({ url, name: f.name });
  };

  return (
    <Card>
      <h3 className="font-semibold mb-2">Beat</h3>
      <div className="flex items-center gap-2 mb-2">
        <input id={inputId} className="hidden" type="file" accept="audio/*" onChange={onChange} />
        <label
          htmlFor={inputId}
          className="cursor-pointer bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm hover:bg-zinc-700"
        >
          {beatName ? "Change Beat" : "Pick a Beat"}
        </label>
        <span className="text-xs text-gray-400 truncate">{beatName || "No beat selected."}</span>
        {beatName && (
          <Button size="sm" onClick={onClear} className="ml-auto">
            Clear
          </Button>
        )}
      </div>
      {beatURL ? <audio src={beatURL} controls className="w-full" /> : null}
    </Card>
  );
}

