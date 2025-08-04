// src/logic/TurnEngine.js

/**
 * Executes one turn of a battle between two battlers.
 * Each battler selects a "move" (e.g. punchline, scheme, rebuttal)
 * This engine determines the outcome and crowd reaction.
 */

import moveCatalog from './MoveCatalog.json';

export function runTurn(battlerA, moveA, battlerB, moveB) {
  const result = {
    battlerA: {
      move: moveA,
      effectiveness: 0,
      crowdReaction: 0
    },
    battlerB: {
      move: moveB,
      effectiveness: 0,
      crowdReaction: 0
    },
    winner: null,
    narrative: ''
  };

  const moveDataA = moveCatalog[moveA];
  const moveDataB = moveCatalog[moveB];

  // Base effectiveness + relevant stat boost
  const effectiveA = moveDataA.base + (battlerA.attributes[moveDataA.primaryStat] || 0) * moveDataA.multiplier;
  const effectiveB = moveDataB.base + (battlerB.attributes[moveDataB.primaryStat] || 0) * moveDataB.multiplier;

  result.battlerA.effectiveness = Math.round(effectiveA);
  result.battlerB.effectiveness = Math.round(effectiveB);

  // Simulated crowd reaction based on effectiveness delta
  const crowdShift = effectiveA - effectiveB;
  result.battlerA.crowdReaction = Math.max(0, 50 + crowdShift);
  result.battlerB.crowdReaction = Math.max(0, 50 - crowdShift);

  if (crowdShift > 5) {
    result.winner = 'A';
    result.narrative = `${battlerA.name} landed a sharper ${moveA} than ${battlerB.name}'s ${moveB}. Crowd leaned heavy.`;
  } else if (crowdShift < -5) {
    result.winner = 'B';
    result.narrative = `${battlerB.name} hit cleaner with a ${moveB} while ${battlerA.name} fell short.`;
  } else {
    result.winner = 'draw';
    result.narrative = `Both battlers came close — neither ${moveA} nor ${moveB} dominated the round.`;
  }

  return result;
}