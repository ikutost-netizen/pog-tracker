import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Member, HistoryEntry, MemberTitleHistory } from "@/types";
import StandingsBoard from "@/components/StandingsBoard";
import MvpHorse from "@/components/MvpHorse";
import PointChart from "@/components/PointChart";
import UpdateHistory from "@/components/UpdateHistory";

function loadData() {
  const membersPath = path.join(process.cwd(), "data", "members.json");
  const historyPath = path.join(process.cwd(), "data", "history.json");
  const titleHistoryPath = path.join(process.cwd(), "data", "titleHistory.json");
  const members: Member[] = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
  const history: HistoryEntry[] = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
  const titleHistories: MemberTitleHistory[] = JSON.parse(fs.readFileSync(titleHistoryPath, "utf-8"));
  return {
    members,
    history: [...history].sort((a, b) => a.date.localeCompare(b.date)),
    titleHistories,
  };
}

export default function Home() {
  const { members, history } = loadData();
  const latest = history[history.length - 1];
  const historyNewestFirst = [...history].reverse();

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-6 text-center">
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
          仲間内POGランキング
        </h1>
        {latest && (
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            最終更新: {latest.label} ({latest.date})
          </p>
        )}
      </header>

      <MvpHorse members={members} history={history} />
      <StandingsBoard members={members} history={history} />
      <PointChart members={members} history={history} />
      <UpdateHistory history={historyNewestFirst} />

      {/* MVP & 称号ストーリーへのリンク */}
      <section className="mb-8">
        <Link
          href="/story"
          className="board-glow rounded-lg flex items-center justify-between px-4 py-4 group transition-opacity hover:opacity-80"
          style={{ background: "var(--bg-card)", display: "flex" }}
        >
          <div>
            <div
              className="text-xs font-bold tracking-widest uppercase mb-0.5"
              style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
            >
              MVP &amp; 称号ストーリー
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              週間MVP馬と称号変遷の全記録
            </div>
          </div>
          <span
            className="text-lg"
            style={{ color: "var(--amber)" }}
          >
            →
          </span>
        </Link>
      </section>

      <footer className="text-center mt-8 pb-4">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          更新はClaude Code経由でのみ行われます
        </p>
      </footer>
    </main>
  );
}
