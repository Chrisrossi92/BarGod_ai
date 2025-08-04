// src/components/therise/moves/MoveLoadoutSelector.jsx

import React, { useMemo } from 'react';
import MoveCard from './MoveCard';
import SelectedMovePanel from './SelectedMovePanel';
import rawCatalog from '../../../logic/MoveCatalog.json';

const MAX_MOVES = 4;

const moveCatalog = Object.entries(rawCatalog).map(([name, data]) => ({
  name,
  ...data,
}));

export default function MoveLoadoutSelector({ selectedMoves, setSelectedMoves }) {
  // Group moves by type
  const movesByType = useMemo(() => {
    const groups = {};
    moveCatalog.forEach((move) => {
      if (!groups[move.type]) groups[move.type] = [];
      groups[move.type].push(move);
    });
    return groups;
  }, []);

  const handleSelect = (move) => {
    const alreadySelected = selectedMoves.find((m) => m.name === move.name);

    if (alreadySelected) {
      // Remove move
      setSelectedMoves((prev) => prev.filter((m) => m.name !== move.name));
    } else if (selectedMoves.length < MAX_MOVES) {
      // Add move
      setSelectedMoves((prev) => [...prev, move]);
    }
  };

  const handleClear = () => {
    setSelectedMoves([]);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-lime-400 mb-4">Move Loadout</h2>

      <SelectedMovePanel moves={selectedMoves} onRemove={handleSelect} onClear={handleClear} />

      <div className="mt-6 space-y-6">
        {Object.entries(movesByType).map(([type, moves]) => (
          <div key={type}>
            <h3 className="text-lg font-semibold text-white mb-2">{type}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {moves.map((move) => (
                <MoveCard
                  key={move.name}
                  move={move}
                  selected={selectedMoves.some((m) => m.name === move.name)}
                  onClick={() => handleSelect(move)}
                  disabled={selectedMoves.length >= MAX_MOVES && !selectedMoves.some((m) => m.name === move.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
