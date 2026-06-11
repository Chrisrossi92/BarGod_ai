import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Dumbbell,
  Flame,
  FolderOpen,
  Mic,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import battleStage from "@/assets/battle-stage.jpg";
import BarGodLogo from "@/components/BarGodLogo";
import SocialTicker from "@/components/home/SocialTicker";

const featuredModes = [
  {
    title: "MyCareer",
    label: "Build your battler",
    description: "Create a persona, pick an archetype, choose moves, and start the climb.",
    to: "/mycareer",
    icon: Trophy,
    accent: "text-lime-300",
    border: "border-lime-400/40",
  },
  {
    title: "Quick Battle",
    label: "Run the matchup",
    description: "Select two battlers and simulate turns with the current battle engine.",
    to: "/simulate",
    icon: Swords,
    accent: "text-sky-300",
    border: "border-sky-400/40",
  },
  {
    title: "MyTeam",
    label: "Manage the roster",
    description: "Browse your battlers and shape the collection that will become crew play.",
    to: "/battlers",
    icon: Users,
    accent: "text-violet-300",
    border: "border-violet-400/40",
  },
];

const sideModes = [
  {
    title: "Training Room",
    to: "/training-room",
    icon: Dumbbell,
    description: "Jump into drills, studio tools, and practice flows.",
  },
  {
    title: "Bar Builder",
    to: "/bar-builder",
    icon: BookOpenText,
    description: "Write drafts with syllable counts and rhyme highlighting.",
  },
  {
    title: "Freestyle Lab",
    to: "/freestyle-lab",
    icon: Mic,
    description: "Record freestyles and run prompt drills over beats.",
  },
  {
    title: "Battlers",
    to: "/battlers",
    icon: Flame,
    description: "Search cards, stats, archetypes, and profile pages.",
  },
  {
    title: "My Work",
    to: "/my-work",
    icon: FolderOpen,
    description: "Open saved lyrics and take metadata from your local vault.",
  },
];

function FeaturedModeCard({ mode, index }) {
  const Icon = mode.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Link
        to={mode.to}
        className={`group block h-full rounded-2xl border ${mode.border} bg-zinc-950/80 p-5 shadow-xl shadow-black/30 backdrop-blur transition hover:-translate-y-1 hover:bg-zinc-900/90`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`mb-2 text-xs font-bold uppercase tracking-[0.18em] ${mode.accent}`}>
              {mode.label}
            </div>
            <h2 className="text-2xl font-black text-white">{mode.title}</h2>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Icon className={mode.accent} size={24} />
          </div>
        </div>
        <p className="mt-5 min-h-[72px] text-sm leading-6 text-zinc-300">
          {mode.description}
        </p>
        <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 group-hover:text-white">
          Enter mode
        </div>
      </Link>
    </motion.div>
  );
}

function SideModeLink({ mode }) {
  const Icon = mode.icon;

  return (
    <Link
      to={mode.to}
      className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-black/45 px-4 py-3 transition hover:border-zinc-500 hover:bg-zinc-900"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lime-300">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-white">{mode.title}</div>
        <div className="truncate text-xs text-zinc-400 group-hover:text-zinc-300">
          {mode.description}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${battleStage})` }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <BarGodLogo />
          <Link
            to="/login"
            className="rounded-full border border-zinc-700 bg-zinc-950/70 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-400 hover:text-white"
          >
            Sign in
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1fr_360px]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              <div className="mb-3 inline-flex rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
                Game Mode Select
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Build the battler. Train the pen. Win the room.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                BarGod is now organized around playable modes: career progression,
                roster management, quick simulations, writing tools, and saved work.
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {featuredModes.map((mode, index) => (
                <FeaturedModeCard key={mode.title} mode={mode} index={index} />
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Practice & Vault
                </div>
                <h2 className="text-xl font-black">Mode Shortcuts</h2>
              </div>
            </div>
            <div className="space-y-3">
              {sideModes.map((mode) => (
                <SideModeLink key={mode.title} mode={mode} />
              ))}
            </div>
          </aside>
        </section>

        <div className="pb-4">
          <SocialTicker />
        </div>
      </main>
    </div>
  );
}
