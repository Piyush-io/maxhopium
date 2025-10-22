import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 21600

interface RaceResult {
  round: string
  raceName: string
  date: string
  Results: Array<{
    position: string
    points: string
    Driver: {
      driverId: string
      givenName: string
      familyName: string
    }
  }>
}

interface ScheduleRace {
  round: string
  raceName: string
  date: string
  Sprint?: {
    date: string
    time: string
  }
}

interface StandingsData {
  round: string
  DriverStandings: Array<{
    position: string
    points: string
    wins: string
    Driver: {
      driverId: string
      givenName: string
      familyName: string
    }
  }>
}

export async function GET() {
  try {
    const standingsResponse = await fetch("https://api.jolpi.ca/ergast/f1/2025/driverStandings.json")
    const standingsData = await standingsResponse.json()
    const standings: StandingsData = standingsData.MRData.StandingsTable.StandingsLists[0]

    const resultsResponse = await fetch("https://api.jolpi.ca/ergast/f1/2025/results.json?limit=1000")
    const resultsData = await resultsResponse.json()
    const races: RaceResult[] = resultsData.MRData.RaceTable.Races

    const scheduleResponse = await fetch("https://api.jolpi.ca/ergast/f1/2025.json")
    const scheduleData = await scheduleResponse.json()
    const schedule: ScheduleRace[] = scheduleData.MRData.RaceTable.Races

    const topDrivers = standings.DriverStandings.slice(0, 3)

    const driversData = topDrivers.map((driver) => {
      const driverId = driver.Driver.driverId
      const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`

      let cumulativePoints = 0
      const racePoints = races.map((race) => {
        const result = race.Results.find((r) => r.Driver.driverId === driverId)
        const points = result ? Number.parseFloat(result.points) : 0
        cumulativePoints += points

        return {
          round: Number.parseInt(race.round),
          raceName: race.raceName,
          date: race.date,
          points: points,
          cumulative: cumulativePoints,
        }
      })

      return {
        driverId,
        name: driverName,
        currentPoints: Number.parseFloat(driver.points),
        position: Number.parseInt(driver.position),
        racePoints,
      }
    })

    const completedRounds = races.length
    const totalRoundsInSchedule = schedule.length
    const sprintRounds = schedule.filter(r => r.Sprint).map(r => Number.parseInt(r.round))
    
    const totalEvents = schedule.reduce((count, race) => {
      return count + 1 + (race.Sprint ? 1 : 0)
    }, 0)
    
    const completedEvents = races.reduce((count, race) => {
      const hasResults = race.Results && race.Results.length > 0
      const hasSprint = sprintRounds.includes(Number.parseInt(race.round))
      return count + (hasResults ? 1 : 0) + (hasSprint ? 1 : 0)
    }, 0)

    const remainingEvents = totalEvents - completedEvents
    const remainingRaces = totalRoundsInSchedule - completedRounds
    const remainingSprints = sprintRounds.filter(r => r > completedRounds).length

    return NextResponse.json({
      currentRound: Number.parseInt(standings.round),
      drivers: driversData,
      lastUpdate: new Date().toISOString(),
      schedule,
      completedRounds,
      totalRounds: totalRoundsInSchedule,
      remainingEvents,
      remainingRaces,
      remainingSprints,
      sprintRounds,
    })
  } catch (error) {
    console.error("[v0] Error fetching F1 data:", error)
    return NextResponse.json({ error: "Failed to fetch F1 data" }, { status: 500 })
  }
}
