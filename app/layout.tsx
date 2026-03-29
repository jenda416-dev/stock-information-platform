import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { NavAuth } from "@/components/NavAuth";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "股市資訊平台",
  description: "追蹤市場 KOL 動態與每日財經摘要",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = email === process.env.ADMIN_EMAIL;

  return (
    <ClerkProvider>
    <html lang="zh-TW" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
          <nav className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-bold text-lg">
              📈 股市資訊
            </Link>
            <Link
              href="/kol"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              KOL 影片筆記
            </Link>
            <Link
              href="/news"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              每日財經摘要
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <NavAuth isAdmin={isAdmin} />
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
    </ClerkProvider>
  );
}
