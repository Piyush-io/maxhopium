'use client'

import { driverColors } from '@/lib/constants'

interface TooltipPayload {
  value: number
  payload: Record<string, any>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const driverDisplayNames: Record<string, string> = {
  norris: 'Lando Norris',
  piastri: 'Oscar Piastri',
  verstappen: 'Max Verstappen',
}

export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const raceData = payload[0].payload
    const drivers = ['norris', 'piastri', 'verstappen']

    return (
      <div className="bg-[#0a0a0a]/60 backdrop-blur-xl rounded-lg p-4 shadow-2xl min-w-[240px]">
        <p className="font-mono text-xs mb-3 text-white/90 font-semibold">
          {raceData.raceName}
        </p>
        <div className="space-y-3">
          {drivers.map((driver) => {
            const actual = raceData[`${driver}Actual`]
            const required = raceData[`${driver}Required`]
            const color = driverColors[driver]

            if (actual === null && required === null) return null

            return (
              <div key={driver} className="space-y-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-white/90 font-medium text-xs">
                    {driverDisplayNames[driver]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pl-4">
                  <span className="text-white/50 text-[10px] font-mono">
                    Actual
                  </span>
                  <span className="font-mono text-white/90 text-xs font-semibold">
                    {actual !== null && actual !== undefined
                      ? Math.round(actual)
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pl-4">
                  <span className="text-white/50 text-[10px] font-mono">
                    Target
                  </span>
                  <span className="font-mono text-white/50 text-xs">
                    {required !== null && required !== undefined
                      ? Math.round(required)
                      : '—'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}
