"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { constItems, keyItems } from '@/data/services';

interface Props {
  expandedSide: 'left' | 'right' | null;
  setExpandedSide: (side: 'left' | 'right' | null) => void;
  swipeTransition: any;
  clipStrLeft: string;
  clipStrRight: string;
  isMobile: boolean;
}

export default function SpinningWheel({ expandedSide, setExpandedSide, swipeTransition, clipStrLeft, clipStrRight, isMobile }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '', side: 'left' });
  const totalIcons = 8;
  const radius = 110;

  const rotateMV = useMotionValue(0);
  const counterRotateMV = useMotionValue(0);

  useEffect(() => {
    let animationFrameId: number;
    let currentRotation = rotateMV.get();

    const renderLoop = () => {
      if (!isHovered && expandedSide === null) {
        currentRotation = (currentRotation + 0.25) % 360;
        rotateMV.set(currentRotation);
        counterRotateMV.set(-currentRotation);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, expandedSide, rotateMV, counterRotateMV]);

  const handleMouseEnter = (e: React.MouseEvent, text: string, side: 'left' | 'right') => {
    if (expandedSide) return;
    setIsHovered(true);
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text, side });
  };

  const handleMouseMove = (e: React.MouseEvent, text: string, side: 'left' | 'right') => {
    if (expandedSide) return;
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text, side });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleIconClick = (e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault();
    if (!expandedSide) {
      setExpandedSide(side);
      setTooltip(prev => ({ ...prev, visible: false }));
      setIsHovered(false);

      animate(rotateMV, 0, swipeTransition);
      animate(counterRotateMV, 0, swipeTransition);
    }
  };

  const getExpandedPosition = (index: number, side: 'left' | 'right') => {
    if (isMobile) {
      // 2 columns, 4 rows for a symmetrical ribcage layout
      const col = index % 2;
      const row = Math.floor(index / 2);
      // Center icons tightly to leave maximum width for text on the edges
      const x = col === 0 ? -30 : 30; 
      // Anchor icons safely in their respective halves (Bottom half for Construction, Top half for Keyholding)
      const y = side === 'left' ? 30 + (row * 60) : -210 + (row * 60);
      return { x, y };
    } else {
      const col = index % 2; 
      const row = Math.floor(index / 2); 
      let x = 100 + (col * 280); 
      if (side === 'right') {
         x = -620 + (col * 280);
      }
      const y = -220 + (row * 150); 
      return { x, y };
    }
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full z-50 pointer-events-none overflow-hidden">
        
        {/* Center Logo/Pivot */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-2xl z-50 flex items-center justify-center border-4 border-slate-100 pointer-events-auto"
          initial={false}
          animate={{ scale: expandedSide ? 0 : 1, opacity: expandedSide ? 0 : 1 }}
          transition={swipeTransition}
        >
          <span className="font-extrabold text-xl text-blue-900 tracking-tighter">H<span className="text-teal-600">F</span></span>
        </motion.div>

        {/* Left Half Wrapper (Construction) */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-10"
          initial={false}
          animate={{ clipPath: clipStrLeft }}
          transition={swipeTransition}
        >
          <div className="absolute inset-0 w-full h-full">
            <motion.div 
              className={`absolute left-1/2 top-1/2 w-0 h-0`}
              style={{ rotate: rotateMV }}
            >
            {/* The circular border */}
            <motion.div 
              className="absolute left-0 top-0 rounded-full border border-blue-400/30 -ml-[110px] -mt-[110px]"
              style={{ width: radius*2, height: radius*2 }}
              animate={{ opacity: expandedSide ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />

            {constItems.map((item, i) => {
              const angle = (i * 360) / totalIcons;
              const circleX = radius * Math.cos((angle * Math.PI) / 180);
              const circleY = radius * Math.sin((angle * Math.PI) / 180);
              const isExpanded = expandedSide === 'left';
              const gridPos = getExpandedPosition(i, 'left');
              
              return (
                <motion.div 
                  key={i} 
                  className="absolute w-12 h-12 -ml-6 -mt-6 pointer-events-auto group/icon"
                  initial={false}
                  animate={{ 
                    x: isExpanded ? gridPos.x : circleX, 
                    y: isExpanded ? gridPos.y : circleY,
                    scale: isExpanded ? 0.9 : 1
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isExpanded ? swipeTransition.duration + i * 0.05 : 0 
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label, 'left')}
                  onMouseMove={(e) => handleMouseMove(e, item.label, 'left')}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleIconClick(e, 'left')}
                >
                  <Link href={item.href} onClick={e => !isExpanded && e.preventDefault()} className="block w-full h-full relative">
                    <motion.div 
                      className="w-full h-full bg-blue-900 rounded-full shadow-lg border-2 border-white flex flex-col items-center justify-center text-blue-100 transition-colors duration-300 hover:bg-blue-600 hover:text-white"
                      whileHover={{ scale: isExpanded ? 1.05 : 1.15 }}
                      style={{ viewTransitionName: isExpanded ? `circle-const-${i}` : 'none' }}
                    >
                      <motion.div className="w-5 h-5 flex items-center justify-center" style={{ rotate: counterRotateMV }}>
                        {item.icon}
                      </motion.div>
                    </motion.div>

                    {/* Beside-Icon Text for Expanded State */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ delay: swipeTransition.duration + 0.5 + i * 0.05 }}
                          className={`absolute ${isMobile ? (i % 2 === 0 ? 'w-[100px] top-1/2 -translate-y-1/2 right-[115%] text-right pr-1' : 'w-[100px] top-1/2 -translate-y-1/2 left-[115%] text-left pl-1') : 'w-48 top-1/2 -translate-y-1/2 text-left left-[130%]'}`}
                        >
                          <h3 className={`font-bold text-white drop-shadow-sm ${isMobile ? 'text-[10px] uppercase tracking-wider leading-[1.2] whitespace-normal' : 'text-sm whitespace-nowrap'}`}>{item.label}</h3>
                          <p className={`text-white/80 text-xs mt-0.5 leading-tight drop-shadow-sm ${isMobile ? 'hidden' : 'block'}`}>{item.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
          </div>
        </motion.div>

        {/* Right Half Wrapper (Keyholding) */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-10"
          initial={false}
          animate={{ clipPath: clipStrRight }}
          transition={swipeTransition}
        >
          <div className="absolute inset-0 w-full h-full">
            <motion.div 
              className={`absolute left-1/2 top-1/2 w-0 h-0`}
              style={{ rotate: rotateMV }}
            >
            <motion.div 
              className="absolute left-0 top-0 rounded-full border border-teal-400/30 -ml-[110px] -mt-[110px]"
              style={{ width: radius*2, height: radius*2 }}
              animate={{ opacity: expandedSide ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />

            {keyItems.map((item, i) => {
              const angle = (i * 360) / totalIcons;
              const circleX = radius * Math.cos((angle * Math.PI) / 180);
              const circleY = radius * Math.sin((angle * Math.PI) / 180);
              const isExpanded = expandedSide === 'right';
              const gridPos = getExpandedPosition(i, 'right');

              return (
                <motion.div 
                  key={i} 
                  className="absolute w-12 h-12 -ml-6 -mt-6 pointer-events-auto group/icon"
                  initial={false}
                  animate={{ 
                    x: isExpanded ? gridPos.x : circleX, 
                    y: isExpanded ? gridPos.y : circleY,
                    scale: isExpanded ? 0.9 : 1
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isExpanded ? swipeTransition.duration + i * 0.05 : 0 
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label, 'right')}
                  onMouseMove={(e) => handleMouseMove(e, item.label, 'right')}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleIconClick(e, 'right')}
                >
                  <Link href={item.href} onClick={e => !isExpanded && e.preventDefault()} className="block w-full h-full relative">
                    <motion.div 
                      className="w-full h-full bg-teal-800 rounded-full shadow-xl border-2 border-white flex flex-col items-center justify-center text-teal-100 transition-colors duration-300 hover:bg-teal-500 hover:text-white"
                      whileHover={{ scale: isExpanded ? 1.05 : 1.15 }}
                      style={{ viewTransitionName: isExpanded ? `circle-key-${i}` : 'none' }}
                    >
                      <motion.div className="w-5 h-5 flex items-center justify-center" style={{ rotate: counterRotateMV }}>
                        {item.icon}
                      </motion.div>
                    </motion.div>

                    {/* Beside-Icon Text for Expanded State */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ delay: swipeTransition.duration + 0.5 + i * 0.05 }}
                          className={`absolute ${isMobile ? (i % 2 === 0 ? 'w-[100px] top-1/2 -translate-y-1/2 right-[115%] text-right pr-1' : 'w-[100px] top-1/2 -translate-y-1/2 left-[115%] text-left pl-1') : 'w-48 top-1/2 -translate-y-1/2 text-left left-[130%]'}`}
                        >
                          <h3 className={`font-bold text-white drop-shadow-sm ${isMobile ? 'text-[10px] uppercase tracking-wider leading-[1.2] whitespace-normal' : 'text-sm whitespace-nowrap'}`}>{item.label}</h3>
                          <p className={`text-white/80 text-xs mt-0.5 leading-tight drop-shadow-sm ${isMobile ? 'hidden' : 'block'}`}>{item.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Mouse-following Tooltip Portal */}
      {!expandedSide && tooltip.visible && (
        <div 
          className={`fixed z-[100] px-5 py-2.5 text-sm font-extrabold text-white rounded-xl shadow-2xl pointer-events-none tracking-wide ${tooltip.side === 'left' ? 'bg-blue-900 border border-blue-700' : 'bg-teal-800 border border-teal-600'}`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: tooltip.side === 'left' ? 'translate(calc(-100% - 24px), -50%)' : 'translate(24px, -50%)'
          }}
        >
          {tooltip.text}
          <div className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${tooltip.side === 'left' ? 'border-l-blue-900 -right-2' : 'border-r-teal-800 -left-2'}`}></div>
        </div>
      )}
    </>
  );
}
