"use client";

import { useEffect, useState, useRef } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [clipPathD, setClipPathD] = useState("M 0 0 L 1 0 L 1 1 L 0 1 Z");
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const duration = 700; // ms
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      setProgress(t);

      // Ease functions
      const easeOutCubic = 1 - Math.pow(1 - t, 3);
      const easeQuint = 1 - Math.pow(1 - t, 5);
      const bulge = Math.sin(t * Math.PI) * 0.16; // Genie organic S-curve bulge

      if (t >= 1) {
        setClipPathD("M 0 0 L 1 0 L 1 1 L 0 1 Z");
        return;
      }

      // Calculate macOS Genie funnel cubic Bezier control points
      const topW = 0.02 + 0.98 * easeQuint;
      const botW = 0.01 + 0.99 * Math.pow(t, 2.5);

      const leftT = Math.max(0, 0.5 - topW / 2);
      const rightT = Math.min(1, 0.5 + topW / 2);
      const leftB = Math.max(0, 0.5 - botW / 2);
      const rightB = Math.min(1, 0.5 + botW / 2);

      const c1RightX = rightT - (rightT - rightB) * 0.3 + bulge;
      const c2RightX = rightB + (rightT - rightB) * 0.3 + bulge;
      const c1LeftX = leftT + (leftB - leftT) * 0.3 - bulge;
      const c2LeftX = leftB - (leftB - leftT) * 0.3 - bulge;

      const path = `M ${leftT} 0 L ${rightT} 0 C ${c1RightX} 0.35, ${c2RightX} 0.7, ${rightB} 1 L ${leftB} 1 C ${c2LeftX} 0.7, ${c1LeftX} 0.35, ${leftT} 0 Z`;
      setClipPathD(path);

      animRef.current = requestAnimationFrame(animateFrame);
    };

    animRef.current = requestAnimationFrame(animateFrame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const easeOut = 1 - Math.pow(1 - progress, 3);
  const translateY = (1 - easeOut) * 220;
  const scale = 0.15 + 0.85 * easeOut;
  const rotateX = (1 - easeOut) * 35;
  const opacity = Math.min(1, progress * 1.8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      {/* Dynamic SVG Clip Path for 60fps macOS Genie Cubic Bezier Morphing */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="macOSGenieClip" clipPathUnits="objectBoundingBox">
            <path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>

      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* macOS Genie Window Container - Monochrome Black & White */}
      <div 
        className="relative z-10 w-full max-w-2xl max-h-[88vh] flex flex-col bg-black border border-zinc-800 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.12)] overflow-hidden text-left font-space-mono select-none"
        style={{
          clipPath: "url(#macOSGenieClip)",
          WebkitClipPath: "url(#macOSGenieClip)",
          transform: `perspective(1200px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
          transformOrigin: "bottom center",
          opacity: opacity,
          willChange: "transform, opacity, clip-path",
        }}
      >
        {/* Window Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-900/90 border-b border-zinc-800 select-none shrink-0">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
            <span className="text-white">macOS Genie :: Resume.pdf</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-[11px] sm:text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors font-mono cursor-pointer active:scale-95"
            >
              ESC [X]
            </button>
          </div>
        </div>

        {/* Scrollable Resume Body */}
        <div className="p-4 xs:p-6 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 text-zinc-300 custom-scrollbar flex-1 font-space-mono">
          {/* Profile Section */}
          <div className="border-b border-zinc-800/80 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white font-space-mono">
                  ANKIT <span className="text-zinc-400 text-base sm:text-lg font-normal">(BlazeNeuro)</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  Full-Stack Developer & Software Engineer
                </p>
              </div>

              <a
                href="https://github.com/ankit-blazeneuro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-white/20 transition-colors w-full sm:w-auto font-mono shrink-0 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>View Profile / PDF</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 sm:mt-4 text-[11px] sm:text-xs text-zinc-400 font-mono break-all">
              <a href="https://github.com/ankit-blazeneuro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                github.com/ankit-blazeneuro
              </a>
              <span className="hidden xs:inline">•</span>
              <a href="https://leetcode.com/u/iamankitm/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                leetcode.com/u/iamankitm
              </a>
              <span className="hidden xs:inline">•</span>
              <a href="https://www.linkedin.com/in/iamankitkm/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                linkedin.com/in/iamankitkm
              </a>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2.5 sm:space-y-3">
            <h2 className="text-[11px] sm:text-xs uppercase tracking-wider text-white font-bold font-mono">
              01 // Technical Skills & Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-white font-medium block mb-1">Frontend & Graphics:</span>
                <span className="text-zinc-400">React, Next.js, TypeScript, Three.js, WebGL ASCII Shaders, Tailwind CSS</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-white font-medium block mb-1">Backend & Systems:</span>
                <span className="text-zinc-400">Node.js, Python, C++, REST APIs, Algorithmic Optimization</span>
              </div>
            </div>
          </div>

          {/* Experience & Highlighted Projects */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-[11px] sm:text-xs uppercase tracking-wider text-white font-bold font-mono">
              02 // Featured Engineering Projects
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-white font-medium">
                  <span>🚀 Interactive 3D Portfolio Platform</span>
                  <span className="text-[10px] text-zinc-500 font-mono">2026</span>
                </div>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed">
                  Engineered a modern web portfolio using Next.js 16, Three.js custom ASCII post-processing shaders, 3D planetary models, and interactive terminal CLI.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-white font-medium">
                  <span>⚡ Algorithmic Problem Solving</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Ongoing</span>
                </div>
                <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed">
                  Active problem solver on LeetCode focusing on advanced data structures, graph algorithms, dynamic programming, and efficient memory complexity.
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <h2 className="text-[11px] sm:text-xs uppercase tracking-wider text-white font-bold font-mono">
              03 // Education
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-zinc-300">
              <span>Bachelor of Technology in Computer Science / Engineering</span>
              <span className="text-zinc-500 font-mono text-[10px]">India</span>
            </div>
          </div>
        </div>

        {/* Window Footer */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 font-mono shrink-0">
          <span>[ macOS Genie Morph Active ]</span>
          <button
            onClick={onClose}
            className="text-white hover:underline font-mono text-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
