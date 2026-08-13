"use client";

import { useState, useEffect } from "react";
import Terminal from "@/components/Terminal";
import JupiterSection from "@/components/JupiterSection";
import Footer from "@/components/Footer";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import Glitch from "@/components/Glitch";


export default function Home() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);

  const handlePortalTrigger = () => {
    setIsGlitching(true);
    setIsComingSoon(false);

    // Glitch the actual home page for 2 seconds, then show "Coming Soon!"
    setTimeout(() => {
      setIsGlitching(false);
      setIsComingSoon(true);
    }, 2000);
  };

  const handleExitPortal = () => {
    setIsGlitching(false);
    setIsComingSoon(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isComingSoon) {
        handleExitPortal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComingSoon]);

  // Phase 2: Full-Screen "Coming Soon!" Page
  if (isComingSoon) {
    return (
      <div className="fixed inset-0 z-[100] w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-black text-white font-space-mono select-none overflow-y-auto animate-fadeIn">
        {/* Subtle cosmic grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center py-8">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] sm:text-xs text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>PORTAL STATUS :: DIMENSION 04</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-space-mono">
              Coming Soon!
            </h1>
            <p className="text-zinc-400 text-xs sm:text-base max-w-md mx-auto leading-relaxed px-2">
              This dimensional portal is currently under construction. New interactive features and experiments are being teleported here soon.
            </p>
          </div>

          {/* Diagnostic Information Box */}
          <div className="w-full max-w-md p-3.5 sm:p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] sm:text-xs text-left space-y-2 text-zinc-400 font-mono">
            <div className="flex justify-between border-b border-zinc-800/80 pb-1">
              <span className="text-zinc-500">SYSTEM_ID:</span>
              <span className="text-white">0x9F_PORTAL</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/80 pb-1">
              <span className="text-zinc-500">SYNC_STATUS:</span>
              <span className="text-white">100% INITIALIZED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ESTIMATED_RELEASE:</span>
              <span className="text-white">Q4 2026</span>
            </div>
          </div>

          {/* Exit / Return Button */}
          <button
            onClick={handleExitPortal}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg font-space-mono cursor-pointer active:scale-95"
          >
            [ Exit Portal / Return to Terminal ]
          </button>
        </div>
      </div>
    );
  }

  // Home Page Content (Normal or 2-Second WebGL Glitch active)
  const homeContent = (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col items-center">
      <main className="relative flex min-h-[calc(100vh-80px)] w-full max-w-full flex-col items-center justify-center pt-20 xs:pt-24 sm:pt-36 md:pt-44 lg:pt-52 pb-6 px-3 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-10 md:space-y-12 overflow-x-hidden">
        {/* Background Graphic starting from left edge of screen */}
        <div className="absolute left-0 top-24 sm:top-48 lg:top-64 w-full pointer-events-none z-0 flex justify-start opacity-70 sm:opacity-80 overflow-hidden max-w-full">
          <BackgroundDecoration className="w-[800px] sm:w-[1150px] lg:w-[1450px] max-w-full sm:max-w-none h-auto shrink-0" />
        </div>

        {/* Header Container */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-2.5 sm:space-y-3 px-2">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white font-sans">
            Welcome to My Portfolio
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-sans">
            Think beyond the limits
          </p>
        </div>

        {/* Terminal Section */}
        <div className="relative z-10 w-full max-w-4xl mt-6 sm:mt-16 md:mt-24">
          <Terminal onPortalTrigger={handlePortalTrigger} />
        </div>

        {/* 3D ASCII Jupiter Section below Terminal */}
        <JupiterSection />

        {/* Footer with Space Mono font */}
        <Footer />
      </main>
    </div>
  );


  // If portal is triggered, wrap the ACTUAL LIVE HOME PAGE in WebGL Glitch for 2 seconds
  if (isGlitching) {
    return (
      <Glitch
        intensity={2.0}
        interval={0}
        duration={2}
        slices={40}
        shift={70}
        rgbShift={14}
        blocks={0.9}
        noise={0.7}
        className="w-full h-screen overflow-hidden bg-black"
      >
        {homeContent}
      </Glitch>
    );
  }

  return homeContent;
}
