"use client";

import { useState, useEffect, useRef } from "react";

interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        config: {
          videoId: string;
          playerVars?: { autoplay?: number; start?: number };
          events?: { onReady?: (event: { target: YTPlayer }) => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Props {
  guid: string;
  title: string;
}

export function YoutubeEmbed({ guid, title }: Props) {
  const [active, setActive] = useState(false);
  const startAtRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    const handleSeek = (e: Event) => {
      const seconds = (e as CustomEvent<{ seconds: number }>).detail.seconds;
      if (playerRef.current) {
        playerRef.current.seekTo(seconds, true);
        playerRef.current.playVideo();
      } else {
        startAtRef.current = seconds;
        setActive(true);
      }
    };
    window.addEventListener("ytSeek", handleSeek);
    return () => window.removeEventListener("ytSeek", handleSeek);
  }, []);

  useEffect(() => {
    if (!active) return;
    let mounted = true;

    const createPlayer = () => {
      if (!mounted || !containerRef.current) return;
      new window.YT!.Player(containerRef.current, {
        videoId: guid,
        playerVars: {
          autoplay: 1,
          ...(startAtRef.current !== undefined ? { start: startAtRef.current } : {}),
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            if (startAtRef.current !== undefined) {
              e.target.seekTo(startAtRef.current, true);
            }
            e.target.playVideo();
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      mounted = false;
    };
  }, [active, guid]);

  if (!active) {
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
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
