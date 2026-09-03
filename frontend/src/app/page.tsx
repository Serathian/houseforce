"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import SpinningWheel from '@/components/SpinningWheel';

export default function Home() {
  const [expandedSide, setExpandedSide] = useState<'left' | 'right' | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<'left' | 'right' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleReset = () => {
    setExpandedSide(null);
    setHoveredEdge(null);
  };

  const swipeTransition = { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const };

  let clipStrLeft = 'inset(0px calc(50% + 0px) 0px 0px)';
  let clipStrRight = 'inset(0px 0px 0px calc(50% + 0px))';

  if (isMobile) {
    clipStrLeft = 'inset(0px 0px calc(50% + 0px) 0px)';
    clipStrRight = 'inset(calc(50% + 0px) 0px 0px 0px)';

    if (expandedSide === 'left') { // Construction (Top) expanded
      clipStrLeft = 'inset(0px 0px calc(0% + 48px) 0px)';
      clipStrRight = 'inset(calc(100% - 48px) 0px 0px 0px)';
    } else if (expandedSide === 'right') { // Keyholding (Bottom) expanded
      clipStrLeft = 'inset(0px 0px calc(100% - 48px) 0px)';
      clipStrRight = 'inset(calc(0% + 48px) 0px 0px 0px)';
    }
  } else {
    let rightInset = 'calc(50% + 0px)';
    let leftInset = 'calc(50% + 0px)';

    if (expandedSide === 'left') {
      leftInset = hoveredEdge === 'right' ? 'calc(0% + 260px)' : 'calc(0% + 48px)';
      rightInset = hoveredEdge === 'right' ? 'calc(100% - 260px)' : 'calc(100% - 48px)';
    } else if (expandedSide === 'right') {
      leftInset = hoveredEdge === 'left' ? 'calc(100% - 260px)' : 'calc(100% - 48px)';
      rightInset = hoveredEdge === 'left' ? 'calc(0% + 260px)' : 'calc(0% + 48px)';
    }
    
    clipStrLeft = `inset(0px ${leftInset} 0px 0px)`;
    clipStrRight = `inset(0px 0px 0px ${rightInset})`;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Dynamic Spatial Hero */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-slate-50">
        
        {/* Left Background (Construction - Blue) */}
        <motion.div 
          className="absolute inset-0 w-full h-full group"
          initial={false}
          animate={{ clipPath: clipStrLeft }}
          transition={swipeTransition}
          onClick={() => expandedSide === 'right' && handleReset()}
          onMouseEnter={() => expandedSide === 'right' && setHoveredEdge('left')}
          onMouseLeave={() => expandedSide === 'right' && setHoveredEdge(null)}
        >
          <div className="absolute inset-0 w-full h-full bg-blue-900 opacity-95"></div>
          <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          
          {/* Peeking Drawer Handle */}
          <AnimatePresence>
            {expandedSide === 'right' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.3 }}
                className="absolute right-0 top-0 h-full w-full cursor-pointer group/sliver z-50 pointer-events-auto"
                onClick={() => handleReset()}
              >
                <div className={`absolute ${isMobile ? 'top-0 left-0 w-full h-[48px] justify-center' : 'left-0 top-1/2 -translate-y-1/2 pl-3 w-[260px]'} flex items-center opacity-70 group-hover/sliver:opacity-100 transition-opacity duration-300`}>
                  {isMobile ? (
                    <ArrowDown className="shrink-0 text-white w-6 h-6 " />
                  ) : (
                    <>
                      <ArrowRight className="shrink-0 text-white w-6 h-6 group-hover/sliver:translate-x-1 transition-transform duration-300 drop-shadow-md" />
                      <span className="ml-4 font-bold text-white text-lg tracking-wide whitespace-nowrap drop-shadow-md">Back to Selection</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Background (Keyholding - Teal) */}
        <motion.div 
          className="absolute inset-0 w-full h-full group"
          initial={false}
          animate={{ clipPath: clipStrRight }}
          transition={swipeTransition}
          onClick={() => expandedSide === 'left' && handleReset()}
          onMouseEnter={() => expandedSide === 'left' && setHoveredEdge('right')}
          onMouseLeave={() => expandedSide === 'left' && setHoveredEdge(null)}
        >
          <div className="absolute inset-0 w-full h-full bg-teal-800 opacity-95"></div>
          <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>

          {/* Peeking Drawer Handle */}
          <AnimatePresence>
            {expandedSide === 'left' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.3 }}
                className="absolute left-0 top-0 h-full w-full cursor-pointer group/sliver z-50 pointer-events-auto"
                onClick={() => handleReset()}
              >
                <div className={`absolute ${isMobile ? 'bottom-0 left-0 w-full h-[48px] justify-center' : 'right-0 top-1/2 -translate-y-1/2 pr-3 justify-end w-[260px]'} flex items-center opacity-70 group-hover/sliver:opacity-100 transition-opacity duration-300`}>
                  {isMobile ? (
                    <ArrowUp className="shrink-0 text-white w-6 h-6 " />
                  ) : (
                    <>
                      <span className="mr-4 font-bold text-white text-lg tracking-wide whitespace-nowrap drop-shadow-md">Back to Selection</span>
                      <ArrowLeft className="shrink-0 text-white w-6 h-6 group-hover/sliver:-translate-x-1 transition-transform duration-300 drop-shadow-md" />
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* The Wheel */}
        <SpinningWheel 
          expandedSide={expandedSide} 
          setExpandedSide={setExpandedSide}
          swipeTransition={swipeTransition}
          clipStrLeft={clipStrLeft}
          clipStrRight={clipStrRight}
          isMobile={isMobile}
        />
        
        <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row pointer-events-none z-10">
          {/* Left/Top Content Container (Construction) */}
          <div className="h-1/2 md:h-full w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 text-center">
            <AnimatePresence>
              {(expandedSide === null || expandedSide === 'left') && (
                <motion.div 
                  className="relative z-20 flex flex-col items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={swipeTransition}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  style={{ viewTransitionName: expandedSide === 'left' ? 'hero-text-const' : 'none' }}
                >
                  <span className="text-blue-300 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4 mt-8 md:mt-0">Led by Paul Reddy</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-white tracking-tight drop-shadow-md">Construction<br/>& Reforming</h2>
                  <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-sm font-light drop-shadow px-4 md:px-0 hidden sm:block">
                    30+ years of expertise. &quot;Quality First&quot; property renovations in Torrevieja.
                  </p>

                  <AnimatePresence>
                    {expandedSide === 'left' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="pointer-events-auto"
                      >
                        <Link 
                          href="/services/construction"
                          className="inline-flex items-center bg-white text-blue-900 font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-xl hover:bg-blue-50 hover:scale-105 transition-all text-sm md:text-base"
                        >
                          Explore Construction <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right/Bottom Content Container (Keyholding) */}
          <div className="h-1/2 md:h-full w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 text-center">
            <AnimatePresence>
              {(expandedSide === null || expandedSide === 'right') && (
                <motion.div 
                  className="relative z-20 flex flex-col items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={swipeTransition}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  style={{ viewTransitionName: expandedSide === 'right' ? 'hero-text-key' : 'none' }}
                >
                  <span className="text-teal-200 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4 mt-8 md:mt-0">Managed by Paige</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-white tracking-tight drop-shadow-md">Keyholding<br/>& Cleaning</h2>
                  <p className="text-base md:text-lg text-teal-50 mb-6 md:mb-8 max-w-sm font-light drop-shadow px-4 md:px-0 hidden sm:block">
                    Total peace of mind for your Spanish property with meticulous cleaning and security.
                  </p>

                  <AnimatePresence>
                    {expandedSide === 'right' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="pointer-events-auto"
                      >
                        <Link 
                          href="/services/keyholding"
                          className="inline-flex items-center bg-white text-teal-900 font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-xl hover:bg-teal-50 hover:scale-105 transition-all text-sm md:text-base"
                        >
                          Explore Keyholding <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
