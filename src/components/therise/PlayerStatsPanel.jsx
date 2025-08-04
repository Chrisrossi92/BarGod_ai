// src/components/therise/PlayerStatsPanel.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

const avatarSvg = createAvatar(adventurer, {
  seed: 'BarGodUser123',
  backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
  radius: 50,
}).toString();

export default function PlayerStatsPanel() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 rounded-xl shadow-lg">
      {/* Animated Avatar */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-md"
        dangerouslySetInnerHTML={{ __html: avatarSvg }}
      />

      {/* Stats Info */}
      <div className="text-center md:text-left mt-4 md:mt-0 md:ml-6 flex-1">
        <h2 className="text-2xl font-bold tracking-wide">MC Legacy</h2>
        <p className="text-sm text-gray-400">Tier: <span className="text-yellow-400">Underground Champ</span></p>

        {/* XP Bar */}
        <div className="mt-2 w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '72%' }}
            transition={{ duration: 1.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-lime-500"
          />
        </div>
        <p className="text-xs mt-1 text-green-300">XP: 720 / 1000</p>
      </div>

      {/* Badge / Title */}
      <div className="mt-4 md:mt-0">
        <span className="inline-block px-4 py-1 bg-yellow-500 text-black rounded-full text-xs font-semibold shadow-md">
          "Punchline Prodigy"
        </span>
      </div>
    </div>
  );
}