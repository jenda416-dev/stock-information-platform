"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DcaCalculator } from "./DcaCalculator";
import { DividendCalculator } from "./DividendCalculator";
import { LifecycleCalculator } from "./LifecycleCalculator";

export function CalculatorTabs() {
  return (
    <Tabs defaultValue="dca" onValueChange={(v) => sendGAEvent("event", "calculator_tab", { tab: v })}>
      <TabsList className="w-full h-10 mb-5">
        <TabsTrigger value="dca">定期定額</TabsTrigger>
        <TabsTrigger value="dividend">每月可領</TabsTrigger>
        <TabsTrigger value="lifecycle">退休規劃</TabsTrigger>
      </TabsList>
      <TabsContent value="dca">
        <DcaCalculator />
      </TabsContent>
      <TabsContent value="dividend">
        <DividendCalculator />
      </TabsContent>
      <TabsContent value="lifecycle">
        <LifecycleCalculator />
      </TabsContent>
    </Tabs>
  );
}
