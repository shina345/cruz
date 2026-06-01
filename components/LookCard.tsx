"use client";

import { useState } from "react";
import { LookItem } from "@/constants/collections";

interface LookCardProps {
  item: LookItem;
  aspectRatio?: string;
  variant?: "default" | "compact";
}

export default function LookCard({ item, aspectRatio = "aspect-[3/4]", variant = "default" }: LookCardProps) {
  const isCompact = variant === "compact";
  const heightClass = item.height || aspectRatio;

  // Drawer modal states
  const [isOpen, setIsOpen] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientSize, setClientSize] = useState("M");
  const [clientNotes, setClientNotes] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Auto-generate luxury technical specifications based on items
  const getAtelierSpecs = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("cashmere") || lower.includes("knit") || lower.includes("sweater") || lower.includes("polo") || lower.includes("beanie")) {
      return {
        material: "100% Organic Cashmere & Fine Merino Wool",
        fit: "Relaxed Drop-Shoulder Silhouette",
        process: "Interloop Fine Knit, Hand-Finished in Milan",
        care: "Professional Dry Clean Only"
      };
    } else if (lower.includes("denim") || lower.includes("jean") || lower.includes("jorts")) {
      return {
        material: "14.5oz Raw Japanese Selvedge Cotton Denim",
        fit: "Relaxed Straight-Leg / Architectural Drape",
        process: "Shuttle Loom Woven, Indigo Rope Dyed",
        care: "Wash Cold, Air Dry Inside Out"
      };
    } else if (lower.includes("coat") || lower.includes("trench") || lower.includes("jacket") || lower.includes("blazer") || lower.includes("overcoat")) {
      return {
        material: "Double-Faced Wool & Silk Blend (Wind-Resistant)",
        fit: "Structured Shoulder, Architectural Drape",
        process: "Traditional Tailored Atelier Construction",
        care: "Dry Clean Only, Iron Low Heat"
      };
    } else {
      return {
        material: "100% Organic Mulberry Silk / Fine Italian Linen Crepe",
        fit: "Fluid Silhouette, Clean Line Drape",
        process: "Bias-Cut, French Seamed Atelier Tailoring",
        care: "Gentle Professional Dry Clean Only"
      };
    }
  };

  const specs = getAtelierSpecs(item.title);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    const newInquiry = {
      id: `inquiry-${Date.now()}`,
      lookId: item.id,
      lookLabel: item.look,
      lookTitle: item.title,
      lookImg: item.img,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientSize: clientSize,
      clientNotes: clientNotes.trim(),
      timestamp: new Date().toLocaleString(),
      status: "pending"
    };

    try {
      const stored = localStorage.getItem("cruz_showroom_inquiries");
      const inquiries = stored ? JSON.parse(stored) : [];
      localStorage.setItem("cruz_showroom_inquiries", JSON.stringify([newInquiry, ...inquiries]));
      // Dispatch event to sync admin panel or other hooks
      window.dispatchEvent(new Event("cruz_inquiries_updated"));
    } catch (err) {
      console.error(err);
    }

    setInquirySubmitted(true);
  };

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setClientNotes("");
    setClientSize("M");
    setInquirySubmitted(false);
    setShowInquiryForm(false);
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`group cursor-pointer fade-in-up ${item.mt || ""} relative`}
      >
        <div className={`overflow-hidden ${isCompact ? "mb-4" : "mb-5"} ${heightClass} relative`}>
          <img
            src={item.img}
            className={`parallax-img w-full h-[125%] object-cover absolute top-0 left-0 transform filter grayscale group-hover:grayscale-0 transition-[filter] duration-1000 ${
              item.objectTop ? "object-top" : ""
            } ${item.outOfStock ? "brightness-[0.4]" : ""}`}
            alt={item.title}
          />
          {item.outOfStock && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-[8.5px] font-mono tracking-[0.3em] uppercase text-cruzBg bg-cruzBlack/90 px-3 py-1.5 border border-cruzBorder/30">
                Sold Out
              </span>
            </div>
          )}
        </div>
        
        {isCompact ? (
          <>
            <p className="text-[9px] uppercase tracking-[0.15em] mb-1 flex justify-between">
              <span>{item.look}</span>
              {item.outOfStock && <span className="text-[8px] font-mono text-red-600 font-bold uppercase tracking-widest">[ Sold Out ]</span>}
            </p>
            <p className="text-[9px] text-gray-400 tracking-wider">{item.title}</p>
          </>
        ) : (
          <div className="flex justify-between items-center border-b border-cruzBorder pb-4">
            <span className="text-[9px] uppercase tracking-[0.2em]">{item.look}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              {item.outOfStock && <span className="text-[8px] font-mono text-red-600 font-bold uppercase tracking-widest mr-1">[ Sold Out ]</span>}
              {item.title}
            </span>
          </div>
        )}
      </div>

      {/* Showroom Detail Drawer Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-[4px] cursor-default animate-fade-in"
          onClick={() => {
            setIsOpen(false);
            resetForm();
          }}
        >
          {/* Drawer Wrapper */}
          <div 
            className="w-full max-w-md bg-cruzBg text-cruzBlack h-full flex flex-col justify-between border-l border-cruzBorder relative shadow-2xl p-8 overflow-y-auto cursor-default animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-cruzBorder pb-4 mb-6">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-cruzGold">Atelier Showroom</span>
                <h4 className="text-[11px] uppercase tracking-widest font-semibold mt-1">{item.look} &bull; Specifications</h4>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-cruzBlack transition-colors"
              >
                [ Close ]
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-8 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 scrollbar-thin">
              {/* Product Frame */}
              <div className="aspect-[4/5] bg-cruzGrey border border-cruzBorder/40 overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className={`w-full h-full object-contain p-4 ${item.outOfStock ? "brightness-50 grayscale" : ""}`} 
                />
                {item.outOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <span className="text-[8.5px] font-mono tracking-[0.3em] uppercase text-cruzBg bg-cruzBlack border border-red-800 px-4 py-2">
                      Archive Only &bull; Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Status */}
              <div>
                <h3 className="text-2xl font-serif font-light tracking-wide">{item.title}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.outOfStock ? "bg-red-500" : "bg-green-500 animate-pulse"}`}></span>
                  <span className="text-[8.5px] font-mono uppercase tracking-widest text-gray-500">
                    {item.outOfStock ? "Atelier Archive Only" : "Available for Showroom Fitting"}
                  </span>
                </div>
              </div>

              {/* Atelier Specs */}
              <div className="border-t border-b border-cruzBorder/40 py-6 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-mono">
                  <span className="text-gray-400">Atelier:</span>
                  <span className="col-span-2 text-cruzBlack font-medium">Milan, IT &bull; Room 3B</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-mono">
                  <span className="text-gray-400">Materials:</span>
                  <span className="col-span-2 text-cruzBlack font-medium">{specs.material}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-mono">
                  <span className="text-gray-400">Fit Line:</span>
                  <span className="col-span-2 text-cruzBlack font-medium">{specs.fit}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-mono">
                  <span className="text-gray-400">Technique:</span>
                  <span className="col-span-2 text-cruzBlack font-medium">{specs.process}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[9px] uppercase tracking-wider font-mono">
                  <span className="text-gray-400">Garment Care:</span>
                  <span className="col-span-2 text-cruzBlack font-medium">{specs.care}</span>
                </div>
              </div>

              {/* Private Fitting Inquiry */}
              <div className="space-y-4">
                {!showInquiryForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (item.outOfStock) return;
                      setShowInquiryForm(true);
                    }}
                    disabled={!!item.outOfStock}
                    className={`w-full text-center py-4 text-[9.5px] uppercase tracking-[0.25em] font-mono border transition-all ${
                      item.outOfStock
                        ? "border-cruzBorder text-gray-400 bg-gray-50 cursor-not-allowed"
                        : "border-cruzBlack bg-cruzBlack text-cruzBg hover:bg-cruzBlack/90"
                    }`}
                  >
                    {item.outOfStock ? "Item Sold Out / Unavailable" : "Request Private Fitting"}
                  </button>
                ) : (
                  <div className="border border-cruzBorder p-5 bg-white space-y-4 animate-fade-in">
                    <span className="text-[8.5px] font-mono uppercase tracking-widest text-cruzGold">Book Showroom Appointment</span>
                    
                    {inquirySubmitted ? (
                      <div className="text-center py-6 space-y-3">
                        <span className="text-lg">✓</span>
                        <p className="text-[9.5px] uppercase tracking-wider text-cruzBlack">Fitting Request Logged</p>
                        <p className="text-[8.5px] text-gray-400 uppercase tracking-widest leading-loose">
                          Our private client advisor will contact you within 24 hours to schedule your atelier appointment.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono uppercase text-gray-400">Your Name</label>
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. Alexis Vane"
                            className="w-full bg-cruzBg/50 border border-cruzBorder px-3 py-2 text-[10px] uppercase tracking-wider focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono uppercase text-gray-400">Email Address</label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="e.g. alexis@atelier.com"
                            className="w-full bg-cruzBg/50 border border-cruzBorder px-3 py-2 text-[10px] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-mono uppercase text-gray-400">Atelier Size</label>
                            <select
                              value={clientSize}
                              onChange={(e) => setClientSize(e.target.value)}
                              className="w-full bg-cruzBg/50 border border-cruzBorder px-3 py-2 text-[10px] uppercase font-mono focus:outline-none cursor-pointer"
                            >
                              <option value="XS">XS (44)</option>
                              <option value="S">S (46)</option>
                              <option value="M">M (48)</option>
                              <option value="L">L (50)</option>
                              <option value="XL">XL (52)</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-mono uppercase text-gray-400">Fittings Location</label>
                            <div className="w-full bg-gray-50 border border-cruzBorder px-3 py-2 text-[10px] uppercase font-mono select-none">
                              Milan Atelier
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono uppercase text-gray-400">Notes / Fitting Requests</label>
                          <textarea
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            placeholder="Specify preferred date, modifications..."
                            rows={2}
                            className="w-full bg-cruzBg/50 border border-cruzBorder px-3 py-2 text-[10px] uppercase tracking-wider focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowInquiryForm(false)}
                            className="flex-1 border border-cruzBorder text-gray-500 py-2.5 text-[8.5px] font-mono uppercase tracking-widest hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-cruzBlack text-cruzBg py-2.5 text-[8.5px] font-mono uppercase tracking-widest hover:bg-cruzBlack/90"
                          >
                            Submit Booking
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[7.5px] font-mono uppercase tracking-[0.25em] text-gray-400 pt-4 border-t border-cruzBorder mt-4">
              Cruz Haute Couture &bull; Milan Showroom SS26
            </div>
          </div>
        </div>
      )}
    </>
  );
}
