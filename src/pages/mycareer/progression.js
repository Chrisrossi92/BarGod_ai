import {
  ARCHETYPES,
  CORE_STAT_LIST,
  CROWD_MOMENTUM_RULES,
  MOVES,
  MOVE_LIST,
  REGIONAL_OPPONENTS,
  STARTER_OPPONENTS,
} from "@/logic/gameDesign";
import gameStorage from "@/lib/storage/gameStorage";

export const SELECTED_KEY = "bargod.mycareer.selectedBattlerId";
export const PROGRESS_KEY = "bargod.mycareer.progress.v1";
export const XP_PER_LEVEL = 100;
export const STAT_POINTS_PER_LEVEL = 2;
export const RIVALRY_ATTEMPT_THRESHOLD = 2;
export const RIVALRY_XP_BONUS = 10;
export const NORMAL_LOADOUT_SIZE = 4;

const BASE_GENERAL_MOVE_IDS = ["clean_round", "jab_setup"];
const GENERAL_UNLOCK_MOVE_IDS = ["cadence_switch", "judge_appeal", "stumble_recovery"];

export const CAREER_TITLES = {
  first_win: {
    id: "first_win",
    label: "First Win",
    description: "Won your first MyCareer battle.",
  },
  open_mic_prospect: {
    id: "open_mic_prospect",
    label: "Open Mic Prospect",
    description: "Defeated a Local Open Mic opponent.",
  },
  open_mic_champion: {
    id: "open_mic_champion",
    label: "Open Mic Champion",
    description: "Cleared every opponent on the Local Open Mic ladder.",
  },
  regional_ready: {
    id: "regional_ready",
    label: "Regional Ready",
    description: "Unlocked the Regional Circuit.",
  },
  regional_circuit_champion: {
    id: "regional_circuit_champion",
    label: "Regional Circuit Champion",
    description: "Cleared every opponent on the Regional Circuit.",
  },
  rivalry_killer: {
    id: "rivalry_killer",
    label: "Rivalry Killer",
    description: "Beat an opponent after the matchup became personal.",
  },
  room_shaker: {
    id: "room_shaker",
    label: "Room Shaker",
    description: "Won a battle after spending a signature move.",
  },
};

export const CAREER_TITLE_LIST = Object.values(CAREER_TITLES);

const LEGACY_ARCHETYPE_MAP = {
  punchliner: "puncher",
  controller: "performer",
  wildcard: "freestyler",
};

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

export const MOVE_ACCENTS = {
  punches: "border-red-500/60 bg-red-500/10 text-red-200",
  schemes: "border-sky-400/60 bg-sky-400/10 text-sky-200",
  angles: "border-violet-400/60 bg-violet-400/10 text-violet-200",
  performance: "border-lime-400/60 bg-lime-400/10 text-lime-200",
  rebuttal: "border-amber-400/60 bg-amber-400/10 text-amber-200",
  composure: "border-zinc-500/60 bg-zinc-500/10 text-zinc-200",
};

export const CAREER_TIERS = [
  {
    id: "local-open-mic",
    label: "Local Open Mic",
    description: "Starter tier for learning move timing and crowd momentum.",
    opponents: STARTER_OPPONENTS,
  },
  {
    id: "regional-circuit",
    label: "Regional Circuit",
    description: "Road battles against stronger, more polished opponents.",
    unlocksAfterTierId: "local-open-mic",
    opponents: REGIONAL_OPPONENTS,
  },
  {
    id: "city-circuit",
    label: "City Circuit",
    description: "A future tier for city-ranked names, bigger rooms, and title pressure.",
    unlocksAfterTierId: "regional-circuit",
    comingSoon: true,
    rewardPreview: "Preview reward: City Circuit title path, higher XP payouts, and rare move unlocks.",
    plannedOpponents: [
      "Noir District",
      "Civic Saint",
      "Metro Myth",
      "Harbor Phaze",
      "Queen Ledger",
    ],
    opponents: [],
  },
];

export function readProgress() {
  return normalizeProgress(gameStorage.getJson(PROGRESS_KEY, {}));
}

export function writeProgress(progress) {
  gameStorage.setJson(PROGRESS_KEY, progress);
}

export function getLevelFromXp(xp) {
  return Math.floor((Number(xp) || 0) / XP_PER_LEVEL) + 1;
}

export function normalizeProgress(progress) {
  const xp = Number(progress.xp) || 0;
  const level = progress.level || getLevelFromXp(xp);
  return {
    xp,
    level,
    wins: Number(progress.wins) || 0,
    losses: Number(progress.losses) || 0,
    battles: Number(progress.battles) || 0,
    statPoints: Number(progress.statPoints) || 0,
    statUpgrades: progress.statUpgrades || {},
    opponentHistory: progress.opponentHistory || {},
    unlockedMoveIds: Array.isArray(progress.unlockedMoveIds)
      ? progress.unlockedMoveIds
      : [],
    moveLoadouts: progress.moveLoadouts || {},
    earnedTitleIds: Array.isArray(progress.earnedTitleIds)
      ? progress.earnedTitleIds
      : [],
    defeatedOpponentIds: Array.isArray(progress.defeatedOpponentIds)
      ? progress.defeatedOpponentIds
      : [],
    lastOpponentId: progress.lastOpponentId || null,
    lastResult: progress.lastResult || null,
  };
}

export function applyBattleProgress(progress, battleResult, battler) {
  const current = normalizeProgress(progress);
  const currentOpponentHistory = getOpponentHistory(current, battleResult.opponentId);
  const levelBefore = current.level;
  const xpBefore = current.xp;
  const xpAfter = xpBefore + battleResult.xpEarned;
  const levelAfter = getLevelFromXp(xpAfter);
  const levelsGained = Math.max(0, levelAfter - levelBefore);
  const statPointsEarned = levelsGained * STAT_POINTS_PER_LEVEL;
  const playerWon = battleResult.winner === "player";
  const defeatedOpponentIds =
    playerWon && battleResult.opponentId
      ? Array.from(new Set([...current.defeatedOpponentIds, battleResult.opponentId]))
      : current.defeatedOpponentIds;

  const nextProgressBase = {
    ...current,
    xp: xpAfter,
    level: levelAfter,
    battles: current.battles + 1,
    wins: current.wins + (playerWon ? 1 : 0),
    losses: current.losses + (playerWon ? 0 : 1),
    statPoints: current.statPoints + statPointsEarned,
    opponentHistory: {
      ...current.opponentHistory,
      [battleResult.opponentId]: {
        attempts: currentOpponentHistory.attempts + 1,
        wins: currentOpponentHistory.wins + (playerWon ? 1 : 0),
        losses: currentOpponentHistory.losses + (playerWon ? 0 : 1),
      },
    },
    defeatedOpponentIds,
    lastOpponentId: battleResult.opponentId,
    lastResult: battleResult.winner,
  };
  const newlyEarnedTitles = getNewlyEarnedTitles(current, nextProgressBase, battleResult);
  const newlyUnlockedMoves = getNewlyUnlockedMoves(current, nextProgressBase, battler);
  const nextProgress = {
    ...nextProgressBase,
    unlockedMoveIds: Array.from(
      new Set([
        ...current.unlockedMoveIds,
        ...newlyUnlockedMoves.map((move) => move.id),
      ])
    ),
    earnedTitleIds: Array.from(
      new Set([
        ...current.earnedTitleIds,
        ...newlyEarnedTitles.map((title) => title.id),
      ])
    ),
  };

  return {
    nextProgress,
    newlyEarnedTitles,
    newlyUnlockedMoves,
    summary: {
      xpBefore,
      xpAfter,
      levelBefore,
      levelAfter,
      levelsGained,
      statPointsEarned,
      recordBefore: {
        wins: current.wins,
        losses: current.losses,
      },
      recordAfter: {
        wins: current.wins + (playerWon ? 1 : 0),
        losses: current.losses + (playerWon ? 0 : 1),
      },
    },
  };
}

export function getOpponentHistory(progress, opponentId) {
  const history = normalizeProgress(progress).opponentHistory?.[opponentId] || {};
  return {
    attempts: Number(history.attempts) || 0,
    wins: Number(history.wins) || 0,
    losses: Number(history.losses) || 0,
  };
}

export function isOpponentRival(progress, opponentId) {
  return getOpponentHistory(progress, opponentId).attempts >= RIVALRY_ATTEMPT_THRESHOLD;
}

export function getEarnedTitles(progress) {
  const earnedIds = normalizeProgress(progress).earnedTitleIds;
  return earnedIds.map((id) => CAREER_TITLES[id]).filter(Boolean);
}

function hasTitle(progress, titleId) {
  return normalizeProgress(progress).earnedTitleIds.includes(titleId);
}

function getNewlyEarnedTitles(previousProgress, nextProgress, battleResult) {
  const next = normalizeProgress(nextProgress);
  const playerWon = battleResult.winner === "player";
  const usedSignatureInWin =
    playerWon && battleResult.turns.some((turn) => turn.battlerA?.isSignatureMove);
  const allLocalOpponentsDefeated = areTierOpponentsDefeated("local-open-mic", next);
  const regionalUnlocked = isTierUnlocked("regional-circuit", next);
  const allRegionalOpponentsDefeated = areTierOpponentsDefeated("regional-circuit", next);
  const candidates = [];

  if (playerWon) candidates.push(CAREER_TITLES.first_win);
  if (playerWon && next.defeatedOpponentIds.length > 0) {
    candidates.push(CAREER_TITLES.open_mic_prospect);
  }
  if (allLocalOpponentsDefeated) candidates.push(CAREER_TITLES.open_mic_champion);
  if (regionalUnlocked) candidates.push(CAREER_TITLES.regional_ready);
  if (allRegionalOpponentsDefeated) {
    candidates.push(CAREER_TITLES.regional_circuit_champion);
  }
  if (playerWon && battleResult.isRivalryBattle) {
    candidates.push(CAREER_TITLES.rivalry_killer);
  }
  if (usedSignatureInWin) candidates.push(CAREER_TITLES.room_shaker);

  return candidates.filter((title) => title && !hasTitle(previousProgress, title.id));
}

function getArchetypeMoveIds(archetypeId) {
  return MOVE_LIST.filter((move) => move.archetypeAffinity === archetypeId)
    .sort((a, b) => a.power - b.power)
    .map((move) => move.id);
}

export function getBaseUnlockedMoveIds(battler) {
  const archetype = normalizeArchetype(battler?.archetypeId);
  const signatureMoveId = getSignatureMoveId(battler);
  const archetypeStarters = getArchetypeMoveIds(archetype)
    .filter((moveId) => moveId !== signatureMoveId)
    .slice(0, 2);

  return Array.from(
    new Set([
      ...BASE_GENERAL_MOVE_IDS,
      ...archetypeStarters,
      ...(signatureMoveId ? [signatureMoveId] : []),
    ])
  ).filter((moveId) => MOVES[moveId]);
}

function getLevelMilestoneMoveIds(level, battler, existingMoveIds = []) {
  const archetype = normalizeArchetype(battler?.archetypeId);
  const signatureMoveId = getSignatureMoveId(battler);
  const selected = [];
  const unavailable = new Set([...existingMoveIds, signatureMoveId].filter(Boolean));
  const affinityMoves = getArchetypeMoveIds(archetype).filter(
    (moveId) => !unavailable.has(moveId)
  );

  if (level >= 2) {
    const levelTwoMove = affinityMoves.find((moveId) => !selected.includes(moveId));
    if (levelTwoMove) {
      selected.push(levelTwoMove);
      unavailable.add(levelTwoMove);
    }
  }

  if (level >= 3) {
    const generalMove = GENERAL_UNLOCK_MOVE_IDS.find(
      (moveId) => MOVES[moveId] && !unavailable.has(moveId) && !selected.includes(moveId)
    );
    if (generalMove) {
      selected.push(generalMove);
      unavailable.add(generalMove);
    }
  }

  if (level >= 5) {
    const strongerAffinityMove = getArchetypeMoveIds(archetype)
      .filter((moveId) => !unavailable.has(moveId) && !selected.includes(moveId))
      .sort((a, b) => MOVES[b].power - MOVES[a].power)[0];
    if (strongerAffinityMove) selected.push(strongerAffinityMove);
  }

  return selected;
}

export function getUnlockedMoveIds(progress, battler) {
  const normalized = normalizeProgress(progress);
  const baseMoveIds = getBaseUnlockedMoveIds(battler);
  const milestoneMoveIds = getLevelMilestoneMoveIds(
    normalized.level,
    battler,
    baseMoveIds
  );

  return Array.from(
    new Set([...baseMoveIds, ...normalized.unlockedMoveIds, ...milestoneMoveIds])
  ).filter((moveId) => MOVES[moveId]);
}

function getNewlyUnlockedMoves(previousProgress, nextProgress, battler) {
  if (!battler) return [];

  const before = new Set(getUnlockedMoveIds(previousProgress, battler));
  const after = getUnlockedMoveIds(nextProgress, battler);

  return after
    .filter((moveId) => !before.has(moveId))
    .map((moveId) => MOVES[moveId])
    .filter(Boolean);
}

export function getLoadoutMoveIds(progress, battler) {
  if (!battler) return [];

  const normalized = normalizeProgress(progress);
  const signatureMoveId = getSignatureMoveId(battler);
  const unlockedMoveIds = getUnlockedMoveIds(normalized, battler);
  const storedLoadout = normalized.moveLoadouts?.[battler.id] || [];
  const validStoredLoadout = storedLoadout.filter(
    (moveId) => unlockedMoveIds.includes(moveId) && moveId !== signatureMoveId
  );

  if (validStoredLoadout.length > 0) {
    return validStoredLoadout.slice(0, NORMAL_LOADOUT_SIZE);
  }

  return getBaseUnlockedMoveIds(battler)
    .filter((moveId) => unlockedMoveIds.includes(moveId) && moveId !== signatureMoveId)
    .slice(0, NORMAL_LOADOUT_SIZE);
}

export function normalizeArchetype(id) {
  return LEGACY_ARCHETYPE_MAP[id] || id || null;
}

export function getBattlerUpgrades(progress, battlerId) {
  return normalizeProgress(progress).statUpgrades?.[battlerId] || {};
}

function getBaseCoreStats(attributes = {}) {
  const stats = Object.fromEntries(CORE_STAT_LIST.map((stat) => [stat.id, 50]));

  Object.entries(attributes || {}).forEach(([key, rawValue]) => {
    const statId = LEGACY_STAT_MAP[key] || key;
    if (!stats[statId]) return;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    stats[statId] = Math.max(stats[statId], value);
  });

  return stats;
}

export function getDisplayStats(battler, progress) {
  const baseStats = getBaseCoreStats(battler?.attributes || {});
  const upgrades = getBattlerUpgrades(progress, battler?.id);

  return Object.fromEntries(
    CORE_STAT_LIST.map((stat) => [
      stat.id,
      (baseStats[stat.id] || 50) + (Number(upgrades[stat.id]) || 0),
    ])
  );
}

export function buildBattleAttributes(battler, progress) {
  return {
    ...(battler?.attributes || {}),
    ...getDisplayStats(battler, progress),
  };
}

export function pickMove(loadout, index) {
  if (!loadout.length) return "clean_round";
  return loadout[index % loadout.length];
}

export function getSignatureMoveId(battler) {
  const archetype = normalizeArchetype(battler?.archetypeId);
  return ARCHETYPES[archetype]?.signatureMove || null;
}

export function getOpponentSignatureMove(opponent) {
  const signatureMoveId = ARCHETYPES[opponent?.archetype]?.signatureMove;
  return signatureMoveId ? MOVES[signatureMoveId] : null;
}

export function getPlayerMoveOptions(battler, progress, usedSignatureMoveIds = []) {
  const signatureMoveId = getSignatureMoveId(battler);
  const canUseSignature =
    signatureMoveId && !usedSignatureMoveIds.includes(signatureMoveId);
  const moveIds = [
    ...(canUseSignature ? [signatureMoveId] : []),
    ...getLoadoutMoveIds(progress, battler),
  ];

  return moveIds
    .map((moveId) => MOVES[moveId])
    .filter(Boolean)
    .map((move) => ({
      ...move,
      isSignatureOption: move.id === signatureMoveId && canUseSignature,
    }));
}

export function getOpponentOverall(opponent) {
  if (opponent?.overall) return opponent.overall;
  const values = Object.values(opponent?.stats || {});
  if (!values.length) return 50;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function getOpponentById(opponentId) {
  return CAREER_TIERS.flatMap((tier) => tier.opponents).find(
    (opponent) => opponent.id === opponentId
  );
}

export function getTierByOpponentId(opponentId) {
  return CAREER_TIERS.find((tier) =>
    tier.opponents.some((opponent) => opponent.id === opponentId)
  );
}

export function areTierOpponentsDefeated(tierId, progress) {
  const normalized = normalizeProgress(progress);
  const tier = CAREER_TIERS.find((candidate) => candidate.id === tierId);
  if (!tier) return false;

  return tier.opponents.every((opponent) =>
    normalized.defeatedOpponentIds.includes(opponent.id)
  );
}

export function isTierUnlocked(tierId, progress) {
  const tier = CAREER_TIERS.find((candidate) => candidate.id === tierId);
  if (!tier) return false;
  if (!tier.unlocksAfterTierId) return true;

  return areTierOpponentsDefeated(tier.unlocksAfterTierId, progress);
}

export function getOpponentStatus(opponentId, progress) {
  const normalized = normalizeProgress(progress);
  const tier = getTierByOpponentId(opponentId);
  if (!tier || !isTierUnlocked(tier.id, normalized)) return "locked";

  const index = tier.opponents.findIndex((opponent) => opponent.id === opponentId);
  if (index === -1) return "locked";
  if (normalized.defeatedOpponentIds.includes(opponentId)) return "defeated";
  if (index === 0) return "available";

  const previousOpponent = tier.opponents[index - 1];
  return normalized.defeatedOpponentIds.includes(previousOpponent.id)
    ? "available"
    : "locked";
}

export function getFirstUnlockedOpponent(progress) {
  return (
    CAREER_TIERS.flatMap((tier) => tier.opponents).find((opponent) =>
      ["available", "defeated"].includes(getOpponentStatus(opponent.id, progress))
    ) || CAREER_TIERS[0].opponents[0]
  );
}

export function buildBattleResult(turns, opponent, isRivalryBattle = false) {
  const currentMomentum =
    turns[turns.length - 1]?.crowdMomentum?.after ||
    CROWD_MOMENTUM_RULES.startingMomentum;
  const playerRoundWins = turns.filter((turn) => turn.winner === "A").length;
  const opponentRoundWins = turns.filter((turn) => turn.winner === "B").length;
  const winner =
    playerRoundWins > opponentRoundWins
      ? "player"
      : opponentRoundWins > playerRoundWins
      ? "opponent"
      : currentMomentum >= 50
      ? "player"
      : "opponent";
  const baseXpEarned =
    45 +
    playerRoundWins * 15 +
    (winner === "player" ? 40 : 15) +
    Math.max(0, Math.round((currentMomentum - 50) / 2));
  const rivalryBonusXp = isRivalryBattle ? RIVALRY_XP_BONUS : 0;
  const xpEarned = baseXpEarned + rivalryBonusXp;

  return {
    opponentId: opponent.id,
    opponentLabel: opponent.label,
    isRivalryBattle,
    rivalryBonusXp,
    winner,
    playerRoundWins,
    opponentRoundWins,
    crowdReaction: Math.round(currentMomentum),
    xpEarned,
    turns,
    momentumSummary: {
      start: CROWD_MOMENTUM_RULES.startingMomentum,
      finish: Math.round(currentMomentum),
      swing: Math.round(currentMomentum - CROWD_MOMENTUM_RULES.startingMomentum),
    },
  };
}
