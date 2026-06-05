"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DigitalTailoring from "@/components/DigitalTailoring";
import SafeVideo from "@/components/SafeVideo";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import ThreePreloader from "@/components/ThreePreloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroVideoUrl] = useSiteConfig("heroVideoUrl", "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175");
  const [heroImageUrl] = useSiteConfig("heroImageUrl", "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop");
  const [heroMediaType] = useSiteConfig("heroMediaType", "video");
  const [heroTitle] = useSiteConfig("heroTitle", "The Milan Atelier");
  const [homeLook1Url] = useSiteConfig("homeLook1Url", "https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=1200&auto=format&fit=crop");
  const [homeLook2Url] = useSiteConfig("homeLook2Url", "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop");
  const [homeQuoteUrl] = useSiteConfig("homeQuoteUrl", "/quote.jpg");
  const [homeCampaignUrl] = useSiteConfig("homeCampaignUrl", "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2000&auto=format&fit=crop");
  const [searchLook1Url] = useSiteConfig("searchLook1Url", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop");
  const [searchLook2Url] = useSiteConfig("searchLook2Url", "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop");

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        ".hero-fade-in",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".fade-in-up").forEach((element: any) => {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // GSAP Parallax Scroll Effect for Cinematic lookbook images
    gsap.utils.toArray(".parallax-img").forEach((img: any) => {
      gsap.fromTo(
        img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <main>
      {/* Search Overlay (Hidden by Default) */}
      <div className="fixed inset-0 bg-cruzBg/95 z-50 transform -translate-y-full transition-transform duration-700 ease-in-out overflow-y-auto" id="search-flyout">
        <div className="container mx-auto px-5 sm:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-cruzBorder pb-6 sm:pb-8">
            <h2 className="text-[10px] tracking-[0.2em] uppercase font-light text-gray-400">Archive Navigator</h2>
            <button className="text-2xl font-light hover:rotate-90 transition-transform duration-300" id="close-search-btn">×</button>
          </div>

          <div className="flex flex-col md:flex-row mt-8 sm:mt-12 gap-10 md:gap-16">
            {/* Search Input Area */}
            <div className="w-full md:w-1/2">
              <input type="text" placeholder="Explore the Archive..." className="w-full text-2xl sm:text-4xl md:text-5xl font-serif font-light bg-transparent border-none outline-none placeholder-gray-300 text-cruzBlack pb-4" />
              <div className="h-[1px] bg-cruzBlack w-full mt-2 transform scale-x-0 origin-left transition-transform duration-500 focus-within:scale-x-100"></div>

              <div className="mt-12">
                <h3 className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-6">Discover</h3>
                <ul className="space-y-4 text-sm font-serif italic text-gray-600">
                  <li><a href="#" className="hover:text-cruzGold transition-colors">FW26 Collection Overview</a></li>
                  <li><a href="#" className="hover:text-cruzGold transition-colors">SS25 Archive Details</a></li>
                  <li><a href="#" className="hover:text-cruzGold transition-colors">Atelier Craft & Construction</a></li>
                  <li><a href="#" className="hover:text-cruzGold transition-colors">The Milan Heritage</a></li>
                </ul>
              </div>
            </div>

            {/* Curated Archive Links */}
            <div className="w-full md:w-1/2">
              <h3 className="text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-6">Key Silhouettes</h3>
              <div className="grid grid-cols-2 gap-8">
                <a href="#" className="group">
                  <div className="aspect-[3/4] overflow-hidden mb-3"><img src={searchLook1Url} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" alt="Wool Coat" /></div>
                  <p className="text-[9px] tracking-[0.1em] uppercase group-hover:text-cruzGold transition-colors">Tailored Wool Coat</p>
                  <p className="text-[9px] text-gray-400">Look 01</p>
                </a>
                <a href="#" className="group">
                  <div className="aspect-[3/4] overflow-hidden mb-3"><img src={searchLook2Url} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 object-top" alt="Nylon Trench" /></div>
                  <p className="text-[9px] tracking-[0.1em] uppercase group-hover:text-cruzGold transition-colors">Nylon Trench</p>
                  <p className="text-[9px] text-gray-400">Look 05</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Video Showcase */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        {/* Cinematic Director's HUD Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-8 flex flex-col justify-between text-[8px] tracking-[0.25em] text-white/50 uppercase font-mono cinematic-hud select-none">
          {/* Corner Brackets */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/20"></div>
          <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/20"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/20"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/20"></div>

          {/* Top Metadata Row */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-rec-blink"></span>
              <span>REC 00:26:12:09</span>
            </div>
            <div className="hidden sm:block">LENS 50mm f/1.4 &bull; 4K 4:2:2</div>
          </div>

          {/* Bottom Metadata Row */}
          <div className="flex justify-between items-center w-full mt-auto">
            <div>SHUTTER 180&deg; &bull; 24fps &bull; ISO 400</div>
            <div className="hidden sm:block">WIDESCREEN 2.39:1 &bull; CRUZ DIRECT</div>
          </div>
        </div>

        <div className="w-full h-full overflow-hidden absolute inset-0">
          {heroMediaType === "image" ? (
            <img src={heroImageUrl} className="w-full h-full object-cover ken-burns" alt="Hero Background" />
          ) : (
            <>
              <img src={heroImageUrl} className="w-full h-full object-cover absolute inset-0" alt="Hero Fallback" />
              <SafeVideo src={heroVideoUrl} className="w-full h-full object-cover ken-burns relative" />
            </>
          )}
        </div>
        
        <div className="absolute inset-0 bg-black/35 z-0"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
          <h2 className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 opacity-0 hero-fade-in">Fall / Winter 2026</h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-wide mb-6 sm:mb-8 font-light leading-tight opacity-0 hero-fade-in">{heroTitle}</h1>
          <a href="#" className="border border-white px-7 sm:px-10 py-3 text-[9px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 opacity-0 hero-fade-in">View The Lookbook</a>
        </div>
      </section>

      {/* The Architecture of Cloth Section */}
      <section className="py-20 sm:py-32 md:py-40 bg-cruzBg px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20 md:mb-24 fade-in-up">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-4 sm:mb-6">Archive Selection</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-cruzBlack">The Architecture of Cloth</h2>
          <p className="mt-4 sm:mt-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 max-w-lg mx-auto leading-loose px-4">
            Hand-tailored in Milan. A study in structure, form, and pure materiality. Stripping away the non-essential to reveal true luxury.
          </p>
        </div>

        {/* Asymmetrical Lookbook Grid */}
        <div className="container mx-auto px-2 sm:px-8 md:px-16 grid grid-cols-1 sm:grid-cols-2 gap-y-12 sm:gap-y-20 md:gap-y-32 gap-x-8 md:gap-x-16">
          <div className="flex flex-col group cursor-pointer fade-in-up">
            <div className="aspect-[3/4] overflow-hidden mb-4 sm:mb-6 bg-cruzGrey relative">
              <img src={homeLook1Url} alt="Look 01" className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 transform filter grayscale group-hover:grayscale-0" />
            </div>
            <div className="flex justify-between items-center border-b border-cruzBorder pb-3 sm:pb-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em]">Look 01 — Overcoat</h4>
              <span className="text-[9px] text-gray-400 tracking-widest">Milan Atelier</span>
            </div>
          </div>

          <div className="flex flex-col group cursor-pointer sm:mt-20 md:mt-40 fade-in-up">
            <div className="aspect-[4/5] overflow-hidden mb-4 sm:mb-6 bg-cruzGrey relative">
              <img src={homeLook2Url} alt="Look 02" className="parallax-img w-full h-[125%] object-cover absolute top-0 left-0 transform filter grayscale group-hover:grayscale-0" />
            </div>
            <div className="flex justify-between items-center border-b border-cruzBorder pb-3 sm:pb-4">
              <h4 className="text-[10px] uppercase tracking-[0.2em]">Look 02 — Cropped Jacket</h4>
              <span className="text-[9px] text-gray-400 tracking-widest">Raw Cashmere</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Scarcity Manifesto featuring quote.jpg */}
      <section className="py-16 sm:py-24 md:py-40 bg-cruzBg border-t border-b border-cruzBorder/40 overflow-hidden px-4 sm:px-8 md:px-16 fade-in-up">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 md:gap-24 items-center">
            
            {/* Left Column: Manifesto Text */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-10">
              <span className="text-[9px] tracking-[0.35em] text-cruzGold uppercase font-medium">Cruz Manifesto &bull; Chapter IV</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-tight text-cruzBlack">
                Scarcity is a form of discipline.
              </h2>
              <div className="h-[1px] bg-cruzBlack/20 w-24 sm:w-32"></div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500 leading-loose">
                We believe in the beauty of the finite. Every collection is engineered in extremely limited runs within our Milanese ateliers. When a silhouette sells out, its pattern is retired to our digital archive, never to be reproduced. 
              </p>
              <div className="flex gap-8 sm:gap-12 pt-2 sm:pt-6">
                <div>
                  <h4 className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-1">BATCH RUN</h4>
                  <p className="font-serif italic text-base sm:text-lg text-cruzBlack">50 Units Only</p>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-1">MATERIALITY</h4>
                  <p className="font-serif italic text-base sm:text-lg text-cruzBlack">100% Traceable</p>
                </div>
              </div>
            </div>

            {/* Right Column: Beautifully framed quote.jpg */}
            <div className="md:col-span-5 relative flex justify-center">
              {/* Cinematic technical HUD brackets for the poster */}
              <div className="absolute -inset-4 pointer-events-none z-20 border border-cruzBlack/5 opacity-50 m-2">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cruzBlack/40"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cruzBlack/40"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cruzBlack/40"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cruzBlack/40"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-[1px] bg-cruzBlack/30"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-[1px] bg-cruzBlack/30"></div>
              </div>

              <div className="aspect-[2/3] w-full max-w-sm bg-white overflow-hidden shadow-2xl border border-cruzBorder/50 transform rotate-1 hover:rotate-0 transition-transform duration-700 p-6 relative group">
                <img 
                  src={homeQuoteUrl} 
                  alt="Money comes back. But clothes go out of stock." 
                  className="w-full h-full object-contain filter contrast-125 transition-transform duration-1000 group-hover:scale-102"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3D Interactive Viewer */}
      <DigitalTailoring />

      {/* Editorial Full Width Break */}
      <section className="w-full h-[60vh] sm:h-[75vh] md:h-[90vh] overflow-hidden relative fade-in-up">
        <img src={homeCampaignUrl} alt="Campaign" className="parallax-img w-full h-[125%] absolute top-0 left-0 object-cover object-top" />
        <div className="absolute inset-0 bg-black/15 z-10 pointer-events-none"></div>
        <div className="absolute bottom-6 left-5 sm:bottom-10 sm:left-10 md:left-24 text-white z-20">
          <p className="text-[9px] tracking-[0.3em] uppercase mb-1 sm:mb-2">Campaign 2026</p>
          <h3 className="text-xl sm:text-3xl font-serif font-light">Structure &amp; Flow</h3>
        </div>
      </section>
      {isLoading && <ThreePreloader onComplete={() => setIsLoading(false)} />}
    </main>
  );
}
