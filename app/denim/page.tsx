"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { denimCollection } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function DenimPage() {
  const items = useCollection("denim", denimCollection);
  const { garments: serverItems } = useServerGarments("denim");
  const [denimCoverUrl] = useSiteConfig("denimCoverUrl", "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2000&auto=format&fit=crop");

  return (
    <main>
      <FadeInClient />
      {/* Dark, raw hero for denim */}
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
              <span className="hidden sm:block">CRUZ DENIM &bull; LIMITED EDITION</span>
            </div>
            <div className="flex justify-between items-center w-full mt-auto">
              <span>{items.length} PIECES</span>
              <span className="hidden sm:block">RAW SELVEDGE</span>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <img src={denimCoverUrl} className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 filter brightness-[0.6]" alt="Denim Hero" />
          </div>
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center z-10">
              <p className="text-cruzBg text-[9px] tracking-[0.4em] uppercase mb-4">Limited Edition — {items.length} Pieces</p>
              <h2 className="text-cruzBg text-4xl md:text-6xl font-serif font-light tracking-wide">Denim</h2>
          </div>
      </section>

      {/* Statement line */}
      <section className="py-20 text-center px-6 border-b border-cruzBorder fade-in-up">
          <p className="max-w-xl mx-auto text-[10px] uppercase tracking-[0.25em] leading-loose text-gray-500">Raw selvedge. Hand-finished washes. The Cruz denim chapter is built on craft, not trend.</p>
      </section>

      {/* Offset 2-col */}
      <section className="container mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-12 sm:gap-y-20 md:gap-y-28">
              {[...items, ...serverItems].map((item) => (
                <LookCard key={item.id} item={item} />
              ))}
          </div>
      </section>
    </main>
  );
}
