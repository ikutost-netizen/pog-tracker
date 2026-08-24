"use client";

import { useEffect, useState } from "react";

interface Props {
  date: string;
}

export default function ClassicCountdown({ date }: Props) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDays(diff);
  }, [date]);

  if (days === null) return null;
  if (days < 0) return <span style={{ color: "var(--text-muted)" }}>終了</span>;
  if (days === 0) return <span style={{ color: "var(--amber)", fontWeight: 700 }}>本日！</span>;

  return (
    <span style={{ color: days <= 60 ? "var(--amber)" : "var(--text-muted)" }}>
      あと{days}日
    </span>
  );
}
