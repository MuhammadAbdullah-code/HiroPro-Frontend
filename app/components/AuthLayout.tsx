'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  headline: string;
  subheadline: string;
}

// Live activity ticker messages
const tickerMessages = [
  'Electrician booked in F-10 · 2 min ago',
  'New review · 5★ · 6 min ago',
  'Plumber confirmed · G-11 · 9 min ago',
  'Cleaning service started · E-7 · 12 min ago'
];

export default function AuthLayout({ children, headline, subheadline }: AuthLayoutProps) {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  // Rotate ticker every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-inter">
      {/* Left Panel - Live Local Network */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#1E1B6E] overflow-hidden">
        {/* Abstract Dot Network Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Network nodes and connections */}
          {/* Connection lines */}
          <line x1="10%" y1="15%" x2="25%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="25%" y1="25%" x2="35%" y2="20%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="35%" y1="20%" x2="50%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="50%" y1="30%" x2="65%" y2="25%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="65%" y1="25%" x2="80%" y2="35%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          <line x1="15%" y1="45%" x2="30%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="30%" y1="50%" x2="45%" y2="55%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="45%" y1="55%" x2="60%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="60%" y1="50%" x2="75%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          <line x1="20%" y1="75%" x2="35%" y2="70%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="35%" y1="70%" x2="50%" y2="75%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="50%" y1="75%" x2="65%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="65%" y1="80%" x2="80%" y2="75%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Vertical connections */}
          <line x1="25%" y1="25%" x2="30%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="50%" y1="30%" x2="50%" y2="75%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="65%" y1="25%" x2="65%" y2="80%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Regular nodes (white) */}
          <circle cx="10%" cy="15%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="25%" cy="25%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="35%" cy="20%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="80%" cy="35%" r="4" fill="rgba(255,255,255,0.4)" />
          
          <circle cx="15%" cy="45%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="30%" cy="50%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="45%" cy="55%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="75%" cy="60%" r="4" fill="rgba(255,255,255,0.4)" />
          
          <circle cx="20%" cy="75%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="35%" cy="70%" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="80%" cy="75%" r="4" fill="rgba(255,255,255,0.4)" />

          {/* Active nodes (pulsing coral) - use CSS animation */}
          <circle cx="50%" cy="30%" r="6" fill="#F4623A" filter="url(#glow)" className="pulse-coral" />
          <circle cx="60%" cy="50%" r="6" fill="#F4623A" filter="url(#glow)" className="pulse-coral" style={{ animationDelay: '0.5s' }} />
          <circle cx="50%" cy="75%" r="6" fill="#F4623A" filter="url(#glow)" className="pulse-coral" style={{ animationDelay: '1s' }} />
          <circle cx="65%" cy="25%" r="6" fill="#F4623A" filter="url(#glow)" className="pulse-coral" style={{ animationDelay: '1.5s' }} />
          <circle cx="65%" cy="80%" r="6" fill="#F4623A" filter="url(#glow)" className="pulse-coral" style={{ animationDelay: '2s' }} />
        </svg>

        {/* Main Content - Center */}
        <div className="absolute inset-0 flex items-center justify-center px-12 z-10">
          <div className="max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-sora leading-tight">
              {headline}
            </h2>
            <p className="text-lg text-white/80 font-inter">
              {subheadline}
            </p>
          </div>
        </div>

        {/* Live Ticker - Bottom Left */}
        <div className="absolute bottom-8 left-8 z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[320px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#0F9D8C] rounded-full animate-pulse" />
              <span className="text-xs text-white/60 font-inter uppercase tracking-wider">
                Live Activity
              </span>
            </div>
            <div className="h-5 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTickerIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-white font-mono"
                >
                  {tickerMessages[currentTickerIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#F7F8FA]">
        {/* Mobile Header - Logo + Coral Accent Bar */}
        <div className="md:hidden">
          <div className="h-1 bg-[#F4623A]" />
          <div className="py-6 px-4 bg-white border-b border-[var(--color-border)]">
            <Link href="/" className="flex items-center gap-2 text-[#1E1B6E]">
              <FaMapMarkerAlt className="w-6 h-6" />
              <span className="text-xl font-bold font-sora">HirePro</span>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
