"use client";

import { useState, useEffect } from "react";
import { LookItem } from "@/constants/collections";

export function useCollection(categoryKey: string, staticItems: LookItem[]) {
  const [items, setItems] = useState<LookItem[]>(staticItems);


  useEffect(() => {
    const loadItems = () => {
      try {
        const oosStr = localStorage.getItem("cruz_out_of_stock_items");
        const oosList: string[] = oosStr ? JSON.parse(oosStr) : [];

        const deletedStr = localStorage.getItem("cruz_deleted_items");
        const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];

        const storedStr = localStorage.getItem("cruz_uploaded_items");
        let uploadedItems: any[] = [];
        if (storedStr) {
          uploadedItems = JSON.parse(storedStr);
        }

        // Prepare custom uploaded items for the current category
        const customFiltered = uploadedItems
          .filter((item) => item.category === categoryKey && !deletedList.includes(item.id))
          .map((item) => ({
            id: item.id || `uploaded-${Date.now()}-${Math.random()}`,
            title: item.title,
            img: item.img,
            look: item.look || `Look ${staticItems.length + 1}`,
            mt: item.mt || "",
            height: item.height || "",
          }));

        // Merge static items (filter deleted) with stock status
        const mergedStatic = staticItems
          .filter((item) => !deletedList.includes(item.id))
          .map((item) => ({
            ...item,
            outOfStock: oosList.includes(item.id),
          }));
const merged = mergedStatic;
      const appended: LookItem[] = [];

        customFiltered.forEach((customItem) => {
          const customLookNormalized = customItem.look.trim().toLowerCase();
          const matchIndex = merged.findIndex(
            (sItem) => sItem.look.trim().toLowerCase() === customLookNormalized
          );
          if (matchIndex !== -1) {
            merged[matchIndex] = {
              ...merged[matchIndex],
              title: customItem.title,
              img: customItem.img,
              mt: customItem.mt || merged[matchIndex].mt,
              height: customItem.height || merged[matchIndex].height,
              outOfStock:
                oosList.includes(merged[matchIndex].id) || oosList.includes(customItem.id),
            };
          } else {
            const isOos = oosList.includes(customItem.id);
            appended.push({
              ...customItem,
              outOfStock: isOos,
            });
          }
        });

        setItems([...merged, ...appended]);
      } catch (err) {
        console.error("Error loading collection from localStorage:", err);
        setItems(staticItems);
      }
    };

    loadItems();

    const handleSync = () => loadItems();
    window.addEventListener("cruz_collections_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("cruz_collections_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [categoryKey, staticItems]);

  return items;
}
