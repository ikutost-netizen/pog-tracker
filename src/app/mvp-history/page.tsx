import fs from "fs";
import path from "path";
import type { Member, HistoryEntry, MemberTitleHistory } from "@/types";
import MvpStory from "@/components/MvpStory";

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

export default function MvpHistoryPage() {
  const { members, history, titleHistories } = loadData();

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
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
          MVP &amp; 称号ストーリー
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          週間MVP馬と称号変遷の全記録
        </p>
      </header>

      <MvpStory members={members} history={history} titleHistories={titleHistories} />

      <footer className="text-center mt-4 pb-4">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          更新はClaude Code経由でのみ行われます
        </p>
      </footer>
    </main>
  );
}
