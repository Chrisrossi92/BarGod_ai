import React from 'react';

export default function BattlerInfoForm({
  name,
  setName,
  title,
  setTitle,
  appearance,
  setAppearance,
}) {
  const handleChange = (key, value) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <label className="block text-lime-400 font-semibold mb-1">Enter Battler Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
      </div>

      <div>
        <label className="block text-lime-400 font-semibold mb-1">Enter Battler Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className="bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-neutral-700"
          value={appearance?.hairstyle || ''}
          onChange={(e) => handleChange('hairstyle', e.target.value)}
        >
          <option value="">Hairstyle</option>
          <option value="buzz">Buzz</option>
          <option value="braids">Braids</option>
          <option value="fade">Fade</option>
        </select>

        <select
          className="bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-neutral-700"
          value={appearance?.outfit || ''}
          onChange={(e) => handleChange('outfit', e.target.value)}
        >
          <option value="">Outfit</option>
          <option value="hoodie">Hoodie</option>
          <option value="jersey">Jersey</option>
          <option value="suit">Suit</option>
        </select>

        <select
          className="bg-[#1a1c23] text-white px-4 py-2 rounded-md border border-neutral-700"
          value={appearance?.accessory || ''}
          onChange={(e) => handleChange('accessory', e.target.value)}
        >
          <option value="">Accessory</option>
          <option value="chain">Chain</option>
          <option value="shades">Shades</option>
          <option value="earring">Earring</option>
        </select>
      </div>
    </div>
  );
}
