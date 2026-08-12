import Terminal from "@/components/Terminal";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="h-screen w-full">
      <main className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center pt-44 sm:pt-52 pb-24 px-4 sm:px-6 text-center space-y-12 overflow-hidden">
        {/* Background Graphic starting from left edge of screen */}
        <div className="absolute left-0 top-64 sm:top-80 w-full pointer-events-none z-0 flex justify-start opacity-80">
          <BackgroundDecoration className="w-[1150px] sm:w-[1450px] h-auto" />
        </div>

        {/* Header Container */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-white font-sans">
            Welcome to My Portfolio
          </h1>
          <p className="text-zinc-400 text-lg font-sans">
            Think beyond the limits
          </p>
        </div>

        {/* Terminal Section */}
        <div className="relative z-10 w-full max-w-4xl mt-24 sm:mt-32">
          <Terminal />
        </div>
      </main>
    </ScrollArea>
  );
}
