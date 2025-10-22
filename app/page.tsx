import F1ChampionshipTracker from "@/components/f1-championship-tracker"

async function getF1Data() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/f1-data`, {
      next: { revalidate: 21600 },
      cache: 'force-cache'
    })
    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error('Failed to fetch F1 data:', error)
    return null
  }
}

export default async function Home() {
  const f1Data = await getF1Data()
  
  return (
    <main className="h-dvh animated-gradient grid-pattern">
      <F1ChampionshipTracker initialData={f1Data} />
    </main>
  )
}
