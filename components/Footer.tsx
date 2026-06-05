import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cruzBlack text-cruzBg pt-24 pb-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mb-24">
          <div>
            <h5 className="text-[9px] tracking-[0.2em] uppercase font-light mb-8 text-gray-400">The Brand</h5>
            <ul className="text-[10px] space-y-5 tracking-wider">
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Our Heritage</Link></li>
              <li><Link href="#" className="hover:text-cruzGold transition-colors">The Milan Atelier</Link></li>
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Creative Direction</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[9px] tracking-[0.2em] uppercase font-light mb-8 text-gray-400">Collections</h5>
            <ul className="text-[10px] space-y-5 tracking-wider">
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Fall Winter 2026</Link></li>
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Spring Summer 2025</Link></li>
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Permanent Archive</Link></li>
              <li><Link href="#" className="hover:text-cruzGold transition-colors">Runway Videos</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[9px] tracking-[0.2em] uppercase font-light mb-8 text-gray-400">Contact</h5>
            <ul className="text-[10px] space-y-5 tracking-wider">
              <li>
                <a href="tel:+2349037012037" className="hover:text-cruzGold transition-colors block">
                  +234 903 701 2037
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/szn.c0r1?igsh=NHRhYjBmeXVjczE3&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cruzGold transition-colors block"
                >
                  Instagram
                </a>
              </li>
              <li className="text-gray-500 font-mono text-[9px]">
                MILAN &bull; LAGOS
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-[9px] tracking-[0.2em] uppercase font-light mb-8 text-gray-400">Join the Archive</h5>
            <p className="text-[10px] mb-6 text-gray-400 leading-relaxed tracking-wider">
              Subscribe to receive private invitations to runway shows and new collection releases.
            </p>
            <div className="flex border-b border-gray-700 pb-3">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent text-cruzBg text-[10px] w-full outline-none placeholder-gray-600 tracking-wider"
              />
              <button className="text-[9px] uppercase tracking-[0.2em] font-light hover:text-cruzGold transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-[9px] tracking-[0.2em] text-gray-600 border-t border-gray-800 pt-10 uppercase">
          <p>&copy; 2026 Cruz Atelier. Milan, Italy.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a 
              href="https://www.instagram.com/szn.c0r1?igsh=NHRhYjBmeXVjczE3&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cruzBg transition-colors"
            >
              Instagram
            </a>
            <Link href="#" className="hover:text-cruzBg transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-cruzBg transition-colors">YouTube</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
