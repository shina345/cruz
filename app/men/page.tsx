"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { menCollection } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function MenPage() {
  const items = useCollection("men", menCollection);
  const { garments: serverItems } = useServerGarments("men");
  const [menCoverUrl] = useSiteConfig("menCoverUrl", "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop");

  return (
    <main className="relative">
      <FadeInClient />
      
      <section className="relative w-full h-[75vh] overflow-hidden fade-in-up">
          {/* Cinematic HUD */}
          <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-8 flex flex-col justify-between text-[8px] tracking-[0.25em] text-white/40 uppercase font-mono cinematic-hud select-none">
            <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/15"></div>
            <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-white/15"></div>
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-white/15"></div>
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/15"></div>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-rec-blink"></span>
                <span>REC</span>
              </div>
              <span className="hidden sm:block">CRUZ MENSWEAR &bull; FW26</span>
            </div>
            <div className="flex justify-between items-center w-full mt-auto">
              <span>{items.length} LOOKS</span>
              <span className="hidden sm:block">MILAN STUDIO</span>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <img src={menCoverUrl} className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 filter brightness-75" alt="Men Fall Winter" />
          </div>
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center z-10">
              <p className="text-cruzBg text-[9px] tracking-[0.4em] uppercase mb-4">Fall Winter 2026</p>
              <h2 className="text-cruzBg text-4xl md:text-6xl font-serif font-light tracking-wide">Men</h2>
          </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
          <div className="text-center mb-12 sm:mb-20 fade-in-up">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">{items.length} Looks</p>
              <h2 className="text-3xl font-serif font-light">The Masculine Silhouette</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-12 sm:gap-y-20 md:gap-y-24">
              {items.map(item => (
                <LookCard key={item.id} item={item} />
              ))}
              {serverItems.map(item => (
                <LookCard key={`server-${item.id}`} item={item} />
              ))}
          </div>
      </section>
    </main>
  );
}
