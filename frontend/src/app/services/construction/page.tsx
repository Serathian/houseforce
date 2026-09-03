"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from 'next-view-transitions';
import { constItems } from '@/data/services';

export default function ConstructionPage() {
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
        
        const duplicateStart = el.children[0].children[constItems.length] as HTMLElement;
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

  const services = [
    {
      title: 'Renovations & Remodeling',
      desc: 'From single room updates to full villa renovations. We modernize your property while respecting its original character.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      title: 'Kitchen Fitting',
      desc: 'Complete kitchen overhauls including custom cabinetry, worktops, tiling, and appliance installation.',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
    },
    {
      title: 'Bathroom Installations',
      desc: 'Transform your bathroom with modern suites, walk-in showers, flawless tiling, and waterproofing.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Plumbing & Electrics',
      desc: 'Certified and safe electrical rewiring, lighting installations, and comprehensive plumbing services.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      title: 'Planning & Project Management',
      desc: 'We take the stress out of building in Spain by managing planning permissions, architects, and site coordination.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    },
    {
      title: 'General Building Work',
      desc: 'Extensions, structural modifications, plastering, and exterior finishing tailored to your exact specifications.',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Perfect Replica Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-slate-50 flex items-center justify-center">
        
        {/* Absolute Background Layers matching Home Page EXACTLY */}
        <div className="absolute inset-0 w-full h-[85vh] z-0 pointer-events-none">
          {/* Construction Background takes the full screen, the sliver sits on top */}
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-full bg-blue-900 opacity-95"></div>
            <div className="absolute left-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          </div>

          {/* Keyholding peeking sliver! */}
          <div className="hidden md:block absolute right-0 top-0 h-full w-[48px] hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer group/sliver z-50 pointer-events-auto overflow-hidden">
            <Link href="/services/keyholding" className="block w-full h-full relative">
              <div className="absolute right-0 top-0 w-[100vw] h-full bg-teal-800 opacity-95"></div>
              <div className="absolute right-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center pl-3 w-[260px] opacity-70 group-hover/sliver:opacity-100 transition-opacity duration-300">
                 <svg className="w-6 h-6 text-white shrink-0 group-hover/sliver:-translate-x-1 transition-transform duration-300 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 <span className="ml-4 font-bold text-white text-lg tracking-wide text-center max-w-full drop-shadow-md">Explore Keyholding</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Content Layout */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center h-full pointer-events-none max-w-[100vw]">
          <motion.div 
            className="flex flex-col items-center p-12 text-center"
            style={{ viewTransitionName: 'hero-text-const' }}
          >
            <span className="text-blue-300 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 md:mb-4">Led by Paul Reddy</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 text-white tracking-tight drop-shadow-md">Construction<br/>& Reforming</h2>
            <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-sm font-light drop-shadow">
              30+ years of expertise. &quot;Quality First&quot; property renovations in Torrevieja.
            </p>
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
            {[...constItems, ...constItems].map((item, i) => (
              <a 
                href="#services"
                key={i} 
                className={`flex flex-row items-center gap-3 pr-2 flex-shrink-0 group cursor-pointer pointer-events-auto ${i >= constItems.length ? 'md:hidden' : ''}`}
              >
                <span className="text-[11px] md:text-xs font-bold text-white uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-colors whitespace-nowrap drop-shadow-md">{item.label}</span>
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 rounded-full shrink-0 shadow-lg border-2 border-white flex items-center justify-center text-blue-100 group-hover:bg-blue-500 group-hover:scale-110 group-hover:text-white transition-all duration-300"
                  style={{ viewTransitionName: i >= constItems.length ? 'none' : `circle-const-${i}` }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Comprehensive Building Services</h2>
          <p className="text-slate-600 text-lg leading-relaxed font-light">
            We handle everything from the initial planning stages to the final coat of paint. With Paul personally overseeing every site alongside Skippy, you can be assured that no detail is overlooked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
