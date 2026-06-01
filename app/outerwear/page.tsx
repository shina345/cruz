"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { outerwearRow1, outerwearRow3 } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function OuterwearPage() {
  const items = useCollection("outerwear", [...outerwearRow1, ...outerwearRow3]);
  const { garments: serverItems } = useServerGarments("outerwear");
  const [outerwearCoverUrl] = useSiteConfig("outerwearCoverUrl", "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop");

  // Extract dynamic items for custom layout rows
  const itemLook1 = items.find(i => i.id === "o1") || outerwearRow1[0];
  const itemLook2 = items.find(i => i.id === "o2") || outerwearRow1[1];
  
  // Slide 3 is the cover photo banner itself, so row 3 items are o4, o5, o6
  const row3Items = items.filter(i => ["o4", "o5", "o6"].includes(i.id));
  
  // Custom uploaded silhouettes (localStorage) + server garments
  const customItems = [
    ...items.filter(i => !["o1", "o2", "o4", "o5", "o6"].includes(i.id)),
    ...serverItems,
  ];

  return (
    <main>
      <FadeInClient />
      {/* Stacked Hero */}
      <section className="py-16 sm:py-24 md:py-32 text-center px-4 sm:px-6 fade-in-up">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400 mb-4 sm:mb-6">FW26 — {items.length} Looks</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light tracking-wide mb-6 sm:mb-10">Outerwear</h1>
          <p className="max-w-lg mx-auto text-[10px] uppercase tracking-[0.2em] leading-loose text-gray-500 px-4">Constructed for endurance. Finished for eternity. Each coat begins as raw wool in the highlands and ends as architecture on the human body.</p>
      </section>

      {/* Asymmetric editorial grid */}
      <section className="container mx-auto px-4 sm:px-8 md:px-16 pb-20 sm:pb-32 md:pb-40">
          {/* Row 1: large + small */}
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 md:gap-20 items-end mb-16 sm:mb-24 md:mb-32">
              <div className="w-full md:w-7/12">
                  <LookCard item={itemLook1} />
              </div>
              <div className="w-full md:w-5/12">
                  <LookCard item={itemLook2} />
              </div>
          </div>

          {/* Full-width editorial image with cinematic parallax + HUD */}
          <div className="group cursor-pointer mb-16 sm:mb-24 md:mb-32 fade-in-up">
              <div className="overflow-hidden h-[50vh] sm:h-[65vh] md:h-[80vh] relative">
                  {/* Cinematic HUD */}
                  <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-8 flex flex-col justify-between text-[8px] tracking-[0.25em] text-white/30 uppercase font-mono cinematic-hud select-none">
                    <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/15"></div>
                    <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-white/15"></div>
                    <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-white/15"></div>
                    <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/15"></div>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-rec-blink"></span>
                        <span>REC</span>
                      </div>
                      <span className="hidden sm:block">EDITORIAL &bull; LOOK 03</span>
                    </div>
                    <div className="flex justify-between items-center w-full mt-auto">
                      <span>NYLON TRENCH</span>
                      <span className="hidden sm:block">MILAN &bull; 2026</span>
                    </div>
                  </div>

                  <img src={outerwearCoverUrl} className="parallax-img w-full h-[125%] absolute top-0 left-0 object-cover object-top filter grayscale group-hover:grayscale-0 transition-[filter] duration-1000" alt="Nylon Trench" />
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-6">Look 03 — Technical Nylon Trench, Photographed in Milan</p>
          </div>

          {/* Row 3: three column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-10 sm:gap-y-16 md:gap-y-20 mb-12 sm:mb-20">
              {row3Items.map((item) => (
                  <LookCard key={item.id} item={item} />
              ))}
          </div>

          {/* Custom uploaded outerwear row */}
          {customItems.length > 0 && (
            <div className="border-t border-cruzBorder/40 pt-12 sm:pt-20 fade-in-up">
              <div className="text-center mb-10 sm:mb-16">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">Custom Archive Additions</p>
                <h3 className="text-2xl font-serif font-light">Added Silhouettes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-10 sm:gap-y-20">
                {customItems.map((item) => (
                  <LookCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
      </section>
    </main>
  );
}
