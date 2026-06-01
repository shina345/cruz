"use client";

import FadeInClient from "@/components/FadeInClient";
import LookCard from "@/components/LookCard";
import { rtwCollection } from "@/constants/collections";
import { useCollection } from "@/hooks/useCollection";
import { useServerGarments } from "@/hooks/useServerGarments";

export default function ReadyToWearPage() {
  const items = useCollection("rtw", rtwCollection);
  const { garments: serverItems } = useServerGarments("rtw");

  return (
    <main>
      <FadeInClient />
      <section className="py-16 sm:py-24 md:py-32 text-center px-4 sm:px-6 fade-in-up relative">
          {/* Subtle cinematic corner brackets on the text hero */}
          <div className="absolute inset-0 pointer-events-none p-8 md:p-12 select-none">
            <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-cruzBlack/10"></div>
            <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-cruzBlack/10"></div>
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-cruzBlack/10"></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-cruzBlack/10"></div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-rec-blink"></span>
            <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400 font-mono cinematic-hud">SS25 — {items.length} Looks</p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-light tracking-wide mb-8 sm:mb-10">Ready-to-Wear</h1>
          <p className="max-w-lg mx-auto text-[10px] uppercase tracking-[0.2em] leading-loose text-gray-500 px-4">Clothes conceived for the modern life. Luxury that moves with you — from atelier fitting to cobblestone street.</p>
      </section>
      <section className="container mx-auto px-4 sm:px-8 md:px-16 pb-20 sm:pb-32 md:pb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16 md:gap-y-20">
              {[...items, ...serverItems].map((item) => (
                <LookCard key={item.id} item={item} variant="compact" aspectRatio="aspect-[2/3]" />
              ))}
          </div>
      </section>
    </main>
  );
}
