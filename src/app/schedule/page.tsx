import fs from "fs";
import path from "path";
import Image from "next/image";
import type { ScheduleData, Member } from "@/types";

function loadData(): { schedule: ScheduleData; members: Member[] } {
  const schedulePath = path.join(process.cwd(), "data", "schedule.json");
  const membersPath = path.join(process.cwd(), "data", "members.json");
  const schedule: ScheduleData = JSON.parse(fs.readFileSync(schedulePath, "utf-8"));
  const members: Member[] = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
  return { schedule, members };
}

export default function SchedulePage() {
  const { schedule, members } = loadData();
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <div
          className="text-xs tracking-[0.3em] uppercase mb-1"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
        >
          POG TRACKER 2026
        </div>
        <h1
          className="text-2xl font-black"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          予定表
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          出走予定馬と来週の注目レース
        </p>
      </header>

      {/* 来週の注目馬・レース */}
      <section className="mb-8">
        <h2
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          来週の注目馬・レース
        </h2>

        {!schedule.nextWeek ? (
          <div
            className="board-glow rounded-lg px-4 py-8 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
              次週の出走予定情報は未登録です
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
              Claude Codeとのやりとりで随時更新されます
            </div>
          </div>
        ) : (
          <div className="board-glow rounded-lg p-4" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-bold"
                style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
              >
                {schedule.nextWeek.weekLabel}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {schedule.nextWeek.dateRange}
              </span>
            </div>

            {schedule.nextWeek.entries.length === 0 ? (
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                出走予定なし
              </div>
            ) : (
              <div className="space-y-4">
                {schedule.nextWeek.entries.map((entry, i) => {
                  const member = entry.horses[0] ? memberMap[entry.horses[0].memberId] : null;
                  return (
                    <div
                      key={i}
                      className="border-t pt-4"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
                        >
                          {entry.date.slice(5).replace("-", "/")}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {entry.venue} {entry.distance}
                        </span>
                      </div>
                      <div
                        className="text-sm font-bold mb-2"
                        style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                      >
                        {entry.raceName}
                      </div>
                      <div className="space-y-1.5 mb-2">
                        {entry.horses.map((h, j) => {
                          const m = memberMap[h.memberId];
                          return (
                            <div key={j} className="flex items-center gap-2">
                              {m && (
                                <div
                                  className="w-5 h-5 rounded-full overflow-hidden border shrink-0"
                                  style={{ borderColor: m.color }}
                                >
                                  <Image
                                    src={m.icon}
                                    alt={m.name}
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}
                              <span
                                className="text-xs font-bold"
                                style={{ color: m?.color ?? "var(--text-primary)" }}
                              >
                                {h.horse}
                              </span>
                              {h.jockey && (
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                  {h.jockey}騎手
                                </span>
                              )}
                              {m && (
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                  ({m.name})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {entry.consideration.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            検討中: {entry.consideration.join("・")}
                          </span>
                        </div>
                      )}
                      {entry.comment && (
                        <div
                          className="text-xs leading-relaxed border-l-2 pl-2"
                          style={{
                            color: "var(--text-muted)",
                            borderColor: member?.color ?? "rgba(255,182,39,0.3)",
                          }}
                        >
                          {entry.comment}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 今後の予定 */}
      {schedule.upcoming.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
          >
            今後の予定
          </h2>
          <div className="space-y-3">
            {schedule.upcoming.map((week, i) => (
              <div
                key={i}
                className="board-glow rounded-lg px-4 py-3 flex items-center justify-between"
                style={{ background: "var(--bg-card)" }}
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                >
                  {week.weekLabel}
                </span>
                <div className="text-right">
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {week.dateRange}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {week.entries.length}レース
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center pb-4">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          更新はClaude Code経由でのみ行われます
        </p>
      </footer>
    </main>
  );
}
