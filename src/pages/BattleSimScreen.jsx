// src/pages/BattleSimScreen.jsx

import React, { useState } from 'react';
import { runTurn } from '@/logic/TurnEngine';
import BattleLog from '@/components/BattleLog';

// Dummy battlers for demo
const testBattlerA = {
  name: 'Illmac',
  attributes: {
    rhyming: 90,
    rebuttals: 85,
    creativity: 92,
    storytelling: 88,
    presence: 80,
    crowdControl: 86
  }
};

const testBattlerB = {
  name: 'Bigg K',
  attributes: {
    rhyming: 87,
    rebuttals: 82,
    creativity: 70,
    storytelling: 75,
    presence: 92,
    crowdControl: 89
  }
};

export default function BattleSimScreen() {
  const [turns, setTurns] = useState([]);

  const handleSimTurn = () => {
    const moves = ['punchline', 'scheme', 'rebuttal', 'angle', 'freestyle', 'closer'];
    const moveA = moves[Math.floor(Math.random() * moves.length)];
    const moveB = moves[Math.floor(Math.random() * moves.length)];
    const turnResult = runTurn(testBattlerA, moveA, testBattlerB, moveB);
    turnResult.battlerA.name = testBattlerA.name;
    turnResult.battlerB.name = testBattlerB.name;
    setTurns(prev => [...prev, turnResult]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Battle Simulation</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={handleSimTurn} className="bg-green-600 hover:bg-green-700">
          Simulate Next Turn
        </button>
        <button onClick={() => setTurns([])} className="bg-red-600 hover:bg-red-700">
          Reset Battle
        </button>
      </div>

      <BattleLog turns={turns} />
    </div>
  );
}