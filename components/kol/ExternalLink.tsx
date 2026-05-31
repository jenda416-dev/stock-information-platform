"use client";

import { sendGAEvent } from "@next/third-parties/google";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  gaEvent: string;
  gaParams?: Record<string, string>;
}

export function ExternalLink({ gaEvent, gaParams, onClick, children, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        if (gaParams) sendGAEvent("event", gaEvent, gaParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
