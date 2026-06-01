"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeInClient from "@/components/FadeInClient";
import SafeVideo from "@/components/SafeVideo";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function ShowroomPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [showroomVideoUrl] = useSiteConfig("showroomVideoUrl", "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175");
  const [showroomSlide1Url] = useSiteConfig("showroomSlide1Url", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop");
  const [showroomVideoSlideUrl] = useSiteConfig("showroomVideoSlideUrl", "https://player.vimeo.com/external/498425268.hd.mp4?s=d7e366ff42c1613ebbe6a894a7cb2eddbf8e353f&profile_id=175");
  const [showroomSlide3Url] = useSiteConfig("showroomSlide3Url", "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop");
  const [showroomSlide4Url] = useSiteConfig("showroomSlide4Url", "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2500&auto=format&fit=crop");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollSection = scrollSectionRef.current;
    const container = containerRef.current;
    const cursor = cursorRef.current;

    // Custom Cursor Logic
    const moveCursor = (e: MouseEvent) => {
      if (cursor) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out"
        });
      }
    };

    if (cursor) {
      const hoverElements = document.querySelectorAll(".interactive-hover");
      hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
          gsap.to(cursor, { scale: 3, backgroundColor: "rgba(197, 160, 89, 0.2)", mixBlendMode: "difference" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(cursor, { scale: 1, backgroundColor: "rgba(255, 255, 255, 1)", mixBlendMode: "normal" });
        });
      });

      window.addEventListener("mousemove", moveCursor);
    }

    if (scrollSection && container) {
      const scrollWidth = container.scrollWidth - window.innerWidth;

      const tween = gsap.to(container, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: scrollSection,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollWidth}`,
        },
      });

      // Skew elements based on scroll velocity
      let proxy = { skew: 0 },
          skewSetter = gsap.quickSetter(".skew-element", "skewX", "deg"),
          clamp = gsap.utils.clamp(-20, 20);

      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -100);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew)
            });
          }
        }
      });

      // Wild 3D Image rotations on scroll
      gsap.utils.toArray(".showroom-img-3d").forEach((img: any) => {
        gsap.fromTo(img, 
          { scale: 1.4, rotationY: 25, rotationZ: 2, z: -500 },
          { 
            scale: 1, 
            rotationY: -10,
            rotationZ: -2,
            z: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: 1,
            }
          }
        );
      });

      // Staggered Text Reveal
      gsap.utils.toArray(".stagger-text").forEach((textGroup: any) => {
        const letters = Array.from((textGroup as HTMLElement).querySelectorAll("span"));
        gsap.fromTo(letters,
          { y: 100, opacity: 0, rotationX: -90 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.05,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: textGroup,
              containerAnimation: tween,
              start: "left 75%",
            }
          }
        )
      });

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        window.removeEventListener("mousemove", moveCursor);
      };
    }
  }, []);

  // Helper to wrap text in spans for staggering
  const wrapLetters = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block">{char === " " ? "\u00A0" : char}</span>
    ));
  };

  return (
    <main className="bg-[#050505] text-cruzBg overflow-hidden cursor-none">
      <FadeInClient />
      
      {/* Custom Cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out flex items-center justify-center">
      </div>

      {/* Intro Hero with Heavy Animation */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 relative overflow-hidden interactive-hover">
        <SafeVideo src={showroomVideoUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]"></div>

        {/* Cinematic Director's HUD */}
        <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-10 flex flex-col justify-between text-[8px] tracking-[0.25em] text-white/25 uppercase font-mono cinematic-hud select-none">
          <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/10"></div>
          <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/10"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/10"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/10"></div>

          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-rec-blink"></span>
              <span>REC 00:00:00:00</span>
            </div>
            <span className="hidden sm:block">ANAMORPHIC 2.39:1 &bull; 4K</span>
          </div>

          <div className="flex justify-between items-center w-full mt-auto">
            <span>CRUZ SHOWROOM &bull; INTERACTIVE</span>
            <span className="hidden sm:block">SCROLL &rarr; HORIZONTAL</span>
          </div>
        </div>

        <div className="relative z-10 fade-in-up">
          <p className="text-[10px] tracking-[0.8em] uppercase text-cruzGold mb-8 opacity-80">Interactive Gallery</p>
          <h1 className="text-6xl md:text-[10rem] font-serif font-light tracking-tighter mb-8 text-white leading-none mix-blend-difference overflow-hidden">
            <div className="flex">
              {wrapLetters("Showroom")}
            </div>
          </h1>
          <p className="max-w-xl mx-auto text-[11px] uppercase tracking-[0.3em] leading-loose text-gray-300">
            A dynamic exhibition of the Cruz Archive. 
          </p>
        </div>
        
        <div className="absolute bottom-12 z-10 flex flex-col items-center gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] text-cruzGold">Scroll</p>
          <div className="w-[1px] h-24 bg-gradient-to-b from-cruzGold to-transparent overflow-hidden">
            <div className="w-full h-full bg-white animate-[slideDown_2s_infinite]"></div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <section className="h-screen w-full bg-[#050505] relative flex items-center">
        
        {/* Massive Parallax Floating Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cruzGold/5 rounded-full blur-3xl animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-white/5 rounded-full blur-3xl animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>

        <div ref={containerRef} className="h-full flex items-center w-max px-[10vw] gap-[20vw] z-10 perspective-[2000px]">
          
          {/* Slide 1 */}
          <div className="w-[85vw] md:w-[45vw] h-[75vh] flex flex-col justify-center relative group skew-element interactive-hover">
            <div className="overflow-hidden h-[85%] w-full relative">
              <img src={showroomSlide1Url} className="showroom-img-3d w-full h-full object-cover filter brightness-75 hover:brightness-110" alt="Piece 1" />
              
              <div className="absolute top-12 -left-12 -rotate-90 origin-bottom-left text-white z-20 overflow-hidden">
                <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-white/50 block">001 — Archival</span>
              </div>
            </div>
            <div className="mt-8 flex justify-between items-end border-b border-white/20 pb-4 overflow-hidden stagger-text">
              <h3 className="text-4xl font-serif text-white flex">{wrapLetters("Structured Coat")}</h3>
            </div>
          </div>

          {/* Slide 2: Floating Text & Video */}
          <div className="w-[90vw] md:w-[50vw] flex items-center justify-between gap-12 relative skew-element">
            <div className="w-1/2 stagger-text">
              <h2 className="text-5xl md:text-8xl font-serif font-light text-white mb-6 leading-none flex flex-wrap">{wrapLetters("Kinetic Form.")}</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] leading-loose text-gray-400 mt-12">
                Luxury is not static. It reacts to physics, tension, and velocity.
              </p>
            </div>
            
            <div className="w-1/2 h-[50vh] overflow-hidden rounded-full shadow-[0_0_100px_rgba(197,160,89,0.2)] interactive-hover">
              <SafeVideo src={showroomVideoSlideUrl} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-150" />
            </div>
          </div>

          {/* Slide 3: Offset 3D Image */}
          <div className="w-[85vw] md:w-[35vw] h-[70vh] flex flex-col justify-start relative group -translate-y-24 skew-element interactive-hover">
            <div className="overflow-visible h-[90%] w-full relative">
              <div className="absolute inset-0 bg-cruzGold/20 transform translate-x-8 translate-y-8 blur-md"></div>
              <img src={showroomSlide3Url} className="showroom-img-3d relative w-full h-full object-cover filter grayscale hover:grayscale-0" alt="Piece 2" />
            </div>
            <div className="mt-16 text-right overflow-hidden stagger-text">
                <h3 className="text-3xl font-serif text-white flex justify-end">{wrapLetters("Cropped Noir")}</h3>
            </div>
          </div>

          {/* Slide 4: Ultra Wide Cinematic Hero */}
          <div className="w-[95vw] md:w-[85vw] h-[90vh] flex flex-col justify-center relative skew-element interactive-hover">
            <div className="overflow-hidden h-full w-full relative shadow-[0_0_100px_rgba(255,255,255,0.05)]">
              <img src={showroomSlide4Url} className="showroom-img-3d w-full h-full object-cover object-top filter brightness-[0.4] hover:brightness-[0.8]" alt="Masterpiece" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none overflow-hidden stagger-text">
                <p className="text-[10px] uppercase tracking-[0.8em] font-bold text-cruzGold mb-8 flex">{wrapLetters("The Masterpiece")}</p>
                <h3 className="text-7xl md:text-[12rem] font-serif text-white font-light uppercase tracking-tighter flex mix-blend-overlay">{wrapLetters("TECH_NYLON")}</h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Outro */}
      <section className="py-40 flex flex-col items-center justify-center text-center px-6 relative bg-white text-black fade-in-up interactive-hover">
        <h2 className="text-5xl md:text-[8rem] font-serif font-bold tracking-tighter mb-16 uppercase">Enter The Archive</h2>
        <a href="/rtw" className="group flex items-center gap-4 text-[12px] tracking-[0.2em] uppercase font-bold border-b-2 border-black pb-2">
          Explore Ready To Wear
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover:translate-x-4 transition-transform duration-300">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </section>

      <style jsx global>{`
        @keyframes slideDown {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
