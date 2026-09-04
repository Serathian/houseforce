"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from 'next-view-transitions';
import { keyItems } from '@/data/services';

export default function KeyholdingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);

  useEffect(() => {
    const handleNavHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'construction') {
        setIsNavHovered(true);
      } else {
        setIsNavHovered(false);
      }
    };
    window.addEventListener('nav-hover-sliver', handleNavHover);
    return () => window.removeEventListener('nav-hover-sliver', handleNavHover);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let animationId: number;
    let isPaused = false;
    let exactScroll = 0;

    const scroll = () => {
      if (!isPaused && el) {
        exactScroll += 0.35;
        
        const firstChild = el.children[0]?.children[0] as HTMLElement;
        const duplicateStart = el.children[0]?.children[keyItems.length] as HTMLElement;
        
        if (firstChild && duplicateStart) {
          const jumpPoint = duplicateStart.offsetLeft - firstChild.offsetLeft;
          if (jumpPoint > 0 && exactScroll >= jumpPoint) {
            exactScroll -= jumpPoint;
          } else if (exactScroll < 0) {
            exactScroll += jumpPoint;
          }
        }
        
        el.scrollLeft = exactScroll;
      }
      animationId = requestAnimationFrame(scroll);
    };

    const timerId = setTimeout(() => {
      if (el) exactScroll = el.scrollLeft;
      animationId = requestAnimationFrame(scroll);
    }, 100);

    const pause = () => { isPaused = true; };
    const resume = () => { 
      isPaused = false; 
      if (el) exactScroll = el.scrollLeft;
    };
    
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    
    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animationId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

  const benefits = [
    {
      title: 'Worry-Free Holiday Home Care',
      categorySlug: 'keyholding',
      blogCta: 'View Real Keyholding Checkouts & Photos',
      desc: 'Leaving your property empty can be stressful. We ensure your holiday home or rental in Torrevieja and Orihuela Costa is secure, well-maintained, and pristine.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      badge: 'Managed by Paige Reddy',
      tags: ['Bi-Weekly Inspections', 'WhatsApp Photo Updates', 'Weather & Storm Checks']
    },
    {
      title: 'Meet & Greet Handovers',
      categorySlug: 'keyholding',
      blogCta: 'Read Guest Handover Notes',
      desc: 'We provide a warm Spanish welcome for you, your guests, or rental clients—handing over keys, explaining air con & boilers, and offering local Torrevieja advice.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      badge: 'Personal Welcome',
      tags: ['Key Handovers', 'Guest Orientation', '24/7 Local Contact']
    },
    {
      title: 'Deep Cleaning & Changeovers',
      categorySlug: 'cleaning',
      blogCta: 'See Property Cleaning Photos',
      desc: 'Immaculate cleaning services between guest stays or before your arrival. Fresh linens, spotless kitchens, terrace jet washing, and thorough ventilation.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      badge: 'High Standard Turnovers',
      tags: ['Linen & Laundry', 'Patio & Terrace Wash', 'Pre-Arrival Prep']
    },
    {
      title: 'Emergency Callouts & Upkeep',
      categorySlug: 'maintenance',
      blogCta: 'Read Maintenance Case Studies',
      desc: 'Regular property inspections, summer plumbing flushes, leak detection, and rapid local callouts for alarm triggers or unexpected maintenance.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      badge: 'Paul & Skippy Backup',
      tags: ['Summer Water Flushes', 'Emergency Key Release', 'Repair Coordination']
    }
  ];

  const handleScrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Perfect Replica Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-slate-50 flex items-center justify-center">
        
        {/* Absolute Background Swipe Layers matching Home Page EXACTLY */}
        <div className="absolute inset-0 w-full h-[85vh] z-0 overflow-hidden pointer-events-none">
          {/* Construction peeking sliver! */}
          <div className={`hidden md:block absolute left-0 top-0 h-full ${isNavHovered ? 'w-[260px]' : 'w-[48px]'} hover:w-[260px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer group/sliver z-50 pointer-events-auto overflow-hidden`}>
            <Link href="/services/construction" className="block w-full h-full relative">
              <div className="absolute left-0 top-0 w-[100vw] h-full bg-blue-900 opacity-95"></div>
              <div className="absolute left-0 top-0 w-[100vw] h-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
              
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 justify-end w-[260px] ${isNavHovered ? 'opacity-100' : 'opacity-70'} group-hover/sliver:opacity-100 transition-opacity duration-300`}>
                 <span className="mr-4 font-bold text-white text-lg tracking-wide text-center max-w-full drop-shadow-md">Explore Construction</span>
                 <svg className={`w-6 h-6 text-white shrink-0 ${isNavHovered ? 'translate-x-1' : ''} group-hover/sliver:translate-x-1 transition-transform duration-300 drop-shadow-md`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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
              <span className="text-amber-300 font-extrabold drop-shadow">Total peace of mind</span> for your Spanish property with meticulous cleaning and security.
            </p>
            {/* Scroll Down CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pointer-events-auto mt-4"
            >
              <a 
                href="#services"
                onClick={handleScrollToServices}
                className="inline-flex flex-col items-center text-white/80 hover:text-white transition-colors group cursor-pointer"
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
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* The 8 Icons - Now gracefully arranged in a sleek horizontal menu bar below the hero */}
        <div ref={scrollRef} className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative min-w-max px-6 py-3 md:py-4 flex flex-row justify-start items-start gap-6 md:gap-10 lg:gap-12 mx-auto">
            {[...keyItems, ...keyItems, ...keyItems].map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center flex-shrink-0 w-[84px] md:w-[110px] group cursor-default select-none pointer-events-auto"
              >
                <div 
                  className="w-12 h-12 bg-teal-800 rounded-full shrink-0 shadow-lg border-2 border-white flex items-center justify-center text-teal-100 transition-all duration-300"
                  style={{ viewTransitionName: i < keyItems.length ? `circle-key-${i}` : 'none' }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-white mt-2.5 uppercase tracking-wider opacity-85 transition-colors text-center max-w-full drop-shadow-md leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-teal-800 font-bold text-xs uppercase tracking-widest block mb-2">Property Care in Torrevieja</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Keyholding &amp; Property Care Services</h2>
          <p className="text-slate-600 text-lg leading-relaxed font-light">
            Managed directly by Paige Reddy, with 30+ years of building and maintenance support from Paul &amp; Skippy so your home is <span className="text-amber-600 font-semibold">always in safe hands</span>.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1st Feature Card - Grounded & Family-Focused */}
          <div className="md:col-span-2 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-teal-800/80 flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  Managed by Paige Reddy
                </span>
                <span className="text-xs font-medium text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Torrevieja &amp; Orihuela Costa
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-white">
                Worry-Free Holiday Home Care
              </h3>
              <p className="text-teal-100 text-base sm:text-lg leading-relaxed font-light max-w-3xl mb-8">
                Leaving your Spanish home empty can be daunting. Paige conducts bi-weekly inspections, sends WhatsApp photo updates after storms, and makes sure your property is fresh, ventilated, and secure. If an emergency or leak occurs, Paul and Skippy are right on hand to take care of it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-teal-100 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>Bi-Weekly Security &amp; Damp Inspections</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>WhatsApp Photo &amp; Video Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>Post-Storm &amp; Heavy Rain Checkouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-amber-200 font-semibold">Full Building &amp; Plumbing Backup by Paul &amp; Skippy</span>
                </div>
              </div>

              <Link 
                href={`/blog?category=${benefits[0].categorySlug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-200 hover:text-white pt-4 border-t border-white/15"
              >
                <span>{benefits[0].blogCta}</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Remaining Services Cards */}
          {benefits.slice(1).map((benefit, idx) => (
            <div key={idx} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] hover:border-teal-300/80 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center group-hover:bg-teal-800 group-hover:text-white transition-colors duration-300 shadow-sm border border-teal-100/60">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                    </svg>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${benefit.title.includes('Emergency') ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-teal-950 bg-teal-50/80 border-teal-200/80'}`}>
                    {benefit.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light text-base mb-6">{benefit.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {benefit.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs bg-slate-100/80 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200/50">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Link 
                href={`/blog?category=${benefit.categorySlug}`}
                className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-950 hover:text-teal-700"
              >
                <span>{benefit.blogCta}</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Property Care Advice & Transparency Banner */}
        <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-teal-800 font-bold text-xs uppercase tracking-widest block mb-2">Authored by Paige Reddy</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Property Care Guides &amp; Updates</h3>
            <p className="text-slate-600 text-base font-light leading-relaxed">
              Paige publishes regular property care advice, storm readiness checklists, and keyholding updates so homeowners can stay informed on best practices for Spanish properties.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 inline-flex items-center gap-2 bg-teal-900 hover:bg-teal-800 text-white font-bold py-3.5 px-6 rounded-full text-sm transition-colors shadow-sm"
          >
            <span>Explore Property Care Guides</span> &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
