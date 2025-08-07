import React from "react";

export default function SyllableCounter({ count }) {
  return (
    <div className="text-center text-sm text-lime-400 mb-2">
      Syllables: <span className="font-semibold">{count}</span>
    </div>
  );
}