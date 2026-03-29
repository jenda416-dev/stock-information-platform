import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  await db
    .insert(schema.kolPersons)
    .values([
      {
        slug: "youtube_gooaye",
        displayName: "股癌 Gooaye",
        platform: "youtube",
        feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UC23rnlQU_qE3cec9x709peA",
        avatarUrl: null,
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
