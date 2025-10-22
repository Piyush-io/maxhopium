export const driverColors: Record<string, string> = {
  piastri: '#FF8700',
  norris: '#FFB347',
  verstappen: '#3671C6',
}

export const driverAvatars: Record<string, string> = {
  norris: '/Lando.png',
  piastri: '/Oscar.png',
  max_verstappen: '/Max.png',
  verstappen: '/Max.png',
}

export const idealScenario = {
  currentPoints: {
    norris: 293,
    piastri: 324,
    verstappen: 230,
  },
  actualPoints: {
    norris: [6, 15, 0, 18, 0, 0, 0, 0, 0, 0, 0],
    piastri: [0, 12, 0, 10, 0, 0, 0, 0, 0, 0, 0],
    verstappen: [25, 18, 8, 25, 0, 0, 0, 0, 0, 0, 0],
  },
  requiredPoints: {
    norris: [18, 15, 7, 15, 18, 7, 18, 18, 7, 18, 18],
    piastri: [0, 18, 6, 18, 15, 6, 15, 15, 6, 15, 15],
    verstappen: [25, 25, 8, 25, 25, 8, 25, 25, 8, 25, 25],
  },
  finalPoints: {
    norris: 452,
    piastri: 453,
    verstappen: 454,
  },
  races: [
    'AZE',
    'SGP',
    'USA S',
    'USA',
    'MEX',
    'BRA S',
    'BRA',
    'LV',
    'QAT S',
    'QAT',
    'ABD',
  ],
  completedRaces: 4,
}
