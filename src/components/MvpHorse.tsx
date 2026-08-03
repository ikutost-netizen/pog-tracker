"use client";

import Image from "next/image";
import type { Member, HistoryEntry } from "@/types";

type Props = {
  members: Member[];
  history: HistoryEntry[];
};

export default function MvpHorse({ members, history }: Props) {
  const latest = history[history.length - 1];
  if (!latest?.mvp) return null;

  const member = members.find((m) => m.id === latest.mvp!.memberId);
  if (!member) return null;

  return (
    <section className="mb-5">
      <div
        className="board-glow rounded-lg px-4 py-3 flex items-center gap-4"
        style={{ background: "var(--bg-card)" }}
      >
        {/* Trophy */}
        <div
          className="text-2xl shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,182,39,0.12)" }}
        >
          🏆
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
          >
            今週のMVP馬
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="text-base font-black"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-noto)" }}
            >
              {latest.mvp.horse}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
            >
              +{latest.mvp.points.toLocaleString()}P
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-5 h-5 rounded-full overflow-hidden border shrink-0"
              style={{ borderColor: member.color }}
            >
              <Image
                src={member.icon}
                alt={member.name}
                width={20}
                height={20}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {member.name}
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                style={{
                  background: "rgba(255,182,39,0.12)",
                  color: "var(--amber)",
                  fontFamily: "var(--font-noto)",
                }}
              >
                {member.nickname}
              </span>
            </span>
          </div>
        </div>

        {/* Label decoration */}
        <div
          className="text-xs font-bold shrink-0 text-right hidden sm:block"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          {latest.label}
        </div>
      </div>
    </section>
  );
}
