"use client";

import { useState } from 'react';
import { Link } from 'next-view-transitions';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-blue-900 tracking-tight">
              House<span className="text-teal-600">Force</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">Home</Link>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">About Us</Link>
            <Link href="/services/construction" className="text-blue-700 hover:text-blue-900 px-3 py-2 text-sm font-bold transition-colors">Construction</Link>
            <Link href="/services/keyholding" className="text-teal-600 hover:text-teal-800 px-3 py-2 text-sm font-bold transition-colors">Keyholding</Link>
            <Link href="/blog" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">Blog</Link>
            <Link href="/contact" className="bg-blue-900 text-white hover:bg-blue-800 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md">Contact</Link>
          </nav>

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
            {/* Mobile Header (replicated inside overlay to align button) */}
            <div className="px-4 sm:px-6">
              <div className="flex justify-between items-center h-20">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-extrabold text-blue-900 tracking-tight">
                  House<span className="text-teal-600">Force</span>
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
            <nav className="flex flex-col flex-grow justify-center space-y-8 px-8 pb-20">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-4xl font-extrabold text-slate-800 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="text-4xl font-extrabold text-slate-800 hover:text-blue-600 transition-colors">About Us</Link>
              <Link href="/services/construction" onClick={() => setIsOpen(false)} className="text-4xl font-extrabold text-blue-700 hover:text-blue-900 transition-colors">Construction</Link>
              <Link href="/services/keyholding" onClick={() => setIsOpen(false)} className="text-4xl font-extrabold text-teal-600 hover:text-teal-800 transition-colors">Keyholding</Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="text-4xl font-extrabold text-slate-800 hover:text-blue-600 transition-colors">Blog</Link>
              
              <div className="pt-8">
                <Link href="/contact" onClick={() => setIsOpen(false)} className="inline-block w-full text-center bg-blue-900 text-white hover:bg-blue-800 px-8 py-4 rounded-full text-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
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
