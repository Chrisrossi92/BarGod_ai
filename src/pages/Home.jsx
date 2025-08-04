// src/pages/Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mic, Flame, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* LOGO + Hero */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 bg-clip-text text-transparent"
        >
          BarGod.ai
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-300 max-w-xl mx-auto"
        >
          Where battle rap gets rated. Train your moves, simulate your performance, and rise through the ranks in the world’s first AI-powered battle rap sim.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/therise/create')}
          className="bg-lime-500 hover:bg-lime-600 text-black font-bold px-6 py-3 rounded-full shadow-lg transition"
        >
          Start Building a Battler
        </motion.button>
      </div>

      {/* Action Grid */}
      <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ActionCard
          icon={<Brain className="text-lime-400" size={28} />}
          title="Train Your Craft"
          desc="Sharpen your bars, moves, and setups in a simulated lab."
          onClick={() => navigate('/train')}
        />

        <ActionCard
          icon={<Mic className="text-blue-400" size={28} />}
          title="Simulate Battles"
          desc="Face off in AI matchups using your custom loadout."
          onClick={() => navigate('/simulate')}
        />

        <ActionCard
          icon={<Users className="text-violet-400" size={28} />}
          title="Browse Battlers"
          desc="View top-tier builds, records, and stats from the culture."
          onClick={() => navigate('/battlers')}
        />

        <ActionCard
          icon={<Flame className="text-red-400" size={28} />}
          title="Explore the Culture"
          desc="Dive into transcripts, bar ratings, and AI breakdowns."
          onClick={() => navigate('/culture')}
        />
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      className="cursor-pointer bg-[#12131a] p-5 rounded-xl border border-neutral-700 hover:border-lime-400 transition shadow-md"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </motion.div>
  );
}



