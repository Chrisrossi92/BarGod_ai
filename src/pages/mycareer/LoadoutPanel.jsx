import { MOVES } from "@/logic/gameDesign";

import {
  MOVE_ACCENTS,
  NORMAL_LOADOUT_SIZE,
  getSignatureMoveId,
} from "./progression";
import { SectionCard } from "./ui";

export default function LoadoutPanel({
  battler,
  equippedMoveIds,
  unlockedMoveIds,
  onToggleMove,
}) {
  if (!battler) return null;

  const signatureMove = MOVES[getSignatureMoveId(battler)];
  const normalUnlockedMoves = unlockedMoveIds
    .filter((moveId) => moveId !== signatureMove?.id)
    .map((moveId) => MOVES[moveId])
    .filter(Boolean);

  return (
    <SectionCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Loadout
          </div>
          <h2 className="text-xl font-black">Set your moves</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Equip up to {NORMAL_LOADOUT_SIZE} normal moves. Signature stays separate.
          </p>
        </div>
        <div className="rounded-2xl border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-center">
          <div className="text-[10px] uppercase text-lime-300">Equipped</div>
          <div className="text-2xl font-black text-white">
            {equippedMoveIds.length}/{NORMAL_LOADOUT_SIZE}
          </div>
        </div>
      </div>

      {signatureMove && (
        <div className="mb-3 rounded-2xl border border-yellow-300/40 bg-yellow-300/10 p-3">
          <div className="text-xs uppercase tracking-wide text-yellow-200">
            Signature Move
          </div>
          <div className="mt-1 text-lg font-black text-white">
            {signatureMove.label}
          </div>
          <div className="mt-1 text-sm leading-5 text-zinc-400">
            Once per battle. Does not use a normal loadout slot.
          </div>
        </div>
      )}

      <div className="space-y-3">
        {normalUnlockedMoves.map((move) => {
          const equipped = equippedMoveIds.includes(move.id);
          const full = !equipped && equippedMoveIds.length >= NORMAL_LOADOUT_SIZE;
          const accent = MOVE_ACCENTS[move.primaryStat] || MOVE_ACCENTS.composure;

          return (
            <div
              key={move.id}
              className={`rounded-2xl border p-3 ${
                equipped ? "border-lime-400 bg-lime-400/10" : accent
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-black text-white">{move.label}</div>
                  <div className="mt-1 text-sm leading-5 text-zinc-400">
                    {move.description}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                    <span className="rounded-full bg-black px-3 py-1 text-zinc-300">
                      {move.primaryStat}
                    </span>
                    <span className="rounded-full bg-black px-3 py-1 text-zinc-300">
                      Power {move.power}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleMove(move.id)}
                  disabled={full}
                  className={`min-h-12 shrink-0 rounded-2xl px-4 text-sm font-black ${
                    equipped
                      ? "bg-zinc-900 text-white"
                      : "bg-lime-400 text-black disabled:bg-zinc-800 disabled:text-zinc-500"
                  }`}
                >
                  {equipped ? "Drop" : "Equip"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
