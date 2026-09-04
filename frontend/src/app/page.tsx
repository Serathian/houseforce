"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, 
  CheckCircle2, ShieldCheck, Users, Hammer, Key, 
  Sparkles, Star, Clock, ChevronRight, Send, Award
} from 'lucide-react';
import SpinningWheel from '@/components/SpinningWheel';

export default function Home() {
  const [expandedSide, setExpandedSide] = useState<'left' | 'right' | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<'left' | 'right' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleNavHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'construction') {
        setHoveredEdge('left');
      } else if (customEvent.detail === 'keyholding') {
        setHoveredEdge('right');
      } else {
        setHoveredEdge(null);
      }
    };

    const handleResetEvent = () => {
      setExpandedSide(null);
      setHoveredEdge(null);
    };

    window.addEventListener('nav-hover-sliver', handleNavHover);
    window.addEventListener('reset-homepage-hero', handleResetEvent);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('nav-hover-sliver', handleNavHover);
      window.removeEventListener('reset-homepage-hero', handleResetEvent);
    };
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
          <div className="h-1/2 md:h-full w-full md:w-1/2 flex flex-col items-center justify-start pt-6 sm:pt-10 md:justify-center md:pt-0 p-6 md:p-12 text-center">
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
                  <span className="text-blue-300 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4">Led by Paul Reddy</span>
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
          <div className="h-1/2 md:h-full w-full md:w-1/2 flex flex-col items-center justify-end pb-8 sm:pb-12 md:justify-center md:pb-0 p-6 md:p-12 text-center">
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
                  <span className="text-teal-200 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4">Managed by Paige</span>
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

      {/* Trust & Family Section */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 relative overflow-hidden z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs uppercase tracking-widest mb-4">
            <Award className="w-4 h-4 text-blue-700" />
            20+ Years Operating in Torrevieja, La Mata &amp; Costa Blanca
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Changing How You Think About <br className="hidden sm:inline" />
            <span className="text-blue-900">Builders</span> &amp; <span className="text-teal-700">Property Care</span>
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-16">
            For over two decades, <strong>HouseForce.biz</strong> has delivered a fully legal, transparent, family-run alternative to traditional general contractors. With direct family oversight on every single job, we treat your home with the care and standards it deserves.
          </p>

          {/* Modern People-First Team Showcase - Quick Intro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-10">
            {/* Paul Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                    alt="Paul Reddy - Founder & Master Contractor"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">Paul Reddy</h3>
                    <p className="text-blue-300 font-bold text-[11px] uppercase tracking-wider">Founder &amp; Master Contractor</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Over 35 years in the building trades, supervising all reforms in Torrevieja directly.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <a href="mailto:paul@houseforce.biz" className="text-blue-900 font-bold hover:underline">paul@houseforce.biz</a>
              </div>
            </div>

            {/* Paige Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                    alt="Paige Reddy - Keyholding Lead"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">Paige Reddy</h3>
                    <p className="text-teal-300 font-bold text-[11px] uppercase tracking-wider">Property Care Manager</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Managing keyholding custody, bi-weekly checks, and turnover cleaning for expat homes.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <a href="mailto:paige@houseforce.biz" className="text-teal-900 font-bold hover:underline">paige@houseforce.biz</a>
              </div>
            </div>

            {/* Skippy Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                    alt="Gabriel Skippy - Operations Manager"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">Gabriel &quot;Skippy&quot;</h3>
                    <p className="text-slate-300 font-bold text-[11px] uppercase tracking-wider">Operations &amp; Local Liaison</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Bilingual liaison coordinating site operations, suppliers, and town hall permits.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <span className="text-slate-900 font-bold">English &amp; Spanish</span>
              </div>
            </div>

            {/* Jake Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" 
                    alt="Jake Reddy - Head of Digital Systems"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">Jake Reddy</h3>
                    <p className="text-indigo-300 font-bold text-[11px] uppercase tracking-wider">Digital Systems &amp; Web</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Maintaining website infrastructure, quote forms, and owner digital communications.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <span className="text-indigo-900 font-bold">Web &amp; Systems</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full text-sm transition-colors shadow-md"
            >
              <span>Learn Our 20-Year Story &amp; Working Standards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two Core Family Services */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Two Core Services, One Family Team
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
              Choose the service tailored to your property needs—or combine both for total property peace of mind in Torrevieja.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Construction & Reforming Card */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-950 text-white rounded-xl shadow-sm">
                      <Hammer className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-blue-900 text-xs font-bold uppercase tracking-wider">Led by Paul &amp; Skippy</span>
                      <h3 className="text-2xl font-extrabold text-slate-900">Construction &amp; Reforming</h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                    Torrevieja &amp; Region
                  </span>
                </div>

                <p className="text-slate-600 mb-6 font-light leading-relaxed">
                  Specialists in Costa Blanca property reforms—from full villa modernisations and custom kitchen fittings to bathroom rewires and municipal planning.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Full Villa Modernisations & Coastal Extensions",
                    "Custom Kitchens, Bathrooms & Moisture-Resistant Tiling",
                    "Certified Plumbing, Electrical Rewires & Structural Works",
                    "Itemized, Guaranteed Quotes with Zero Hidden Fees"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/services/construction"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-blue-800 transition-colors group"
                >
                  <span>Explore Construction &amp; Reform Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Keyholding & Property Care Card */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] hover:border-teal-200 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-900 text-white rounded-xl shadow-sm">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-teal-800 text-xs font-bold uppercase tracking-wider">Managed by Paige</span>
                      <h3 className="text-2xl font-extrabold text-slate-900">Keyholding &amp; Property Care</h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                    Torrevieja &amp; Region
                  </span>
                </div>

                <p className="text-slate-600 mb-6 font-light leading-relaxed">
                  Protecting your overseas home while away with secure key storage, summer pipe flushes, storm checks, changeover cleans, and emergency response.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Secure Key Storage & 24/7 Local Emergency Contact",
                    "Routine Property Inspections, Plumbing Flushes & Security Checks",
                    "Spotless Holiday Changeover & Deep Cleaning Services",
                    "Personal Guest Meet & Greet Handovers"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/services/keyholding"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-950 hover:text-teal-800 transition-colors group"
                >
                  <span>Explore Keyholding &amp; Cleaning Plans</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HouseForce - Grounded Family Standards */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Our Principles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Why Homeowners Trust HouseForce
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
              Built on integrity, transparency, and two decades of satisfied clients in Torrevieja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Family Accountability</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                No middleman or unvetted casual workers. Paul, Paige, and Skippy handle your property directly.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Legal &amp; Guaranteed</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Fully registered Spanish business. Every reform comes with transparent contracts and full warranty.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bilingual Support (🇬🇧 &amp; 🇪🇸)</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Clear communication with expat owners while coordinating seamlessly with local Spanish authorities.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Quality First Standard</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                We never cut corners on materials, craftsmanship, or cleaning standards. Period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Process */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2 block">How We Work</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Getting Started with HouseForce
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/90 rounded-2xl p-8 border border-slate-700/80 relative">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Step 01</span>
              <h3 className="text-xl font-bold mb-2">Initial Contact &amp; Advice</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Send us a message or call. We listen to your reform ideas or keyholding requirements in detail.
              </p>
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-8 border border-slate-700/80 relative">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2 block">Step 02</span>
              <h3 className="text-xl font-bold mb-2">Clear Scope &amp; Proposal</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                For reforms: Paul provides a detailed itemized quote. For keyholding: Paige tailors a property care package.
              </p>
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-8 border border-slate-700/80 relative">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 block">Step 03</span>
              <h3 className="text-xl font-bold mb-2">Peace of Mind Delivery</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Relax knowing your project or key security is in trusted, experienced family hands with regular updates.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all hover:scale-105 text-base"
            >
              Start Your Consultation <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Trusted by Torrevieja Homeowners
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto font-light">
              See what property owners say about our reform work and property care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex text-amber-400 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-base italic mb-6 leading-relaxed">
                &quot;Paul and his team completely transformed our villa in Torrevieja. His attention to detail and honest advice saved us thousands. You will never find a better builder in Spain!&quot;
              </p>
              <div className="font-bold text-slate-900">— Mark &amp; Sarah T., Villa Owners in Punta Prima</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex text-amber-400 gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-base italic mb-6 leading-relaxed">
                &quot;Paige has been looking after our keyholding and cleaning for 3 years now. Arriving in Spain to a spotless home with everything checked gives us complete peace of mind.&quot;
              </p>
              <div className="font-bold text-slate-900">— David L., Holiday Home Owner in La Mata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-teal-300 font-bold text-xs uppercase tracking-widest inline-block mb-4 backdrop-blur-md">
            Torrevieja &amp; Costa Blanca Property Services
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Ready to Discuss Your Reform or Keyholding Needs?
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Get in touch with Paul or Paige today for a friendly, no-obligation conversation about how we can help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact?dept=construction"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all hover:scale-105 text-base"
            >
              <Hammer className="w-5 h-5" /> Talk to Paul (Construction)
            </Link>
            <Link
              href="/contact?dept=keyholding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all hover:scale-105 text-base"
            >
              <Key className="w-5 h-5" /> Talk to Paige (Keyholding)
            </Link>
          </div>

          <div className="mt-12 text-slate-400 text-sm flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-slate-800">
            <span>Direct Email: <a href="mailto:paul@houseforce.biz" className="text-white underline">paul@houseforce.biz</a></span>
            <span className="hidden sm:inline">•</span>
            <span>Keyholding Email: <a href="mailto:paige@houseforce.biz" className="text-white underline">paige@houseforce.biz</a></span>
          </div>
        </div>
      </section>
    </div>
  );
}

