// src/logic/archetypes.js

// Core archetype definitions for The Rise and Battler system.
// These should stay in sync with any OVR/stat calculations.

const archetypes = {
  punchliner: {
    id: "punchliner",
    name: "Aggressive Punchliner",
    description:
      "Explosive direct attacks, heavy emphasis on haymakers and instant impact.",
    quote: `"You talk tough in your raps, but I've seen puddles with more depth."`,
    statEmphasis: {
      punchlines: 1.0,
      schemes: 0.5,
      angles: 0.6,
      rebuttals: 0.6,
      freestyle: 0.4,
      presence: 0.8,
      crowdControl: 0.7,
      delivery: 0.8,
    },
  },
  schemer: {
    id: "schemer",
    name: "Scheme Technician",
    description:
      "Layered writing and extended schemes that wear opponents down over time.",
    quote: `"I got schemes in my bars like dreams in REM — deep, real, and back to back."`,
    statEmphasis: {
      punchlines: 0.6,
      schemes: 1.0,
      angles: 0.8,
      rebuttals: 0.5,
      freestyle: 0.5,
      presence: 0.7,
      crowdControl: 0.6,
      delivery: 0.6,
    },
  },
  controller: {
    id: "controller",
    name: "Crowd Controller",
    description:
      "Commands attention and energy, thrives on momentum and big reactions.",
    quote: `"The crowd's reacting before I even punch — that's gravity in my presence."`,
    statEmphasis: {
      punchlines: 0.7,
      schemes: 0.6,
      angles: 0.7,
      rebuttals: 0.6,
      freestyle: 0.4,
      presence: 1.0,
      crowdControl: 1.0,
      delivery: 0.9,
    },
  },
  wildcard: {
    id: "wildcard",
    name: "Freestyle Wildcard",
    description:
      "Unpredictable and improv-heavy, thrives in chaos and off-the-dome swings.",
    quote: `"They said 'go freestyle,' so I unplugged the mic and used it as a weapon."`,
    statEmphasis: {
      punchlines: 0.7,
      schemes: 0.5,
      angles: 0.6,
      rebuttals: 0.8,
      freestyle: 1.0,
      presence: 0.7,
      crowdControl: 0.8,
      delivery: 0.7,
    },
  },
};

export default archetypes;
export const archetypeList = Object.values(archetypes);
