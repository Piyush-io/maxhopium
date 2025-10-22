export interface RacePoint {
  round: number
  raceName: string
  date: string
  points: number
  cumulative: number
}

export interface DriverData {
  driverId: string
  name: string
  currentPoints: number
  position: number
  racePoints: RacePoint[]
}

export interface F1ChampionshipTrackerProps {
  initialData: F1ApiResponse | null
}

export interface ScheduleRace {
  round: string
  raceName: string
  date: string
  Sprint?: {
    date: string
    time: string
  }
}

export interface F1ApiResponse {
  currentRound: number
  drivers: DriverData[]
  lastUpdate: string
  schedule?: ScheduleRace[]
  completedRounds?: number
  totalRounds?: number
  remainingEvents?: number
  remainingRaces?: number
  remainingSprints?: number
  sprintRounds?: number[]
}

export interface ChampionshipScenario {
  currentPoints: Record<string, number>
  actualPoints: Record<string, number[]>
  requiredPoints: Record<string, number[]>
  finalPoints: Record<string, number>
  races: string[]
  completedRaces: number
}

export interface DriverWithScenario {
  driverId: string
  name: string
  currentPoints: number
  targetPoints?: number
  pointsNeeded?: number | null
  avgPointsNeeded?: number | null
  actualPoints: number
  position: number
}

export interface ChartDataPoint {
  race: string
  raceName: string
  round: number
  isFuture: boolean
  [key: string]: any
}
