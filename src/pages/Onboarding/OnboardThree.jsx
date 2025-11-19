import React from "react";
import { useNavigate } from "react-router-dom";
import LuxuryBtn from "@/components/atoms/Button/LuxuryBtn";

export default function OnboardThree() {
  const navigate = useNavigate();
  return (
    <main className="relative w-full min-h-[100dvh] bg-[#0e1b1f] text-white overflow-hidden">
      {/* subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_60%)]"
        aria-hidden="true"
      />

      {/* Centered character and speech bubble */}
      <section className="w-full flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Speech bubble */}
        <div className="max-w-[560px] text-center text-[clamp(0.8rem,2.2vw,1rem)] leading-relaxed rounded-xl border border-white/50 bg-white/5 backdrop-blur-md px-4 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.25)] mb-4 animate-fade-in-up">
          Cảm ơn bạn đã chia sẻ với tớ
        </div>

        {/* Character image with enhanced animations */}
        <div className="relative animate-gentle-float">
          {/* ambient glow around character */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[260px] md:w-[320px] h-[200px] sm:h-[260px] md:h-[320px] rounded-full blur-2xl opacity-60 bg-[radial-gradient(circle,rgba(255,240,180,0.55)_0%,rgba(255,240,180,0.25)_45%,rgba(255,240,180,0.05)_70%,transparent_80%)] animate-gentle-pulse"
          />

          <img
            src="/image/onboarding/emoSignUp.webp"
            alt="Emo cảm ơn bạn"
            className="relative z-10 w-[140px] sm:w-[180px] md:w-[220px] h-auto select-none drop-shadow-[0_14px_30px_rgba(32,64,72,0.45)] animate-fade-in-scale"
            draggable="false"
          />
        </div>

        {/* Subtitle with better positioning */}
        <div className="mt-6 max-w-[680px] text-center px-4">
          <p
            className="text-[clamp(0.95rem,2.2vw,1.05rem)] text-white/80 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}>
            "Tớ muốn giúp bạn theo dõi hành trình cảm xúc của mình tốt hơn."
          </p>
        </div>
      </section>

      {/* Bottom fixed nav with enhanced styling */}
      <nav className="fixed bottom-0 left-0 right-0 w-full px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-black/20 backdrop-blur-md border-t border-white/30">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full sm:flex-1 relative">
              {/* Glowing background for LuxuryBtn */}
              <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-r from-white/20 via-white/30 to-white/20 blur-lg animate-pulse"></div>
              <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-white/10 via-white/20 to-white/10 blur-md"></div>
              {/* LuxuryBtn */}
              <div className="relative z-10">
                <LuxuryBtn
                  text="TẠO HỒ SƠ"
                  onClick={() => navigate("/signup")}
                  variant="responsive"
                />
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              type="button"
              className="w-full sm:flex-1 h-12 sm:h-11 md:h-12 rounded-xl text-white/90 font-semibold border border-white/20 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] hover:bg-white/8 active:scale-95 transition-all duration-200 text-sm sm:text-base">
              LÚC KHÁC
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}
