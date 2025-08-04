// src/components/BattleLog.jsx

import React from 'react';

export default function BattleLog({ turns }) {
  if (!turns || !turns.length) {
    return <div className="text-gray-400 text-center">No turns played yet.</div>;
  }

  return (
    <div className="bg-gray-950 p-4 rounded-lg shadow-lg space-y-4 max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold text-center text-white mb-2">Battle Log</h2>
      {turns.map((turn, index) => (
        <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700">
          <div className="text-sm text-gray-300 mb-1">Round {index + 1}</div>
          <div className="text-white font-medium">{turn.narrative}</div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div className="bg-gray-900 p-2 rounded">
              <strong>{turn.battlerA.name}</strong>
              <div>Move: {turn.battlerA.move}</div>
              <div>Effectiveness: {turn.battlerA.effectiveness}</div>
              <div>Crowd Reaction: {turn.battlerA.crowdReaction}</div>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <strong>{turn.battlerB.name}</strong>
              <div>Move: {turn.battlerB.move}</div>
              <div>Effectiveness: {turn.battlerB.effectiveness}</div>
              <div>Crowd Reaction: {turn.battlerB.crowdReaction}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}