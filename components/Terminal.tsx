"use client";

import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import AsciiObject from "./AsciiObject";
import { ScrollArea } from "@/components/ui/scroll-area";

const DOLLAR_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initXterm() {
      if (!terminalRef.current || xtermInstanceRef.current) return;

      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      if (!isMounted) return;

      const term = new Terminal({
        cursorBlink: true,
        convertEol: true,
        rows: 14,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      if (terminalRef.current) {
        terminalRef.current.innerHTML = "";
      }

      term.open(terminalRef.current);
      fitAddon.fit();
      term.focus();
      xtermInstanceRef.current = term;

      const welcomeBanner = [
        "Welcome to BlazeNeuro Terminal. Type 'help' or 'ascii' for options.",
        "",
      ];

      welcomeBanner.forEach((line) => term.writeln(line));

      const prompt = () => {
        term.write("$ ");
      };

      prompt();

      let currentLine = "";

      term.onData((data: string) => {
        const code = data.charCodeAt(0);

        if (code === 13) {
          term.writeln("");
          const cmd = currentLine.trim().toLowerCase();

          if (cmd === "help") {
            term.writeln("Available commands:");
            term.writeln("  ascii    - Render 3D ASCII Object");
            term.writeln("  jupiter  - Render 3D Jupiter Model Info");
            term.writeln("  about    - Developer profile");
            term.writeln("  skills   - Tech stack & tools");
            term.writeln("  clear    - Clear terminal screen");
          } else if (cmd === "ascii") {
            term.writeln("  [ 3D Dollar ASCII Object Active ]");
          } else if (cmd === "jupiter") {
            term.writeln("  [ 3D Jupiter ASCII Object Active Below Terminal ]");
          } else if (cmd === "about") {
            term.writeln("Full-Stack Developer building modern web experiences.");
          } else if (cmd === "skills") {
            term.writeln("React • Next.js • TypeScript • Three.js • Tailwind CSS");
          } else if (cmd === "clear") {
            term.clear();
          } else if (cmd.length > 0) {
            term.writeln(`command not found: ${currentLine.trim()}`);
          }

          currentLine = "";
          prompt();
        } else if (code === 127) {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write("\b \b");
          }
        } else if (code >= 32) {
          currentLine += data;
          term.write(data);
        }
      });

      const handleResize = () => {
        try {
          fitAddon.fit();
        } catch {}
      };

      setTimeout(() => {
        try {
          fitAddon.fit();
          term.focus();
        } catch {}
      }, 100);

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    initXterm();

    return () => {
      isMounted = false;
      if (xtermInstanceRef.current) {
        try {
          xtermInstanceRef.current.dispose();
        } catch {}
        xtermInstanceRef.current = null;
      }
    };
  }, []);

  const handleContainerClick = () => {
    if (xtermInstanceRef.current) {
      xtermInstanceRef.current.focus();
    }
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto border border-zinc-800 bg-black text-left rounded-xl overflow-hidden shadow-2xl cursor-text"
      onClick={handleContainerClick}
    >
      {/* Top Header Bar seamlessly connected */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 select-none">
        <div className="text-xs text-zinc-500 font-mono">terminal :: BlazeNeuro</div>
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded-full bg-zinc-500 inline-block shrink-0" style={{ width: "14px", height: "14px" }} />
          <span className="w-3.5 h-3.5 rounded-full bg-zinc-500 inline-block shrink-0" style={{ width: "14px", height: "14px" }} />
          <span className="w-3.5 h-3.5 rounded-full bg-zinc-500 inline-block shrink-0" style={{ width: "14px", height: "14px" }} />
        </div>
      </div>

      {/* Terminal Viewport Container */}
      <div className="p-4 bg-black flex flex-col items-center">
        {/* BlazeNeuro ASCII Text Banner */}
        <pre 
          className="text-[6.5px] xs:text-[8px] sm:text-xs text-white leading-none overflow-x-auto text-center select-none w-full my-2"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
        >
{`  ██████╗ ██╗      █████╗ ███████╗███████╗███╗   ██╗███████╗██╗    ██╗██████╗  ██████╗ 
  ██╔══██╗██║     ██╔══██╗╚══███╔╝██╔════╝████╗  ██║██╔════╝██║    ██║██╔══██╗██╔═══██╗
  ██████╔╝██║     ███████║  ███╔╝ █████╗  ██╔██╗ ██║█████╗  ██║    ██║██████╔╝██║   ██║
  ██╔══██╗██║     ██╔══██║ ███╔╝  ██╔══╝  ██║╚██╗██║██╔══╝  ██║    ██║██╔══██╗██║   ██║
  ██████╔╝███████╗██║  ██║███████╗███████╗██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝
  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝`}
        </pre>

        {/* 3D AsciiObject Canvas - 3D Dollar ($) Sign */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 my-2 flex items-center justify-center pointer-events-none select-none">
          <AsciiObject 
            src={DOLLAR_LOGO_SVG} 
            autoRotate 
            ascii={true} 
            cellSize={8} 
            scale={2.5}
            className="w-28 h-28 sm:w-36 sm:h-36"
          />
        </div>

        {/* Terminal CLI Output Viewport */}
        <div 
          ref={terminalRef} 
          className="w-full h-[180px] sm:h-[220px] text-left mt-2 cursor-text overflow-x-auto" 
        />
      </div>
    </div>
  );
}
