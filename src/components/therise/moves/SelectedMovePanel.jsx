// src/components/therise/moves/SelectedMovePanel.jsx

import React from 'react';
import { Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectedMovePanel({ moves, onRemove, onClear }) {
  if (moves.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">Selected Moves ({moves.length}/4)</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {moves.map((move) => (
            <motion.div
              key={move.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
              className="relative p-3 bg-gray-800 rounded-lg border border-lime-400"
            >
              <div className="text-white text-sm font-medium">{move.name}</div>
              <div className="text-xs text-gray-400">{move.type}</div>
              <button
                onClick={() => onRemove(move)}
                className="absolute top-1 right-1 text-gray-400 hover:text-red-400"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
