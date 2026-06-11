// src/components/battlers/UploadsList.jsx
import React from "react";

export default function UploadsList({ uploads = [] }) {
  if (!uploads.length) {
    return (
      <div className="text-xs text-zinc-400 border border-dashed border-zinc-700 rounded-lg px-3 py-2">
        No uploads yet. This section is coming soon.
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {uploads.map((u) => (
        <div
          key={u.id || u.name}
          className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2"
        >
          <span className="truncate max-w-[70%]">{u.name || "Untitled upload"}</span>
          {u.created_at && (
            <span className="text-xs text-zinc-500">
              {new Date(u.created_at).toLocaleString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
