// src/components/StatCard.jsx

import React from 'react';

export default function StatCard({ profile }) {
  const {
    name,
    overall,
    attributes,
    strengths = [],
    weaknesses = [],
    imageUrl
  } = profile;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-white">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${name} avatar`}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white"
        />
      )}

      <div className="text-center mb-4">
        <div className="text-sm uppercase text-gray-400 tracking-widest">Stat Profile</div>
        <h2 className="text-3xl font-bold">{name}</h2>
        <p className="text-yellow-400 text-xl font-semibold">Overall: {overall}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key} className="bg-gray-700 rounded p-2 flex justify-between text-sm">
            <span className="capitalize text-gray-300">{key}</span>
            <span className="font-semibold text-white">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex-1">
          <div className="text-green-400 font-medium mb-1">Strengths</div>
          <ul className="list-disc list-inside text-gray-300">
            {strengths.map((s, idx) => <li key={idx} className="capitalize">{s}</li>)}
          </ul>
        </div>
        <div className="flex-1">
          <div className="text-red-400 font-medium mb-1">Weaknesses</div>
          <ul className="list-disc list-inside text-gray-300">
            {weaknesses.map((w, idx) => <li key={idx} className="capitalize">{w}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}