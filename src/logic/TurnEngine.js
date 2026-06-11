// src/logic/TurnEngine.js

/**
 * Executes one battle turn using the shared BarGod game design model.
 * The result keeps legacy fields (`effectiveness`, `crowdReaction`) so
 * current UI can render while newer battle screens adopt richer fields.
 */

import {
  ARCHETYPES,
  CORE_STAT_IDS,
  CROWD_MOMENTUM_RULES,
  MOVES,
} from "@/logic/gameDesign";

const RISK_OUTCOME = {
  clean: "clean",
  shaky: "shaky",
  miss: "miss",
};

const SIGNATURE_IMPACT_BONUS = 14;
const SIGNATURE_MOMENTUM_BONUS = 10;

const LEGACY_STAT_MAP = {
  punchlines: "punches",
  punches: "punches",
  schemes: "schemes",
  angles: "angles",
  storytelling: "angles",
  performance: "performance",
  presence: "performance",
  crowdControl: "performance",
  delivery: "performance",
  rebuttals: "rebuttal",
  rebuttal: "rebuttal",
  freestyle: "rebuttal",
  composure: "composure",
};

const LEGACY_ARCHETYPE_MAP = {
  punchliner: "puncher",
  controller: "performer",
  wildcard: "freestyler",
};

function clamp(value, min = CROWD_MOMENTUM_RULES.minMomentum, max = CROWD_MOMENTUM_RULES.maxMomentum) {
  return Math.max(min, Math.min(max, value));
}

function normalizeStats(attributes = {}) {
  const stats = Object.fromEntries(CORE_STAT_IDS.map((stat) => [stat, 50]));

  Object.entries(attributes || {}).forEach(([key, rawValue]) => {
    const mappedKey = LEGACY_STAT_MAP[key] || key;
    if (!CORE_STAT_IDS.includes(mappedKey)) return;

    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    stats[mappedKey] = Math.max(stats[mappedKey], value);
  });

  return stats;
}

function getArchetypeId(battler = {}) {
  const rawId = battler.archetype || battler.archetypeId || battler.style || null;
  return LEGACY_ARCHETYPE_MAP[rawId] || rawId;
}

function applyArchetypeBonuses(stats, battler = {}) {
  const archetype = ARCHETYPES[getArchetypeId(battler)];
  if (!archetype) return stats;

  const boosted = { ...stats };
  Object.entries(archetype.statBonuses || {}).forEach(([stat, bonus]) => {
    if (!CORE_STAT_IDS.includes(stat)) return;
    boosted[stat] = (boosted[stat] || 0) + bonus;
  });
  return boosted;
}

function getMove(moveId) {
  return MOVES[moveId] || MOVES.clean_round;
}

function rollRisk(move, stats) {
  const riskPenalty = CROWD_MOMENTUM_RULES.riskPenalty[move.risk] || 0;
  const composure = stats.composure || 50;
  const missChance = clamp(riskPenalty * 2.4 - composure * 0.12, 3, 42);
  const shakyChance = clamp(riskPenalty * 3.2 - composure * 0.08, 8, 55);
  const roll = Math.random() * 100;

  if (roll < missChance) {
    return {
      outcome: RISK_OUTCOME.miss,
      penalty: CROWD_MOMENTUM_RULES.missPenalty[move.risk] || riskPenalty,
    };
  }

  if (roll < missChance + shakyChance) {
    return {
      outcome: RISK_OUTCOME.shaky,
      penalty: Math.ceil(riskPenalty / 2),
    };
  }

  return {
    outcome: RISK_OUTCOME.clean,
    penalty: 0,
  };
}

function scoreMove({ battler, moveId, currentMomentum }) {
  const move = getMove(moveId);
  const baseStats = normalizeStats(battler.attributes || battler.stats || {});
  const stats = applyArchetypeBonuses(baseStats, battler);
  const archetypeId = getArchetypeId(battler);
  const archetype = ARCHETYPES[archetypeId];
  const isSignatureMove = archetype?.signatureMove === move.id;
  const effectiveMove = isSignatureMove
    ? {
        ...move,
        power: move.power + SIGNATURE_IMPACT_BONUS,
        momentumEffect: move.momentumEffect + SIGNATURE_MOMENTUM_BONUS,
        risk: "high",
      }
    : move;
  const primaryStatValue = stats[effectiveMove.primaryStat] || 50;
  const risk = rollRisk(effectiveMove, stats);
  const affinityBonus =
    effectiveMove.archetypeAffinity && effectiveMove.archetypeAffinity === archetypeId
      ? CROWD_MOMENTUM_RULES.affinityBonus
      : 0;
  const roomModifier =
    currentMomentum >= CROWD_MOMENTUM_RULES.hotRoomThreshold
      ? CROWD_MOMENTUM_RULES.hotRoomBonus
      : currentMomentum <= CROWD_MOMENTUM_RULES.coldRoomThreshold
      ? -CROWD_MOMENTUM_RULES.coldRoomPenalty
      : 0;
  const comebackBonus =
    currentMomentum <= CROWD_MOMENTUM_RULES.comebackThreshold
      ? CROWD_MOMENTUM_RULES.comebackBonus
      : 0;

  const impactScore = Math.round(
    effectiveMove.power +
      primaryStatValue * CROWD_MOMENTUM_RULES.statScale +
      affinityBonus +
      roomModifier +
      comebackBonus -
      risk.penalty
  );

  return {
    move: move.id,
    moveUsed: move.id,
    moveLabel: move.label,
    moveData: effectiveMove,
    primaryStat: effectiveMove.primaryStat,
    primaryStatValue,
    impactScore,
    effectiveness: impactScore,
    momentumBase: effectiveMove.momentumEffect,
    riskOutcome: risk.outcome,
    riskPenalty: risk.penalty,
    isSignatureMove,
    signatureLabel: isSignatureMove ? `${archetype.label} Signature` : null,
    stats,
  };
}

function buildNarrative({ battlerA, battlerB, scoredA, scoredB, winner }) {
  if (scoredA.isSignatureMove) {
    return `${battlerA.name} called for a signature ${scoredA.moveLabel}. The spotlight hit and the room surged.`;
  }

  if (scoredB.isSignatureMove) {
    return `${battlerB.name} fired back with a signature ${scoredB.moveLabel}. The crowd felt the moment.`;
  }

  if (winner === "A") {
    return `${battlerA.name} landed ${scoredA.moveLabel} cleaner than ${battlerB.name}'s ${scoredB.moveLabel}. The room shifted their way.`;
  }

  if (winner === "B") {
    return `${battlerB.name} hit harder with ${scoredB.moveLabel} while ${battlerA.name}'s ${scoredA.moveLabel} did not move the room enough.`;
  }

  return `${battlerA.name} and ${battlerB.name} traded close moments with ${scoredA.moveLabel} and ${scoredB.moveLabel}. The crowd stayed split.`;
}

export function runTurn(
  battlerA,
  moveA,
  battlerB,
  moveB,
  options = {}
) {
  const currentMomentum = clamp(
    Number.isFinite(options.currentMomentum)
      ? options.currentMomentum
      : CROWD_MOMENTUM_RULES.startingMomentum
  );

  const scoredA = scoreMove({
    battler: battlerA,
    moveId: moveA,
    currentMomentum,
  });
  const scoredB = scoreMove({
    battler: battlerB,
    moveId: moveB,
    currentMomentum: CROWD_MOMENTUM_RULES.maxMomentum - currentMomentum,
  });

  const impactDelta = scoredA.impactScore - scoredB.impactScore;
  const rawMomentumSwing =
    impactDelta +
    scoredA.momentumBase -
    scoredB.momentumBase;
  const momentumSwing =
    Math.abs(impactDelta) <= CROWD_MOMENTUM_RULES.neutralWindow
      ? CROWD_MOMENTUM_RULES.drawMomentum
      : Math.round(rawMomentumSwing / 2);

  const crowdA = clamp(currentMomentum + momentumSwing);
  const crowdB = clamp(CROWD_MOMENTUM_RULES.maxMomentum - crowdA);

  let winner = "draw";
  if (impactDelta > CROWD_MOMENTUM_RULES.neutralWindow) winner = "A";
  if (impactDelta < -CROWD_MOMENTUM_RULES.neutralWindow) winner = "B";

  const result = {
    battlerA: {
      name: battlerA.name,
      ...scoredA,
      momentumSwing,
      crowdReaction: Math.round(crowdA),
    },
    battlerB: {
      name: battlerB.name,
      ...scoredB,
      momentumSwing: -momentumSwing,
      crowdReaction: Math.round(crowdB),
    },
    winner,
    impactDelta: Math.round(impactDelta),
    momentumSwing,
    crowdMomentum: {
      before: currentMomentum,
      after: Math.round(crowdA),
    },
    narrative: "",
  };

  result.narrative = buildNarrative({
    battlerA,
    battlerB,
    scoredA,
    scoredB,
    winner,
  });

  return result;
}

export { RISK_OUTCOME };
