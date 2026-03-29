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
        <h1 className="text-2xl font-bold mb-1">KOL 影片筆記</h1>
        <p className="text-muted-foreground text-sm">追蹤市場重要人士最新動態</p>
      </div>
      <KolFeed
        initialPosts={serialized}
        initialNextPage={null}
        slug={slug}
      />
    </div>
  );
}
