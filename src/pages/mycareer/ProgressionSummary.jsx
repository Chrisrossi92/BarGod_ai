import { StatPill } from "./ui";

export default function ProgressionSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black p-3">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        Progression
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatPill label="Level" value={`${summary.levelBefore} -> ${summary.levelAfter}`} />
        <StatPill label="Points" value={`+${summary.statPointsEarned}`} />
        <StatPill label="XP Total" value={summary.xpAfter} />
        <StatPill
          label="Record"
          value={`${summary.recordAfter.wins}-${summary.recordAfter.losses}`}
        />
      </div>
    </div>
  );
}
