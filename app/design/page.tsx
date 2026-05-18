import type { Metadata } from "next";
import { SectionTitle } from "./_components/helpers";
import { ColorSection } from "./_components/ColorSection";
import { TypographySection } from "./_components/TypographySection";
import { SpacingSection } from "./_components/SpacingSection";
import { ShadowSection } from "./_components/ShadowSection";
import { BreakpointsSection } from "./_components/BreakpointsSection";
import { ComponentsSection } from "./_components/ComponentsSection";
import { StatesSection } from "./_components/StatesSection";
import { IconSection } from "./_components/IconSection";
import { DarkModeSection } from "./_components/DarkModeSection";
import { LayoutSection } from "./_components/LayoutSection";
import { DosDontsSection } from "./_components/DosDontsSection";
import { TransitionSection } from "./_components/TransitionSection";
import { FormSection } from "./_components/FormSection";
import { DesignSidebar } from "./_components/DesignSidebar";

export const metadata: Metadata = {
  title: "Design System — 股市資訊平台",
};

const sections: Record<string, { title: string; content: React.ReactNode }> = {
  color:       { title: "色彩系統",                content: <ColorSection /> },
  typography:  { title: "字體排版",                content: <TypographySection /> },
  spacing:     { title: "Spacing Scale",          content: <SpacingSection /> },
  shadow:      { title: "Shadow & Elevation Scale", content: <ShadowSection /> },
  breakpoints: { title: "響應式斷點",              content: <BreakpointsSection /> },
  layout:      { title: "版面寬度規則",             content: <LayoutSection /> },
  components:  { title: "元件樣式規範",             content: <ComponentsSection /> },
  forms:       { title: "表單元件",                content: <FormSection /> },
  transition:  { title: "Transition & Animation", content: <TransitionSection /> },
  states:      { title: "Loading / Empty 狀態",   content: <StatesSection /> },
  icons:       { title: "Icon 規範",              content: <IconSection /> },
  darkmode:    { title: "Dark Mode",              content: <DarkModeSection /> },
  dosdont:     { title: "Do's & Don'ts",          content: <DosDontsSection /> },
};

export default async function DesignPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section = "color" } = await searchParams;
  const current = sections[section] ?? sections.color;

  return (
    <div>
      {/* Fixed sidebar */}
      <aside className="hidden lg:block fixed top-14 left-0 bottom-0 w-60 border-r border-border bg-background overflow-y-auto z-[5]">
        <DesignSidebar activeId={section} />
      </aside>

      {/* Content */}
      <div className="lg:ml-60">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-8">
            <SectionTitle>{current.title}</SectionTitle>
          </div>
          {current.content}
          <footer className="border-t border-border/50 mt-16 pt-6 text-sm text-muted-foreground">
            設計規範定義在 <code className="font-mono bg-muted px-1.5 py-0.5 rounded">DESIGN.md</code>，更新樣式時請同步修改。
          </footer>
        </div>
      </div>
    </div>
  );
}
