import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kolPosts, kolPersons } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;
  const slug = searchParams.get("slug");

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
    .limit(limit)
    .offset(offset);
  return NextResponse.json({ posts, page, nextPage: posts.length === limit ? page + 1 : null });
}
