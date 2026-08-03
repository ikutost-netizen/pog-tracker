"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Member, HistoryEntry } from "@/types";

type Props = {
  members: Member[];
  history: HistoryEntry[];
};

const RANK_MEDALS = ["🥇", "🥈", "🥉", "4", "5"];

type RankedMember = Member & {
  points: number;
  prevPoints: number;
  diff: number;
  rank: number;
};

function buildRanking(members: Member[], history: HistoryEntry[]): RankedMember[] {
  if (history.length === 0) return [];
  const latest = history[history.length - 1];
  const prev = history.length >= 2 ? history[history.length - 2] : null;

  const ranked = members
    .map((m) => ({
      ...m,
      points: latest.points[m.id] ?? 0,
      prevPoints: prev ? (prev.points[m.id] ?? 0) : 0,
      diff: (latest.points[m.id] ?? 0) - (prev ? (prev.points[m.id] ?? 0) : 0),
    }))
    .sort((a, b) => b.points - a.points)
    .map((m, i) => ({ ...m, rank: i + 1 }));

  return ranked;
}

function leaderChanged(history: HistoryEntry[], members: Member[]): boolean {
  if (history.length < 2) return false;
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const leaderId = (entries: HistoryEntry) =>
    Object.entries(entries.points).sort((a, b) => b[1] - a[1])[0]?.[0];
  return leaderId(latest) !== leaderId(prev);
}

export default function StandingsBoard({ members, history }: Props) {
  const [animated, setAnimated] = useState(false);
  const ranking = buildRanking(members, history);
  const latest = history[history.length - 1];
  const hasLeaderChange = leaderChanged(history, members);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-8">
      {/* Board header */}
      <div
        className="board-glow rounded-t-lg px-4 py-2 flex items-center justify-between"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
          >
            STANDINGS
          </span>
          {latest && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {latest.label} / {latest.date}
            </span>
          )}
        </div>
        {hasLeaderChange && (
          <span
            className="leader-badge text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: "var(--amber)",
              color: "#0B1F16",
              fontFamily: "var(--font-chivo)",
            }}
          >
            首位交代!
          </span>
        )}
      </div>

      {/* Board rows */}
      <div
        className="board-glow rounded-b-lg overflow-hidden divide-y"
        style={{
          background: "var(--bg-card)",
          borderTop: "none",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
      >
        {ranking.map((member, idx) => (
          <BoardRow
            key={member.id}
            member={member}
            animated={animated}
            delay={idx * 80}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </section>
  );
}

function BoardRow({
  member,
  animated,
  delay,
  isFirst,
}: {
  member: RankedMember;
  animated: boolean;
  delay: number;
  isFirst: boolean;
}) {
  const diffSign = member.diff > 0 ? "▲" : member.diff < 0 ? "▼" : "―";
  const diffColor =
    member.diff > 0 ? "#4ade80" : member.diff < 0 ? "#f87171" : "var(--text-muted)";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 relative"
      style={{
        background: isFirst ? "rgba(255,182,39,0.04)" : undefined,
        borderLeft: isFirst ? `3px solid var(--amber)` : "3px solid transparent",
      }}
    >
      {/* Rank */}
      <div
        className="rank-medal w-7 text-center text-lg font-bold shrink-0"
        style={{
          color: isFirst ? "var(--amber)" : "var(--text-muted)",
          fontFamily: "var(--font-chivo)",
        }}
      >
        {member.rank <= 3 ? RANK_MEDALS[member.rank - 1] : member.rank}
      </div>

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2"
        style={{ borderColor: member.color }}
      >
        <Image
          src={member.icon}
          alt={member.name}
          width={36}
          height={36}
          className="object-cover w-full h-full"
          unoptimized
        />
      </div>

      {/* Name + nickname */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-bold truncate block"
          style={{ color: isFirst ? "var(--text-primary)" : "var(--text-muted)" }}
        >
          {member.name}
        </span>
        {member.nickname && (
          <span
            className="text-xs px-1.5 py-0.5 rounded inline-block mt-0.5"
            style={{
              background: isFirst ? "rgba(255,182,39,0.15)" : "rgba(255,255,255,0.05)",
              color: isFirst ? "var(--amber)" : "var(--text-muted)",
              fontFamily: "var(--font-noto)",
              lineHeight: 1.4,
            }}
          >
            {member.nickname}
          </span>
        )}
      </div>

      {/* Diff — hidden on narrow screens */}
      <div
        className="text-xs font-bold w-20 text-right shrink-0 hidden sm:block"
        style={{ color: diffColor, fontFamily: "var(--font-chivo)" }}
      >
        {member.diff !== 0 ? `${diffSign}${Math.abs(member.diff).toLocaleString()}` : diffSign}
      </div>

      {/* Points */}
      <div
        className="text-right shrink-0 w-24"
        style={{ fontFamily: "var(--font-chivo)" }}
      >
        <span
          className={`text-xl font-bold ${animated ? "flip-digit" : "opacity-0"}`}
          style={{
            color: isFirst ? "var(--amber)" : "var(--text-primary)",
            animationDelay: `${delay}ms`,
          }}
        >
          {member.points.toLocaleString()}
        </span>
        <span className="text-xs ml-0.5" style={{ color: "var(--text-muted)" }}>
          pt
        </span>
      </div>
    </div>
  );
}
