// src/components/battlers/BattlerGrid.jsx

import React from 'react';
import StatCard from '../StatCard';

const dummyProfiles = [
  {
    name: 'Dizaster',
    overall: 95,
    attributes: {
      rhyming: 96,
      rebuttals: 94,
      humor: 76,
      aggression: 98,
      storytelling: 81,
      creativity: 90,
      crowdControl: 93,
      presence: 92
    },
    strengths: ['aggression', 'rebuttals', 'crowdControl'],
    weaknesses: ['humor']
  },
  {
    name: 'Pat Stay',
    overall: 94,
    attributes: {
      rhyming: 91,
      rebuttals: 85,
      humor: 96,
      aggression: 78,
      storytelling: 89,
      creativity: 92,
      crowdControl: 88,
      presence: 93
    },
    strengths: ['humor', 'presence', 'creativity'],
    weaknesses: ['aggression']
  }
];

export default function BattlerGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {dummyProfiles.map((profile, idx) => (
        <StatCard key={idx} profile={profile} />
      ))}
    </div>
  );
}