// src/components/battlers/BattlerSearchBar.jsx

import React from 'react';

export default function BattlerSearchBar() {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="Search battlers..."
        className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}