"use client";

import { useState } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const ALL_GARMENTS = [
  {
    id: "g1",
    title: "Logo Tank Top",
    img: "/cruz_tank_top.jpg",
    ref: "REF. TANK-FW26",
    spec: {
      weave: "Double-faced Rib Twill",
      weight: "320 g/m²",
      origin: "Biella Mills, Italy",
      composition: "85% Camel Hair, 15% Cashmere",
      tension: "High Elastic Recovery",
    },
  },
  {
    id: "g2",
    title: "XS Polo Black",
    img: "/heavenly_polo_black.jpg",
    ref: "REF. POLO-BLK-FW26",
    spec: {
      weave: "Classic Honeycomb Piqué",
      weight: "280 g/m²",
      origin: "Prato Mills, Italy",
      composition: "100% Superfine Merino Wool",
      tension: "Firm Structural Hold",
    },
  },
  {
    id: "g3",
    title: "Heritage Bodysuit White",
    img: "/heritage_bodysuit_white.jpg",
    ref: "REF. BODY-WHT-FW26",
    spec: {
      weave: "Interlock Knit Charmeuse",
      weight: "220 g/m²",
      origin: "Como Atelier, Italy",
      composition: "90% Mulberry Silk, 10% Elastane",
      tension: "Fluid Sculpted Flow",
    },
  },
  {
    id: "g4",
    title: "Ribbed Bodysuit Black",
    img: "/ribbed_bodysuit.jpg",
    ref: "REF. BODY-BLK-FW26",
    spec: {
      weave: "Heavyweight 2x2 Rib Knit",
      weight: "340 g/m²",
      origin: "Como Atelier, Italy",
      composition: "95% Organic Cotton, 5% Lycra",
      tension: "High Tension Ribbing",
    },
  },
  {
    id: "g5",
    title: "XS Polo White",
    img: "/heavenly_polo_white.jpg",
    ref: "REF. POLO-WHT-FW26",
    spec: {
      weave: "Classic Honeycomb Piqué",
      weight: "280 g/m²",
      origin: "Prato Mills, Italy",
      composition: "100% Superfine Merino Wool",
      tension: "Firm Structural Hold",
    },
  },
  {
    id: "g6",
    title: "Gothic Allover Shorts",
    img: "/gothic_shorts.jpg",
    ref: "REF. SHRT-LOGO-FW26",
    spec: {
      weave: "Double-knit Jacquard",
      weight: "400 g/m²",
      origin: "Varese Mills, Italy",
      composition: "100% Compact Mercerized Cotton",
      tension: "Dense Structured Drape",
    },
  },
  {
    id: "g7",
    title: "Tribal Cross Jorts",
    img: "/gothic_jorts.jpg",
    ref: "REF. JRT-DENIM-FW26",
    spec: {
      weave: "14oz Selvedge Denim",
      weight: "480 g/m²",
      origin: "Kojima Mills, Japan",
      composition: "100% Indigo Dyed Cotton",
      tension: "Heavy Rigid Structure",
    },
  },
  {
    id: "g8",
    title: "Graffiti Beanie Black",
    img: "/cruz_beanie.jpg",
    ref: "REF. BN-GRAF-FW26",
    spec: {
      weave: "Double-Layer Intarsia Knit",
      weight: "120g total",
      origin: "Florence Atelier, Italy",
      composition: "70% Extra Fine Wool, 30% Cashmere",
      tension: "Elastic Comfort Stretch",
    },
  },
];

export default function DigitalTailoring() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0); // force re-mount animation on switch
  const [tailoringBrandImg] = useSiteConfig("tailoringBrandImg", "/cruz_tank_top.jpg");

  const garment = ALL_GARMENTS[selectedIndex];
  const spec = garment.spec;

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="py-16 sm:py-24 md:py-40 bg-cruzGrey relative overflow-hidden">
      <style>{`
        @keyframes garment-float {
          0%   { transform: translateY(0px) rotate(-1.5deg) scale(1); }
          25%  { transform: translateY(-14px) rotate(0.5deg) scale(1.012); }
          50%  { transform: translateY(-8px) rotate(1.5deg) scale(1.008); }
          75%  { transform: translateY(-18px) rotate(-0.5deg) scale(1.015); }
          100% { transform: translateY(0px) rotate(-1.5deg) scale(1); }
        }
        @keyframes garment-shadow {
          0%,100% { transform: scaleX(1) translateY(0); opacity: 0.18; }
          50%      { transform: scaleX(0.82) translateY(8px); opacity: 0.10; }
        }
        @keyframes garment-enter {
          0%   { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0px) scale(1); filter: blur(0px); }
        }
        .garment-float { animation: garment-float 5s ease-in-out infinite; }
        .garment-shadow-anim { animation: garment-shadow 5s ease-in-out infinite; }
        .garment-enter { animation: garment-enter 0.5s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row md:items-start md:justify-between z-10 relative gap-8 md:gap-16">

        {/* ── LEFT: Copy + Drawer + Specs ── */}
        <div className="w-full md:w-5/12 fade-in-up">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-gray-500 mb-4">Interactive Archive</h3>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-cruzBlack font-light mb-5 sm:mb-8 leading-tight">
            Digital<br />Tailoring
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] leading-loose text-gray-500 mb-8 max-w-sm">
            Browse the full archive. Select any garment to see it in motion and explore its precise textile construction.
          </p>

          {/* Garment Thumbnail Drawer — horizontally scrollable */}
          <div>
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-cruzGold block mb-3">
              Select Archive Garment
            </span>
            <div
              className="flex gap-2 sm:gap-3 overflow-x-auto pb-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.1) transparent" }}
            >
              {ALL_GARMENTS.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={() => handleSelect(idx)}
                  className={`flex-shrink-0 w-[52px] sm:w-[62px] text-left transition-all duration-300 pb-2 border-b-2 ${
                    selectedIndex === idx
                      ? "border-cruzBlack opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <div className="aspect-[3/4] w-full bg-white border border-cruzBorder/40 overflow-hidden flex items-center justify-center mb-1.5 p-1">
                    <img
                      src={g.img}
                      alt={g.title}
                      className={`max-h-full max-w-full object-contain transition-all duration-500 ${
                        selectedIndex === idx ? "grayscale-0" : "grayscale"
                      }`}
                    />
                  </div>
                  <span className="text-[6px] sm:text-[6.5px] font-mono uppercase tracking-wider block truncate text-cruzBlack leading-tight">
                    {g.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Technical Spec Sheet */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-cruzBorder/60">
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-cruzGold block mb-4">
              Textile Specifications
            </span>
            <div className="space-y-2 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-wider">
              {[
                ["Composition", spec.composition],
                ["Weave Structure", spec.weave],
                ["Fabric Weight", spec.weight],
                ["Origin", spec.origin],
                ["Behavior / Flow", spec.tension],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-cruzBorder/30 gap-3">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="text-cruzBlack font-medium text-right leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Animated Garment Viewer ── */}
        <div className="w-full md:w-6/12 h-[360px] sm:h-[480px] md:h-[640px] bg-white relative shadow-2xl fade-in-up overflow-hidden border border-cruzBorder/30 flex flex-col items-center justify-center">

          {/* Blueprint grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:8px_8px] opacity-10 pointer-events-none" />

          {/* Concentric guide circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 border border-cruzBlack/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[420px] h-72 sm:h-[420px] border border-cruzBlack/4 rounded-full pointer-events-none" />

          {/* Watermark brand bg */}
          <img
            src={tailoringBrandImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.05] grayscale contrast-125 pointer-events-none mix-blend-multiply select-none"
          />

          {/* Animated Garment */}
          <div key={animKey} className="garment-enter relative flex flex-col items-center justify-center w-full h-full">
            <div className="garment-float relative flex items-center justify-center" style={{ height: "70%", width: "100%" }}>
              <img
                src={garment.img}
                alt={garment.title}
                className="max-h-full max-w-[60%] sm:max-w-[55%] object-contain drop-shadow-2xl select-none pointer-events-none"
                draggable={false}
              />
            </div>
            {/* Floating shadow beneath */}
            <div
              className="garment-shadow-anim mx-auto rounded-full bg-cruzBlack/10 blur-xl"
              style={{ width: "28%", height: "12px", marginTop: "-6px" }}
            />
          </div>

          {/* Atelier Barcode Label — compact on mobile */}
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 bg-white/95 backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-3 border border-cruzBlack/10 shadow-sm flex gap-2 sm:gap-4 items-center z-20 transition-all duration-300 hover:border-cruzBlack/30 max-w-[calc(100%-24px)]">
            {/* Barcode bars — hidden on very small screens */}
            <div className="hidden sm:flex flex-row gap-[2px] items-end opacity-35 h-7">
              {[1,2,1,3,1,1,2,1,3,1,2,1].map((w, i) => (
                <span key={i} style={{ width: `${w}px`, height: "100%", background: "#1a1a1a", display: "block" }} />
              ))}
            </div>
            <div className="hidden sm:block h-10 w-px bg-cruzBlack/10" />
            <div className="w-8 h-11 sm:w-10 sm:h-14 bg-cruzGrey border border-cruzBorder/40 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
              <img
                src={garment.img}
                alt={garment.title}
                className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cruzGold flex-shrink-0" />
                <span className="text-[6.5px] sm:text-[7px] font-mono text-cruzGold uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold">Atelier Sample</span>
              </div>
              <h4 className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-cruzBlack font-bold truncate max-w-[120px] sm:max-w-none">{garment.title}</h4>
              <span className="text-[6px] sm:text-[6.5px] font-mono text-gray-400 mt-0.5 uppercase tracking-widest">{garment.ref}</span>
            </div>
          </div>

          {/* HUD overlays */}
          <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between select-none z-10">
            <div className="flex justify-between items-center text-[6px] sm:text-[7px] tracking-[0.2em] uppercase text-cruzBlack/25">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-rec-blink" />
                <span>LIVE PREVIEW</span>
              </div>
              <span className="hidden sm:block">MOTION STUDIO</span>
            </div>
            <div className="flex justify-between items-center text-[6px] sm:text-[7px] tracking-[0.2em] uppercase text-cruzBlack/25">
              <span className="hidden sm:block">FLOATING GARMENT</span>
              <span>FW 26 ARCHIVE</span>
            </div>
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-l border-cruzBlack/12" />
            <div className="absolute top-3 right-3 w-4 h-4 sm:w-5 sm:h-5 border-t border-r border-cruzBlack/12" />
            <div className="absolute bottom-3 left-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-l border-cruzBlack/12" />
            <div className="absolute bottom-3 right-3 w-4 h-4 sm:w-5 sm:h-5 border-b border-r border-cruzBlack/12" />
          </div>
        </div>
      </div>
    </section>
  );
}
