"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  return { dark, toggle };
}

function UserMenu({ isAdmin }: { isAdmin: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { dark, toggle } = useDarkMode();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden ring-2 ring-border hover:ring-foreground/40 transition-all"
      >
        {user?.imageUrl ? (
          <Image src={user.imageUrl} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
        ) : (
          <span className="bg-muted text-muted-foreground text-xs font-semibold w-full h-full flex items-center justify-center">
            {user?.firstName?.[0] ?? "U"}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border bg-background shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium truncate">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-muted-foreground">
                  <path fillRule="evenodd" d="M6.955 1.45A.5.5 0 0 1 7.5 1h1a.5.5 0 0 1 .545.45l.17 1.52a5.06 5.06 0 0 1 .672.276l1.243-.87a.5.5 0 0 1 .634.067l.708.708a.5.5 0 0 1 .067.634l-.87 1.243a5.11 5.11 0 0 1 .276.672l1.52.17A.5.5 0 0 1 15 6.5v1a.5.5 0 0 1-.45.545l-1.52.17a5.11 5.11 0 0 1-.276.672l.87 1.243a.5.5 0 0 1-.067.634l-.708.708a.5.5 0 0 1-.634.067l-1.243-.87a5.06 5.06 0 0 1-.672.276l-.17 1.52A.5.5 0 0 1 8.5 15h-1a.5.5 0 0 1-.545-.45l-.17-1.52a5.06 5.06 0 0 1-.672-.276l-1.243.87a.5.5 0 0 1-.634-.067l-.708-.708a.5.5 0 0 1-.067-.634l.87-1.243a5.06 5.06 0 0 1-.276-.672l-1.52-.17A.5.5 0 0 1 1 8.5v-1a.5.5 0 0 1 .45-.545l1.52-.17a5.06 5.06 0 0 1 .276-.672l-.87-1.243a.5.5 0 0 1 .067-.634l.708-.708a.5.5 0 0 1 .634-.067l1.243.87a5.06 5.06 0 0 1 .672-.276l.17-1.52ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
                </svg>
                管理
              </Link>
            )}

            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-muted-foreground">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 2a5 5 0 0 1 4.032 7.94A4.498 4.498 0 0 0 8 9.5a4.498 4.498 0 0 0-4.032 1.44A5 5 0 0 1 8 3Z" />
                </svg>
                <span className="text-sm">深色模式</span>
              </div>
              <button
                onClick={toggle}
                role="switch"
                aria-checked={dark}
                aria-label="切換深色模式"
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                  dark ? "bg-foreground" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow transition-transform duration-200 ${
                    dark ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="border-t py-1">
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.22a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H6.75a.75.75 0 0 1 0-1.5h5.69l-.97-.97a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function NavAuth({ isAdmin }: { isAdmin: boolean }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          登入 / 註冊
        </button>
      </SignInButton>
    );
  }

  return <UserMenu isAdmin={isAdmin} />;
}
