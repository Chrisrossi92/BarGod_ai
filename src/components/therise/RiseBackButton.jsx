// src/components/therise/RiseBackButton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function RiseBackButton({ to = '/therise' }) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(to)}
      className="mb-6 flex items-center gap-2 text-sm font-medium text-lime-400 hover:text-white transition duration-200"
    >
      <ArrowLeft size={16} />
      Back to The Rise
    </motion.button>
  );
}