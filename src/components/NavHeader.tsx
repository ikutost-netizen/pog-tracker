"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "TOP" },
  { href: "/mvp-history", label: "MVP & 称号" },
  { href: "/classic-roadmap", label: "ロードマップ" },
  { href: "/schedule", label: "予定表" },
];

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-30 border-b"
      style={{
        background: "var(--bg-primary)",
        borderColor: "rgba(255,182,39,0.12)",
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-2 flex items-center gap-4 overflow-x-auto">
        <span
          className="text-xs font-black tracking-widest shrink-0"
          style={{ color: "var(--amber)", fontFamily: "var(--font-chivo)" }}
        >
          POG
        </span>
        <div className="h-3 w-px shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs whitespace-nowrap transition-colors shrink-0"
              style={{
                color: isActive ? "var(--amber)" : "var(--text-muted)",
                fontFamily: "var(--font-chivo)",
                fontWeight: isActive ? 700 : 400,
                borderBottom: isActive ? "1px solid var(--amber)" : "none",
                paddingBottom: "1px",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
