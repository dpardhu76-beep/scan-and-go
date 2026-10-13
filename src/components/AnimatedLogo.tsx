import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  interactive?: boolean;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'hero',
  showText = false,
  interactive = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    try {
      sound.playScanBeep();
    } catch {}
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
  };

  // Dimensions based on size
  const dimensions = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', bolt: 'w-2.5 h-2.5', text: 'text-sm' },
    md: { container: 'w-10 h-10', icon: 'w-5 h-5', bolt: 'w-3 h-3', text: 'text-base' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', bolt: 'w-4 h-4', text: 'text-xl' },
    hero: { container: 'w-36 h-36 sm:w-44 sm:h-44', icon: 'w-16 h-16 sm:w-20 sm:h-20', bolt: 'w-7 h-7', text: 'text-3xl sm:text-5xl' },
  }[size];

  // If size is navbar (md) or small (sm)
  if (size === 'sm' || size === 'md') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleClick}
          className={`relative ${dimensions.container} rounded-xl bg-gradient-to-br from-[#ff2a35] via-[#d71920] to-[#990e14] text-white flex items-center justify-center font-black shadow-md shadow-red-600/30 overflow-hidden cursor-pointer border border-red-400/30`}
        >
          {/* Laser scanning beam overlay */}
          <motion.div
            animate={{
              top: ['-10%', '110%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_#ffffff] z-20 pointer-events-none"
          />

          {/* Glowing pulse aura */}
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-red-400/20 rounded-xl pointer-events-none"
          />

          <span className="relative z-10 text-white font-black tracking-tight text-base sm:text-lg">
            SG
          </span>

          {/* Electric micro-spark in corner */}
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="absolute -top-0.5 -right-0.5 text-yellow-300 pointer-events-none"
          >
            <Zap className="w-3 h-3 fill-current" />
          </motion.div>
        </motion.div>

        {showText && (
          <div>
            <div className="font-black text-base tracking-tight text-slate-900 leading-none">
              SCAN <span className="text-[#d71920]">AND</span> GO
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Smart Supermarket
            </div>
          </div>
        )}
      </div>
    );
  }

  // Large or Hero centerpiece logo
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        className="relative flex items-center justify-center cursor-pointer select-none group"
      >
        {/* Outer Orbit 1: Revolving Radar Calibration Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/40 pointer-events-none -m-3 sm:-m-4"
        />

        {/* Outer Orbit 2: Counter-Rotating Optical Laser Ring with Blips */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full border border-red-500/20 pointer-events-none -m-6 sm:-m-8"
        >
          {/* Laser Blip Target Dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_#ff3344]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
        </motion.div>

        {/* Outer Glowing Atmosphere Aura */}
        <motion.div
          animate={{
            scale: isHovered || isClicked ? 1.2 : [1, 1.1, 1],
            opacity: isHovered || isClicked ? 0.8 : [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-3xl bg-red-600/30 blur-2xl pointer-events-none -m-2"
        />

        {/* Main 3D Glassmorphic Capsule Enclosure */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative ${dimensions.container} rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/90 border-2 border-red-500/60 shadow-[0_0_50px_rgba(215,25,32,0.45)] flex items-center justify-center overflow-hidden`}
        >
          {/* Internal Radial Sheen */}
          <div className="absolute inset-0 bg-radial from-red-600/20 via-transparent to-transparent pointer-events-none" />

          {/* Active Sweeping Laser Beam (Continuous Vertical Sweep) */}
          <motion.div
            animate={{
              top: ['-5%', '105%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_20px_#ff2233] z-20 pointer-events-none"
          />

          {/* Secondary Holographic Grid Background inside lens */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff223315_1px,transparent_1px),linear-gradient(to_bottom,#ff223315_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Central Animated Content: Shopping Cart + Laser Barcode */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Shopping Cart Icon with float and lightning */}
            <div className="relative">
              <motion.div
                animate={{
                  rotate: isClicked ? [0, -10, 10, -5, 0] : [0, -2, 2, 0],
                  scale: isClicked ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  duration: isClicked ? 0.6 : 3,
                  repeat: isClicked ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ShoppingCart className={`${dimensions.icon} text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`} />
              </motion.div>

              {/* Pulsing Lightning Bolt */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 12, -12, 0],
                  filter: ['drop-shadow(0 0 4px #facc15)', 'drop-shadow(0 0 14px #facc15)', 'drop-shadow(0 0 4px #facc15)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-2 -right-3 text-yellow-300"
              >
                <Zap className={`${dimensions.bolt} fill-current`} />
              </motion.div>
            </div>

            {/* High-Tech Animated Barcode Lines beneath cart */}
            <div className="mt-3 flex items-center gap-1 sm:gap-1.5 opacity-90 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs border border-white/10">
              {[
                { h: 'h-4', w: 'w-1', color: 'bg-red-500', delay: 0 },
                { h: 'h-3', w: 'w-0.5', color: 'bg-white', delay: 0.1 },
                { h: 'h-5', w: 'w-1.5', color: 'bg-white', delay: 0.2 },
                { h: 'h-3.5', w: 'w-0.5', color: 'bg-red-400', delay: 0.3 },
                { h: 'h-4.5', w: 'w-1', color: 'bg-white', delay: 0.4 },
                { h: 'h-5', w: 'w-2', color: 'bg-red-500', delay: 0.5 },
                { h: 'h-3', w: 'w-0.5', color: 'bg-white', delay: 0.6 },
                { h: 'h-4', w: 'w-1.5', color: 'bg-red-400', delay: 0.7 },
              ].map((bar, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scaleY: [0.85, 1.2, 0.85],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: bar.delay,
                    ease: 'easeInOut',
                  }}
                  className={`${bar.w} ${bar.h} ${bar.color} rounded-full shadow-[0_0_6px_currentColor]`}
                />
              ))}
            </div>
          </div>

          {/* Corner Precision Aim Target Crosshairs */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 rounded-br-sm pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Interactive Sound Trigger Hint below logo */}
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="mt-3 flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-red-300 uppercase"
      >
        <Sparkles className="w-3 h-3 text-yellow-400" />
        <span>Tap Logo to Test Laser Scan</span>
      </motion.div>
    </div>
  );
};
