import {
  CAREER_TIERS,
  getOpponentHistory,
  getOpponentStatus,
  isTierUnlocked,
  isOpponentRival,
} from "./progression";
import CollectibleOpponentCard from "./CollectibleOpponentCard";
import { SectionCard } from "./ui";

export default function OpponentLadder({ progress, selectedOpponentId, onSelect }) {
  return (
    <SectionCard>
      <div className="mb-4">
        <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          MyCareer Ladder
        </div>
        <h2 className="text-xl font-black">Choose your opponent</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Clear each tier to unlock tougher rooms on the road.
        </p>
      </div>

      <div className="space-y-4">
        {CAREER_TIERS.map((tier) => {
          const tierUnlocked = !tier.comingSoon && isTierUnlocked(tier.id, progress);
          const defeatedCount = tier.opponents.filter((opponent) =>
            progress.defeatedOpponentIds.includes(opponent.id)
          ).length;

          return (
            <div
              key={tier.id}
              className={`rounded-3xl border p-3 ${
                tierUnlocked
                  ? "border-zinc-800 bg-black"
                  : "border-zinc-800 bg-zinc-950/80 opacity-75"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3 px-1">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-lime-300">
                    {tier.label}
                  </div>
                  <div className="mt-1 text-sm leading-5 text-zinc-400">
                    {tier.description}
                  </div>
                </div>
                <div className="shrink-0 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-center">
                  <div className="text-[10px] uppercase text-zinc-500">Tier</div>
                  <div className="text-xs font-black uppercase text-zinc-200">
                    {tier.comingSoon
                      ? "coming soon"
                      : tierUnlocked
                      ? `${defeatedCount}/${tier.opponents.length}`
                      : "locked"}
                  </div>
                </div>
              </div>

              {tier.comingSoon ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs font-black uppercase tracking-wide text-zinc-500">
                      Planned Names
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tier.plannedOpponents.map((name) => (
                        <span
                          key={name}
                          className="rounded-full border border-zinc-700 bg-black px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-300"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-3">
                    <div className="text-xs font-black uppercase tracking-wide text-lime-300">
                      Reward Preview
                    </div>
                    <div className="mt-1 text-sm leading-5 text-zinc-300">
                      {tier.rewardPreview}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {tier.opponents.map((opponent, index) => {
                    const status = getOpponentStatus(opponent.id, progress);
                    const history = getOpponentHistory(progress, opponent.id);
                    const rival = isOpponentRival(progress, opponent.id);
                    const selected = opponent.id === selectedOpponentId;
                    const locked = status === "locked";

                    return (
                      <CollectibleOpponentCard
                        key={opponent.id}
                        opponent={opponent}
                        battleNumber={index + 1}
                        selected={selected}
                        locked={locked}
                        status={status}
                        rival={rival}
                        history={history}
                        onSelect={onSelect}
                      />
                    );
                  })}
                </div>
              )}

              {!tier.comingSoon && !tierUnlocked && tier.unlocksAfterTierId && (
                <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-400">
                  Clear Local Open Mic to unlock this circuit.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
