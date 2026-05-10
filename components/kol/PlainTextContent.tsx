"use client";

function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

// Move [MM:SS] or MM:SS at the start of a line to after the line's text
function rearrangeLineTimestamps(content: string): string {
  return content.replace(
    /^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s+(.+)$/gm,
    (_, ts, text) => `${text} ${ts}`
  );
}

interface Props {
  content: string;
}

export function PlainTextContent({ content }: Props) {
  const processed = rearrangeLineTimestamps(content);
  const parts = processed.split(/(?<![0-9:])(\d{1,2}:\d{2}(?::\d{2})?)(?![0-9:])/g);

  return (
    <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const seconds = parseTimestamp(part);
          return (
            <button
              key={i}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("ytSeek", { detail: { seconds } }));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {part}
            </button>
          );
        }
        return part;
      })}
    </div>
  );
}
