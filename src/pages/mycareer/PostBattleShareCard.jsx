import { useRef, useState } from "react";
import html2canvas from "html2canvas";

import { StatPill } from "./ui";

function getShareCardData({ result, playerName, opponentName }) {
  const turns = result?.turns || [];
  const playerSignatureTurn = turns.find((turn) => turn.battlerA?.isSignatureMove);
  const bestCrowdReaction = turns.reduce(
    (best, turn) => Math.max(best, turn.battlerA?.crowdReaction || 0),
    result?.crowdReaction || 0
  );
  const biggestSwingTurn = turns.reduce((best, turn) => {
    if (!best) return turn;
    return Math.abs(turn.momentumSwing || 0) > Math.abs(best.momentumSwing || 0)
      ? turn
      : best;
  }, null);
  const record = result?.progressionSummary?.recordAfter;
  const won = result?.winner === "player";
  const signatureMove = playerSignatureTurn?.battlerA?.moveLabel || null;
  const biggestSwing = biggestSwingTurn?.momentumSwing || 0;

  return {
    playerName,
    opponentName,
    isRivalryBattle: Boolean(result?.isRivalryBattle || result?.rivalryActive),
    newTitleLabels: (result?.newlyEarnedTitles || []).map((title) => title.label),
    newMoveLabels: (result?.newlyUnlockedMoves || []).map((move) => move.label),
    resultLabel: won ? "WIN" : "LOSS",
    resultText: won ? "Won the room" : "Lost the room",
    crowdReaction: result?.crowdReaction || 0,
    xpEarned: result?.xpEarned || 0,
    recordLabel: record ? `${record.wins}-${record.losses}` : "0-0",
    signatureMove,
    bestCrowdReaction,
    biggestSwing,
  };
}

function buildShareCaption(data) {
  return `BarGod MyCareer: ${data.playerName} ${data.resultLabel === "WIN" ? "defeated" : "fell to"} ${data.opponentName}${data.isRivalryBattle ? " in a Rivalry Battle" : ""}. Crowd ${data.crowdReaction}/100, +${data.xpEarned} XP, record ${data.recordLabel}.${data.signatureMove ? ` Signature: ${data.signatureMove}.` : ""}${data.newTitleLabels.length ? ` Title unlocked: ${data.newTitleLabels.join(", ")}.` : ""}${data.newMoveLabels.length ? ` Move unlocked: ${data.newMoveLabels.join(", ")}.` : ""}`;
}

function getSafeFilenamePart(value = "battler") {
  return value
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "battler";
}

export default function PostBattleShareCard({
  result,
  playerName,
  opponentName,
  copyStatus,
  onCopy,
}) {
  const cardRef = useRef(null);
  const [exportStatus, setExportStatus] = useState("");
  const data = getShareCardData({ result, playerName, opponentName });
  const caption = buildShareCaption(data);

  async function downloadShareCard() {
    setExportStatus("");
    if (!cardRef.current) {
      setExportStatus("Share card is not ready to export.");
      return;
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const player = getSafeFilenamePart(data.playerName);
      const opponent = getSafeFilenamePart(data.opponentName);

      link.download = `BarGod_${player}_vs_${opponent}_share_card.png`;
      link.href = dataUrl;
      link.click();
      setExportStatus("Share card downloaded.");
    } catch (error) {
      console.error("Failed to export BarGod share card", error);
      setExportStatus("Export failed. You can still screenshot the card.");
    }
  }

  return (
    <div className="rounded-3xl border border-lime-400/40 bg-zinc-950 p-3">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-5 shadow-2xl shadow-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.24),transparent_38%),linear-gradient(180deg,rgba(127,29,29,0.3),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-lime-400/10 to-transparent" />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-lime-300">
                BarGod
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                {data.isRivalryBattle ? "Rivalry Battle Share Card" : "MyCareer Share Card"}
              </div>
            </div>
            <div
              className={`rounded-2xl px-4 py-2 text-xl font-black ${
                data.resultLabel === "WIN"
                  ? "bg-lime-400 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {data.resultLabel}
            </div>
          </div>

          <div className="mt-8 text-center">
            {data.isRivalryBattle && (
              <div className="mb-3 inline-flex rounded-full border border-red-400/60 bg-red-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-100">
                Rivalry Battle
              </div>
            )}
            <div className="text-3xl font-black uppercase tracking-tight text-white">
              {data.playerName}
            </div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-zinc-500">
              vs
            </div>
            <div className="mt-2 text-2xl font-black uppercase tracking-tight text-zinc-200">
              {data.opponentName}
            </div>
            <div className="mt-3 text-sm font-bold text-lime-200">
              {data.resultText}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <StatPill label="Final Crowd" value={`${data.crowdReaction}/100`} />
            <StatPill label="XP" value={`+${data.xpEarned}`} />
            <StatPill label="Record" value={data.recordLabel} />
            <StatPill
              label="Biggest Swing"
              value={`${data.biggestSwing >= 0 ? "+" : ""}${data.biggestSwing}`}
            />
          </div>

          <div className="mt-3 rounded-2xl border border-zinc-800 bg-black/80 p-3">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Battle Moment
            </div>
            <div className="mt-1 text-lg font-black text-white">
              {data.signatureMove || "No signature spent"}
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              Best crowd reaction: {data.bestCrowdReaction}/100
            </div>
          </div>

          {data.newTitleLabels.length > 0 && (
            <div className="mt-3 rounded-2xl border border-yellow-300/40 bg-yellow-300/10 p-3">
              <div className="text-xs uppercase tracking-wide text-yellow-200">
                Title Unlocked
              </div>
              <div className="mt-1 text-lg font-black text-white">
                {data.newTitleLabels.join(", ")}
              </div>
            </div>
          )}

          {data.newMoveLabels.length > 0 && (
            <div className="mt-3 rounded-2xl border border-lime-400/40 bg-lime-400/10 p-3">
              <div className="text-xs uppercase tracking-wide text-lime-200">
                Move Unlocked
              </div>
              <div className="mt-1 text-lg font-black text-white">
                {data.newMoveLabels.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onCopy(caption)}
        className="mt-3 flex min-h-14 w-full items-center justify-center rounded-2xl bg-lime-400 px-5 text-base font-black text-black"
      >
        Copy Caption
      </button>
      <button
        type="button"
        onClick={downloadShareCard}
        className="mt-3 flex min-h-14 w-full items-center justify-center rounded-2xl border border-zinc-700 bg-black px-5 text-base font-black text-white"
      >
        Save Share Card
      </button>
      {copyStatus && (
        <div className="mt-2 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-300">
          {copyStatus}
        </div>
      )}
      {exportStatus && (
        <div className="mt-2 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-300">
          {exportStatus}
        </div>
      )}
    </div>
  );
}
