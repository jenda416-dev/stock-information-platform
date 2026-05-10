export function extractActionGuide(content: string): {
  mainContent: string;
  conclusion: string | null;
  actionGuide: string | null;
} {
  let conclusion: string | null = null;
  let actionGuide: string | null = null;

  // Format A (EP660 style): > quote block + **行動指南：** plain text
  let mainContent = content.replace(
    /\n*#{1,3}[^\n]*關鍵金句[^\n]*\n\n(>[ \t][^\n]+(?:\n>[ \t][^\n]+)*)\n\n\*\*行動指南[：:]\*\* ([^\n]+)/g,
    (_, bq, guideText) => {
      conclusion = bq.replace(/^>[ \t]?/gm, "").replace(/\*\*/g, "").trim();
      actionGuide = guideText.trim();
      return "";
    }
  );

  // Format B (EP658 style): **"quote"** + > **行動指南：** text (inverted)
  if (!conclusion && !actionGuide) {
    mainContent = mainContent.replace(
      /\n*#{1,3}[^\n]*關鍵金句[^\n]*\n\n(\*\*[^\n]+\*\*)\n\n>[ \t]*\*\*行動指南[：:]\*\*[ \t]+([^\n]+)/g,
      (_, boldText, guideText) => {
        conclusion = boldText.replace(/\*\*/g, "").trim();
        actionGuide = guideText.trim();
        return "";
      }
    );
  }

  return { mainContent: mainContent.trim(), conclusion, actionGuide };
}
