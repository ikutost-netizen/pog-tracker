"use client";

import Image from "next/image";
import type { Member, HistoryEntry, MemberTitleHistory } from "@/types";

type Props = {
  members: Member[];
  history: HistoryEntry[];
  titleHistories: MemberTitleHistory[];
};

function weekNum(label: string): number {
  return parseInt(label.replace(/[^\d]/g, "") || "0");
}

function getTitleAt(memberId: string, label: string, titleHistories: MemberTitleHistory[]): string | null {
  const entry = titleHistories.find((t) => t.memberId === memberId);
  if (!entry) return null;
  const n = weekNum(label);
  const applicable = entry.titleHistory
    .filter((t) => weekNum(t.fromLabel) <= n)
    .sort((a, b) => weekNum(b.fromLabel) - weekNum(a.fromLabel));
  return applicable[0]?.title ?? null;
}

function getTitleChangeAt(memberId: string, label: string, titleHistories: MemberTitleHistory[]): { prev: string; next: string } | null {
  const entry = titleHistories.find((t) => t.memberId === memberId);
  if (!entry) return null;
  const idx = entry.titleHistory.findIndex((t) => t.fromLabel === label);
  if (idx <= 0) return null;
  return { prev: entry.titleHistory[idx - 1].title, next: entry.titleHistory[idx].title };
}

function getFirstTitleAt(memberId: string, label: string, titleHistories: MemberTitleHistory[]): string | null {
  const entry = titleHistories.find((t) => t.memberId === memberId);
  if (!entry || entry.titleHistory.length === 0) return null;
  if (entry.titleHistory[0].fromLabel === label) return entry.titleHistory[0].title;
  return null;
}

export default function MvpStory({ members, history, titleHistories }: Props) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));
  const mvpWeeks = history.filter((h) => h.mvp !== null);

  if (mvpWeeks.length === 0) return null;

  return (
    <section className="mb-8">
      <div
        className="board-glow rounded-lg overflow-hidden"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(255,182,39,0.12)" }}>
          <h2
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
          >
            MVP &amp; 称号ストーリー
          </h2>
        </div>

        <div className="px-4 py-3 space-y-0">
          {mvpWeeks.map((entry, i) => {
            const mvp = entry.mvp!;
            const member = memberMap[mvp.memberId];
            if (!member) return null;

            const title = getTitleAt(mvp.memberId, entry.label, titleHistories);
            const titleChange = getTitleChangeAt(mvp.memberId, entry.label, titleHistories);
            const firstTitle = getFirstTitleAt(mvp.memberId, entry.label, titleHistories);
            const isLast = i === mvpWeeks.length - 1;

            return (
              <div key={entry.date}>
                {/* 称号変更マーカー */}
                {titleChange && (
                  <div
                    className="flex items-center gap-2 py-2 text-xs font-bold"
                    style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                  >
                    <div className="w-0.5 h-4 mx-3" style={{ background: "var(--amber)" }} />
                    ➡ 称号変更: 「{titleChange.prev}」→「{titleChange.next}」
                  </div>
                )}
                {/* 称号初取得マーカー */}
                {!titleChange && firstTitle && (
                  <div
                    className="flex items-center gap-2 py-2 text-xs font-bold"
                    style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                  >
                    <div className="w-0.5 h-4 mx-3" style={{ background: "var(--amber)", opacity: 0.5 }} />
                    ✦ 称号獲得: 「{firstTitle}」
                  </div>
                )}

                {/* MVPカード */}
                <div className="flex gap-3 py-3 relative">
                  {/* タイムラインライン */}
                  <div
                    className="absolute left-3 top-0 bottom-0 w-px"
                    style={{
                      background: isLast
                        ? "linear-gradient(to bottom, rgba(255,182,39,0.2), transparent)"
                        : "rgba(255,182,39,0.15)",
                    }}
                  />

                  {/* ドット */}
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold z-10"
                    style={{
                      background: "var(--bg-card)",
                      border: "2px solid rgba(255,182,39,0.4)",
                      color: "var(--amber)",
                      fontFamily: "var(--font-chivo)",
                    }}
                  >
                    🏆
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0 pb-1">
                    {/* 週 + 日付 */}
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                      >
                        {entry.label}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {entry.date}
                      </span>
                    </div>

                    {/* MVP馬 + ポイント */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="text-sm font-black"
                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-noto)" }}
                      >
                        {mvp.horse}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                      >
                        +{mvp.points.toLocaleString()}P
                      </span>
                    </div>

                    {/* レース名 */}
                    {mvp.raceName && (
                      <div
                        className="text-xs mb-1.5"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
                      >
                        {mvp.raceName}
                      </div>
                    )}

                    {/* オーナー + 称号 */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full overflow-hidden shrink-0 border"
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
                      </span>
                      {title ? (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(255,182,39,0.12)",
                            color: "var(--amber)",
                            fontFamily: "var(--font-noto)",
                          }}
                        >
                          {title}
                        </span>
                      ) : (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.2)",
                            fontFamily: "var(--font-noto)",
                          }}
                        >
                          称号なし
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
