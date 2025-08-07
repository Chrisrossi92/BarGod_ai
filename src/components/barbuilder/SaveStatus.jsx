import React from "react";

export default function SaveStatus({ saved }) {
  return (
    <div className="text-center text-xs text-gray-500 italic mb-4">
      {saved ? "Saved" : "Saving..."}
    </div>
  );
}