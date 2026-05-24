"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { hierarchy, treemap as d3treemap } from "d3-hierarchy";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import type { SectorWithStocks } from "@/types/sectors";

type Props = {
  sectors: SectorWithStocks[];
  onSelect: (sector: SectorWithStocks | null) => void;
  selectedId?: number;
};

type TreeLeaf = SectorWithStocks;
type TreeRoot = { id: number; name: string; children: TreeLeaf[] };

function getColor(change: number): string {
  if (change >= 9) return "#4D0E0E";
  if (change >= 7) return "#6B1414";
  if (change >= 5) return "#882020";
  if (change >= 3) return "#A32B2B";
  if (change >= 1) return "#C43030";
  if (change >= 0) return "#D44040";
  if (change >= -3) return "#1D6B40";
  if (change >= -7) return "#155530";
  return "#0D3B22";
}

export function SectorTreemap({ sectors, onSelect, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 520 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) setDims({ w: Math.floor(width), h: 520 });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = useMemo(() => {
    if (!dims.w || sectors.length === 0) return [];

    const rootData: TreeRoot = {
      id: -1,
      name: "root",
      children: sectors.map((s) => ({ ...s })),
    };

    const root = hierarchy<TreeRoot | TreeLeaf>(rootData).sum((d) => {
      if ("changePercent" in d) return Math.max(Math.abs(d.changePercent), 0.3);
      return 0;
    });

    const layout = d3treemap<TreeRoot | TreeLeaf>()
      .size([dims.w, dims.h])
      .padding(2)
      .round(true);

    layout(root);

    return root.leaves().map((leaf) => {
      const r = leaf as HierarchyRectangularNode<TreeRoot | TreeLeaf>;
      const item = leaf.data as TreeLeaf;
      return { item, x: r.x0, y: r.y0, w: r.x1 - r.x0, h: r.y1 - r.y0 };
    });
  }, [sectors, dims]);

  return (
    <div ref={containerRef} className="w-full" style={{ height: 520 }}>
      <svg
        width={dims.w}
        height={dims.h}
        style={{ display: "block" }}
        aria-label="產業板塊族群熱力圖"
      >
        {nodes.map(({ item, x, y, w, h }) => {
          const isSelected = selectedId === item.id;
          const showName = w > 55 && h > 36;
          const showPercent = w > 70 && h > 58;
          const fontSize = Math.min(14, Math.max(9, Math.sqrt(w * h) / 8));

          return (
            <g
              key={item.id}
              onClick={() => onSelect(isSelected ? null : item)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${item.name} ${item.changePercent > 0 ? "+" : ""}${item.changePercent.toFixed(2)}%`}
            >
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={getColor(item.changePercent)}
                stroke={isSelected ? "white" : "transparent"}
                strokeWidth={2}
                rx={3}
              />
              {showName && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + (showPercent ? -10 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={fontSize}
                  fontWeight="600"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {item.name}
                </text>
              )}
              {showPercent && (
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.75)"
                  fontSize={Math.max(9, fontSize - 2)}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {item.changePercent > 0 ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
