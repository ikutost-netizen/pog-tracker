"use client";

import Image from "next/image";
import { useState } from "react";
import type { HistoryEntry } from "@/types";

type Props = {
  history: HistoryEntry[];
};

export default function UpdateHistory({ history }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (history.length === 0) return null;

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
            UPDATE HISTORY
          </h2>
        </div>

        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {history.map((entry) => (
            <HistoryRow
              key={entry.date}
              entry={entry}
              onScreenshotClick={setLightbox}
            />
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-8 right-0 text-white text-sm opacity-70 hover:opacity-100"
              onClick={() => setLightbox(null)}
            >
              ✕ 閉じる
            </button>
            <Image
              src={lightbox}
              alt="スクリーンショット"
              width={1200}
              height={800}
              className="rounded-lg w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      )}
    </section>
  );
}

function HistoryRow({
  entry,
  onScreenshotClick,
}: {
  entry: HistoryEntry;
  onScreenshotClick: (src: string) => void;
}) {
  return (
    <div className="flex gap-4 px-4 py-3">
      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-14 rounded overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        {entry.screenshot ? (
          <button
            className="w-full h-full block cursor-zoom-in"
            onClick={() => onScreenshotClick(entry.screenshot!)}
            title="クリックで拡大"
          >
            <Image
              src={entry.screenshot}
              alt={`${entry.label} スクリーンショット`}
              width={160}
              height={112}
              className="object-cover w-full h-full hover:opacity-80 transition-opacity"
              unoptimized
            />
          </button>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            —
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
          >
            {entry.label}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {entry.date}
          </span>
        </div>

        {/* 実況 */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {entry.commentary}
        </p>

        {/* 評論家コメント */}
        {entry.analysis && (
          <div
            className="mt-2 pt-2 text-xs leading-relaxed"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-muted)",
            }}
          >
            <span
              className="font-bold mr-1.5 text-xs"
              style={{ color: "rgba(255,182,39,0.6)", fontFamily: "var(--font-chivo)" }}
            >
              【評】
            </span>
            {entry.analysis}
          </div>
        )}
      </div>
    </div>
  );
}
