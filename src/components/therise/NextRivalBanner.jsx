// src/components/therise/NextRivalBanner.jsx

import React from 'react';
import { motion } from 'framer-motion';

const nextOpponent = {
  name: 'MC Razor',
  tier: 'Regional Threat',
  style: 'Aggressive Punchliner',
  intro: 'You survived the locals... but Razor eats rookies alive.',
  moves: ['Haymaker', 'Overhead Setup', 'Combo Chain', 'Rebuttal Disarm']
};

export default function NextRivalBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-gradient-to-r from-red-800 to-pink-700 p-6 rounded-xl shadow-lg text-white"
    >
      <h3 className="text-xl font-bold mb-1">Next Rival: {nextOpponent.name}</h3>
      <p className="text-sm text-pink-200 italic mb-2">{nextOpponent.intro}</p>
      <p className="text-sm mb-2">Style: <span className="font-semibold text-yellow-300">{nextOpponent.style}</span> — Tier: {nextOpponent.tier}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        {nextOpponent.moves.map((move, i) => (
          <span
            key={i}
            className="bg-black bg-opacity-20 border border-white px-3 py-1 rounded-full shadow"
          >
            {move}
          </span>
        ))}
      </div>
    </motion.div>
  );
}