import Link from "next/link";

export default function TopUtilityBar() {
  return (
    <div className="w-full bg-cruzBg px-8 py-3 flex justify-between items-center text-[9px] tracking-[0.2em] uppercase border-b border-cruzBorder relative z-50">
      <div className="flex gap-6">
        <Link href="/" className="hover:opacity-50 transition-opacity">Global</Link>
        <span className="text-gray-400">English</span>
        <Link href="#" className="hover:opacity-50 hidden md:block transition-opacity">The Atelier</Link>
      </div>
      <div className="flex gap-6">
        <Link href="#" className="hover:opacity-50 transition-opacity">Archive</Link>
        <Link href="#" className="hover:opacity-50 transition-opacity">Exhibitions</Link>
        <Link href="#" className="hover:opacity-50 transition-opacity">Press</Link>
      </div>
    </div>
  );
}
