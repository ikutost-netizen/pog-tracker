import Link from "next/link";

export default function StoryRedirectPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12 text-center">
      <div className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-chivo)" }}>
        このページは移転しました
      </div>
      <Link
        href="/mvp-history"
        className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"
        style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
      >
        MVP &amp; 称号ストーリーへ →
      </Link>
    </main>
  );
}
