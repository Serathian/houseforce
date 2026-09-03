"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Hammer, Wrench, HardHat, Paintbrush, Ruler, Pickaxe, Settings, Brush,
  Key, Lock, House, Umbrella, Sun, Droplets, SprayCan, Sparkles
} from 'lucide-react';

export default function SpinningWheel() {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '', side: 'left' });
  const totalIcons = 8;
  const radius = 110;

  const constItems = [
    { icon: <Hammer />, label: "General Building", href: "/services/construction" },
    { icon: <Wrench />, label: "Plumbing & Electrics", href: "/services/construction" },
    { icon: <HardHat />, label: "Project Management", href: "/services/construction" },
    { icon: <Paintbrush />, label: "Painting & Decorating", href: "/services/construction" },
    { icon: <Ruler />, label: "Planning", href: "/services/construction" },
    { icon: <Pickaxe />, label: "Renovations", href: "/services/construction" },
    { icon: <Settings />, label: "Custom Fitting", href: "/services/construction" },
    { icon: <Brush />, label: "Plastering", href: "/services/construction" }
  ];

  const keyItems = [
    { icon: <Key />, label: "Meet & Greet", href: "/services/keyholding" },
    { icon: <SprayCan />, label: "Deep Cleaning", href: "/services/keyholding" },
    { icon: <House />, label: "Property Inspections", href: "/services/keyholding" },
    { icon: <Umbrella />, label: "Holiday Home Care", href: "/services/keyholding" },
    { icon: <Droplets />, label: "Plumbing Flushes", href: "/services/keyholding" },
    { icon: <Lock />, label: "Security Checks", href: "/services/keyholding" },
    { icon: <Sparkles />, label: "Changeover Cleans", href: "/services/keyholding" },
    { icon: <Sun />, label: "Worry-Free Vacations", href: "/services/keyholding" }
  ];

  const playState = isHovered ? 'paused' : 'running';

  const handleMouseEnter = (e: React.MouseEvent, text: string, side: 'left' | 'right') => {
    setIsHovered(true);
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text, side });
  };

  const handleMouseMove = (e: React.MouseEvent, text: string, side: 'left' | 'right') => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text, side });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-40 hidden md:block pointer-events-none">
        
        {/* Center Logo/Pivot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-2xl z-50 flex items-center justify-center border-4 border-slate-100 pointer-events-auto">
          <span className="font-extrabold text-xl text-blue-900 tracking-tighter">H<span className="text-teal-600">F</span></span>
        </div>

        {/* Left Half (Construction) */}
        <div className="absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }}>
          <div 
            className="w-full h-full rounded-full border border-blue-400/30 animate-[spin_30s_linear_infinite]"
            style={{ animationPlayState: playState }}
          >
            {constItems.map((item, i) => {
              const angle = (i * 360) / totalIcons;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div 
                  key={i} 
                  className="absolute left-1/2 top-1/2 w-12 h-12 -ml-6 -mt-6 pointer-events-auto group/icon"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label, 'left')}
                  onMouseMove={(e) => handleMouseMove(e, item.label, 'left')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href={item.href} className="block w-full h-full">
                    <div 
                      className="w-full h-full bg-blue-900 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-blue-100 transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:bg-blue-600 group-hover/icon:text-white group-hover/icon:border-blue-200"
                    >
                      <div className="animate-[spin_30s_linear_infinite_reverse] w-6 h-6 flex items-center justify-center" style={{ animationPlayState: playState }}>
                        {item.icon}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Half (Keyholding) */}
        <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 50%)' }}>
          <div 
            className="w-full h-full rounded-full border border-teal-400/30 animate-[spin_30s_linear_infinite]"
            style={{ animationPlayState: playState }}
          >
            {keyItems.map((item, i) => {
              const angle = (i * 360) / totalIcons;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div 
                  key={i} 
                  className="absolute left-1/2 top-1/2 w-12 h-12 -ml-6 -mt-6 pointer-events-auto group/icon"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label, 'right')}
                  onMouseMove={(e) => handleMouseMove(e, item.label, 'right')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href={item.href} className="block w-full h-full">
                    <div 
                      className="w-full h-full bg-teal-800 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-teal-100 transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:bg-teal-500 group-hover/icon:text-white group-hover/icon:border-teal-200"
                    >
                      <div className="animate-[spin_30s_linear_infinite_reverse] w-6 h-6 flex items-center justify-center" style={{ animationPlayState: playState }}>
                        {item.icon}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Mouse-following Tooltip Portal */}
      {tooltip.visible && (
        <div 
          className={`fixed z-[100] px-5 py-2.5 text-sm font-extrabold text-white rounded-xl shadow-2xl pointer-events-none tracking-wide ${tooltip.side === 'left' ? 'bg-blue-900 border border-blue-700' : 'bg-teal-800 border border-teal-600'}`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: tooltip.side === 'left' ? 'translate(calc(-100% - 24px), -50%)' : 'translate(24px, -50%)'
          }}
        >
          {tooltip.text}
          {/* Subtle directional pointer/caret */}
          <div className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${tooltip.side === 'left' ? 'border-l-blue-900 -right-2' : 'border-r-teal-800 -left-2'}`}></div>
        </div>
      )}
    </>
  );
}
