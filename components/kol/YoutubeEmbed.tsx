"use client";

import { useState } from "react";

interface Props {
  guid: string;
  title: string;
}

export function YoutubeEmbed({ guid, title }: Props) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${guid}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="absolute inset-0 w-full h-full group"
      aria-label={`播放 ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${guid}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${guid}/mqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
