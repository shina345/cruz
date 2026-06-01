"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { womenCollection } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function WomenPage() {
  const items = useCollection("women", womenCollection);
  const { garments: serverItems } = useServerGarments("women");
  const [womenCoverUrl] = useSiteConfig("womenCoverUrl", "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop");
  const [womenEditorialUrl] = useSiteConfig("womenEditorialUrl", "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=2000&auto=format&fit=crop");

  return (
    <main className="relative">
      <FadeInClient />
      
      {/* Hero */}
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
              <span className="hidden sm:block">CRUZ WOMENSWEAR &bull; FW26</span>
            </div>
            <div className="flex justify-between items-center w-full mt-auto">
              <span>{items.length} LOOKS</span>
              <span className="hidden sm:block">MILAN ATELIER</span>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <img src={womenCoverUrl} className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 filter brightness-90" alt="Women Fall Winter" />
          </div>
          <div className="absolute inset-0 bg-black/10 z-10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center z-10">
              <p className="text-cruzBg text-[9px] tracking-[0.4em] uppercase mb-4">Fall Winter 2026</p>
              <h2 className="text-cruzBg text-4xl md:text-6xl font-serif font-light tracking-wide">Women</h2>
          </div>
      </section>

      {/* Collection Grid */}
      <section className="container mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
          <div className="text-center mb-12 sm:mb-20 fade-in-up">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">{items.length} Looks</p>
              <h2 className="text-3xl font-serif font-light">The Feminine Form</h2>
          </div>

          {/* Three Column Look Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-12 sm:gap-y-20 md:gap-y-24">
              {[...items, ...serverItems].map((item) => (
                <LookCard key={item.id} item={item} />
              ))}
          </div>

          {/* Editorial Break */}
          <div className="mt-20 sm:mt-32 md:mt-40 w-full overflow-hidden group cursor-pointer fade-in-up relative h-[45vh] sm:h-[60vh] md:h-[70vh]">
              <img src={womenEditorialUrl} className="parallax-img w-full h-[125%] absolute top-0 left-0 object-cover filter grayscale group-hover:grayscale-0 transition-[filter] duration-1000" alt="Campaign Fall Winter 2026" />
              <p className="absolute bottom-3 left-3 sm:bottom-0 sm:left-0 text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-6 z-10 sm:translate-y-8 px-2">Campaign — Fall Winter 2026, Photographed by Cruz Studio</p>
          </div>
      </section>
    </main>
  );
}
