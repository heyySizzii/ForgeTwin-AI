import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { MachinePoint } from "../types/telemetry";

interface Props {
  data: MachinePoint[];
}

export function TelemetryChart({
  data
}: Props) {
  return (
    <div className="chart-container">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="temperatureGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopOpacity={0.28}
              />

              <stop
                offset="100%"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            stroke="#5e6876"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#5e6876"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#10151c",
              border:
                "1px solid rgba(255,255,255,.1)",
              borderRadius: 8,
              color: "#fff"
            }}
          />

          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#d19a56"
            fill="url(#temperatureGradient)"
            strokeWidth={2}
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="vibration"
            stroke="#759bb7"
            fill="transparent"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
