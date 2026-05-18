"use client";

import { useState } from "react";
import Link from "next/link";

const groups = [
  {
    label: "設計基礎",
    items: [
      { id: "color",      label: "色彩系統" },
      { id: "typography", label: "字體排版" },
      { id: "spacing",    label: "Spacing Scale" },
      { id: "shadow",     label: "Shadow & Elevation" },
    ],
  },
  {
    label: "版面 & 斷點",
    items: [
      { id: "breakpoints", label: "響應式斷點" },
      { id: "layout",      label: "版面寬度規則" },
    ],
  },
  {
    label: "元件",
    items: [
      { id: "components", label: "元件樣式規範" },
      { id: "forms",      label: "表單元件" },
    ],
  },
  {
    label: "行為 & 狀態",
    items: [
      { id: "transition", label: "Transition & Animation" },
      { id: "states",     label: "Loading / Empty 狀態" },
    ],
  },
  {
    label: "系統規則",
    items: [
      { id: "icons",    label: "Icon 規範" },
      { id: "darkmode", label: "Dark Mode" },
      { id: "dosdont",  label: "Do's & Don'ts" },
    ],
  },
];

export function DesignSidebar({ activeId }: { activeId: string }) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.label, true]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className="py-4">
      {groups.map((group, groupIndex) => {
        const isOpen = openGroups[group.label];
        return (
          <div key={group.label}>
            {/* Divider between groups */}
            {groupIndex > 0 && (
              <div className="mx-4 my-3 border-t border-border/50" />
            )}

            {/* Group header */}
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest hover:text-muted-foreground transition-colors"
            >
              {group.label}
              <svg
                className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Items */}
            {isOpen && (
              <div className="mt-0.5 mb-1">
                {group.items.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/design?section=${item.id}`}
                      className={`flex items-center text-sm py-1.5 pr-4 pl-5 border-l-2 transition-colors ${
                        isActive
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-foreground/70 hover:text-foreground hover:border-border"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
