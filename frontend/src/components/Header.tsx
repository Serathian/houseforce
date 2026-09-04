"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isConstruction = pathname === '/services/construction';
  const isKeyholding = pathname === '/services/keyholding';

  const handleNavHover = (item: 'construction' | 'keyholding' | null) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nav-hover-sliver', { detail: item }));
    }
  };

  const handleLogoClick = () => {
    if (pathname === '/' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reset-homepage-hero'));
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          
          {/* Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={handleLogoClick} className="text-2xl font-extrabold text-blue-900 tracking-tight">
              House<span className="text-teal-600">Force</span><span className="text-amber-500">.</span>
            </Link>
          </div>
          
          {/* Primary Service Items (Single Subtle Tab Integrated Inside Menu Bar) */}
          <div className="hidden md:flex justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
            <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 p-1.5 rounded-full border border-slate-200/80 shadow-inner transition-all">
              <nav className="flex items-center space-x-1">
                <Link 
                  href="/services/construction" 
                  onMouseEnter={() => handleNavHover('construction')}
                  onMouseLeave={() => handleNavHover(null)}
                  className={`flex items-center gap-2 text-xs lg:text-sm font-extrabold px-4 py-1.5 rounded-full transition-all group ${
                    isConstruction 
                      ? 'bg-blue-900 text-white shadow-sm' 
                      : 'text-slate-700 hover:text-blue-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-all ${
                    isConstruction 
                      ? 'bg-blue-300 animate-pulse' 
                      : 'bg-blue-900 group-hover:scale-125'
                  }`}></span>
                  <span>Construction</span>
                </Link>

                <div className="w-[1px] h-4 bg-slate-300/80 my-auto shrink-0" />

                <Link 
                  href="/services/keyholding" 
                  onMouseEnter={() => handleNavHover('keyholding')}
                  onMouseLeave={() => handleNavHover(null)}
                  className={`flex items-center gap-2 text-xs lg:text-sm font-extrabold px-4 py-1.5 rounded-full transition-all group ${
                    isKeyholding 
                      ? 'bg-teal-800 text-white shadow-sm' 
                      : 'text-slate-700 hover:text-teal-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-all ${
                    isKeyholding 
                      ? 'bg-teal-200 animate-pulse' 
                      : 'bg-teal-600 group-hover:scale-125'
                  }`}></span>
                  <span>Keyholding</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Secondary Items (Right) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors">
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="bg-blue-950 text-white hover:bg-blue-900 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md"
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-600 hover:text-blue-900 focus:outline-none p-2 rounded-md hover:bg-slate-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 w-full h-[100dvh] bg-white z-[200] flex flex-col"
          >
            {/* Mobile Header */}
            <div className="px-4 sm:px-6">
              <div className="flex justify-between items-center h-20">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-extrabold text-blue-900 tracking-tight">
                  House<span className="text-teal-600">Force</span><span className="text-amber-500">.</span>
                </Link>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-slate-400 hover:text-blue-900 focus:outline-none p-2 rounded-md hover:bg-slate-50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
            </div>
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col flex-grow justify-center space-y-6 px-8 pb-16">
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">Primary Services</span>
                <Link 
                  href="/services/construction" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-3 text-3xl font-extrabold text-blue-950 hover:text-blue-700 transition-colors"
                >
                  <span className="w-3 h-3 rounded-full bg-blue-900"></span>
                  <span>Construction</span>
                </Link>
                <Link 
                  href="/services/keyholding" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-3 text-3xl font-extrabold text-teal-900 hover:text-teal-600 transition-colors"
                >
                  <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                  <span>Keyholding</span>
                </Link>
              </div>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">Company</span>
                <Link 
                  href="/about" 
                  onClick={() => setIsOpen(false)} 
                  className="block text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  About Us
                </Link>
                <Link 
                  href="/blog" 
                  onClick={() => setIsOpen(false)} 
                  className="block text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Blog
                </Link>
              </div>
              
              <div className="pt-6">
                <Link 
                  href="/contact" 
                  onClick={() => setIsOpen(false)} 
                  className="inline-block w-full text-center bg-blue-950 text-white hover:bg-blue-900 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl"
                >
                  Contact Us
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
