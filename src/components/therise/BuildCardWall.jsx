// src/components/therise/BuildCardWall.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const builds = [
  {
    name: 'Aggressive Punchliner',
    ovr: 87,
    style: 'High Impact',
    moves: ['Haymaker', 'Rebuttal', 'Crowd Hype', 'Combo Chain'],
    color: 'from-red-600 to-pink-500'
  },
  {
    name: 'Scheme Technician',
    ovr: 82,
    style: 'Narrative Control',
    moves: ['Setup', 'Stretch Rhyme', 'Angle Flipper', 'Double Entendre'],
    color: 'from-purple-700 to-indigo-500'
  },
  {
    name: 'New Build Slot',
    ovr: null,
    style: 'Create New',
    moves: [],
    color: 'from-gray-600 to-gray-800'
  }
];

export default function BuildCardWall() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {builds.map((build, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-br ${build.color} text-white p-4 rounded-xl shadow-lg flex flex-col items-start justify-between transition-all duration-300`}
        >
          <h3 className="text-xl font-bold mb-1">{build.name}</h3>
          <p className="text-sm text-gray-200 mb-3">{build.style}</p>

          {build.ovr !== null ? (
            <>
              <div className="text-sm mb-2">
                <span className="font-semibold">OVR:</span> {build.ovr}
              </div>
              <ul className="text-xs text-gray-100 space-y-1">
                {build.moves.map((move, i) => (
                  <li key={i}>• {move}</li>
                ))}
              </ul>
            </>
          ) : (
            <button
              onClick={() => navigate('/therise/create')}
              className="mt-auto px-4 py-1 text-sm bg-black bg-opacity-20 border border-white rounded-full hover:bg-white hover:text-black transition"
            >
              Create Build
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}