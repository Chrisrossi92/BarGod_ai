// src/components/therise/hometown/CityPin.jsx

import React from 'react';
import { motion } from 'framer-motion';

export default function CityPin({ city, isSelected, onSelect }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: city.x, top: city.y, transform: 'translate(-50%, -50%)' }}
      whileHover={{ scale: 1.3 }}
      animate={{ scale: isSelected ? 1.3 : 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <button
        onClick={() => onSelect(city.id)}
        className={`w-4 h-4 rounded-full ${
          isSelected ? 'bg-lime-400 ring-2 ring-white' : 'bg-lime-600'
        } shadow-md`}
        title={city.name}
      />
    </motion.div>
  );
}
