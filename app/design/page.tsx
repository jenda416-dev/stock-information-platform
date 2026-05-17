import type { Metadata } from "next";
import { SectionTitle } from "./_components/helpers";
import { ColorSection } from "./_components/ColorSection";
import { TypographySection } from "./_components/TypographySection";
import { ComponentsSection } from "./_components/ComponentsSection";
import { StatesSection } from "./_components/StatesSection";
import { LayoutSection } from "./_components/LayoutSection";

export const metadata: Metadata = {
  title: "Design System — 股市資訊平台",
};

export default function DesignPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">

      <div>
        <h1 className="text-xl font-bold mb-1">Design System</h1>
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
        <SectionTitle>元件</SectionTitle>
        <ComponentsSection />
      </section>

      <section>
        <SectionTitle>Loading / Empty 狀態</SectionTitle>
        <StatesSection />
      </section>

      <section>
        <SectionTitle>版面寬度規則</SectionTitle>
        <LayoutSection />
      </section>

      <footer className="border-t border-border/50 pt-6 text-xs text-muted-foreground">
        設計規範定義在 <code className="font-mono bg-muted px-1.5 py-0.5 rounded">DESIGN.md</code>，更新樣式時請同步修改。
      </footer>

    </div>
  );
}
