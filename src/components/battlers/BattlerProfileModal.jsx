// src/components/battlers/BattlerProfileModal.jsx

import React from 'react';
import StatCard from '../StatCard';

export default function BattlerProfileModal({ profile, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full p-6 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-white text-lg hover:text-red-400"
          onClick={onClose}
        >
          ✕
        </button>

        <StatCard profile={profile} />

        <div className="mt-4 text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">Battle History (demo):</p>
          <ul className="list-disc list-inside">
            <li>vs. Opponent A – Jan 2023 – Genius</li>
            <li>vs. Opponent B – Sep 2022 – YouTube</li>
            <li>vs. Opponent C – Mar 2022 – Text Upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}