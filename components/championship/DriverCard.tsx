"use client";

import { driverColors, driverAvatars } from "@/lib/constants";

interface DriverCardProps {
  driverId: string;
  name: string;
  position: number;
  currentPoints: number;
  targetPoints: number;
  recentForm: number[];
  recentRaces: string[];
}

export function DriverCard({
  driverId,
  name,
  position,
  currentPoints,
  targetPoints,
  recentForm,
  recentRaces,
}: DriverCardProps) {
  const color = driverColors[driverId as keyof typeof driverColors] || "#a1a1aa";
  const maxPoints = 26;

  return (
    <div className="bg-white/2 rounded-none p-5 flex items-center gap-4 border-b border-white/[0.02] last:border-b-0 hover:bg-white/4 transition-all">
      <div className="relative shrink-0">
        <div
          className="w-16 h-16 rounded-none border"
          style={{ borderColor: color, borderWidth: "1px" }}
        >
          <img
            src={driverAvatars[driverId as keyof typeof driverAvatars]}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -left-1 bg-[#0a0a0a] rounded-none px-1.5 py-0.5 border border-white/[0.05]">
          <span className="text-[9px] font-mono font-bold text-white/70">
            P{position}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <span className="text-white font-mono text-xs tracking-tight font-medium block">
            {name}
          </span>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/50 font-mono">Current</span>
            <span className="text-white font-mono font-semibold">
              {currentPoints} pts
            </span>
          </div>
          {targetPoints && (
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/40 font-mono">Target</span>
              <span className="text-white/60 font-mono">
                {targetPoints} pts
              </span>
            </div>
          )}
          {recentForm.length > 0 && (
            <div className="flex items-center justify-between text-[10px] mt-2">
              <span className="text-white/40 font-mono">Form</span>
              <div className="flex gap-0.5">
                {recentForm.map((points, i) => {
                  const opacity = points / maxPoints;
                  return (
                    <div
                      key={i}
                      className="w-1 h-3 bg-white rounded-none"
                      style={{ opacity: Math.max(opacity, 0.15) }}
                      title={`${recentRaces[i] || `Race ${i + 1}`}: ${points} pts`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
