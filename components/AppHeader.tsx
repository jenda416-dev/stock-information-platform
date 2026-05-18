"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavMenu } from "./NavMenu";
import { ThemeToggle } from "./ThemeToggle";

function LogoIcon() {
  return (
    <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const isDesign = pathname.startsWith("/design");

  if (isDesign) {
    return (
      <header className="border-b fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="h-14 flex items-center">
          {/* Left: aligned with sidebar width */}
          <div className="hidden lg:flex items-center w-60 px-4 flex-shrink-0 border-r border-border h-full">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
            >
              <LogoIcon />
              <span>股市資訊平台</span>
            </Link>
          </div>

          {/* Mobile: standard logo */}
          <div className="flex lg:hidden items-center px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition-opacity">
              <LogoIcon />
              <span>股市資訊平台</span>
            </Link>
          </div>

          {/* Right: design system label + theme toggle */}
          <div className="flex-1 flex items-center justify-between px-6">
            <span className="text-sm text-muted-foreground">
              Design System
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6 relative">
        <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition-opacity">
          <LogoIcon />
          <span>股市資訊平台</span>
        </Link>
        <NavMenu />
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
