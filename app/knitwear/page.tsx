"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { knitwearCollection } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function KnitwearPage() {
  const items = useCollection("knitwear", knitwearCollection);
  const { garments: serverItems } = useServerGarments("knitwear");
  const [knitwearCoverUrl] = useSiteConfig("knitwearCoverUrl", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop");

  return (
    <main>
      <FadeInClient />
      {/* Full-bleed muted hero */}
      <section className="relative w-full h-[70vh] overflow-hidden fade-in-up">
          {/* Cinematic HUD */}
          <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-8 flex flex-col justify-between text-[8px] tracking-[0.25em] text-cruzBlack/30 uppercase font-mono cinematic-hud select-none">
            <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-cruzBlack/10"></div>
            <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-cruzBlack/10"></div>
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-cruzBlack/10"></div>
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-cruzBlack/10"></div>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-rec-blink"></span>
                <span>REC</span>
              </div>
              <span className="hidden sm:block">CRUZ KNITWEAR &bull; FW26</span>
            </div>
            <div className="flex justify-between items-center w-full mt-auto">
              <span>{items.length} SILHOUETTES</span>
              <span className="hidden sm:block">ATELIER CRAFT</span>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <img src={knitwearCoverUrl} className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 filter brightness-90 saturate-50" alt="Knitwear Hero" />
          </div>
          <div className="absolute inset-0 bg-cruzBg/30 z-10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center z-10">
              <p className="text-cruzBlack text-[9px] tracking-[0.4em] uppercase mb-4">FW26 — Cashmere & Merino</p>
              <h2 className="text-cruzBlack text-4xl md:text-6xl font-serif font-light tracking-wide">Knitwear</h2>
          </div>
      </section>

      {/* Intro quote */}
      <section className="py-24 text-center px-6 border-b border-cruzBorder fade-in-up">
          <p className="max-w-xl mx-auto text-[10px] uppercase tracking-[0.25em] leading-loose text-gray-500 italic font-serif text-sm">&quot;Warmth is the highest form of luxury.&quot;</p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mt-4">— Cruz Creative Studio, 2026</p>
      </section>

      {/* 2-col staggered */}
      <section className="container mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-20 gap-y-12 sm:gap-y-20 md:gap-y-32">
              {[...items, ...serverItems].map((item) => (
                <LookCard key={item.id} item={item} />
              ))}
          </div>
      </section>
    </main>
  );
}
