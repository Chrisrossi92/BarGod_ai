// src/components/therise/hometown/cityData.js

export const cities = [
  {
    id: 'nyc',
    name: 'New York City',
    x: '82%',
    y: '35%',
    bonus: {
      label: 'Legendary origin: +1 bars',
      stats: {
        punchlines: 1,
        presence: 1,
      },
    },
  },
  {
    id: 'la',
    name: 'Los Angeles',
    x: '12%',
    y: '65%',
    bonus: {
      label: 'Performance heavy: +1 crowd boost',
      stats: {
        crowdControl: 1,
        presence: 1,
      },
    },
  },
  {
    id: 'toronto',
    name: 'Toronto',
    x: '75%',
    y: '18%',
    bonus: {
      label: 'Freestyle-friendly: +1 improv',
      stats: {
        freestyle: 1,
        rebuttals: 1,
      },
    },
  },
  {
    id: 'detroit',
    name: 'Detroit',
    x: '60%',
    y: '25%',
    bonus: {
      label: 'Punchline capital: +1 haymaker chance',
      stats: {
        punchlines: 1,
        crowdControl: 1,
      },
    },
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    x: '65%',
    y: '65%',
    bonus: {
      label: 'Flow-focused: +1 rhythm control',
      stats: {
        schemes: 1,
        presence: 1,
      },
    },
  }
];
