"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(endTime: string): TimeLeft {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function VotingCountdown({
  endTime,
  startTime,
}: {
  endTime: string;
  startTime: string | null;
}) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft(endTime));
    const id = setInterval(() => { setTime(calcTimeLeft(endTime)); }, 1000);
    return () => { clearInterval(id); };
  }, [endTime]);

  if (time == null) {
    return (
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Voting ends in
        </p>
        <div className="h-5" />
      </div>
    );
  }

  if (time.total <= 0) {
    return (
      <span className="text-xs font-medium text-muted-foreground">
        Voting ended
      </span>
    );
  }

  // Color based on % time remaining
  const totalDuration = startTime
    ? new Date(endTime).getTime() - new Date(startTime).getTime()
    : null;
  const pctLeft = totalDuration ? (time.total / totalDuration) * 100 : null;

  const urgency =
    pctLeft == null
      ? "normal"
      : pctLeft < 15
      ? "critical"
      : pctLeft < 33
      ? "warning"
      : "normal";

  const colorMap = {
    normal: {
      digit: "text-foreground",
      label: "text-muted-foreground",
      bar: "bg-primary",
      separator: "text-muted-foreground",
    },
    warning: {
      digit: "text-amber-400",
      label: "text-amber-500/70",
      bar: "bg-amber-500",
      separator: "text-amber-500/50",
    },
    critical: {
      digit: "text-red-400",
      label: "text-red-500/70",
      bar: "bg-red-500",
      separator: "text-red-500/50",
    },
  };

  const c = colorMap[urgency];

  const units = [
    { value: time.days, label: "days" },
    { value: time.hours, label: "hrs" },
    { value: time.minutes, label: "min" },
    { value: time.seconds, label: "sec" },
  ];

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        Voting ends in
      </p>

      {/* Digit blocks */}
      <div className="flex items-end gap-0.5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-end gap-0.5">
            <div className="flex flex-col items-center">
              <span
                className={`font-mono text-sm font-bold tabular-nums leading-none ${c.digit}`}
              >
                {pad(u.value)}
              </span>
              <span className={`mt-0.5 text-[8px] uppercase tracking-wide ${c.label}`}>
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className={`mb-3 text-xs font-bold ${c.separator}`}>:</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar — time elapsed */}
      {pctLeft != null && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${c.bar}`}
            style={{ width: `${pctLeft}%` }}
          />
        </div>
      )}
    </div>
  );
}
