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

const GRADE_BG: Record<string, string> = {
  G1: "rgba(255,182,39,0.15)",
  G2: "rgba(200,160,64,0.12)",
  G3: "rgba(154,128,64,0.12)",
  OP: "rgba(255,255,255,0.06)",
};

function raceGrade(raceName: string): string | null {
  if (raceName.includes("G1")) return "G1";
  if (raceName.includes("G2")) return "G2";
  if (raceName.includes("G3")) return "G3";
  if (raceName.includes("OP")) return "OP";
  return null;
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
              <div className="space-y-5">
                {schedule.nextWeek.entries.map((entry, i) => {
                  const grade = raceGrade(entry.raceName);
                  const bgColor = grade ? GRADE_BG[grade] : "transparent";
                  return (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-3"
                      style={{
                        background: bgColor,
                        border: i > 0 ? "none" : "none",
                        borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        marginLeft: i > 0 ? "0" : "0",
                      }}
                    >
                      {/* Race info */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
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
                            className="font-bold text-sm"
                            style={{ color: grade && grade !== "OP" ? "var(--amber)" : "var(--text-primary)", fontFamily: "var(--font-chivo)" }}
                          >
                            {entry.raceName}
                          </div>
                        </div>
                        {grade && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0"
                            style={{
                              background: "var(--amber)",
                              color: "#0B1F16",
                              fontFamily: "var(--font-chivo)",
                              opacity: grade === "OP" ? 0.7 : 1,
                            }}
                          >
                            {grade}
                          </span>
                        )}
                      </div>

                      {/* Horses */}
                      <div className="space-y-1.5 mb-2">
                        {entry.horses.map((h, j) => {
                          const m = h.memberId ? memberMap[h.memberId] : null;
                          return (
                            <div key={j} className="flex items-center gap-2">
                              {m ? (
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
                              ) : (
                                <div
                                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                                  style={{ background: "rgba(255,255,255,0.08)", fontSize: "8px", color: "var(--text-muted)" }}
                                >
                                  ?
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
                                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                                  {m.name}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Comment */}
                      {entry.comment && (
                        <div
                          className="text-xs leading-relaxed border-l-2 pl-2 mt-1"
                          style={{
                            color: "var(--text-muted)",
                            borderColor: "rgba(255,182,39,0.3)",
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
          <div className="space-y-4">
            {schedule.upcoming.map((week, i) => (
              <div
                key={i}
                className="board-glow rounded-lg p-4"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-bold"
                    style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                  >
                    {week.weekLabel}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {week.dateRange}
                  </span>
                </div>
                <div className="space-y-3">
                  {week.entries.map((entry, j) => {
                    const grade = raceGrade(entry.raceName);
                    return (
                      <div
                        key={j}
                        className={j > 0 ? "border-t pt-3" : ""}
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
                          >
                            {entry.date.slice(5).replace("-", "/")}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {entry.venue} {entry.distance}
                          </span>
                          {grade && (
                            <span
                              className="text-xs px-1 py-0.5 rounded font-bold"
                              style={{
                                background: "var(--amber)",
                                color: "#0B1F16",
                                fontFamily: "var(--font-chivo)",
                                opacity: grade === "OP" ? 0.65 : 0.85,
                              }}
                            >
                              {grade}
                            </span>
                          )}
                        </div>
                        <div
                          className="text-xs font-bold mb-1.5"
                          style={{ color: grade && grade !== "OP" ? "var(--amber)" : "var(--text-primary)" }}
                        >
                          {entry.raceName}
                        </div>
                        <div className="space-y-1">
                          {entry.horses.map((h, k) => {
                            const m = h.memberId ? memberMap[h.memberId] : null;
                            return (
                              <div key={k} className="flex items-center gap-2">
                                {m ? (
                                  <div
                                    className="w-4 h-4 rounded-full overflow-hidden border shrink-0"
                                    style={{ borderColor: m.color }}
                                  >
                                    <Image
                                      src={m.icon}
                                      alt={m.name}
                                      width={16}
                                      height={16}
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="w-4 h-4 rounded-full shrink-0"
                                    style={{ background: "rgba(255,255,255,0.08)" }}
                                  />
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
                              </div>
                            );
                          })}
                        </div>
                        {entry.comment && (
                          <div
                            className="text-xs leading-relaxed mt-2 border-l-2 pl-2"
                            style={{ color: "var(--text-muted)", borderColor: "rgba(255,182,39,0.2)" }}
                          >
                            {entry.comment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 検討中 */}
      {schedule.consideration && schedule.consideration.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
          >
            検討中
          </h2>
          <div
            className="board-glow rounded-lg divide-y"
            style={{ background: "var(--bg-card)" }}
          >
            {schedule.consideration.map((h, i) => {
              const m = h.memberId ? memberMap[h.memberId] : null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2.5"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  {m ? (
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
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.07)", fontSize: "8px", color: "var(--text-muted)" }}
                    >
                      ?
                    </div>
                  )}
                  <span
                    className="text-xs font-bold"
                    style={{ color: m?.color ?? "var(--text-primary)" }}
                  >
                    {h.horse}
                  </span>
                  {h.status && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
                    >
                      {h.status}
                    </span>
                  )}
                  <span className="text-xs ml-auto text-right" style={{ color: "var(--text-muted)" }}>
                    {h.note}
                  </span>
                </div>
              );
            })}
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
