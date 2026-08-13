"use client";

import AsciiObject from "./AsciiObject";

const JUPITER_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100" fill="none">
  <!-- Ring Back / Outer (tilted ring -18 deg) -->
  <g transform="rotate(-18 50 50)">
    <ellipse cx="50" cy="50" rx="46" ry="14" stroke="white" stroke-width="2.5" fill="none"/>
    <ellipse cx="50" cy="50" rx="35" ry="9.5" stroke="white" stroke-width="1.8" fill="none"/>
  </g>

  <!-- Planet Main Body Disk -->
  <circle cx="50" cy="50" r="27" fill="black" stroke="white" stroke-width="2.5"/>

  <!-- Atmospheric Gas Bands -->
  <path d="M 24 38 Q 50 42 76 38" stroke="white" stroke-width="2" fill="none"/>
  <path d="M 23 44 Q 50 48 77 44" stroke="white" stroke-width="1.5" fill="none"/>
  <path d="M 23 56 Q 50 60 77 56" stroke="white" stroke-width="2" fill="none"/>
  <path d="M 25 62 Q 50 65 75 62" stroke="white" stroke-width="1.5" fill="none"/>

  <!-- Great Red Spot Storm -->
  <ellipse cx="62" cy="57" rx="4" ry="2.5" fill="white" stroke="white" stroke-width="1"/>

  <!-- Ring Front Overlay (giving 3D overlap effect) -->
  <g transform="rotate(-18 50 50)">
    <path d="M 4 50 A 46 14 0 0 0 96 50" stroke="white" stroke-width="2.5" fill="none"/>
  </g>
</svg>`;

export default function JupiterSection() {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto pt-10 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 grid grid-cols-1 md:grid-cols-12 items-center gap-10 sm:gap-16 lg:gap-24 text-left px-4 sm:px-8 lg:px-12">
      {/* Left Side: 3D ASCII Jupiter Object */}
      <div className="md:col-span-6 lg:col-span-5 flex flex-col items-center md:items-start justify-center shrink-0 w-full">
        <div className="w-60 h-60 xs:w-72 xs:h-72 sm:w-88 sm:h-88 md:w-[440px] md:h-[440px] lg:w-[500px] lg:h-[500px] max-w-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none">
          <AsciiObject 
            src="jupiter" 
            autoRotate 
            autoRotateSpeed={2}
            ascii={true} 
            cellSize={6.5} 
            scale={3.5}
            floatIntensity={1.5}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Right Side: Text Content using Space Mono font */}
      <div className="md:col-span-6 lg:col-span-6 lg:col-start-7 flex flex-col items-start justify-center space-y-4 sm:space-y-5 text-left font-space-mono w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 font-space-mono">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Cosmic Perspective
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white font-space-mono">
          Navigating the Digital Cosmos
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-space-mono">
          Like Jupiter&apos;s gravitational presence, great software brings complex ideas together into seamless, high-performance digital experiences.
        </p>

        <div className="space-y-3 pt-2 text-zinc-300 font-space-mono">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 font-space-mono text-sm mt-0.5">01 //</span>
            <p className="text-xs sm:text-sm text-zinc-300 font-space-mono">
              <strong className="text-white font-medium">Scalable Architecture:</strong> Building robust full-stack applications with clean logic and efficiency.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-amber-500 font-space-mono text-sm mt-0.5">02 //</span>
            <p className="text-xs sm:text-sm text-zinc-300 font-space-mono">
              <strong className="text-white font-medium">Interactive Visuals:</strong> Merging ASCII art, WebGL 3D graphics, and responsive web design.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-amber-500 font-space-mono text-sm mt-0.5">03 //</span>
            <p className="text-xs sm:text-sm text-zinc-300 font-space-mono">
              <strong className="text-white font-medium">Continuous Innovation:</strong> Thinking beyond limits to engineer next-generation web products.
            </p>
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {["Next.js", "TypeScript", "Three.js", "React", "Tailwind CSS"].map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 text-xs font-space-mono rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
