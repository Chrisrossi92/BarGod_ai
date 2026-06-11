import { Trophy } from "lucide-react";

import {
  CAREER_TITLE_LIST,
  getEarnedTitles,
} from "./progression";
import { SectionCard } from "./ui";

export default function TrophyCase({ progress }) {
  const earnedTitles = getEarnedTitles(progress);

  return (
    <SectionCard>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Trophy Case
          </div>
          <h2 className="text-xl font-black">Career Titles</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Lightweight local rewards for big MyCareer moments.
          </p>
        </div>
        <div className="rounded-2xl border border-yellow-300/40 bg-yellow-300/10 px-3 py-2 text-center">
          <div className="text-[10px] uppercase text-yellow-200">Titles</div>
          <div className="text-2xl font-black text-white">
            {earnedTitles.length}/{CAREER_TITLE_LIST.length}
          </div>
        </div>
      </div>

      {earnedTitles.length > 0 ? (
        <div className="space-y-3">
          {earnedTitles.map((title) => (
            <div
              key={title.id}
              className="flex items-start gap-3 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-black">
                <Trophy size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-black text-white">{title.label}</div>
                <div className="mt-1 text-sm leading-5 text-zinc-400">
                  {title.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-black p-3 text-sm text-zinc-400">
          Win battles and clear milestones to hang titles here.
        </div>
      )}
    </SectionCard>
  );
}
