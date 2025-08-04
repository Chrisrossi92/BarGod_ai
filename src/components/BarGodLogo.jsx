// src/components/BarGodLogo.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BarGodLogo({ size = 'text-3xl', center = false }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className={`cursor-pointer font-bold select-none ${size} ${center ? 'mx-auto' : 'ml-4'} text-white`}
      onClick={() => navigate('/')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-white">Bar</span>
      <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent">God</span>
      <span className="text-purple-400">.ai</span>
    </motion.div>
  );
}