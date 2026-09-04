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
            20+ Years Operating in Torrevieja &amp; Costa Blanca
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Changing How You Think About <br className="hidden sm:inline" />
            <span className="text-blue-900">Builders</span> &amp; <span className="text-teal-700">Property Care</span>
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-16">
            For over two decades, <strong>HouseForce.biz</strong> has delivered a fully legal, transparent, family-run alternative to traditional general contractors. With direct family oversight on every single job, we treat your home with the care and standards it deserves.
          </p>

          {/* Family Team Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Paul Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-extrabold text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    PR
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                    🇬🇧 35+ Yrs Trade Exp.
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Paul Reddy</h3>
                <p className="text-blue-800 font-bold text-sm uppercase tracking-wide mb-4">Founder &amp; Master Contractor</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                  Directly managing all major structural reforms, villa extensions, kitchens, bathrooms, and technical building works. Uncompromising &quot;Quality First&quot; standards.
                </p>
              </div>
              <Link 
                href="/contact?dept=construction"
                className="inline-flex items-center justify-between w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-5 rounded-2xl transition-colors text-sm shadow-md"
              >
                <span>Consult with Paul</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Paige Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white font-extrabold text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    PA
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-teal-100 text-teal-900 rounded-full">
                    🇬🇧 🇪🇸 Keyholding Lead
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Paige Reddy</h3>
                <p className="text-teal-800 font-bold text-sm uppercase tracking-wide mb-4">Property Care &amp; Keyholding Manager</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                  Heading up our dedicated keyholding, changeover cleans, emergency callouts, and property security inspections with complete honesty and reliability.
                </p>
              </div>
              <Link 
                href="/contact?dept=keyholding"
                className="inline-flex items-center justify-between w-full bg-teal-800 hover:bg-teal-700 text-white font-bold py-3 px-5 rounded-2xl transition-colors text-sm shadow-md"
              >
                <span>Connect with Paige</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Skippy Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white font-extrabold text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    SK
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-200 text-slate-800 rounded-full">
                    🇬🇧 🇪🇸 20+ Yrs Local
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Gabriel &quot;Skippy&quot;</h3>
                <p className="text-slate-700 font-bold text-sm uppercase tracking-wide mb-4">Operations &amp; Local Liaison</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                  Bilingual client liaison and site operations coordinator. Ensuring smooth communication between homeowners, suppliers, and municipal permissions.
                </p>
              </div>
              <Link 
                href="/about"
                className="inline-flex items-center justify-between w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-2xl transition-colors text-sm shadow-md"
              >
                <span>Meet the Full Team</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Core Pillars & Direct CTAs */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Two Specialized Divisions, One Dedicated Family
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
              Choose the service tailored to your property needs—or combine both for total property peace of mind in Torrevieja.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Construction & Reforming Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-md">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-blue-900 text-xs font-bold uppercase tracking-wider">Division 01</span>
                    <h3 className="text-2xl font-bold text-slate-900">Construction &amp; Reforming</h3>
                  </div>
                </div>

                <p className="text-slate-600 mb-6 font-light leading-relaxed">
                  From complete villa refurbishments and modern kitchen installations to bathroom rewires, plastering, and structural alterations.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Full Property Modernisation & Villa Extensions",
                    "Custom Kitchens, Bathrooms & Tiling",
                    "Licensed Plumbing, Electrical & Structural Works",
                    "Itemized, Guaranteed Quotes with Zero Hidden Fees"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact?dept=construction"
                  className="flex-1 inline-flex justify-center items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md text-sm hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" /> Get Free Reform Quote
                </Link>
                <Link
                  href="/services/construction"
                  className="inline-flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold py-3.5 px-6 rounded-2xl transition-colors text-sm"
                >
                  Explore Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Keyholding & Property Care Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-teal-800 text-white rounded-2xl shadow-md">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-teal-800 text-xs font-bold uppercase tracking-wider">Division 02</span>
                    <h3 className="text-2xl font-bold text-slate-900">Keyholding &amp; Property Care</h3>
                  </div>
                </div>

                <p className="text-slate-600 mb-6 font-light leading-relaxed">
                  Protect your investment while away with meticulous key security, regular property inspections, deep changeover cleans, and emergency assistance.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Secure Key Storage & 24/7 Local Emergency Contact",
                    "Routine Property Inspections, Flushing & Security Checks",
                    "Spotless Holiday Changeover & Deep Cleaning Services",
                    "Personal Guest Meet & Greet Handovers"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact?dept=keyholding"
                  className="flex-1 inline-flex justify-center items-center gap-2 bg-teal-800 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md text-sm hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" /> Book Keyholding Plan
                </Link>
                <Link
                  href="/services/keyholding"
                  className="inline-flex justify-center items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold py-3.5 px-6 rounded-2xl transition-colors text-sm"
                >
                  Explore Services <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HouseForce - Quality & Trust Pillars */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Our Uncompromising Standards</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
              Why Homeowners Trust HouseForce
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
              Built on integrity, transparency, and two decades of satisfied clients in Torrevieja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Family Accountability</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                No middleman or unvetted casual workers. Paul, Paige, and Skippy handle your property directly.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Legal &amp; Guaranteed</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Fully registered Spanish business. Every reform comes with transparent contracts and full warranty.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bilingual Support (🇬🇧 &amp; 🇪🇸)</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                Clear communication with expat owners while coordinating seamlessly with local Spanish authorities.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-teal-300 transition-colors">
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

      {/* Interactive Service Process Flow */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-teal-950/40 opacity-80 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2 block">Simple 3-Step Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              How Working With Us Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/60 relative">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full font-extrabold flex items-center justify-center mb-6 shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Initial Contact &amp; Consultation</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Send us a message or call. We listen to your reform ideas or keyholding requirements in detail.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/60 relative">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full font-extrabold flex items-center justify-center mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Clear Scope &amp; Proposal</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                For reforms: Paul provides a detailed itemized quote. For keyholding: Paige tailors a property care package.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/60 relative">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full font-extrabold flex items-center justify-center mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Peace of Mind Delivery</h3>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Relax knowing your project or key security is in trusted, experienced family hands with regular updates.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all hover:scale-105 text-base"
            >
              Start Your Consultation <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Trust & Reviews */}
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
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

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
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

      {/* High Impact Bottom CTA Banner */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all hover:scale-105 text-base"
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

