// src/components/therise/moves/MoveLoadoutSelector.jsx

import React, { useMemo } from 'react';
import MoveCard from './MoveCard';
import SelectedMovePanel from './SelectedMovePanel';
import { MOVE_LIST } from '@/logic/gameDesign';

const MAX_MOVES = 4;

const STAT_GROUP_LABELS = {
  punches: 'Punches',
  schemes: 'Schemes',
  angles: 'Angles',
  performance: 'Performance',
  rebuttal: 'Rebuttal',
  composure: 'Composure',
};

const moveCatalog = MOVE_LIST.map((move) => ({
  ...move,
  name: move.label,
  type: STAT_GROUP_LABELS[move.primaryStat] || move.primaryStat,
}));

export default function MoveLoadoutSelector({ selectedMoves, setSelectedMoves }) {
  const moves = Array.isArray(selectedMoves) ? selectedMoves : [];

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
    const alreadySelected = moves.find((m) => m.id === move.id || m.name === move.name);

    if (alreadySelected) {
      // Remove move
      setSelectedMoves((prev) => prev.filter((m) => m.id !== move.id && m.name !== move.name));
    } else if (moves.length < MAX_MOVES) {
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

      <SelectedMovePanel moves={moves} onRemove={handleSelect} onClear={handleClear} />

      <div className="mt-6 space-y-6">
        {Object.entries(movesByType).map(([type, moves]) => (
          <div key={type}>
            <h3 className="text-lg font-semibold text-white mb-2">{type}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {moves.map((move) => (
                <MoveCard
                  key={move.name}
                  move={move}
                  selected={moves.some((m) => m.id === move.id || m.name === move.name)}
                  onClick={() => handleSelect(move)}
                  disabled={moves.length >= MAX_MOVES && !moves.some((m) => m.id === move.id || m.name === move.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
