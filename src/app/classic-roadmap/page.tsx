import fs from "fs";
import path from "path";
import ClassicCountdown from "@/components/ClassicCountdown";

type StepRace = {
  name: string;
  tier: "official" | "notable";
  grade: string;
  venue: string;
  distance: string;
  month: number;
  date2027: string | null;
  priorityCondition?: string;
  note?: string;
};

type ClassicRace = {
  id: string;
  name: string;
  grade: string;
  venue: string;
  distance: string;
  month: number;
  date2027: string | null;
  gender: string;
  stepRaces: StepRace[];
};

type TwoYearOldG1 = {
  id: string;
  name: string;
  shortName: string;
  grade: string;
  venue: string;
  distance: string;
  date: string;
  gender: string | null;
  leadsTo: string[];
};

type ClassicRoadmapData = {
  twoYearOldG1: TwoYearOldG1[];
  classicRoadmap: ClassicRace[];
};

function loadData(): ClassicRoadmapData {
  const p = path.join(process.cwd(), "data", "classicRoadmap.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const GRADE_COLORS: Record<string, string> = {
  G1: "#FFB627",
  G2: "#C8A040",
  G3: "#9A8040",
  L: "#7A7060",
};

function getGradeColor(grade: string): string {
  return GRADE_COLORS[grade] ?? "#7A7060";
}

export default function ClassicRoadmapPage() {
  const { twoYearOldG1, classicRoadmap } = loadData();

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
          クラシックロードマップ
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          2歳G1からクラシックへ至る道
        </p>
      </header>

      {/* 2歳G1 Countdown */}
      <section className="mb-8">
        <h2
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          2歳G1 — 2026年12月
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {twoYearOldG1.map((race) => (
            <div
              key={race.id}
              className="board-glow rounded-lg p-3 flex flex-col items-center text-center"
              style={{ background: "var(--bg-card)" }}
            >
              <div
                className="text-xs font-bold mb-1 leading-tight"
                style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
              >
                {race.shortName}
              </div>
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                {race.venue} {race.distance}
              </div>
              <div
                className="text-xs mb-2 font-mono"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-chivo)" }}
              >
                {race.date.slice(5).replace("-", "/")}
              </div>
              <div
                className="text-xs font-bold"
                style={{ fontFamily: "var(--font-chivo)" }}
              >
                <ClassicCountdown date={race.date} />
              </div>
              {race.gender && (
                <div className="mt-1.5 text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,182,39,0.08)", color: "rgba(255,182,39,0.5)" }}>
                  {race.gender}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Classic Roadmap */}
      <section className="mb-8">
        <h2
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          2027年 クラシックロード
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          ※ 2027年の日程は未発表。月は例年開催月を参照。
        </p>

        <div className="space-y-8">
          {classicRoadmap.map((classic) => {
            const official = classic.stepRaces.filter((r) => r.tier === "official");
            const notable = classic.stepRaces.filter((r) => r.tier === "notable");

            return (
              <div key={classic.id}>
                {/* Classic G1 header card */}
                <div
                  className="rounded-lg px-4 py-3 mb-4"
                  style={{
                    background: "rgba(255,182,39,0.08)",
                    border: "1px solid rgba(255,182,39,0.25)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-black px-1.5 py-0.5 rounded"
                          style={{ background: "var(--amber)", color: "#0B1F16", fontFamily: "var(--font-chivo)" }}
                        >
                          G1
                        </span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
                        >
                          {classic.name}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {classic.venue} · {classic.distance} · {classic.gender}
                      </div>
                    </div>
                    <div
                      className="text-xs shrink-0 px-2 py-1 rounded"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-chivo)",
                      }}
                    >
                      {classic.month}月
                    </div>
                  </div>
                </div>

                {/* Official trials */}
                {official.length > 0 && (
                  <div className="mb-3">
                    <div
                      className="text-xs mb-2 flex items-center gap-1.5"
                      style={{ color: "rgba(255,182,39,0.6)", fontFamily: "var(--font-chivo)" }}
                    >
                      <span>◆</span> 公式トライアル
                    </div>
                    <div className="space-y-2 ml-3">
                      {official.map((race, i) => {
                        const gc = getGradeColor(race.grade);
                        return (
                          <div
                            key={i}
                            className="board-glow rounded-lg px-3 py-2.5"
                            style={{
                              background: "var(--bg-card)",
                              borderLeft: "2px solid rgba(255,182,39,0.35)",
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-bold"
                                style={{
                                  background: gc + "1A",
                                  color: gc,
                                  border: `1px solid ${gc}40`,
                                  fontFamily: "var(--font-chivo)",
                                }}
                              >
                                {race.grade}
                              </span>
                              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                                {race.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {race.venue} {race.distance} · {race.month}月
                              </span>
                              {race.priorityCondition && (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    background: "rgba(255,182,39,0.07)",
                                    color: "rgba(255,182,39,0.65)",
                                    fontFamily: "var(--font-chivo)",
                                  }}
                                >
                                  {race.priorityCondition}で出走権
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notable preps */}
                {notable.length > 0 && (
                  <div>
                    <div
                      className="text-xs mb-2 flex items-center gap-1.5"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}
                    >
                      <span>◇</span> 主な前哨戦
                    </div>
                    <div className="space-y-1.5 ml-3">
                      {notable.map((race, i) => {
                        const gc = getGradeColor(race.grade);
                        return (
                          <div
                            key={i}
                            className="rounded-lg px-3 py-2"
                            style={{
                              background: "rgba(255,255,255,0.025)",
                              borderLeft: "2px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-bold"
                                style={{
                                  background: gc + "14",
                                  color: gc,
                                  border: `1px solid ${gc}30`,
                                  fontFamily: "var(--font-chivo)",
                                }}
                              >
                                {race.grade}
                              </span>
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {race.name}
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                              {race.venue} {race.distance} · {race.month}月
                              {race.note && <span className="ml-2">— {race.note}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="text-center pb-4">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          更新はClaude Code経由でのみ行われます
        </p>
      </footer>
    </main>
  );
}
