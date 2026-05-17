"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DcaCalculator } from "./DcaCalculator";
import { DividendCalculator } from "./DividendCalculator";

export function CalculatorTabs() {
  return (
    <Tabs defaultValue="dca">
      <TabsList className="w-full h-10 mb-5">
        <TabsTrigger value="dca">定期定額</TabsTrigger>
        <TabsTrigger value="dividend">每月可領</TabsTrigger>
      </TabsList>
      <TabsContent value="dca">
        <DcaCalculator />
      </TabsContent>
      <TabsContent value="dividend">
        <DividendCalculator />
      </TabsContent>
    </Tabs>
  );
}
