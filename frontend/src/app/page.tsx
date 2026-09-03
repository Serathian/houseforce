"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpinningWheel from '@/components/SpinningWheel';

export default function Home() {
  const [expandedSide, setExpandedSide] = useState<'left' | 'right' | null>(null);

  const handleReset = () => setExpandedSide(null);

  // Transition settings to perfectly sync background swipe with wheel reveal
  const swipeTransition = { duration: 1.0, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="flex flex-col items-center bg-slate-50 min-h-screen overflow-hidden">
      
      {/* Absolute Background Swipe Layers */}
      <div className="absolute inset-0 w-full h-[85vh] z-0 overflow-hidden pointer-events-none">
        {/* Left Background (Construction - Blue) */}
        <motion.div 
          className="absolute left-0 top-0 h-full overflow-hidden"
          initial={false}
          animate={{ 
            width: expandedSide === 'left' ? '100%' : expandedSide === 'right' ? '0%' : '50%' 
          }}
          transition={swipeTransition}
        >
          {/* Ensure the image itself doesn't shrink, just the container masking it */}
          <div className="absolute left-0 top-0 w-[100vw] h-full bg-blue-900 opacity-95"></div>
          <div className="absolute left-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        </motion.div>

        {/* Right Background (Keyholding - Teal) */}
        <motion.div 
          className="absolute right-0 top-0 h-full overflow-hidden"
          initial={false}
          animate={{ 
            width: expandedSide === 'right' ? '100%' : expandedSide === 'left' ? '0%' : '50%' 
          }}
          transition={swipeTransition}
        >
          {/* We lock the image to the right so it stays stable while swiping left */}
          <div className="absolute right-0 top-0 w-[100vw] h-full bg-teal-800 opacity-95"></div>
          <div className="absolute right-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        </motion.div>
      </div>

      {/* Back Button */}
      <AnimatePresence>
        {expandedSide && (
          <motion.button 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            onClick={handleReset}
            className="fixed top-24 left-8 z-50 bg-white text-slate-900 font-bold py-3 px-8 rounded-full shadow-2xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            &larr; Back to Overview
          </motion.button>
        )}
      </AnimatePresence>

      <section className="relative w-full flex flex-row min-h-[85vh] z-10 pointer-events-none">
        
        {/* The Interactive Wheel Component */}
        <SpinningWheel expandedSide={expandedSide} setExpandedSide={setExpandedSide} swipeTransition={swipeTransition} />
        
        {/* Left Content Container (Static 50% width so text never moves!) */}
        <div className="w-1/2 flex flex-col items-center p-12 text-center mt-16 pointer-events-none">
          <AnimatePresence>
            {(expandedSide === null || expandedSide === 'left') && (
              <motion.div 
                className="relative z-20 flex flex-col items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <span className="text-blue-300 font-semibold tracking-wider uppercase text-sm mb-4">Led by Paul Reddy</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-md">Construction<br/>& Reforming</h2>
                <p className="text-lg text-blue-100 mb-8 max-w-sm font-light drop-shadow">
                  30+ years of expertise. "Quality First" property renovations in Torrevieja.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Content Container (Static 50% width) */}
        <div className="w-1/2 flex flex-col items-center p-12 text-center mt-16 pointer-events-none">
          <AnimatePresence>
            {(expandedSide === null || expandedSide === 'right') && (
              <motion.div 
                className="relative z-20 flex flex-col items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <span className="text-teal-200 font-semibold tracking-wider uppercase text-sm mb-4">Managed by Paige</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-md">Keyholding<br/>& Cleaning</h2>
                <p className="text-lg text-teal-50 mb-8 max-w-sm font-light drop-shadow">
                  Total peace of mind for your Spanish property with meticulous cleaning and security.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-200 relative overflow-hidden z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-slate-50 -skew-x-12 transform -translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-slate-900 tracking-tight">A True Family Business</h2>
          <p className="text-slate-600 text-xl leading-relaxed font-light">
            For over 20 years, HouseForce has been the trusted name in Torrevieja property services. 
            By dividing our expertise—<strong className="font-semibold text-blue-900">Paul</strong> heading up all major construction and reforming, while <strong className="font-semibold text-teal-700">Paige</strong> ensures your home is spotless and secure—we guarantee that every aspect of your property is handled by a dedicated specialist who treats your home like their own.
          </p>
        </div>
      </section>
    </div>
  );
}
