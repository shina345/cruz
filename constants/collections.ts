export interface LookItem {
  id: string;
  title: string;
  img: string;
  look: string;
  mt?: string;
  height?: string;
  objectTop?: boolean;
  outOfStock?: boolean;
}

export const womenCollection: LookItem[] = [
  { id: "w1", title: "Draped Silk Shirt Dress", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop", look: "Look 01" },
  { id: "w2", title: "Structured Blazer Suit", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=900&auto=format&fit=crop", look: "Look 02", mt: "md:mt-20" },
  { id: "w3", title: "Linen Wide-Leg Trousers", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop", look: "Look 03" },
  { id: "w4", title: "Cashmere Wrap Coat", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop", look: "Look 04" },
  { id: "w5", title: "Technical Trench", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop", look: "Look 05", mt: "md:mt-20" },
  { id: "w6", title: "Sheer Silk Evening Gown", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop", look: "Look 06" },
  { id: "w7", title: "Cruz Heritage Ribbed Bodysuit", img: "/ribbed_bodysuit.jpg", look: "Look 07", mt: "md:mt-20" },
  { id: "w8", title: "Cruz Heritage Zippered Bodysuit", img: "/heritage_bodysuit_white.jpg", look: "Look 08" },
  { id: "w9", title: "Cruz Star Orbit Tank", img: "/cruz_tank_top.jpg", look: "Look 09", mt: "md:mt-20" },
];

export const menCollection: LookItem[] = [
  { id: "m1", title: "Charcoal Wool Suit", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop", look: "Look 01" },
  { id: "m2", title: "Double-Breasted Overcoat", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=900&auto=format&fit=crop", look: "Look 02", mt: "md:mt-20" },
  { id: "m3", title: "Merino Crew Neck", img: "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=900&auto=format&fit=crop", look: "Look 03" },
  { id: "m4", title: "Cruz Logo Tee", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?q=80&w=900&auto=format&fit=crop", look: "Look 04" },
  { id: "m5", title: "Technical Field Jacket", img: "https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=900&auto=format&fit=crop", look: "Look 05", mt: "md:mt-20" },
  { id: "m6", title: "Relaxed Linen Set", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop", look: "Look 06" },
  { id: "m7", title: "Cruz Gothic Allover Logo Shorts", img: "/gothic_shorts.jpg", look: "Look 07", mt: "md:mt-20" },
  { id: "m8", title: "Heavenly XS Polo — White", img: "/heavenly_polo_white.jpg", look: "Look 08" },
  { id: "m9", title: "Heavenly XS Polo — Black", img: "/heavenly_polo_black.jpg", look: "Look 09", mt: "md:mt-20" },
];

export const rtwCollection: LookItem[] = [
  { id: "rtw1", title: "Silk Shirt Dress", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=700&auto=format&fit=crop", look: "Look 01" },
  { id: "rtw2", title: "Blazer Suit", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=700&auto=format&fit=crop", look: "Look 02", mt: "md:mt-12" },
  { id: "rtw3", title: "Wide-Leg Trousers", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=700&auto=format&fit=crop", look: "Look 03" },
  { id: "rtw4", title: "Wrap Coat", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=700&auto=format&fit=crop", look: "Look 04", mt: "md:mt-12" },
  { id: "rtw5", title: "Evening Gown", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop", look: "Look 05" },
  { id: "rtw6", title: "Ribbed Knit Sweater", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=700&auto=format&fit=crop", look: "Look 06", mt: "md:mt-12" },
  { id: "rtw7", title: "Oversized Silk Shirt", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=700&auto=format&fit=crop", look: "Look 07" },
  { id: "rtw8", title: "Graphic Logo Hoodie", img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=700&auto=format&fit=crop", look: "Look 08", mt: "md:mt-12" },
  { id: "rtw9", title: "Cruz Star Orbit Tank", img: "/cruz_tank_top.jpg", look: "Look 09" },
];

export const knitwearCollection: LookItem[] = [
  { id: "k1", title: "Cashmere Roll-Neck", img: "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=1000&auto=format&fit=crop", look: "Look 01" },
  { id: "k2", title: "Ribbed Merino Crew", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop", look: "Look 02", mt: "md:mt-32" },
  { id: "k3", title: "Oversized Logo Knit", img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop", look: "Look 03", mt: "md:-mt-16" },
  { id: "k4", title: "Boxy Knit Cardigan", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop", look: "Look 04", mt: "md:mt-20" },
  { id: "k5", title: "Cruz Gothic Allover Logo Shorts", img: "/gothic_shorts.jpg", look: "Look 05", mt: "md:mt-20" },
  { id: "k6", title: "Cruz Graffiti Beanie", img: "/cruz_beanie.jpg", look: "Look 06" },
];

export const denimCollection: LookItem[] = [
  { id: "d1", title: "Raw Selvedge Straight", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop", look: "Look 01", height: "h-[70vh]" },
  { id: "d2", title: "Washed Wide-Leg", img: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=1200&auto=format&fit=crop", look: "Look 02", mt: "md:mt-40", height: "h-[70vh]" },
  { id: "d3", title: "Cruz Branded Trucker", img: "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1200&auto=format&fit=crop", look: "Look 03", mt: "md:-mt-20", height: "h-[55vh]", objectTop: true },
  { id: "d4", title: "Overdyed Slim", img: "https://images.unsplash.com/photo-1614068687893-b1e01f0b9e9b?q=80&w=1200&auto=format&fit=crop", look: "Look 04", height: "h-[55vh]" },
  { id: "d5", title: "Cruz Gothic Tribal Cross Jorts", img: "/gothic_jorts.jpg", look: "Look 05", mt: "md:mt-40", height: "h-[70vh]" },
];

export const outerwearRow1: LookItem[] = [
  { id: "o1", title: "Tailored Wool Coat — Cream", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop", look: "Look 01", height: "h-[65vh]" },
  { id: "o2", title: "Structured Overcoat — Noir", img: "https://images.unsplash.com/photo-1550614000-4b95d466f21c?q=80&w=900&auto=format&fit=crop", look: "Look 02", height: "h-[50vh]", mt: "md:mb-24" },
];

export const outerwearRow3: LookItem[] = [
  { id: "o4", title: "Cashmere Trench", img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=900&auto=format&fit=crop", look: "Look 04", objectTop: true },
  { id: "o5", title: "Cropped Wool Jacket", img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=900&auto=format&fit=crop", look: "Look 05", mt: "md:mt-16" },
  { id: "o6", title: "Silk Oversized Shirt Coat", img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=900&auto=format&fit=crop", look: "Look 06" },
];
