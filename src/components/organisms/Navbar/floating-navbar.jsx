"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    if (!href || typeof href !== "string") return false;
    if (!href.startsWith("/")) return false; // external links not considered
    return (
      location.pathname === href ||
      location.pathname.startsWith(href.endsWith("/") ? href : `${href}/`)
    );
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 sm:top-8 inset-x-0 mx-auto z-[5000] overflow-hidden",
          "rounded-full backdrop-blur-xl border border-white/15 dark:border-white/10",
          "bg-white/10 dark:bg-black/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
          "pl-6 pr-3 sm:pl-8 sm:pr-2 py-2 items-center justify-center space-x-2 sm:space-x-4",
          className
        )}>
        {navItems.map((navItem, idx) => {
          const active = isActive(navItem.link);
          const isInternal =
            typeof navItem.link === "string" && navItem.link.startsWith("/");
          const commonProps = {
            key: `link-${idx}`,
            "aria-label": navItem.name,
            "aria-current": active ? "page" : undefined,
            className: cn(
              "group relative flex items-center space-x-2 px-3 py-2 rounded-full text-neutral-700 dark:text-neutral-50",
              "transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
              active && "text-violet-700 dark:text-violet-300"
            ),
            children: (
              <>
                <span className="block sm:hidden transition-transform duration-200 group-hover:-translate-y-0.5">
                  {navItem.icon}
                </span>
                <span className="hidden sm:block text-sm font-medium tracking-wide">
                  {navItem.name}
                </span>
                {/* Hover/Active background pill */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 -z-10 rounded-full transition-opacity duration-300 bg-white/50 dark:bg-white/10",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />
                {/* Underline accent */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-3 right-3 -bottom-1 h-px origin-left transition-transform duration-300 bg-white/40 dark:bg-white/20",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </>
            ),
          };

          return isInternal ? (
            <Link to={navItem.link} {...commonProps} />
          ) : (
            <a
              href={navItem.link}
              target="_blank"
              rel="noopener noreferrer"
              {...commonProps}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};
