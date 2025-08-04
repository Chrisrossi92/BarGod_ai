// src/components/therise/creator/ArchetypePreview.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import archetypes from '../../../logic/archetypes';

export default function ArchetypePreview({ selected }) {
  const data = archetypes[selected];

  return (
    <AnimatePresence mode="wait">
      {data && (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mt-4 p-4 rounded-xl border border-lime-500 bg-gray-800 text-white shadow-lg"
        >
          <h3 className="text-xl font-bold text-lime-400">{selected}</h3>
          <p className="text-sm mt-1 text-gray-300">{data.description}</p>
          <p className="italic text-lime-300 mt-2">"{data.quote}"</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

