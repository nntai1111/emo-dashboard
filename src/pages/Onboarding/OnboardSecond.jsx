import { Emotions } from "@/components";
import React, { useState } from "react";
import LuxuryBtn from "@/components/atoms/Button/LuxuryBtn";

export default function OnboardSecond({ onNext }) {
  const levels = [
    { label: "Rất buồn", emoji: "😭" },
    { label: "Buồn", emoji: "😢" },
    { label: "Hơi buồn", emoji: "🙁" },
    { label: "Bình thường", emoji: "😐" },
    { label: "Ổn", emoji: "🙂" },
    { label: "Vui", emoji: "😊" },
    { label: "Rất vui", emoji: "😄" },
  ];
  const [selected, setSelected] = useState(4);
  return (
    <main className="relative w-full min-h-[100dvh] bg-[#0e1b1f] text-white overflow-hidden">
      {/* Centered character and speech bubble */}
      <section className="w-full flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Speech bubble */}
        <div className="max-w-[560px] text-center text-[clamp(0.8rem,2.2vw,1rem)] leading-relaxed rounded-xl border border-white/50 bg-white/5 backdrop-blur-md px-4 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.25)] mb-4 animate-fade-in-up">
          “Trước khi bắt đầu, tớ muốn hỏi nhẹ thôi…”
          <br /> “Hôm nay, bạn cảm thấy thế nào?”
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
            src="/image/onboarding/emoTakeCare.webp"
            alt="Duo chào bạn"
            className="relative z-10 w-[140px] sm:w-[180px] md:w-[220px] h-auto select-none drop-shadow-[0_14px_30px_rgba(32,64,72,0.45)] animate-fade-in-scale"
            draggable="false"
          />
        </div>
      </section>

      {/* Emotion range (7 levels) - fixed above bottom nav */}
      <div className="fixed left-0 right-0 bottom-[100px] sm:bottom-[100px] px-4 z-40 py-8">
        <div className="max-w-3xl mx-auto w-full select-none flex flex-col items-center justify-center gap-4">
          {/* label */}
          <div className="mb-2 text-center text-white/95 text-[clamp(1rem,2.4vw,1.25rem)] font-semibold">
            {levels[selected - 1].label}
          </div>
          {/* scale bar */}
          <div className="relative w-full h-2 rounded-full bg-white/15">
            {/* active progress */}
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-[#7bd83b] via-[#b7f08a] to-[#f8da69] transition-all"
              style={{ width: `${((selected - 1) / 6) * 100}%` }}
            />
            {/* ticks */}
            <div className="absolute -top-3 left-0 right-0 flex justify-between">
              {levels.map((lv, idx) => {
                const isActive = selected === idx + 1;
                return (
                  <button
                    key={lv.label}
                    type="button"
                    onClick={() => setSelected(idx + 1)}
                    className={`relative flex items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                      isActive
                        ? "size-8 border-white/80 bg-white/80 text-[#0b1a13] shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
                        : "size-7 border-white/40 bg-white/25 text-white/90 hover:bg-white/35"
                    }`}
                    aria-label={lv.label}>
                    <span className={`${isActive ? "text-base" : "text-sm"}`}>
                      {lv.emoji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

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
