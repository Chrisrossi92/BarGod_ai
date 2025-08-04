// src/pages/TheRiseHub.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlayerStatsPanel from '../components/therise/PlayerStatsPanel';
import BuildCardWall from '../components/therise/BuildCardWall';
import NextRivalBanner from '../components/therise/NextRivalBanner';
import DailyQuestGrid from '../components/therise/DailyQuestGrid';
import CareerTrophyCase from '../components/therise/CareerTrophyCase';
import SocialTicker from '../components/therise/SocialTicker';
import BackgroundEnvironment from '../components/therise/BackgroundEnvironment';
import BarGodLogo from '../components/BarGodLogo';

export default function TheRiseHub() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-sans">
      <BackgroundEnvironment />

      <div className="absolute top-6 left-6 z-20 cursor-pointer" onClick={() => navigate('/')}> 
        <BarGodLogo size="text-2xl" />
      </div>

      <div className="relative z-10 px-4 lg:px-8 pt-10 max-w-7xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <PlayerStatsPanel />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <BuildCardWall />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
          <NextRivalBanner />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
          <DailyQuestGrid />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
          <CareerTrophyCase />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <SocialTicker />
        </motion.div>
      </div>
    </div>
  );
}