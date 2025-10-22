"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { idealScenario, driverColors } from "@/lib/constants";
import { CustomTooltip } from "@/components/championship/CustomTooltip";
import { DriverCard } from "@/components/championship/DriverCard";
import type { DriverData, F1ChampionshipTrackerProps } from "@/types/f1";

export default function F1ChampionshipTracker({
  initialData,
}: F1ChampionshipTrackerProps) {
  const f1Data = initialData;

  const lastCompletedRace =
    f1Data?.drivers[0]?.racePoints?.[f1Data.drivers[0].racePoints.length - 1]
      ?.raceName || "USA";
  const remainingEvents =
    f1Data?.remainingEvents ??
    idealScenario.races.length - idealScenario.completedRaces;
  const remainingRaces = f1Data?.remainingRaces ?? 5;
  const remainingSprints = f1Data?.remainingSprints ?? 2;

  const calculateChartData = () => {
    const data: any[] = [];
    const driverIds = ["norris", "piastri", "verstappen"];

    idealScenario.races.forEach((raceName, index) => {
      const isCompleted = index < idealScenario.completedRaces;

      const dataPoint: any = {
        race: raceName,
        raceName: raceName,
        round: index + 1,
        isFuture: !isCompleted,
      };

      driverIds.forEach((driverId) => {
        const currentPoints =
          idealScenario.currentPoints[
            driverId as keyof typeof idealScenario.currentPoints
          ];
        const requiredPointsArray =
          idealScenario.requiredPoints[
            driverId as keyof typeof idealScenario.requiredPoints
          ];
        const actualPointsArray =
          idealScenario.actualPoints[
            driverId as keyof typeof idealScenario.actualPoints
          ];

        // Calculate cumulative ideal points up to this race
        const cumulativeRequired = requiredPointsArray
          .slice(0, index + 1)
          .reduce((sum, pts) => sum + pts, 0);
        const totalIdealPoints = currentPoints + cumulativeRequired;

        // Calculate cumulative actual points up to this race
        const cumulativeActual = actualPointsArray
          .slice(0, index + 1)
          .reduce((sum, pts) => sum + pts, 0);
        const totalActualPoints = currentPoints + cumulativeActual;

        // Show ideal scenario (dotted line) for all races
        dataPoint[`${driverId}Required`] = totalIdealPoints;

        // Show actual points for completed races only
        if (isCompleted) {
          dataPoint[`${driverId}Actual`] = totalActualPoints;
        }
      });

      data.push(dataPoint);
    });

    console.log("[v0] Chart data calculated:", data);
    return data;
  };

  const chartData = calculateChartData();

  const driversWithScenarios = [
    {
      driverId: "norris",
      name: "Lando Norris",
      currentPoints: idealScenario.currentPoints.norris,
      position: 1,
      targetPoints: idealScenario.finalPoints.norris,
    },
    {
      driverId: "piastri",
      name: "Oscar Piastri",
      currentPoints: idealScenario.currentPoints.piastri,
      position: 2,
      targetPoints: idealScenario.finalPoints.piastri,
    },
    {
      driverId: "verstappen",
      name: "Max Verstappen",
      currentPoints: idealScenario.currentPoints.verstappen,
      position: 3,
      targetPoints: idealScenario.finalPoints.verstappen,
    },
  ]
    .map((driver) => {
      const currentActual =
        f1Data?.drivers?.find((d) =>
          d.name
            .toLowerCase()
            .includes(driver.name.toLowerCase().split(" ")[1]),
        )?.currentPoints || driver.currentPoints;

      return {
        ...driver,
        actualPoints: currentActual,
      };
    })
    .map((driver) => {
      if (driver.targetPoints) {
        const pointsNeeded = driver.targetPoints - driver.currentPoints;
        const remainingRaces =
          idealScenario.races.length - idealScenario.completedRaces;
        const avgPointsNeeded = Math.ceil(pointsNeeded / remainingRaces);

        return {
          ...driver,
          pointsNeeded,
          avgPointsNeeded,
        };
      }

      return {
        ...driver,
        pointsNeeded: null,
        avgPointsNeeded: null,
      };
    })
    .map((driver) => {
      const currentActual =
        f1Data?.drivers?.find((d) =>
          d.name
            .toLowerCase()
            .includes(driver.name.toLowerCase().split(" ")[1]),
        )?.currentPoints || driver.currentPoints;

      return {
        ...driver,
        actualPoints: currentActual,
      };
    })
    .sort((a, b) => b.actualPoints - a.actualPoints)
    .map((driver, index) => ({
      ...driver,
      position: index + 1,
    }));

  const minPoints =
    Math.min(...Object.values(idealScenario.currentPoints)) - 20;
  const maxPoints =
    Math.max(
      idealScenario.finalPoints.norris,
      idealScenario.finalPoints.piastri,
      idealScenario.finalPoints.verstappen,
    ) + 20;
  const wdcWinnerThreshold = Math.max(
    idealScenario.finalPoints.norris,
    idealScenario.finalPoints.piastri,
    idealScenario.finalPoints.verstappen,
  );

  return (
    <div className="bg-[#0a0a0a] grid-pattern flex flex-col items-center justify-start p-4 md:p-6 h-screen overflow-hidden border-0">
      <div className="w-full mb-4">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-mono font-bold text-white mb-1 uppercase">
              CAN MAX VERSTAPPEN STILL WIN THE WDC?
            </h1>
            <p className="text-xs text-white/40 font-mono">
              After {idealScenario.races[idealScenario.completedRaces - 1]} •{" "}
              {idealScenario.races.length - idealScenario.completedRaces} events
              remaining ({idealScenario.races.slice(idealScenario.completedRaces).filter(r => !r.includes('S')).length} Races, {idealScenario.races.slice(idealScenario.completedRaces).filter(r => r.includes('S')).length} Sprints)
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 grid grid-rows-1 lg:grid-cols-12 gap-4">
        <div
          className="lg:col-span-8 bg-[#0a0a0a] backdrop-blur-sm rounded-none p-4 md:p-6 overflow-hidden relative border border-white/[0.03]"
          style={{ minHeight: "min(70dvh, 560px)" }}
        >
          <div className="absolute top-2 left-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute top-2 right-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute bottom-2 left-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute bottom-2 right-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 800, height: 500 }}
          >
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="race"
                stroke="rgba(255,255,255,0.1)"
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />

              <YAxis
                stroke="rgba(255,255,255,0.1)"
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                domain={[minPoints, maxPoints]}
                label={{
                  value: "Points",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontFamily: "monospace",
                  },
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
                cursor={false}
              />

              <ReferenceLine
                y={wdcWinnerThreshold}
                stroke="#ef4444"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: "WDC Winner",
                  fill: "#ef4444",
                  fontSize: 12,
                  fontFamily: "monospace",
                  position: "top",
                  fontWeight: "600",
                }}
              />

              <ReferenceLine
                y={454}
                stroke="transparent"
                strokeWidth={0}
                label={{
                  value: "454",
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 10,
                  fontFamily: "monospace",
                  position: "left",
                }}
              />

              <ReferenceLine
                x="USA"
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="2 2"
                strokeWidth={1}
                label={{
                  value: "Now",
                  fill: "rgba(255,255,255,0.5)",
                  fontSize: 10,
                  fontFamily: "monospace",
                  position: "top",
                }}
              />

              {driversWithScenarios.slice(0, 2).map((driver, index) => {
                const color = driverColors[driver.driverId] || "#a1a1aa";

                return (
                  <Line
                    key={`actual-${index}`}
                    type="monotone"
                    dataKey={`${driver.driverId}Actual`}
                    name={`${driver.name}`}
                    stroke={color}
                    strokeWidth={3}
                    dot={{
                      fill: color,
                      strokeWidth: 0,
                      r: 3,
                    }}
                    activeDot={{
                      r: 6,
                      fill: color,
                      strokeWidth: 0,
                    }}
                    connectNulls={false}
                  />
                );
              })}

              <Line
                type="monotone"
                dataKey="verstappenActual"
                name="Max Verstappen"
                stroke={driverColors.verstappen}
                strokeWidth={3}
                dot={{
                  fill: driverColors.verstappen,
                  strokeWidth: 0,
                  r: 4,
                }}
                isAnimationActive={false}
                connectNulls={false}
              />

              {driversWithScenarios.map((driver, index) => {
                const color = driverColors[driver.driverId] || "#a1a1aa";

                return (
                  <Line
                    key={`required-${index}`}
                    type="monotone"
                    dataKey={`${driver.driverId}Required`}
                    name={`${driver.name} (Required)`}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    strokeOpacity={0.6}
                    connectNulls={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <aside className="lg:col-span-4 bg-[#0a0a0a] backdrop-blur-sm rounded-none p-6 flex flex-col gap-0 overflow-hidden relative border border-white/[0.03]">
          <div className="absolute top-2 left-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute top-2 right-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute bottom-2 left-2 text-neutral-800 text-xs font-mono">
            +
          </div>
          <div className="absolute bottom-2 right-2 text-neutral-800 text-xs font-mono">
            +
          </div>

          <div className="mb-6 mt-4">
            <h2 className="text-white text-xs font-mono mb-3 tracking-wide uppercase">
              Championship Standings
            </h2>
          </div>

           <div className="grid grid-cols-1 gap-0 relative flex-1">
             {driversWithScenarios.map((driver, index) => {
               const currentActual =
                 f1Data?.drivers?.find((d: DriverData) =>
                   d.name
                     .toLowerCase()
                     .includes(driver.name.toLowerCase().split(" ")[1]),
                 )?.currentPoints || driver.currentPoints;

               const driverKey =
                 driver.driverId as keyof typeof idealScenario.actualPoints;
               const completedPoints = idealScenario.actualPoints[
                 driverKey
               ].slice(0, idealScenario.completedRaces);
               const recentForm = completedPoints.slice(-5);
               const recentRaces = idealScenario.races.slice(
                 Math.max(0, idealScenario.completedRaces - 5),
                 idealScenario.completedRaces,
               );

               return (
                 <DriverCard
                   key={index}
                   driverId={driver.driverId}
                   name={driver.name}
                   position={driver.position}
                   currentPoints={currentActual}
                   targetPoints={driver.targetPoints}
                   recentForm={recentForm}
                   recentRaces={recentRaces}
                 />
               );
             })}
           </div>

           <div className="mt-6 pt-4 border-t border-white/[0.03] space-y-4">
             <div>
               <div className="text-white/60 text-[10px] font-mono mb-2 tracking-wide uppercase">
                 Lines
               </div>
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-[2px] bg-white/90" />
                   <span className="text-white/70 text-xs font-mono">Actual</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-[2px] border-t border-dashed border-white/50" />
                   <span className="text-white/70 text-xs font-mono">Target</span>
                 </div>
               </div>
             </div>
             
             <div>
               <div className="text-white/60 text-[10px] font-mono mb-2 tracking-wide uppercase">
                 Form
               </div>
               <div className="flex items-center gap-2">
                 <div className="flex gap-0.5 flex-1">
                   {[0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95].map((opacity, i) => (
                     <div
                       key={i}
                       className="flex-1 h-3 bg-white rounded-none"
                       style={{ opacity }}
                     />
                   ))}
                 </div>
               </div>
               <div className="flex justify-between mt-1">
                 <span className="text-white/40 text-[10px] font-mono">Bad</span>
                 <span className="text-white/90 text-[10px] font-mono">Good</span>
               </div>
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
