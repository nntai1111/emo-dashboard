// /pages/Onboarding/Onboarding.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components";
import LuxuryBtn from "@/components/atoms/Button/LuxuryBtn";
import OnboardFirst from "./OnboardFirst";
import OnboardSecond from "./OnboardSecond";
import OnboardThree from "./OnboardThree";
import onboardingStyles from "../../../styles/component/Onboarding.module.css";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigate("/login");
    setTimeout(() => setIsNavigating(false), 1000);
  }, [navigate, isNavigating]);


  // === Step Flow ===
  const steps = [
    {
      component: (
        <HeroScreen
          onStart={() => setStep(1)}
          onLogin={handleLoginClick}
          isNavigating={isNavigating}
        />
      ),
    },
    { component: <OnboardFirst onNext={() => setStep(2)} /> },
    { component: <OnboardSecond onNext={() => setStep(3)} /> },
    {
      component: (
        <OnboardThree
          onCreateProfile={() => console.log("Create profile")}
          onLater={() => setStep(0)}
        />
      ),
    },
  ];

  return steps[step]?.component || null;
}

/* -------------------------------------------
 * HERO SCREEN (tách riêng để gọn code)
 * ------------------------------------------ */
function HeroScreen({ onStart, onLogin, isNavigating }) {
  return (
    <main
      className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden"
      role="main">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/image/onboarding/background.webp')",
          backgroundPosition: "center top 100%",
        }}
      />

      <header className="relative z-10 w-full flex justify-center items-center py-6 px-4">
        <Navbar />
      </header>

      <section className="relative z-10 flex-1 flex flex-col justify-end items-center pb-4 px-4 sm:px-6">
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-2 mt-1">
            <h2
              className={`text-center font-semibold leading-tight tracking-wide 
                text-[clamp(1rem,4vw,1.6rem)] text-transparent bg-clip-text 
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] ${onboardingStyles.luxTextShine}`}>
              “CHÀO MỪNG BẠN ĐẾN VỚI
            </h2>

            <h2
              className={`text-center font-semibold leading-tight tracking-wide 
                text-[clamp(1rem,4vw,1.6rem)] text-transparent bg-clip-text 
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${onboardingStyles.luxTextShine}`}>
              KHÔNG GIAN AN TOÀN CHO CẢM XÚC.”
            </h2>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-md">
            <LuxuryBtn text="BẮT ĐẦU" onClick={onStart} />
            <button
              onClick={onLogin}
              disabled={isNavigating}
              className="rounded-md text-sm font-medium transition-all duration-200
                bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                text-white hover:scale-105 active:scale-95 h-10 px-4 py-2 inline-flex justify-center items-center shadow-lg">
              Tôi đã có tài khoản
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
