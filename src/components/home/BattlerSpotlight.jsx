// src/components/home/BattlerSpotlight.jsx

import React from 'react';
import StatCard from '../StatCard';

const featuredProfile = {
  name: 'Illmac',
  overall: 96,
  attributes: {
    rhyming: 94,
    rebuttals: 87,
    humor: 93,
    aggression: 78,
    storytelling: 91,
    creativity: 95,
    crowdControl: 89,
    presence: 88
  },
  strengths: ['humor', 'creativity', 'storytelling'],
  weaknesses: ['aggression']
};

export default function BattlerSpotlight() {
  return (
    <section className="px-4 mb-10">
      <h2 className="text-xl font-bold text-center mb-4 text-white">
        🔦 Battler Spotlight
      </h2>
      <StatCard profile={featuredProfile} />
    </section>
  );
}