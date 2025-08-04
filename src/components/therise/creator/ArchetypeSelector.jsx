// src/components/therise/creator/ArchetypeSelector.jsx

import React from 'react';

const archetypes = [
  {
    id: 'punchliner',
    name: 'Aggressive Punchliner',
    desc: 'Specializes in direct attacks and explosive setups. High power, low defense.',
    example: '"You talk tough in your raps, but I’ve seen puddles with more depth."'
  },
  {
    id: 'schemer',
    name: 'Scheme Technician',
    desc: 'Crafts intricate wordplay and layered concepts. Great for wearing down opponents.',
    example: '"I got schemes in my bars like dreams in REM — deep, real, and back-to-back."'
  },
  {
    id: 'controller',
    name: 'Crowd Controller',
    desc: 'Commands attention and energy. Boosts crowd reaction, thrives on momentum.',
    example: '"The crowd’s reacting before I even punch — that’s gravity in my presence."'
  },
  {
    id: 'wildcard',
    name: 'Freestyle Wildcard',
    desc: 'Unpredictable and creative. Gets bonuses for improv and off-the-dome heat.',
    example: '"They said ‘go freestyle,’ so I unplugged the mic and used it as a weapon."'
  }
];

export default function ArchetypeSelector({ value, onChange }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl text-white space-y-6">
      <h3 className="text-lg font-bold text-lime-400">Select Your Archetype</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {archetypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`text-left p-4 rounded-lg border transition duration-200 shadow-md hover:shadow-lg
              ${value === type.id ? 'border-lime-400 bg-gray-800' : 'border-gray-700 bg-gray-950'}`}
          >
            <h4 className="text-md font-semibold text-white mb-1">{type.name}</h4>
            <p className="text-xs text-gray-300 mb-2">{type.desc}</p>
            <blockquote className="text-xs italic text-lime-300">{type.example}</blockquote>
          </button>
        ))}
      </div>
    </div>
  );
}