// src/components/therise/avatar/AvatarCustomizer.jsx

import React from 'react';
import AvatarCard from './AvatarCard';

export default function AvatarCustomizer({ avatarSeed, onSeedChange, appearance }) {
  return (
    <div className="space-y-4">
      <label htmlFor="avatarSeed" className="text-lime-400 font-bold block">
        Customize Your Avatar
      </label>

      <div className="flex items-center gap-4">
        <AvatarCard avatarSeed={avatarSeed} appearance={appearance} />

        <div className="flex-1">
          <input
            id="avatarSeed"
            type="text"
            value={avatarSeed}
            onChange={(e) => onSeedChange(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <p className="text-gray-400 text-xs mt-1">
            Use any phrase or name to generate a unique look.
          </p>
        </div>
      </div>
    </div>
  );
}