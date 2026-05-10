import { adminDb } from "@/lib/firebase/admin";
import type { KolPostDoc } from "@/lib/firebase/collections";
import { KolFeed } from "@/components/kol/KolFeed";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function KolPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  let query = adminDb
    .collection("kolPosts")
    .orderBy("publishedAt", "desc")
    .limit(5) as FirebaseFirestore.Query;

  if (slug) {
    query = query.where("personSlug", "==", slug);
  }

  const snapshot = await query.get();
  const serialized = snapshot.docs.map((doc) => {
    const p = doc.data() as KolPostDoc;
    return {
      id: doc.id,
      guid: p.guid,
      title: p.title,
      content: p.content,
      translatedContent: p.translatedContent,
      tags: p.tags,
      sourceUrl: p.sourceUrl,
      platform: p.platform,
      publishedAt: p.publishedAt.toDate().toISOString(),
      personSlug: p.personSlug,
      personName: p.personName,
      personAvatar: p.personAvatar,
    };
  });

  // Disable infinite scrolling: only show the latest 5 posts
  const lastCursor = null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h1 className="text-xl font-semibold">KOL 影片筆記</h1>
        </div>
        <p className="text-muted-foreground text-sm pl-6">追蹤市場重要人士最新動態</p>
      </div>
      <KolFeed
        initialPosts={serialized}
        initialCursor={lastCursor}
        slug={slug}
      />
    </div>
  );
}
