"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import type { Member, HistoryEntry } from "@/types";

type Props = {
  members: Member[];
  history: HistoryEntry[];
};

type ChartRow = {
  label: string;
  date: string;
  [memberId: string]: string | number;
};

function buildChartData(members: Member[], history: HistoryEntry[]): ChartRow[] {
  return history.map((entry) => {
    const row: ChartRow = { label: entry.label, date: entry.date };
    members.forEach((m) => {
      row[m.id] = entry.points[m.id] ?? 0;
    });
    return row;
  });
}

type TooltipEntry = {
  dataKey?: string | number;
  value?: number | string | (number | string)[];
  color?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  members: Member[];
};

function CustomTooltip({ active, payload, label, members }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));
  const valid = payload
    .filter((item) => typeof item.dataKey === "string" && typeof item.value === "number")
    .map((item) => ({ dataKey: item.dataKey as string, value: item.value as number, color: item.color ?? "#fff" }))
    .sort((a, b) => b.value - a.value);

  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-xl"
      style={{
        background: "#0d2318",
        border: "1px solid rgba(255,182,39,0.3)",
        fontFamily: "var(--font-chivo)",
      }}
    >
      <div
        className="font-bold mb-1 text-xs"
        style={{ color: "var(--amber)" }}
      >
        {label}
      </div>
      {valid.map((item, idx) => {
        const member = memberMap[item.dataKey];
        if (!member) return null;
        return (
          <div key={item.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {idx + 1}.
            </span>
            <span className="font-bold" style={{ color: item.color }}>
              {member.name}
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              {item.value.toLocaleString()}pt
            </span>
          </div>
        );
      })}
    </div>
  );
}

type CustomDotProps = {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength: number;
  member: Member;
};

function EndDot({ cx, cy, index, dataLength, member }: CustomDotProps) {
  const isLast = index === dataLength - 1;
  if (!isLast || cx === undefined || cy === undefined) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={16} fill={member.color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={4} fill={member.color} />
      <foreignObject x={cx + 6} y={cy - 12} width={24} height={24}>
        <div
          className="w-6 h-6 rounded-full overflow-hidden border"
          style={{ borderColor: member.color }}
        >
          <Image
            src={member.icon}
            alt={member.name}
            width={24}
            height={24}
            className="object-cover"
            unoptimized
          />
        </div>
      </foreignObject>
    </g>
  );
}

export default function PointChart({ members, history }: Props) {
  const data = buildChartData(members, history);
  if (data.length === 0) return null;

  const maxPoints = Math.max(
    ...members.flatMap((m) => history.map((h) => h.points[m.id] ?? 0))
  );

  return (
    <section className="mb-8">
      <div
        className="board-glow rounded-lg p-4"
        style={{ background: "var(--bg-card)" }}
      >
        <h2
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          POINT HISTORY
        </h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-chivo)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, Math.ceil(maxPoints * 1.1 / 500) * 500]}
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-chivo)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
              width={32}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={props.payload as TooltipEntry[] | undefined}
                  label={props.label}
                  members={members}
                />
              )}
              cursor={{ stroke: "rgba(255,182,39,0.2)", strokeWidth: 1 }}
            />
            {members.map((member) => (
              <Line
                key={member.id}
                type="monotone"
                dataKey={member.id}
                stroke={member.color}
                strokeWidth={2.5}
                dot={({ key, ...dotProps }) => (
                  <EndDot
                    key={key as string}
                    {...dotProps}
                    dataLength={data.length}
                    member={member}
                  />
                )}
                activeDot={{ r: 5, fill: member.color, stroke: "var(--bg-card)", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1800}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ background: m.color }}
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
