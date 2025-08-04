// src/components/therise/hometown/HometownSelector.jsx

import React from 'react';
import { cities } from './cityData';
import CityPin from './CityPin';
import mapImage from './map-image.png'; // placeholder graphic

export default function HometownSelector({ value, onChange }) {
  const selectedCity = cities.find(c => c.id === value);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl text-white space-y-4">
      <h3 className="text-lg font-bold text-lime-400">Choose Your Hometown</h3>

      <div className="relative w-full h-[400px] bg-cover bg-center rounded-lg overflow-hidden border border-gray-800 shadow" style={{ backgroundImage: `url(${mapImage})` }}>
        {cities.map((city) => (
          <CityPin
            key={city.id}
            city={city}
            isSelected={value === city.id}
            onSelect={onChange}
          />
        ))}
      </div>

      {selectedCity && (
        <div className="mt-2 text-sm text-gray-300">
          <span className="font-bold text-white">{selectedCity.name}</span> — {selectedCity.bonus}
        </div>
      )}
    </div>
  );
}
