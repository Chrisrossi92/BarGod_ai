// src/components/studio/TakePlayer.jsx
import React from "react";
import Card from "@/common/Card";

export default function TakePlayer({ audioURL }) {
  return (
    <Card>
      <h3 className="font-semibold mb-2">Take</h3>
      {audioURL ? (
        <audio src={audioURL} controls className="w-full" />
      ) : (
        <p className="text-sm text-gray-400">No take recorded yet.</p>
      )}
    </Card>
  );
}
