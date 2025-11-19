import {
  ServiceCTA,
  SpotlightNewDemo,
  TeamMember,
  TimelineDemo,
  Vision,
} from "@/components";
import Packages from "./Packages/Packages";
import styles from "../../styles/background/Background.module.css";
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "@/components/organisms";
export default function Home() {
  const location = useLocation();
  const spotlightRef = useRef(null);
  const problemEndRef = useRef(null);
  const visionRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  useEffect(() => {
    // Observe a sentinel placed at the bottom of Problem.
    // This is more reliable than relying on a high intersectionRatio for large sections.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (isAutoScrollingRef.current) continue; // avoid re-triggering while auto-scrolling
          const target = spotlightRef.current;
          if (target) {
            isAutoScrollingRef.current = true;
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            // Reset after the scroll likely completes
            window.setTimeout(() => {
              isAutoScrollingRef.current = false;
            }, 900);
          }
        }
      },
      {
        root: null, // viewport
        threshold: 0, // fire as soon as sentinel appears
        rootMargin: "0px 0px -10% 0px", // slight advance trigger before fully on screen
      }
    );

    if (problemEndRef.current) observer.observe(problemEndRef.current);

    return () => {
      if (problemEndRef.current) observer.unobserve(problemEndRef.current);
    };
  }, []);

  useEffect(() => {
    const onProgressComplete = () => {
      if (isAutoScrollingRef.current) return;
      const target = visionRef.current;
      if (!target) return;
      isAutoScrollingRef.current = true;
      // Custom scroll animation to control duration between components
      const startY = window.pageYOffset;
      const targetY = startY + target.getBoundingClientRect().top;
      const duration = 2000; // ms – increased transition time
      const startTime = performance.now();

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        const currentY = startY + (targetY - startY) * eased;
        window.scrollTo(0, currentY);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          isAutoScrollingRef.current = false;
        }
      };
      requestAnimationFrame(step);
    };
    window.addEventListener("timeline:progress-complete", onProgressComplete);
    return () =>
      window.removeEventListener(
        "timeline:progress-complete",
        onProgressComplete
      );
  }, []);

  // Helper function to scroll to a section with retry logic
  const scrollToSection = useCallback((sectionId, retryCount = 0) => {
    const maxRetries = 3;
    const delays = [0, 100, 300, 500]; // Progressive delays for retries

    const attemptScroll = () => {
      const targetSection = document.querySelector(`#${sectionId}`);

      if (targetSection) {
        // Reset auto-scrolling flag to allow smooth scroll
        isAutoScrollingRef.current = false;

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          // Double check element still exists
          const element = document.querySelector(`#${sectionId}`);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
        return true;
      }

      return false;
    };

    // Try immediate scroll
    if (attemptScroll()) {
      return;
    }

    // Retry with progressive delays if element not found
    if (retryCount < maxRetries) {
      setTimeout(() => {
        if (!attemptScroll() && retryCount < maxRetries - 1) {
          scrollToSection(sectionId, retryCount + 1);
        }
      }, delays[retryCount + 1]);
    }
  }, []);

  // Handle navigation from other routes - scroll to target section from localStorage
  useEffect(() => {
    const targetSectionId = localStorage.getItem("scrollToSection");

    if (targetSectionId) {
      // Wait a bit for the page to render
      setTimeout(() => {
        scrollToSection(targetSectionId);
        // Clear the target section from localStorage after scrolling completes
        setTimeout(() => {
          localStorage.removeItem("scrollToSection");
        }, 1000);
      }, 300);
    }
  }, [location.pathname, scrollToSection]);

  // Listen for custom scroll events (for same-route scrolling)
  useEffect(() => {
    const handleScrollEvent = (event) => {
      const sectionId = event.detail?.sectionId;
      if (sectionId) {
        // Force reset auto-scrolling flag first
        isAutoScrollingRef.current = false;

        // Small delay to ensure any menu animations are complete
        // and DOM is fully ready
        setTimeout(() => {
          // Double check and reset flag again before scrolling
          isAutoScrollingRef.current = false;
          scrollToSection(sectionId);
        }, 100);
      }
    };

    window.addEventListener("scroll-to-section", handleScrollEvent);
    return () => {
      window.removeEventListener("scroll-to-section", handleScrollEvent);
    };
  }, [scrollToSection]);

  return (
    <>
      <section id="hero-section" className="min-h-screen w-full ">
        <HeroSection />
      </section>
      <div
        className={`${styles.heroBackground} relative w-full will-change-transform transform-gpu`}>
        <section
          className={` min-h-screen overflow-hidden text-white w-full flex items-center justify-center pt-20 mt-30`}>
          <SpotlightNewDemo />
        </section>

        <section
          className={` min-h-screen overflow-hidden text-white w-full flex items-center justify-center px-10`}>
          <TimelineDemo />
        </section>
        <section
          className={`min-h-screen overflow-hidden text-white w-full flex items-center justify-center pb-10 md:pb-20 sm:py-10 lg:pb-[20%] 2xl:pb-[30%]`}>
          <Vision />
        </section>
      </div>
      <section
        id="packages-section"
        className=" min-h-screen overflow-hidden w-full flex items-center justify-center">
        <Packages />
      </section>
      <section className=" min-h-screen overflow-hidden w-full flex items-center justify-center">
        <TeamMember />
      </section>
      <section className=" min-h-screen overflow-hidden w-full flex items-center justify-center">
        <ServiceCTA />
      </section>
    </>
  );
}
