"use client";

import { useEffect, useState } from "react";
import Glitch from "./Glitch";

interface PortalGlitchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PortalGlitch({ isOpen, onClose }: PortalGlitchProps) {
  const [phase, setPhase] = useState<"glitch" | "coming_soon">("glitch");

  useEffect(() => {
    if (!isOpen) {
      setPhase("glitch");
      return;
    }

    setPhase("glitch");

    // Show full-screen WebGL glitch for 2 seconds, then switch to "Coming Soon!"
    const timer = setTimeout(() => {
      setPhase("coming_soon");
    }, 2000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white select-none overflow-hidden font-space-mono">
      {/* 2-Second WebGL Glitch Phase */}
      {phase === "glitch" && (
        <Glitch
          intensity={1.8}
          interval={0}
          duration={2}
          slices={36}
          shift={60}
          rgbShift={12}
          blocks={0.8}
          noise={0.6}
          className="w-full h-full flex flex-col items-center justify-center bg-black"
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 bg-black">
            <div className="relative inline-block">
              <span className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-widest text-white uppercase animate-pulse">
                QUANTUM PORTAL
              </span>
              <span className="absolute top-0 left-0 text-4xl sm:text-6xl md:text-8xl font-bold tracking-widest text-cyan-400 opacity-80 translate-x-1 -translate-y-1 mix-blend-screen pointer-events-none">
                QUANTUM PORTAL
              </span>
              <span className="absolute top-0 left-0 text-4xl sm:text-6xl md:text-8xl font-bold tracking-widest text-red-500 opacity-80 -translate-x-1 translate-y-1 mix-blend-screen pointer-events-none">
                QUANTUM PORTAL
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-cyan-400 font-mono tracking-widest animate-bounce">
                [ INITIALIZING WEBGL GLITCH SEQUENCE :: 2.0s ]
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                SYNCHRONIZING DIMENSIONAL MATRIX • PLEASE STAND BY
              </p>
            </div>
          </div>
        </Glitch>
      )}

      {/* Phase 2: Full-Screen "Coming Soon!" Screen */}
      {phase === "coming_soon" && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black animate-fadeIn">
          {/* Subtle cosmic grid background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8 flex flex-col items-center">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>PORTAL STATUS :: DIMENSION 04</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white font-space-mono">
                Coming Soon!
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                This dimensional portal is currently under construction. New interactive features and experiments are being teleported here soon.
              </p>
            </div>

            {/* Diagnostic Information Box */}
            <div className="w-full max-w-md p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-left space-y-2 text-zinc-400 font-mono">
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
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-zinc-200 transition-colors shadow-lg font-space-mono"
            >
              [ Exit Portal / Return to Terminal ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
