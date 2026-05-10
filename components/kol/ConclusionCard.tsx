"use client";

function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

function seekTo(seconds: number) {
  window.dispatchEvent(new CustomEvent("ytSeek", { detail: { seconds } }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function TextWithTimestamps({ text }: { text: string }) {
  const parts = text.split(/(?<![0-9:])(\d{1,2}:\d{2}(?::\d{2})?)(?![0-9:])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const seconds = parseTimestamp(part);
          return (
            <button
              key={i}
              onClick={() => seekTo(seconds)}
              className="inline font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {part}
            </button>
          );
        }
        return part;
      })}
    </>
  );
}

interface Props {
  conclusion: string | null;
  actionGuide: string | null;
}

export function ConclusionCard({ conclusion, actionGuide }: Props) {
  if (!conclusion && !actionGuide) return null;

  return (
    <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 px-5 py-4 space-y-3 text-[15px] leading-[1.8] text-foreground/80">
      {conclusion && (
        <div>
          <h3 className="text-[15px] font-semibold text-foreground mt-0 mb-1">💡 結論</h3>
          <p className="font-normal">
            <TextWithTimestamps text={conclusion} />
          </p>
        </div>
      )}
      {actionGuide && (
        <div>
          <h3 className="text-[15px] font-semibold text-foreground mt-0 mb-1">🎯 行動指南</h3>
          <p className="font-normal">
            <TextWithTimestamps text={actionGuide} />
          </p>
        </div>
      )}
    </div>
  );
}
