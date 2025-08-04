// src/components/therise/moves/MoveCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

export default function MoveCard({ move, selected, onClick, disabled }) {
  const baseColor =
    move.type === 'Punchline'
      ? 'border-red-500'
      : move.type === 'Setup'
      ? 'border-blue-400'
      : move.type === 'Defense'
      ? 'border-yellow-400'
      : 'border-gray-600';

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative p-4 rounded-lg bg-[#1a1c23] border-2 ${baseColor} transition-all duration-200 cursor-pointer ${
        selected ? 'ring-2 ring-lime-400' : ''
      } ${disabled && !selected ? 'opacity-30 pointer-events-none' : ''}`}
      onClick={onClick}
    >
      <div className="text-white font-semibold text-md">{move.name}</div>
      <div className="text-sm text-gray-400 mt-1">{move.description}</div>

      <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-neutral-800 text-lime-400 border border-lime-500 uppercase tracking-wide">
        {move.type}
      </div>
    </motion.div>
  );
}
