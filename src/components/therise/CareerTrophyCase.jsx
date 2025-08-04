// src/components/therise/CareerTrophyCase.jsx

import React from 'react';
import { motion } from 'framer-motion';

const trophies = [
  { title: 'First Win', desc: 'Won your first battle in The Rise', unlocked: true },
  { title: 'Rival Defeated: MC Razor', desc: 'Climbed past Razor in Regional Tier', unlocked: false },
  { title: 'Flawless Victory', desc: 'Won a battle without taking damage', unlocked: true },
  { title: 'Combo Lord', desc: 'Landed 10+ combo chains in a single arc', unlocked: false },
];

export default function CareerTrophyCase() {
  return (
    <div className="bg-gray-950 p-6 rounded-xl shadow-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Trophy Case</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trophies.map((trophy, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              trophy.unlocked ? 'border-yellow-400 bg-yellow-100 text-black' : 'border-gray-700 bg-gray-800 text-gray-500'
            }`}
          >
            <h4 className="font-semibold text-md">{trophy.title}</h4>
            <p className="text-xs mt-1">{trophy.desc}</p>
            {!trophy.unlocked && <p className="text-xs italic mt-2">Locked</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}