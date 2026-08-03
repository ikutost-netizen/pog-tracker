import fs from "fs";
import path from "path";
import type { Member, HistoryEntry } from "@/types";
import StandingsBoard from "@/components/StandingsBoard";
import MvpHorse from "@/components/MvpHorse";
import PointChart from "@/components/PointChart";
import UpdateHistory from "@/components/UpdateHistory";

function loadData() {
  const membersPath = path.join(process.cwd(), "data", "members.json");
  const historyPath = path.join(process.cwd(), "data", "history.json");
  const members: Member[] = JSON.parse(fs.readFileSync(membersPath, "utf-8"));
  const history: HistoryEntry[] = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
  return {
    members,
    history: [...history].sort((a, b) => a.date.localeCompare(b.date)),
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

      <footer className="text-center mt-8 pb-4">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          更新はClaude Code経由でのみ行われます
        </p>
      </footer>
    </main>
  );
}
