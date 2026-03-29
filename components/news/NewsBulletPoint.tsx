"use client";

import { Badge } from "@/components/ui/badge";
import type { BulletPoint } from "@/types/news";

interface Props {
  index: number;
  bullet: BulletPoint;
}

export function NewsBulletPoint({ index, bullet }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold mt-0.5">
          {index}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1">{bullet.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">{bullet.point}</p>
          {bullet.sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {bullet.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Badge variant="outline" className="text-xs hover:bg-accent cursor-pointer truncate max-w-[200px]">
                    📰 {src.title}
                  </Badge>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
