// src/components/home/FeatureHighlights.jsx

import React from 'react';

const features = [
  {
    title: "Train Your Craft",
    description: "Use bar builders, round finishers, and AI sparring tools to sharpen your pen.",
  },
  {
    title: "Simulate Battles",
    description: "Put battlers head-to-head using stat-based matchups and strategic move selection.",
  },
  {
    title: "Explore the Culture",
    description: "Dive into transcripts, profiles, and classic battles from your favorite leagues.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="px-4 space-y-6 max-w-md mx-auto mb-10">
      {features.map((feature, index) => (
        <div key={index} className="bg-gray-800 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-300">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}