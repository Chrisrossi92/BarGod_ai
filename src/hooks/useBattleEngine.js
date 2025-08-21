import { useState } from "react";

/**
 * useBattleEngine (scaffold)
 * Later: swap mock with OpenAI call using your API key.
 */
export default function useBattleEngine() {
  const [isLoading, setIsLoading] = useState(false);

  async function generateBars({ round, a, b }) {
    setIsLoading(true);
    // MOCK: quick, deterministic bars for now
    const promptSeed = `${a} vs ${b} :: round ${round}`;
    const barA = makeMockBars(promptSeed + "::A");
    const barB = makeMockBars(promptSeed + "::B");
    await delay(350); // tiny UX delay
    setIsLoading(false);
    return { a: barA, b: barB };
  }

  return { generateBars, isLoading };
}

function makeMockBars(seed) {
  // toy generator; replace with AI later
  const templates = [
    "I break down {opp} like rhyme schemes in a clinic,\nInternal gears turning—every punch lands with physics.",
    "You’re ‘bout filler, I’m thriller—crowd stuck in a loop,\nEvery setup a breadcrumb, every haymaker the coup.",
    "Angles on angles, I’m drafting the thesis,\nYou reach for the stars, I’m charting the pieces.",
    "Bars braided like DNA—double helix precision,\nRoom silent then BOOM—crowd flips on the vision.",
    "I’m coaching the cadence—tempo toggled on tap,\nYou phoning it in, I turn your round to a recap.",
  ];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const pick = templates[sum % templates.length];
  const opp = seed.includes("::A") ? "Corner B" : "Corner A";
  return pick.replace("{opp}", opp);
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));