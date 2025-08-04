// src/pages/TheRiseScreen.jsx

import React, { useState } from 'react';
import BarGodLogo from '../components/BarGodLogo';

const introEncounter = {
  id: 'intro01',
  title: 'The Beginning',
  dialogue: [
    "It starts like every great story — in a basement.",
    "No stage. No mic. Just bars.",
    "You’ve been writing for months. Tonight, it’s time to test it in front of strangers.",
    "First up: Jinx. Local freestyle demon." 
  ],
  opponent: {
    name: 'Jinx',
    description: 'Freestyle-heavy, unpredictable. Won’t make it easy.',
    style: ['freestyle', 'presence']
  },
  next: 'firstBattle'
};

export default function TheRiseScreen() {
  const [current, setCurrent] = useState(introEncounter);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const handleNextLine = () => {
    if (dialogueIndex < current.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // TODO: Navigate to actual first battle component when ready
      alert(`Prepare to battle ${current.opponent.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="mb-6 text-center">
        <BarGodLogo size="text-4xl" center />
        <h1 className="text-2xl font-bold mt-2">The Rise</h1>
      </div>

      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-yellow-400 mb-2">{current.title}</h2>
        <p className="text-gray-200 text-md mb-4">
          {current.dialogue[dialogueIndex]}
        </p>

        <button
          onClick={handleNextLine}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition"
        >
          {dialogueIndex < current.dialogue.length - 1 ? 'Next' : `Battle ${current.opponent.name}`}
        </button>
      </div>
    </div>
  );
}