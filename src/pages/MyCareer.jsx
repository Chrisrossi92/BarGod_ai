import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, Mic2, Plus, Swords, Trophy } from "lucide-react";
import { motion } from "framer-motion";

import useBattlers from "@/lib/hooks/useBattlers";
import { runTurn } from "@/logic/TurnEngine";
import {
  ARCHETYPES,
  CROWD_MOMENTUM_RULES,
  MOVES,
} from "@/logic/gameDesign";
import BattleStage from "./mycareer/BattleStage";
import LoadoutPanel from "./mycareer/LoadoutPanel";
import OpponentLadder from "./mycareer/OpponentLadder";
import PostBattleShareCard from "./mycareer/PostBattleShareCard";
import ProgressionSummary from "./mycareer/ProgressionSummary";
import TrophyCase from "./mycareer/TrophyCase";
import UpgradeStatsPanel from "./mycareer/UpgradeStatsPanel";
import {
  CAREER_TIERS,
  MOVE_ACCENTS,
  NORMAL_LOADOUT_SIZE,
  RIVALRY_XP_BONUS,
  SELECTED_KEY,
  applyBattleProgress,
  buildBattleAttributes,
  buildBattleResult,
  getBaseUnlockedMoveIds,
  getDisplayStats,
  getFirstUnlockedOpponent,
  getLoadoutMoveIds,
  getOpponentById,
  getOpponentHistory,
  getOpponentOverall,
  getOpponentSignatureMove,
  getOpponentStatus,
  getPlayerMoveOptions,
  getSignatureMoveId,
  getUnlockedMoveIds,
  isOpponentRival,
  normalizeProgress,
  pickMove,
  readProgress,
  writeProgress,
} from "./mycareer/progression";
import { SectionCard, StatPill } from "./mycareer/ui";

function OpponentIntroScreen({ opponent, isRival, history, onEnterBattle, onBack }) {
  const archetype = ARCHETYPES[opponent.archetype];
  const signatureMove = getOpponentSignatureMove(opponent);
  const introLabel = isRival ? "Rivalry Battle" : "Stage Entrance";
  const quoteLabel = isRival ? "Rivalry Quote" : "Entrance Quote";
  const introCopy = isRival
    ? `${opponent.label} knows your timing now. This one has history.`
    : opponent.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-4"
    >
      <section className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-zinc-950 p-5 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.26),transparent_38%),linear-gradient(180deg,rgba(132,204,22,0.16),transparent_58%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-x-8 top-0 h-32 bg-gradient-to-b from-lime-300/40 to-transparent blur-2xl"
        />
        <div className="relative">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-red-200">
                {introLabel}
              </div>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                {opponent.label}
              </h2>
              <div className="mt-1 text-sm font-bold text-lime-200">
                {opponent.nickname}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0.86, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black"
            >
              <Mic2 size={28} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="rounded-3xl border border-zinc-800 bg-black/85 p-4"
          >
            <div className="flex flex-wrap gap-2">
              {isRival && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                  Rival
                </span>
              )}
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-200">
                {archetype?.label || opponent.archetype}
              </span>
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-wide text-zinc-300">
                {opponent.record}
              </span>
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-wide text-zinc-300">
                {opponent.reputationTier}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {quoteLabel}
              </div>
              <blockquote className="mt-2 text-xl font-black leading-tight text-white">
                "{opponent.entranceQuote}"
              </blockquote>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-300">{introCopy}</p>

            {isRival && (
              <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-3">
                <div className="text-xs uppercase tracking-wide text-red-200">
                  Rivalry History
                </div>
                <div className="mt-1 text-sm font-bold text-white">
                  {history.attempts} meetings · Your record {history.wins}-{history.losses}
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  Rivalry battles grant +{RIVALRY_XP_BONUS} XP.
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <StatPill label="Hometown" value={opponent.hometown} />
              <StatPill label="OVR" value={getOpponentOverall(opponent)} />
            </div>

            <div className="mt-2 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-3">
              <div className="text-xs uppercase tracking-wide text-yellow-200">
                Signature Move
              </div>
              <div className="mt-1 text-lg font-black text-white">
                {signatureMove?.label || "Unknown"}
              </div>
              <div className="mt-1 text-sm text-zinc-400">
                {signatureMove?.description || "No signature move scouted yet."}
              </div>
            </div>
          </motion.div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={onEnterBattle}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 text-base font-black text-black"
            >
              <Swords size={20} />
              Enter Battle
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-zinc-700 bg-black px-5 text-base font-black text-white"
            >
              Back to Ladder
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function MoveChoiceCard({ move, onSelect }) {
  const accent = MOVE_ACCENTS[move.primaryStat] || MOVE_ACCENTS.composure;
  const signatureClass = move.isSignatureOption
    ? "border-yellow-300 bg-yellow-300/15 shadow-yellow-500/20"
    : accent;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(move.id)}
      whileTap={{ scale: 0.97 }}
      className={`w-full rounded-2xl border p-4 text-left shadow-lg shadow-black/30 ${signatureClass}`}
    >
      {move.isSignatureOption && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-flex rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-black"
        >
          Signature Move · Once per battle
        </motion.div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-white">{move.label}</div>
          <div className="mt-1 text-sm leading-5 text-zinc-400">{move.description}</div>
        </div>
        <div className="rounded-xl bg-zinc-900 px-3 py-2 text-center">
          <div className="text-[10px] uppercase text-zinc-500">Power</div>
          <div className="text-lg font-black text-lime-300">{move.power}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
          {move.primaryStat}
        </span>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
          Risk: {move.risk}
        </span>
        <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
          Momentum {move.momentumEffect >= 0 ? "+" : ""}
          {move.momentumEffect}
        </span>
      </div>
    </motion.button>
  );
}

function ExchangeResultCard({ turn, exchangeNumber, onNext }) {
  const signatureMoment = turn.battlerA.isSignatureMove || turn.battlerB.isSignatureMove;
  const signatureBattler = turn.battlerA.isSignatureMove ? turn.battlerA : turn.battlerB;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28 }}
    >
      <SectionCard className="border-lime-400/40">
      {signatureMoment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 rounded-2xl border border-yellow-300/70 bg-yellow-300/15 p-3 text-center"
        >
          <div className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">
            Signature Battle Moment
          </div>
          <div className="mt-1 text-xl font-black text-white">
            {signatureBattler.moveLabel}
          </div>
          <div className="mt-1 text-sm text-yellow-100">
            Spotlight hit. Crowd pressure spiked.
          </div>
        </motion.div>
      )}
      <div className="mb-3">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
          Exchange {exchangeNumber} Result
        </div>
        <h2 className="mt-1 text-2xl font-black">
          {turn.winner === "A"
            ? "You took the room"
            : turn.winner === "B"
            ? "Opponent answered back"
            : "The room stayed split"}
        </h2>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <motion.div
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-zinc-800 bg-black p-3"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-500">Your Move</div>
            <div className="mt-1 text-lg font-black">{turn.battlerA.moveLabel}</div>
            <div className="mt-1 text-sm text-zinc-400">
              Impact {turn.battlerA.impactScore} · {turn.battlerA.riskOutcome}
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.14 }}
            className="rounded-2xl border border-zinc-800 bg-black p-3"
          >
            <div className="text-xs uppercase tracking-wide text-zinc-500">Opponent Move</div>
            <div className="mt-1 text-lg font-black">{turn.battlerB.moveLabel}</div>
            <div className="mt-1 text-sm text-zinc-400">
              Impact {turn.battlerB.impactScore} · {turn.battlerB.riskOutcome}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Crowd" value={`${turn.battlerA.crowdReaction}/100`} />
          <motion.div
            animate={signatureMoment ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <StatPill
              label="Swing"
              value={`${turn.momentumSwing >= 0 ? "+" : ""}${turn.momentumSwing}`}
            />
          </motion.div>
          <StatPill label="Momentum" value={turn.crowdMomentum.after} />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-lime-400 px-5 text-base font-black text-black"
      >
        Next Exchange
      </button>
    </SectionCard>
    </motion.div>
  );
}

export default function MyCareer() {
  const navigate = useNavigate();
  const { builds, loading, error } = useBattlers();
  const [selectedId, setSelectedId] = useState("");
  const [progress, setProgress] = useState(() => readProgress());
  const [result, setResult] = useState(null);
  const [introActive, setIntroActive] = useState(false);
  const [battleActive, setBattleActive] = useState(false);
  const [turns, setTurns] = useState([]);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [usedSignatureMoveIds, setUsedSignatureMoveIds] = useState([]);
  const [copyStatus, setCopyStatus] = useState("");
  const [selectedOpponentId, setSelectedOpponentId] = useState(
    () => normalizeProgress(readProgress()).lastOpponentId || CAREER_TIERS[0].opponents[0].id
  );

  const selectedOpponent = useMemo(
    () =>
      getOpponentById(selectedOpponentId) ||
      getFirstUnlockedOpponent(progress),
    [progress, selectedOpponentId]
  );
  const opponentStatus = getOpponentStatus(selectedOpponent.id, progress);
  const selectedOpponentHistory = getOpponentHistory(progress, selectedOpponent.id);
  const selectedOpponentIsRival = isOpponentRival(progress, selectedOpponent.id);
  const canStartSelectedOpponent = ["available", "defeated"].includes(opponentStatus);
  const selectedBattler = useMemo(
    () => builds.find((build) => build.id === selectedId) || null,
    [builds, selectedId]
  );
  const equippedLoadoutIds = useMemo(
    () => getLoadoutMoveIds(progress, selectedBattler),
    [progress, selectedBattler]
  );
  const unlockedMoveIds = useMemo(
    () => getUnlockedMoveIds(progress, selectedBattler),
    [progress, selectedBattler]
  );
  const moveOptions = useMemo(
    () => getPlayerMoveOptions(selectedBattler, progress, usedSignatureMoveIds),
    [selectedBattler, progress, usedSignatureMoveIds]
  );
  const selectedStats = useMemo(
    () => getDisplayStats(selectedBattler, progress),
    [selectedBattler, progress]
  );
  const latestTurn = turns[turns.length - 1] || null;
  const nextExchangeNumber = turns.length + 1;
  const currentMomentum =
    result?.crowdReaction ||
    latestTurn?.crowdMomentum?.after ||
    CROWD_MOMENTUM_RULES.startingMomentum;
  const battlePhase = result
    ? "final result"
    : awaitingNext
    ? "reveal"
    : battleActive
    ? "choosing"
    : introActive
    ? "entrance"
    : "ready";
  const signatureMoment =
    latestTurn?.battlerA?.isSignatureMove || latestTurn?.battlerB?.isSignatureMove;

  useEffect(() => {
    const storedId = localStorage.getItem(SELECTED_KEY);
    if (storedId) setSelectedId(storedId);
  }, []);

  useEffect(() => {
    if (!selectedId && builds.length > 0) {
      setSelectedId(builds[0].id);
      localStorage.setItem(SELECTED_KEY, builds[0].id);
    }
  }, [builds, selectedId]);

  useEffect(() => {
    if (getOpponentStatus(selectedOpponentId, progress) === "locked") {
      setSelectedOpponentId(getFirstUnlockedOpponent(progress).id);
    }
  }, [progress, selectedOpponentId]);

  useEffect(() => {
    if (!selectedBattler) return;

    const current = normalizeProgress(progress);
    if (Object.prototype.hasOwnProperty.call(current.moveLoadouts, selectedBattler.id)) {
      return;
    }

    const defaultLoadout = getLoadoutMoveIds(current, selectedBattler);
    if (!defaultLoadout.length) return;

    const nextProgress = {
      ...current,
      unlockedMoveIds: Array.from(
        new Set([...current.unlockedMoveIds, ...getBaseUnlockedMoveIds(selectedBattler)])
      ),
      moveLoadouts: {
        ...current.moveLoadouts,
        [selectedBattler.id]: defaultLoadout,
      },
    };

    setProgress(nextProgress);
    writeProgress(nextProgress);
  }, [progress, selectedBattler]);

  function selectBattler(id) {
    setSelectedId(id);
    setResult(null);
    setIntroActive(false);
    setBattleActive(false);
    setTurns([]);
    setAwaitingNext(false);
    setUsedSignatureMoveIds([]);
    setCopyStatus("");
    localStorage.setItem(SELECTED_KEY, id);
  }

  function startBattle() {
    if (!selectedBattler || !canStartSelectedOpponent) return;
    setResult(null);
    setTurns([]);
    setAwaitingNext(false);
    setUsedSignatureMoveIds([]);
    setCopyStatus("");
    setIntroActive(true);
    setBattleActive(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function enterBattleFromIntro() {
    if (!selectedBattler || !canStartSelectedOpponent) return;
    setIntroActive(false);
    setBattleActive(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exitBattleIntro() {
    setIntroActive(false);
    setBattleActive(false);
    setTurns([]);
    setAwaitingNext(false);
    setUsedSignatureMoveIds([]);
    setCopyStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishBattle(finalTurns) {
    const wasRivalryBattle = isOpponentRival(progress, selectedOpponent.id);
    const battleResult = buildBattleResult(finalTurns, selectedOpponent, wasRivalryBattle);
    const { nextProgress, newlyEarnedTitles, newlyUnlockedMoves, summary } = applyBattleProgress(
      progress,
      battleResult,
      selectedBattler
    );
    const updatedOpponentHistory = getOpponentHistory(nextProgress, selectedOpponent.id);
    const resultWithProgress = {
      ...battleResult,
      rivalryActive: isOpponentRival(nextProgress, selectedOpponent.id),
      opponentHistory: updatedOpponentHistory,
      newlyEarnedTitles,
      newlyUnlockedMoves,
      progressionSummary: summary,
    };

    setResult(resultWithProgress);
    setProgress(nextProgress);
    writeProgress(nextProgress);
    setIntroActive(false);
    setBattleActive(false);
    setAwaitingNext(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectMove(moveId) {
    if (!selectedBattler || !battleActive || awaitingNext) return;

    const opponentMove = pickMove(selectedOpponent.moveLoadout || ["clean_round"], turns.length);
    const currentMomentum =
      turns[turns.length - 1]?.crowdMomentum?.after ||
      CROWD_MOMENTUM_RULES.startingMomentum;
    const turn = runTurn(
      {
        name: selectedBattler.name,
        archetypeId: selectedBattler.archetypeId,
        attributes: buildBattleAttributes(selectedBattler, progress),
      },
      moveId,
      {
        name: selectedOpponent.label,
        archetypeId: selectedOpponent.archetype,
        attributes: selectedOpponent.stats,
      },
      opponentMove,
      { currentMomentum }
    );
    const nextTurns = [...turns, turn];

    setTurns(nextTurns);
    if (moveId === getSignatureMoveId(selectedBattler)) {
      setUsedSignatureMoveIds((prev) => Array.from(new Set([...prev, moveId])));
    }
    if (nextTurns.length >= 3) {
      finishBattle(nextTurns);
    } else {
      setAwaitingNext(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function upgradeStat(statId) {
    if (!selectedBattler || (progress.statPoints || 0) <= 0) return;

    const current = normalizeProgress(progress);
    const battlerUpgrades = current.statUpgrades[selectedBattler.id] || {};
    const nextProgress = {
      ...current,
      statPoints: current.statPoints - 1,
      statUpgrades: {
        ...current.statUpgrades,
        [selectedBattler.id]: {
          ...battlerUpgrades,
          [statId]: (Number(battlerUpgrades[statId]) || 0) + 1,
        },
      },
    };

    setProgress(nextProgress);
    writeProgress(nextProgress);
  }

  function toggleLoadoutMove(moveId) {
    if (!selectedBattler) return;

    const current = normalizeProgress(progress);
    const signatureMoveId = getSignatureMoveId(selectedBattler);
    const unlocked = getUnlockedMoveIds(current, selectedBattler);
    if (!unlocked.includes(moveId) || moveId === signatureMoveId) return;

    const currentLoadout = getLoadoutMoveIds(current, selectedBattler);
    const equipped = currentLoadout.includes(moveId);
    const nextLoadout = equipped
      ? currentLoadout.filter((id) => id !== moveId)
      : currentLoadout.length < NORMAL_LOADOUT_SIZE
      ? [...currentLoadout, moveId]
      : currentLoadout;

    const nextProgress = {
      ...current,
      moveLoadouts: {
        ...current.moveLoadouts,
        [selectedBattler.id]: nextLoadout,
      },
    };

    setProgress(nextProgress);
    writeProgress(nextProgress);
  }

  async function copyCaption(caption) {
    setCopyStatus("");
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCopyStatus("Clipboard is unavailable in this browser. Long-press the card text or take a screenshot for now.");
      return;
    }

    try {
      await navigator.clipboard.writeText(caption);
      setCopyStatus("Caption copied.");
    } catch {
      setCopyStatus("Clipboard permission was blocked. You can still screenshot the card.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-4">
        <header className="sticky top-0 z-10 -mx-4 border-b border-zinc-900 bg-black/95 px-4 pb-3 pt-2 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-200"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
                MyCareer
              </div>
              <h1 className="text-3xl font-black tracking-tight">{selectedOpponent.tier}</h1>
            </div>
            <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-3 text-lime-200">
              <Trophy size={24} />
            </div>
          </div>
        </header>

        <div className="space-y-4 pt-5">
          <div className="grid grid-cols-4 gap-2">
            <StatPill label="LVL" value={progress.level || 1} />
            <StatPill label="XP" value={progress.xp || 0} />
            <StatPill label="PTS" value={progress.statPoints || 0} />
            <StatPill label="REC" value={`${progress.wins || 0}-${progress.losses || 0}`} />
          </div>

          {error && (
            <SectionCard className="border-red-500/40 bg-red-500/10 text-sm text-red-100">
              {error}
            </SectionCard>
          )}

          {(introActive || battleActive || result) && selectedBattler && (
            <BattleStage
              player={selectedBattler}
              opponent={selectedOpponent}
              exchangeNumber={result ? 3 : nextExchangeNumber}
              momentum={currentMomentum}
              phase={battlePhase}
              signatureMoment={signatureMoment}
              tierLabel={selectedOpponent.tier}
            />
          )}

          {introActive && selectedBattler && (
            <OpponentIntroScreen
              opponent={selectedOpponent}
              isRival={selectedOpponentIsRival}
              history={selectedOpponentHistory}
              onEnterBattle={enterBattleFromIntro}
              onBack={exitBattleIntro}
            />
          )}

          {battleActive && selectedBattler && !awaitingNext && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              <SectionCard className="border-lime-400/40">
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
                  Exchange {nextExchangeNumber} of 3
                </div>
                <h2 className="mt-1 text-2xl font-black">Pick your move</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {selectedBattler.name} vs {selectedOpponent.label}. Current momentum:{" "}
                  {latestTurn?.crowdMomentum?.after || CROWD_MOMENTUM_RULES.startingMomentum}/100.
                </p>
              </div>
              <div className="space-y-3">
                {moveOptions.map((move) => (
                  <MoveChoiceCard key={move.id} move={move} onSelect={selectMove} />
                ))}
              </div>
            </SectionCard>
            </motion.div>
          )}

          {battleActive && awaitingNext && latestTurn && (
            <ExchangeResultCard
              turn={latestTurn}
              exchangeNumber={turns.length}
              onNext={() => setAwaitingNext(false)}
            />
          )}

          {!introActive && !battleActive && loading ? (
            <SectionCard>
              <div className="text-sm text-zinc-400">Loading your battlers...</div>
            </SectionCard>
          ) : !introActive && !battleActive && builds.length === 0 ? (
            <SectionCard>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                  <Plus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Create Your Battler</h2>
                  <p className="text-sm text-zinc-400">Start your career with a name, style, hometown, and moves.</p>
                </div>
              </div>
              <Link
                to="/therise/create"
                className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-lime-400 px-5 text-base font-black text-black"
              >
                Create Your Battler
              </Link>
            </SectionCard>
          ) : !introActive && !battleActive && !result ? (
            <>
              <SectionCard>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Active Battler
                    </div>
                    <h2 className="text-xl font-black">Choose your build</h2>
                  </div>
                  <Link
                    to="/therise/create"
                    className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-zinc-700 px-3 text-sm font-bold"
                  >
                    <Plus size={17} />
                    New
                  </Link>
                </div>

                <div className="space-y-3">
                  {builds.map((build) => {
                    const active = build.id === selectedId;
                    const buildStats =
                      active ? selectedStats : getDisplayStats(build, progress);
                    return (
                      <button
                        key={build.id}
                        type="button"
                        onClick={() => selectBattler(build.id)}
                        className={`w-full rounded-2xl border p-4 text-left ${
                          active
                            ? "border-lime-400 bg-lime-400/10"
                            : "border-zinc-800 bg-black"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-lg font-black">{build.name}</div>
                            <div className="text-sm text-zinc-400">
                              {build.archetypeLabel} · Best stat{" "}
                              {Math.max(...Object.values(buildStats))}
                            </div>
                          </div>
                          <div className="rounded-xl bg-zinc-900 px-3 py-2 text-center">
                            <div className="text-[10px] uppercase text-zinc-500">OVR</div>
                            <div className="text-lg font-black text-lime-300">{build.ovr}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <UpgradeStatsPanel
                battler={selectedBattler}
                progress={progress}
                onUpgrade={upgradeStat}
              />

              <LoadoutPanel
                battler={selectedBattler}
                progress={progress}
                equippedMoveIds={equippedLoadoutIds}
                unlockedMoveIds={unlockedMoveIds}
                onToggleMove={toggleLoadoutMove}
              />

              <TrophyCase progress={progress} />

              <OpponentLadder
                progress={progress}
                selectedOpponentId={selectedOpponent.id}
                onSelect={(opponentId) => {
                  setSelectedOpponentId(opponentId);
                  setResult(null);
                  setIntroActive(false);
                }}
              />

              <SectionCard>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
                    <Flame size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Selected Battle
                    </div>
                    <h2 className="text-xl font-black">{selectedOpponent.label}</h2>
                    {selectedOpponentIsRival && (
                      <div className="mt-1 inline-flex rounded-full border border-red-400/60 bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-100">
                        Rivalry Battle
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-6 text-zinc-300">{selectedOpponent.bio}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <StatPill label="Record" value={selectedOpponent.record} />
                  <StatPill
                    label="Status"
                    value={opponentStatus === "defeated" ? "rematch" : opponentStatus}
                  />
                </div>
                <div className="mt-2 rounded-2xl border border-zinc-800 bg-black p-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Reputation
                  </div>
                  <div className="mt-1 text-sm font-bold text-zinc-200">
                    {selectedOpponent.reputationTier} from {selectedOpponent.hometown}
                  </div>
                </div>
                {selectedOpponentHistory.attempts > 0 && (
                  <div className="mt-2 rounded-2xl border border-zinc-800 bg-black p-3">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Head-to-Head
                    </div>
                    <div className="mt-1 text-sm font-bold text-zinc-200">
                      {selectedOpponentHistory.attempts} battles ·{" "}
                      {selectedOpponentHistory.wins}-{selectedOpponentHistory.losses}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={startBattle}
                  disabled={!selectedBattler || !canStartSelectedOpponent}
                  className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 text-base font-black text-black disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  <Swords size={20} />
                  {opponentStatus === "defeated" ? "Rematch" : "Start Battle"}
                </button>
              </SectionCard>
            </>
          ) : null}

          {result && selectedBattler && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28 }}
            >
              <SectionCard className="border-lime-400/40">
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">
                  {result.isRivalryBattle || result.rivalryActive
                    ? "Rivalry Battle Result"
                    : "Battle Result"}
                </div>
                <h2 className="mt-1 text-3xl font-black">
                  {result.winner === "player" ? "You won the room" : "Opponent edged it"}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-black p-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Matchup</div>
                  <div className="mt-1 text-lg font-black">
                    {selectedBattler.name} vs {result.opponentLabel || selectedOpponent.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <StatPill label="Crowd" value={`${result.crowdReaction}/100`} />
                  <StatPill label="XP Earned" value={`+${result.xpEarned}`} />
                </div>

                {(result.isRivalryBattle || result.rivalryActive) && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3">
                    <div className="text-xs uppercase tracking-wide text-red-200">
                      Rivalry Battle
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">
                      Head-to-head record: {result.opponentHistory?.wins || 0}-
                      {result.opponentHistory?.losses || 0}
                    </div>
                    {result.rivalryBonusXp > 0 && (
                      <div className="mt-1 text-xs text-zinc-300">
                        Rivalry bonus: +{result.rivalryBonusXp} XP
                      </div>
                    )}
                  </div>
                )}

                <ProgressionSummary summary={result.progressionSummary} />

                {result.newlyEarnedTitles?.length > 0 && (
                  <div className="rounded-2xl border border-yellow-300/40 bg-yellow-300/10 p-3">
                    <div className="text-xs uppercase tracking-wide text-yellow-200">
                      New Title Unlocked
                    </div>
                    <div className="mt-2 space-y-2">
                      {result.newlyEarnedTitles.map((title) => (
                        <div key={title.id} className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-black">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <div className="font-black text-white">{title.label}</div>
                            <div className="text-sm text-zinc-400">
                              {title.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.newlyUnlockedMoves?.length > 0 && (
                  <div className="rounded-2xl border border-lime-400/40 bg-lime-400/10 p-3">
                    <div className="text-xs uppercase tracking-wide text-lime-200">
                      New Move Unlocked
                    </div>
                    <div className="mt-2 space-y-2">
                      {result.newlyUnlockedMoves.map((move) => (
                        <div key={move.id} className="rounded-xl border border-zinc-800 bg-black p-3">
                          <div className="font-black text-white">{move.label}</div>
                          <div className="mt-1 text-sm text-zinc-400">
                            {move.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <PostBattleShareCard
                  result={result}
                  playerName={selectedBattler.name}
                  opponentName={result.opponentLabel || selectedOpponent.label}
                  copyStatus={copyStatus}
                  onCopy={copyCaption}
                />

                <div className="rounded-2xl border border-zinc-800 bg-black p-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Momentum
                  </div>
                  <div className="mt-1 text-sm text-zinc-300">
                    Started at {result.momentumSummary.start}, finished at{" "}
                    {result.momentumSummary.finish}. Swing:{" "}
                    {result.momentumSummary.swing >= 0 ? "+" : ""}
                    {result.momentumSummary.swing}.
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Key Exchanges
                  </div>
                  <div className="mt-2 space-y-2">
                    {result.turns.map((turn, index) => (
                      <div key={`${turn.battlerA.move}-${index}`} className="text-sm text-zinc-300">
                        <span className="font-bold text-white">Round {index + 1}:</span>{" "}
                        {turn.battlerA.moveLabel} vs {turn.battlerB.moveLabel}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResult(null)}
                className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-5 text-base font-black text-white"
              >
                Back to Career
              </button>
            </SectionCard>
            </motion.div>
          )}
        </div>
      </main>

    </div>
  );
}
