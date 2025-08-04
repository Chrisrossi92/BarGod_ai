// src/components/therise/SocialTicker.jsx

import React from 'react';
import { motion } from 'framer-motion';

const updates = [
  '🔥 New Crew Battle: The Syndicate vs. GoldBarz — Watch Now!',
  '👑 Top Rank This Week: Lil Nexus (Rank 1)',
  '🎤 MC Razor just released a post-battle interview!',
  '⚔️ Daily Challenge Reset — Claim your streak bonus!'
];

export default function SocialTicker() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gray-900 border-t border-b border-gray-700 py-3 px-4 overflow-hidden"
    >
      <div className="text-sm text-lime-400 whitespace-nowrap animate-marquee flex gap-10">
        {updates.map((item, idx) => (
          <span key={idx}>{item}</span>
        ))}
      </div>
    </motion.div>
  );
}