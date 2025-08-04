// src/components/therise/DailyQuestGrid.jsx

import React from 'react';
import { motion } from 'framer-motion';

const quests = [
  {
    id: 1,
    task: 'Land 3 Combo Chains in a single battle',
    reward: '+150 XP',
    completed: false
  },
  {
    id: 2,
    task: 'Equip a new passive before your next match',
    reward: '+25 Coins',
    completed: true
  },
  {
    id: 3,
    task: 'Watch 1 crew battle replay',
    reward: '+1 Mystery Crate',
    completed: false
  }
];

export default function DailyQuestGrid() {
  return (
    <div className="bg-gray-900 p-5 rounded-xl shadow-xl">
      <h3 className="text-xl font-bold text-lime-400 mb-4">Daily Missions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            whileHover={{ scale: 1.03 }}
            className={`p-4 rounded-lg border shadow-md transition-all duration-300 ${
              quest.completed ? 'bg-green-700 border-green-400' : 'bg-gray-800 border-gray-700'
            }`}
          >
            <p className="text-sm font-medium text-white mb-2">{quest.task}</p>
            <p className="text-xs text-gray-300">Reward: {quest.reward}</p>
            {quest.completed && (
              <p className="text-xs text-green-300 mt-1 font-semibold">✔ Completed</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}