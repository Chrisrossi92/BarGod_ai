import React, { useMemo } from "react";

const REACTIONS = [
  "🔥 Crowd goes crazy!",
  "😮 Haymaker landed!",
  "😂 Room in stitches.",
  "🤯 Scheme had ‘em shook.",
  "🧠 Layered wordplay appreciated up front.",
];

export default function CrowdReaction({ seed = "" }) {
  const text = useMemo(() => {
    // lightweight deterministic pick
    let sum = 0;
    for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
    return REACTIONS[sum % REACTIONS.length];
  }, [seed]);

  return (
    <div className="text-xs text-zinc-400">{text}</div>
  );
}