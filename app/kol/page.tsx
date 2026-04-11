import { db } from "@/lib/db";
import { kolPosts, kolPersons } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { KolFeed } from "@/components/kol/KolFeed";

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function KolPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  const base = db
    .select({
      id: kolPosts.id,
      guid: kolPosts.guid,
      title: kolPosts.title,
      content: kolPosts.content,
      translatedContent: kolPosts.translatedContent,
      tags: kolPosts.tags,
      sourceUrl: kolPosts.sourceUrl,
      platform: kolPosts.platform,
      publishedAt: kolPosts.publishedAt,
      personSlug: kolPersons.slug,
      personName: kolPersons.displayName,
      personAvatar: kolPersons.avatarUrl,
    })
    .from(kolPosts)
    .innerJoin(kolPersons, eq(kolPosts.personId, kolPersons.id));

  const posts = await (slug ? base.where(eq(kolPersons.slug, slug)) : base)
    .orderBy(desc(kolPosts.publishedAt))
    .limit(5);
  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt.toISOString(),
  }));

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h1 className="text-xl font-semibold">KOL 影片筆記</h1>
        </div>
        <p className="text-muted-foreground text-sm pl-[calc(0.125rem+1rem+0.5rem)]">追蹤市場重要人士最新動態</p>
      </div>
      <KolFeed
        initialPosts={serialized}
        initialNextPage={null}
        slug={slug}
      />
    </div>
  );
}
