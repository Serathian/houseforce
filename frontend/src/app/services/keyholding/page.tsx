"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from 'next-view-transitions';
import { keyItems } from '@/data/services';

export default function KeyholdingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    if (window.innerWidth >= 768) return;
    
    let animationId: number;
    let isPaused = false;
    let exactScroll = 0;
    const scroll = () => {
      if (!isPaused && el) {
        exactScroll += 0.15;
        
        const duplicateStart = el.children[0].children[keyItems.length] as HTMLElement;
        if (duplicateStart) {
          const jumpPoint = duplicateStart.offsetLeft - (el.children[0].children[0] as HTMLElement).offsetLeft;
          if (exactScroll >= jumpPoint) {
            exactScroll -= jumpPoint;
          }
        }
        
        el.scrollLeft = exactScroll;
      }
      animationId = requestAnimationFrame(scroll);
    };

    setTimeout(() => {
      if (el) exactScroll = el.scrollLeft;
      animationId = requestAnimationFrame(scroll);
    }, 1000);

    const pause = () => { isPaused = true; };
    const resume = () => { 
      isPaused = false; 
      if (el) exactScroll = el.scrollLeft;
    };
    
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    
    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  const benefits = [
    {
      title: 'Worry-Free Holiday Homes',
      desc: 'Leaving your property empty can be stressful. We ensure your holiday home or rental is secure, well-maintained, and pristine.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Meet & Greet',
      desc: 'We provide a warm welcome for you or your rental guests, handing over keys and offering local advice to ensure a perfect stay.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      title: 'Deep Cleaning & Changeovers',
      desc: 'Immaculate cleaning services between guest stays or before your arrival. Fresh linens, spotless rooms, and thorough ventilation.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    },
    {
      title: 'Effortless Upkeep',
      desc: 'Regular property inspections, plumbing flushes, and storm checks to catch and resolve issues before they become disasters.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Perfect Replica Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-slate-50 flex items-center justify-center">
        
        {/* Absolute Background Swipe Layers matching Home Page EXACTLY */}
        <div className="absolute inset-0 w-full h-[85vh] z-0 overflow-hidden pointer-events-none">
          {/* Construction peeking sliver! */}
          <div className="hidden md:block absolute left-0 top-0 h-full w-[48px] hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer group/sliver z-50 pointer-events-auto overflow-hidden">
            <Link href="/services/construction" className="block w-full h-full relative">
              <div className="absolute left-0 top-0 w-[100vw] h-full bg-blue-900 opacity-95"></div>
              <div className="absolute left-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 justify-end w-[260px] opacity-70 group-hover/sliver:opacity-100 transition-opacity duration-300">
                 <span className="mr-4 font-bold text-white text-lg tracking-wide text-center max-w-full drop-shadow-md">Explore Construction</span>
                 <svg className="w-6 h-6 text-white shrink-0 group-hover/sliver:translate-x-1 transition-transform duration-300 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
            </Link>
          </div>

          {/* Keyholding Background takes the full screen, the sliver sits on top! */}
          <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
            <div className="absolute right-0 top-0 w-full h-full bg-teal-800 opacity-95"></div>
            <div className="absolute right-0 top-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center h-full pointer-events-none max-w-[100vw]">
          <motion.div 
            className="flex flex-col items-center p-12 text-center"
            style={{ viewTransitionName: 'hero-text-key' }}
          >
            <span className="text-teal-200 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4">Managed by Paige</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-white tracking-tight drop-shadow-md">Keyholding<br/>& Cleaning</h2>
            <p className="text-base md:text-lg text-teal-50 mb-6 md:mb-8 max-w-sm font-light drop-shadow">
              Total peace of mind for your Spanish property with meticulous cleaning and security.
            </p>
            {/* Scroll Down CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pointer-events-auto mt-4"
            >
              <Link 
                href="#services"
                className="inline-flex flex-col items-center text-white/80 hover:text-white transition-colors group"
              >
                <span className="text-xs font-bold tracking-widest uppercase mb-3 drop-shadow-md">Scroll to explore</span>
                {/* Desktop Mouse Scroll */}
                <div className="hidden md:flex justify-center items-center h-12">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <span className="material-symbols-outlined text-white/80 group-hover:text-white text-4xl transition-colors">mouse</span>
                  </motion.div>
                </div>
                {/* Mobile Finger Swipe */}
                <div className="md:hidden flex justify-center items-center h-12 overflow-visible">
                  <motion.div
                    animate={{ y: [10, -10, -10], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  >
                    <span className="material-symbols-outlined text-white/80 group-hover:text-white text-4xl transition-colors">swipe_up</span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* The 8 Icons - Now gracefully arranged in a sleek horizontal menu bar below the hero */}
        <div ref={scrollRef} className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative min-w-max px-6 py-3 md:py-4 flex flex-row justify-start md:justify-center items-center gap-6 md:gap-10 lg:gap-12 mx-auto">
            {[...keyItems, ...keyItems].map((item, i) => (
              <a 
                href="#services"
                key={i} 
                className={`flex flex-col items-center flex-shrink-0 w-[84px] md:w-[110px] group cursor-pointer pointer-events-auto ${i >= keyItems.length ? 'md:hidden' : ''}`}
              >
                <div 
                  className="w-12 h-12 bg-teal-800 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-teal-100 group-hover:bg-teal-500 group-hover:scale-110 group-hover:text-white transition-all duration-300"
                  style={{ viewTransitionName: i >= keyItems.length ? 'none' : `circle-key-${i}` }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-white mt-3 uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-colors text-center max-w-full drop-shadow-md">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* The HouseForce Advantage */}
        <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-10 md:p-16 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-6 md:mb-0 shadow-inner">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              </div>
            </div>
            <div className="md:w-2/3">
              <span className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-2 block">The HouseForce Advantage</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Backed by Renovation Experts</h2>
              <p className="text-slate-700 text-lg leading-relaxed font-light mb-4">
                What sets our keyholding service apart is the extensive renovation and upkeep experience our team brings. Managed by Paige, but backed by Paul and Skippy's 30+ years of building expertise, we bring true peace of mind to property management.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed font-light">
                If a pipe leaks, a storm causes damage, or a small inconvenience arises, you aren't just relying on a cleaner with a set of keys. You have a full construction and maintenance team ready to resolve the issue quickly and professionally.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light text-lg">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
