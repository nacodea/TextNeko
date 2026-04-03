"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicTab } from "./tabs/BasicTab";
import { AdvancedTab } from "./tabs/AdvancedTab";
import { ManageTab } from "./tabs/ManageTab";

export function DictionaryEditorSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-180 max-w-[90vw] p-0">
        <SheetHeader className="px-4 py-3">
          <SheetTitle>辞書エディタ</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">基本</TabsTrigger>
              <TabsTrigger value="advanced">応用</TabsTrigger>
              <TabsTrigger value="manage">管理</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicTab />
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedTab />
            </TabsContent>

            <TabsContent value="manage">
              <ManageTab />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
