import React from "react";
import LuxuryBtn from "@/components/atoms/Button/LuxuryBtn";

export default function OnboardFirst({ onNext }) {
  return (
    <main className="relative w-full min-h-[100dvh] bg-[#0e1b1f] text-white overflow-hidden">
      {/* Centered character and speech bubble */}
      <section className="w-full flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Speech bubble */}
        <div className="max-w-[560px] text-center text-[clamp(0.8rem,2.2vw,1rem)] leading-relaxed rounded-xl border border-white/50 bg-white/5 backdrop-blur-md px-4 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.25)] mb-4 animate-fade-in-up">
          Chào bạn, tớ là Emo – người bạn đồng hành nhỏ của bạn <br />
          trong hành trình cảm xúc này.
        </div>

        {/* Character image from public folder with soft colored shadow */}
        <div className="relative animate-gentle-float">
          {/* base ellipse shadow (warm, soft) */}
          {/* <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[calc(100%-8px)] -translate-x-1/2 w-[160px] sm:w-[220px] md:w-[280px] h-[34px] rounded-full blur-[6px] opacity-85 bg-[radial-gradient(ellipse_at_center,rgba(255,220,190,0.9),rgba(255,220,190,0.15)65%,transparent_80%)]"></span> */}
          {/* ambient glow around character */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[260px] md:w-[320px] h-[200px] sm:h-[260px] md:h-[320px] rounded-full blur-2xl opacity-60 bg-[radial-gradient(circle,rgba(255,240,180,0.55)_0%,rgba(255,240,180,0.25)_45%,rgba(255,240,180,0.05)_70%,transparent_80%)] animate-gentle-pulse"></span>

          <img
            src="/image/onboarding/emoXinChao.webp"
            alt="Duo chào bạn"
            className="relative z-10 w-[140px] sm:w-[180px] md:w-[220px] h-auto select-none drop-shadow-[0_14px_30px_rgba(32,64,72,0.45)] animate-fade-in-scale"
            draggable="false"
          />
        </div>
      </section>

      {/* Bottom fixed nav with white outline */}
      <nav className="fixed bottom-0 left-0 right-0 w-full px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-black/20 backdrop-blur-md border-t border-white/30">
        <div className="w-full max-w-2xl mx-auto flex justify-end pr-2 sm:pr-4 lg:pr-8 lg:max-w-none lg:ml-auto lg:mr-0">
          {/* Glowing background for LuxuryBtn */}
          <div className="relative">
            {/* Animated glow effect */}
            <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-r from-white/20 via-white/30 to-white/20 blur-lg animate-pulse"></div>
            <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-white/10 via-white/20 to-white/10 blur-md"></div>
            {/* LuxuryBtn */}
            <div className="relative z-10">
              <LuxuryBtn text="Tiếp tục" onClick={onNext} />
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
}
