// src/logic/battlerStats.js
import archetypes from "@/logic/archetypes";
import { cities } from "@/components/therise/hometown/cityData"; // adjust path

const ATTR_KEYS = [
  "punchlines",
  "schemes",
  "angles",
  "rebuttals",
  "freestyle",
  "presence",
  "crowdControl",
  "delivery",
];

const BASELINE = 60;     // minimum at level 1
const MAX_BASE = 80;     // top end for a level 1 in their best stats

// OVR weights (sum to 1.0)
const OVR_WEIGHTS = {
  punchlines: 0.20,
  schemes: 0.15,
  angles: 0.15,
  rebuttals: 0.10,
  freestyle: 0.10,
  presence: 0.15,
  crowdControl: 0.05,
  delivery: 0.10,
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// small integer noise to keep things from being too cookie-cutter
function smallRandomInt(range = 2) {
  // returns integer in [-range, +range]
  return Math.floor(Math.random() * (2 * range + 1)) - range;
}

/**
 * Map an archetype weight (roughly 0.4–1.0) to a base stat around 60–80.
 */
function mapEmphasisToStat(weight, options = {}) {
  const w = clamp(weight ?? 0.6, 0.4, 1.0);
  const normalized = (w - 0.4) / (1.0 - 0.4); // 0..1
  const base = BASELINE + normalized * (MAX_BASE - BASELINE); // 60..80
  const noisy = options.noRandom ? base : base + smallRandomInt(2); // +/-2 variation
  return Math.round(clamp(noisy, BASELINE, MAX_BASE));
}

/**
 * Generate base_attributes for a new battler given an archetype id.
 */
export function generateBaseAttributes(archetypeId) {
  const type = archetypes[archetypeId];
  const emphasis = type?.statEmphasis || {};

  const base = {};
  ATTR_KEYS.forEach((key) => {
    const weight = emphasis[key] ?? 0.6;
    base[key] = mapEmphasisToStat(weight);
  });

  return base;
}

export function previewBaseAttributes(archetypeId) {
  const type = archetypes[archetypeId];
  const emphasis = type?.statEmphasis || {};

  const base = {};
  ATTR_KEYS.forEach((key) => {
    const weight = emphasis[key] ?? 0.6;
    base[key] = mapEmphasisToStat(weight, { noRandom: true });
  });

  return base;
}

/**
 * Apply hometown bonus stats to base attributes.
 * cityData bonus shape: { label, stats: { punchlines: +1, presence: +2, ... } }
 */
export function getHometownBonus(hometownId) {
  if (!hometownId) return {};
  const city = cities.find((c) => c.id === hometownId);
  if (!city || !city.bonus || !city.bonus.stats) return {};
  return city.bonus.stats;
}

export function computeEffectiveAttributes(base, bonus) {
  const effective = {};
  ATTR_KEYS.forEach((key) => {
    const baseVal = base?.[key] ?? BASELINE;
    const bonusVal = bonus?.[key] ?? 0;
    effective[key] = baseVal + bonusVal;
  });
  return effective;
}

/**
 * Compute overall rating (OVR) from effective attributes using weights.
 */
export function computeOVR(effective) {
  let total = 0;
  let weightSum = 0;
  ATTR_KEYS.forEach((key) => {
    const stat = effective?.[key] ?? BASELINE;
    const w = OVR_WEIGHTS[key] ?? 0;
    total += stat * w;
    weightSum += w;
  });
  const raw = weightSum > 0 ? total / weightSum : BASELINE;
  const ovr = Math.round(raw);
  return clamp(ovr, 60, 99);
}
