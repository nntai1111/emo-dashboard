import React from "react";
import {
  useReducedMotion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useSpring,
  motion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "../../../../styles/Font/Font.module.css";
import {
  LoginMessageForm,
  MessagesMove,
  ArrowLight,
} from "@/components/molecules";

const Greetings = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { amount: 0.6, margin: "0px" });

  // Removed scroll direction tracking; animations always rise from bottom

  // Controls for children animations
  const titleCtrl = useAnimationControls();
  const subCtrl = useAnimationControls();

  // Variants for per-letter animation
  const containerVariants = reduceMotion
    ? {
        hidden: {},
        visible: {},
      }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.03 },
        },
      };

  const charVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        // Always animate from bottom up regardless of scroll direction
        hidden: { opacity: 0, y: 36 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 140,
            damping: 18,
            mass: 0.8,
          },
        },
      };

  // Pointer-follow sparkles motion values and springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const [showSparkles, setShowSparkles] = useState(false);

  const renderLetters = (text) =>
    text.split("").map((ch, i) => (
      <motion.span
        key={`${ch}-${i}`}
        className="inline-block"
        variants={charVariants}
        aria-hidden={ch === " "}>
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ));

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (inView) {
      if (!hasAnimated) {
        // Play only once while the section remains in view
        titleCtrl.start("visible");
        subCtrl.start("visible");
        setHasAnimated(true);
      }
    } else {
      // Reset when out of view so it can animate again on re-enter
      titleCtrl.set("hidden");
      subCtrl.set("hidden");
      setHasAnimated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasAnimated]);

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full min-h-screen flex items-center mt-[10%] will-change-transform transform-gpu"
        onMouseMove={!reduceMotion ? handleMouseMove : undefined}
        onMouseEnter={!reduceMotion ? () => setShowSparkles(true) : undefined}
        onMouseLeave={!reduceMotion ? () => setShowSparkles(false) : undefined}>
        {!reduceMotion && (
          <motion.div
            className="absolute pointer-events-none -z-0"
            style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showSparkles ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden>
            <motion.span
              className="absolute -top-4 left-0 w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="absolute -top-2 left-6 w-1 h-1 rounded-full bg-fuchsia-300/90 shadow-[0_0_10px_rgba(216,180,254,0.6)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.span
              className="absolute -top-1 -left-6 w-1 h-1 rounded-full bg-cyan-300/90 shadow-[0_0_10px_rgba(165,243,252,0.6)]"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.35,
              }}
            />
            <motion.span
              className="absolute top-3 left-2 w-1 h-1 rounded-full bg-amber-300/90 shadow-[0_0_10px_rgba(252,211,77,0.6)]"
              animate={{ scale: [1, 1.22, 1] }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.span
              className="absolute -top-3 left-10 w-[3px] h-[3px] rounded-full bg-pink-300/90 shadow-[0_0_10px_rgba(249,168,212,0.6)]"
              animate={{ scale: [1, 1.17, 1] }}
              transition={{
                duration: 1.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7,
              }}
            />
          </motion.div>
        )}
        {/* Glass container wraps the core text content for clarity and responsiveness */}
        {/* Ambient decorations */}
        {!reduceMotion && (
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            aria-hidden>
            <motion.div
              className="absolute bg-gradient-to-br from-fuchsia-500/20 to-violet-600/10 blur-3xl rounded-full"
              style={{ width: 360, height: 360, left: "-10%", top: "-6%" }}
              animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bg-gradient-to-br from-cyan-400/20 to-sky-500/10 blur-3xl rounded-full"
              style={{ width: 260, height: 260, right: "-6%", top: "10%" }}
              animate={{ y: [0, 15, 0], scale: [1, 1.07, 1] }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bg-gradient-to-tr from-amber-300/15 to-pink-500/10 blur-3xl rounded-full"
              style={{ width: 220, height: 220, left: "20%", bottom: "-8%" }}
              animate={{ y: [0, 18, 0], scale: [1, 1.06, 1] }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
          </div>
        )}
        {/* Full-bleed glass container that wraps text and interactive area */}
        <div className="relative mx-[calc(50%-50vw)] w-[100vw] max-w-[100vw] px-4 sm:px-8 lg:px-12 overflow-visible z-[1]">
          {/* <div className="relative rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 overflow-hidden h-[90vh]"> */}
          <div>
            <div className="max-w-6xl mx-auto py-8 sm:py-10 lg:py-0 relative">
              <div className={`${styles.dancingScript} text-white`}>
                <motion.h1
                  animate={titleCtrl}
                  initial="hidden"
                  variants={containerVariants}
                  className="tracking-tight leading-tight mb-4 pb-2 relative text-left text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl will-change-transform transform-gpu">
                  {renderLetters("Bạn có ổn không?")}
                  {!reduceMotion && (
                    <motion.span
                      className="pointer-events-none absolute left-0 -bottom-1 h-[3px] w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full"
                      initial={{ x: "-120%" }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      aria-hidden
                    />
                  )}
                </motion.h1>
                <motion.h2
                  animate={subCtrl}
                  initial="hidden"
                  variants={containerVariants}
                  className="tracking-tight text-left text-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl will-change-transform transform-gpu">
                  {renderLetters("Đôi khi câu trả lời thật khó nói...")}
                </motion.h2>
              </div>
            </div>
            {/* Interactive area inside the same glass container */}
            <div className="relative w-full mt-3 sm:mt-8 font-sans overflow-x-clip overflow-y-visible min-h-[28rem] md:min-h-[32rem] lg:min-h-[40rem]">
              <LoginMessageForm className="relative lg:absolute lg:left-[10%] lg:top-0 z-[30]" />
              <div className="relative z-[10]">
                <MessagesMove />
              </div>
            </div>
          </div>
        </div>
        {/* Scroll hint arrow (centered at bottom of section) */}
        {/* <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10">
        <ArrowLight autoHide={false} className="pointer-events-auto" />
      </div> */}
      </section>
    </>
  );
};

export default Greetings;
