"use client";

import ReactMarkdown from "react-markdown";

function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

function seekTo(seconds: number) {
  window.dispatchEvent(new CustomEvent("ytSeek", { detail: { seconds } }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Converts timestamps to seek links; moves line-start [MM:SS] to after the bold title
function preprocessTimestamps(content: string): string {
  // Step 1a: **[MM:SS] bold title:** rest  →  **bold title** [MM:SS](seek:N) rest
  // Handles: `- **[10:49] 標題：** 說明文字`
  let result = content.replace(
    /^([ \t]*(?:[-*+]\s+|\d+[.)]\s+)?)\*\*\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+?)\*\*([ \t].*)$/gm,
    (_, prefix, ts, boldTitle, rest) => {
      const title = boldTitle.trim().replace(/[：:]+$/, "");
      return `${prefix}**${title} [${ts}](seek:${parseTimestamp(ts)})**${rest}`;
    }
  );

  // Step 1b: plain [MM:SS] at line start  →  rest [MM:SS](seek:N)
  result = result.replace(
    /^([ \t]*(?:[-*+]\s+|\d+[.)]\s+)?)\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+)$/gm,
    (_, prefix, ts, text) => `${prefix}${text} [${ts}](seek:${parseTimestamp(ts)})`
  );

  // Step 2: convert remaining inline timestamps not already inside link syntax
  return result.replace(
    /(?<![0-9:\[\(])(\d{1,2}:\d{2}(?::\d{2})?)(?![0-9:\]\)])/g,
    (match) => `[${match}](seek:${parseTimestamp(match)})`
  );
}

interface Props {
  content: string;
}

export function MarkdownContent({ content }: Props) {
  return (
    <div className="[&_li_strong:first-child]:block [&_li_strong:first-child]:mb-0.5">
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-[17px] font-bold text-foreground mt-6 mb-3 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[15px] font-semibold text-foreground mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-[15px] leading-[1.8] text-foreground/80 mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2.5 mb-4">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="text-[15px] leading-[1.8] text-foreground/80">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        blockquote: ({ children }) => (
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 px-5 py-4 my-4 space-y-3 text-[15px] leading-[1.8] text-foreground/80 [&_h3]:mt-0 [&_h3]:mb-1 [&_p]:font-normal">
            {children}
          </div>
        ),
        hr: () => <hr className="my-4 border-border/50" />,
        code: ({ children }) => (
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{children}</code>
        ),
        a: ({ href, children }) => {
          if (href?.startsWith("seek:")) {
            const seconds = parseInt(href.slice(5), 10);
            return (
              <button
                onClick={() => seekTo(seconds)}
                className="inline font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {children}
              </button>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
              {children}
            </a>
          );
        },
      }}
      urlTransform={(url) => url}
    >
      {preprocessTimestamps(content)}
    </ReactMarkdown>
    </div>
  );
}
