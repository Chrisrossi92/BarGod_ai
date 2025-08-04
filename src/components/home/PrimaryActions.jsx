// src/components/home/PrimaryActions.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrimaryActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mb-12">
      <button
        onClick={() => navigate('/therise')}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition duration-300"
      >
        The Rise
      </button>

      <button
        onClick={() => navigate('/simulate')}
        className="bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
      >
        Simulate a Battle
      </button>

      <button
        onClick={() => navigate('/battlers')}
        className="bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
      >
        Browse Battlers
      </button>
    </div>
  );
}
