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

export const metadata: Metadata = {
  title: "Design System — 股市資訊平台",
};

export default function DesignPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">

      <div>
        <h1 className="text-lg sm:text-xl font-bold leading-snug mb-1">Design System</h1>
        <p className="text-sm text-muted-foreground">股市資訊平台的視覺設計規範，供工程師與設計師參考。</p>
      </div>

      <section>
        <SectionTitle>色彩系統</SectionTitle>
        <ColorSection />
      </section>

      <section>
        <SectionTitle>字體排版</SectionTitle>
        <TypographySection />
      </section>

      <section>
        <SectionTitle>版面寬度規則</SectionTitle>
        <LayoutSection />
      </section>

      <section>
        <SectionTitle>Spacing Scale</SectionTitle>
        <SpacingSection />
      </section>

      <section>
        <SectionTitle>響應式斷點</SectionTitle>
        <BreakpointsSection />
      </section>

      <section>
        <SectionTitle>Shadow &amp; Elevation Scale</SectionTitle>
        <ShadowSection />
      </section>

      <section>
        <SectionTitle>元件樣式規範</SectionTitle>
        <ComponentsSection />
      </section>

      <section>
        <SectionTitle>Loading / Empty 狀態</SectionTitle>
        <StatesSection />
      </section>

      <section>
        <SectionTitle>Icon 規範</SectionTitle>
        <IconSection />
      </section>

      <section>
        <SectionTitle>Dark Mode</SectionTitle>
        <DarkModeSection />
      </section>

      <section>
        <SectionTitle>Transition &amp; Animation</SectionTitle>
        <TransitionSection />
      </section>

      <section>
        <SectionTitle>表單元件</SectionTitle>
        <FormSection />
      </section>

      <section>
        <SectionTitle>Do&apos;s &amp; Don&apos;ts</SectionTitle>
        <DosDontsSection />
      </section>

      <footer className="border-t border-border/50 pt-6 text-sm text-muted-foreground">
        設計規範定義在 <code className="font-mono bg-muted px-1.5 py-0.5 rounded">DESIGN.md</code>，更新樣式時請同步修改。
      </footer>

    </div>
  );
}
