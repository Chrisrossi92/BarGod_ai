import React from 'react';

export default function AvatarSeedInput({ avatarSeed, setAvatarSeed }) {
  return (
    <div className="w-full">
      <label className="block text-lime-400 font-semibold mb-1">Customize Your Avatar</label>
      <input
        type="text"
        value={avatarSeed}
        onChange={(e) => setAvatarSeed(e.target.value)}
        placeholder="BarGodSeed"
        className="w-full bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
      />
      <p className="text-xs text-gray-400 mt-1">Use any phrase or name to generate a unique look.</p>
    </div>
  );
}
