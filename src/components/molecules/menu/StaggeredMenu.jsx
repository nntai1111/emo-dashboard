import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { logout } from "../../../store/authSlice";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
export const StaggeredMenu = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  menuSections = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/Emo/EMO_1.webp",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  accentColor = "#5227FF",
  onMenuOpen,
  onMenuClose,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const navigate = useNavigate();

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(["", "Close"]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef(null);

  const resolvedSections = useMemo(() => {
    if (Array.isArray(menuSections) && menuSections.length > 0) {
      return menuSections
        .map((section, sectionIndex) => {
          if (!section || typeof section !== "object") return null;
          const rawItems = Array.isArray(section.items) ? section.items : [];
          const normalizedItems = rawItems
            .filter(Boolean)
            .map((item, itemIndex) => ({
              ...item,
              id:
                item?.id ||
                `${section?.id || `section-${sectionIndex}`}-item-${itemIndex}`,
            }));

          if (!normalizedItems.length) return null;

          const prefix = (() => {
            if (section?.prefix) return section.prefix;
            const value = sectionIndex + 1;
            return value < 10 ? `0${value}` : String(value);
          })();

          return {
            id: section?.id || `section-${sectionIndex}`,
            title: section?.title || null,
            subtitle: section?.subtitle || "",
            layout: section?.layout || "list",
            eyebrow: section?.eyebrow || null,
            highlight: section?.highlight || null,
            prefix,
            items: normalizedItems,
          };
        })
        .filter(Boolean);
    }

    const fallbackSections = [];

    if (Array.isArray(items) && items.length > 0) {
      fallbackSections.push({
        id: "fallback-primary",
        title: null,
        subtitle: "",
        layout: "list",
        prefix: "01",
        items: items.map((item, index) => ({
          ...item,
          id: item?.id || `menu-item-${index}`,
        })),
      });
    }

    if (
      displaySocials &&
      Array.isArray(socialItems) &&
      socialItems.length > 0
    ) {
      fallbackSections.push({
        id: "fallback-social",
        title: "Kết nối cùng EmoEase",
        subtitle: "Theo dõi chúng tôi trên các nền tảng",
        layout: "grid",
        prefix:
          fallbackSections.length >= 1
            ? "0" + (fallbackSections.length + 1)
            : "02",
        items: socialItems.map((item, index) => ({
          ...item,
          id: item?.id || `social-item-${index}`,
          isExternal: true,
        })),
      });
    }

    return fallbackSections;
  }, [menuSections, items, socialItems, displaySocials]);

  const [expandedSections, setExpandedSections] = useState(() => new Set());

  const allowedSectionIds = useMemo(
    () => new Set(resolvedSections.map((section) => section.id)),
    [resolvedSections]
  );

  useEffect(() => {
    setExpandedSections((prev) => {
      const next = new Set();
      prev.forEach((id) => {
        if (allowedSectionIds.has(id)) {
          next.add(id);
        }
      });
      return next.size === prev.size ? prev : next;
    });
  }, [allowedSectionIds]);

  const toggleSection = useCallback((sectionId) => {
    setExpandedSections((prev) => {
      // Nếu section đang mở, đóng nó lại
      if (prev.has(sectionId)) {
        return new Set();
      }
      // Nếu section đang đóng, đóng tất cả sections khác và mở section này
      return new Set([sectionId]);
    });
  }, []);

  useEffect(() => {
    if (!openRef.current) {
      setExpandedSections(new Set());
    }
  }, [open]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity"]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  // Auto-fit labels to single line inside the panel width
  const fitLabelsToSingleLine = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const list = panel.querySelector(".sm-panel-list");
    const labelNodes = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel")
    );
    if (!list || !labelNodes.length) return;

    const listComputed = window.getComputedStyle(list);
    const panelComputed = window.getComputedStyle(panel);

    const panelPaddingLeft = parseFloat(panelComputed.paddingLeft) || 0;
    const panelPaddingRight = parseFloat(panelComputed.paddingRight) || 0;
    const availableWidth =
      panel.clientWidth - panelPaddingLeft - panelPaddingRight - 16; // small safety

    // Space reserved for numbering suffix if enabled
    const numberingEnabled = list.hasAttribute("data-numbering");
    const numberingReserve = numberingEnabled ? 80 : 0; // ~right:3.2em + font-size variance

    const maxWidth = Math.max(120, availableWidth - numberingReserve);

    labelNodes.forEach((label) => {
      // Reset any previous inline size to measure natural size from CSS
      label.style.fontSize = "";
      label.style.whiteSpace = "nowrap";

      // Start from CSS-computed size and shrink as needed, clamped by viewport
      const computed = window.getComputedStyle(label);
      const basePx = parseFloat(computed.fontSize) || 64;
      const maxPx = Math.min(96, basePx * 1.2);
      const minPx = Math.max(18, Math.min(28, basePx * 0.45));

      // Binary search for best fit
      let lo = minPx;
      let hi = maxPx;
      let best = lo;

      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        label.style.fontSize = mid + "px";
        const width = label.scrollWidth;
        if (width <= maxWidth) {
          best = mid;
          lo = mid; // can try larger
        } else {
          hi = mid; // too big
        }
      }

      label.style.fontSize = Math.round(best * 100) / 100 + "px";
    });
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
        // Ensure labels fit when panel is fully visible
        try {
          fitLabelsToSingleLine();
        } catch {}
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline, fitLabelsToSingleLine]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item"
          )
        );
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    // Simple rotation animation on the icon wrapper for visual feedback
    if (opening) {
      gsap.set(icon, { transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap.fromTo(
        icon,
        { rotate: 0, scale: 0.95 },
        { rotate: 180, scale: 1, duration: 0.5, ease: "power4.out" }
      );
    } else {
      spinTweenRef.current = gsap.fromTo(
        icon,
        { rotate: 180, scale: 1 },
        { rotate: 0, scale: 0.95, duration: 0.35, ease: "power3.inOut" }
      );
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "" : "Close";
    const targetLabel = opening ? "Close" : "";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "" ? "Close" : "";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  // Refit on window resize when open
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          fitLabelsToSingleLine();
        } catch {}
      });
    };
    window.addEventListener("resize", onResize);
    // Initial run in case open without animation
    try {
      fitLabelsToSingleLine();
    } catch {}
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [open, fitLabelsToSingleLine]);

  // Close menu helper used when navigating via a menu item
  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [onMenuClose, playClose, animateIcon, animateColor, animateText]);

  const [isAuthed, setIsAuthed] = useState(
    () => !!localStorage.getItem("access_token")
  );
  useEffect(() => {
    const onAuthChanged = () =>
      setIsAuthed(!!localStorage.getItem("access_token"));
    window.addEventListener("app:auth-changed", onAuthChanged);
    return () => window.removeEventListener("app:auth-changed", onAuthChanged);
  }, []);

  const handleLogout = async () => {
    // Hide immediately in UI
    setIsAuthed(false);
    closeMenu();

    const apiBase = import.meta.env.VITE_API_AUTH_URL;
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");
    const clientDeviceId = localStorage.getItem("device_id");
    try {
      if (apiBase && refreshToken) {
        await axios.post(
          `${apiBase}/Auth/v2/token/revoke`,
          { token: accessToken, refreshToken, clientDeviceId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
      }
    } catch {
      // ignore network errors on logout
    } finally {
      try {
        // Clear Redux state first
        dispatch(logout());
      } catch {}
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("google_email");
      } catch {}
      try {
        window.dispatchEvent(new Event("app:auth-changed"));
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "success", message: "Đã đăng xuất" },
          })
        );
      } catch {}
      // Wait a bit for Redux state to update, then redirect
      setTimeout(() => {
        navigate("/onboarding", { replace: true });
      }, 100);
    }
  };

  const handleLogin = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <div className="sm-scope w-full h-full">
      <div
        className={
          (className ? className + " " : "") +
          "staggered-menu-wrapper relative w-full h-full z-40"
        }
        style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}>
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-5"
          aria-hidden="true">
          {(() => {
            const raw =
              colors && colors.length
                ? colors.slice(0, 4)
                : ["#1e1e22", "#35353c"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        <header
          className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none z-20"
          aria-label="Main navigation header">
          <div
            className="sm-logo flex items-center select-none pointer-events-auto"
            aria-label="Logo">
            <img
              src={logoUrl || "/Emo/EMO_2.webp"}
              alt="Logo"
              className="sm-logo-img block h-8 w-auto object-contain"
              draggable={false}
              width={110}
              height={24}
              hidden
            />
          </div>

          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer text-[#e9e9ef] font-medium leading-none overflow-visible pointer-events-auto"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button">
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative h-[1em] overflow-hidden whitespace-nowrap w-0 min-w-0 hidden"
              aria-hidden="true">
              <span
                ref={textInnerRef}
                className="sm-toggle-textInner flex flex-col leading-none text-white">
                {textLines.map((l, i) => (
                  <span
                    className="sm-toggle-line block h-[1em] leading-none"
                    key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center will-change-transform"
              aria-hidden="true">
              {open ? (
                <FiX className="w-[14px] h-[14px] text-white" />
              ) : (
                <div className="bg-[#dddbdb] rounded-full p-[10px]">
                  <GiHamburgerMenu className="w-[14px] h-[14px] text-black" />
                </div>
              )}
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full flex flex-col p-[4rem_2rem_2rem_2rem] overflow-y-auto overscroll-contain z-10 pointer-events-auto"
          aria-hidden={!open}>
          <div className="sm-panel-inner flex-1 flex flex-col gap-7 justify-start px-2">
            {resolvedSections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              const effectiveLayout =
                section.layout === "grid" ? "list" : section.layout;

              return (
                <section
                  key={section.id}
                  className="sm-menu-section flex flex-col gap-3"
                  data-layout={section.layout}>
                  {(section.title || section.subtitle) && (
                    <header className="sm-menu-sectionHeader flex flex-col gap-2">
                      <button
                        type="button"
                        className="sm-menu-sectionHeaderButton px-4 py-3 text-left text-white/85 "
                        onClick={() => toggleSection(section.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`menu-section-${section.id}`}>
                        <span className="sm-menu-sectionBadge inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 border border-white/20 text-xs font-semibold tracking-[0.2em] text-white/70">
                          {section.prefix}
                        </span>
                        <div className="sm-menu-sectionMeta">
                          {section.eyebrow ? (
                            <span className="sm-menu-sectionEyebrow text-xs uppercase tracking-[0.25em] text-white/50">
                              {section.eyebrow}
                            </span>
                          ) : null}
                          {section.title ? (
                            <h3 className="sm-menu-sectionTitle text-xl sm:text-xl font-semibold text-[#ffffff] tracking-tight m-0">
                              {section.title}
                            </h3>
                          ) : null}
                          {section.subtitle ? (
                            <p className="sm-menu-sectionSubtitle text-sm text-white/65 m-0">
                              {section.subtitle}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={`sm-menu-sectionChevron inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}>
                          <FiChevronDown className="h-5 w-5" />
                        </span>
                      </button>
                      {section.highlight ? (
                        <span className="sm-menu-sectionHighlight inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 border border-white/15">
                          {section.highlight}
                        </span>
                      ) : null}
                    </header>
                  )}

                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.ul
                        id={`menu-section-${section.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className={`sm-panel-list list-none m-0 p-0 flex ${
                          effectiveLayout === "grid"
                            ? "sm-panel-listGrid flex-wrap gap-4"
                            : "flex-col gap-4"
                        }`}
                        data-numbering={
                          displayItemNumbering && effectiveLayout === "list"
                            ? "true"
                            : undefined
                        }
                        role="list"
                        style={{ overflow: "hidden" }}>
                        {section.items.map((item, itemIndex) => {
                          const isGrid = effectiveLayout === "grid";
                          const baseClass = [
                            "sm-panel-item group relative w-full overflow-hidden",
                            isGrid
                              ? "sm-panel-item--grid"
                              : "sm-panel-item--list",
                          ].join(" ");
                          const ariaLabel = item.ariaLabel || item.label;
                          const content = (
                            <span className="sm-panel-itemLabel flex w-full flex-col gap-1 text-base sm:text-lg font-semibold leading-snug tracking-tight text-inherit">
                              <span className="sm-menu-itemTitle text-current">
                                {item.label}
                              </span>
                              {item.description ? (
                                <span className="sm-menu-itemSubtitle text-sm font-normal text-white/65">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                          );

                          const commonProps = {
                            className: baseClass,
                            "aria-label": ariaLabel,
                            "data-index": itemIndex + 1,
                          };

                          if (
                            item.actionOnly ||
                            (!item.link && item.onSelect)
                          ) {
                            return (
                              <li
                                className="sm-panel-itemWrap relative overflow-hidden leading-none"
                                key={item.id}>
                                <button
                                  type="button"
                                  {...commonProps}
                                  onClick={() => {
                                    try {
                                      item.onSelect?.();
                                    } finally {
                                      closeMenu();
                                    }
                                  }}>
                                  {content}
                                </button>
                              </li>
                            );
                          }

                          if (item.isExternal) {
                            return (
                              <li
                                className="sm-panel-itemWrap relative overflow-hidden leading-none"
                                key={item.id}>
                                <a
                                  {...commonProps}
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => {
                                    closeMenu();
                                  }}>
                                  {content}
                                </a>
                              </li>
                            );
                          }

                          if (item.link) {
                            return (
                              <li
                                className="sm-panel-itemWrap relative overflow-hidden leading-none"
                                key={item.id}>
                                <Link
                                  {...commonProps}
                                  to={item.link}
                                  onClick={(event) => {
                                    try {
                                      item.onSelect?.(event);
                                    } finally {
                                      closeMenu();
                                    }
                                  }}>
                                  {content}
                                </Link>
                              </li>
                            );
                          }

                          return (
                            <li
                              className="sm-panel-itemWrap relative overflow-hidden leading-none"
                              key={item.id}>
                              <button
                                type="button"
                                {...commonProps}
                                onClick={() => {
                                  try {
                                    item.onSelect?.();
                                  } finally {
                                    closeMenu();
                                  }
                                }}>
                                {content}
                              </button>
                            </li>
                          );
                        })}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                </section>
              );
            })}

            <div className="sm-menu-account mt-auto flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg text-white/85">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm uppercase tracking-[0.4em] text-white/45">
                    Tài khoản
                  </span>
                  <span className="text-base font-semibold text-white">
                    {isAuthed
                      ? "Bạn đang đăng nhập"
                      : "Đăng nhập để trải nghiệm đầy đủ"}
                  </span>
                </div>
                {/* <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/60">
                  <FiPlus className="h-4 w-4" />
                </div> */}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {isAuthed ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="sm-menu-accountButton inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px hover:scale-[1.01] hover:border-white/60 hover:bg-white/25">
                    <FiX className="h-4 w-4" />
                    Đăng xuất
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="sm-menu-accountButton inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-white text-[#3e1c6f] px-4 py-2 text-sm font-semibold shadow-[0_12px_30px_-15px_rgba(255,255,255,0.65)] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_18px_34px_-12px_rgba(255,255,255,0.75)]">
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        navigate("/signup");
                      }}
                      className="sm-menu-accountButton inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px hover:border-white/45 hover:bg-white/10">
                      Tạo tài khoản mới
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
/* Starry night animation */
.starry-night::before,
.starry-night::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 90% 80%, white, transparent),
    radial-gradient(1px 1px at 33% 85%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 50% 20%, white, transparent),
    radial-gradient(1px 1px at 15% 90%, rgba(255,255,255,0.8), transparent);
  background-size: 300% 300%;
  background-position: 0% 0%, 100% 50%, 0% 100%, 50% 0%, 100% 100%, 0% 0%, 50% 100%, 100% 50%;
  animation: shimmer 20s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.sm-scope .staggered-menu-wrapper { 
  position: relative; 
  width: 100%; 
  height: 100%; 
  z-index: 40; 
}

.sm-scope .staggered-menu-header { 
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 1.5rem 2rem; 
  background: transparent; 
  pointer-events: none; 
  z-index: 20; 
}

.sm-scope .staggered-menu-header > * { 
  pointer-events: auto; 
}

.sm-scope .sm-logo { 
  display: flex; 
  align-items: center; 
  user-select: none; 
}

.sm-scope .sm-logo-img { 
  display: block; 
  height: 32px; 
  width: auto; 
  object-fit: contain; 
}

.sm-scope .sm-toggle { 
  position: relative; 
  display: inline-flex; 
  align-items: center; 
  gap: 0.5rem; 
  background: transparent; 
  border: none; 
  cursor: pointer; 
  color: #e9e9ef; 
  font-weight: 500; 
  line-height: 1; 
  overflow: visible; 
  transition: all 0.3s ease;
}

.sm-scope .sm-toggle:focus-visible { 
  outline: 2px solid #ffffffaa; 
  outline-offset: 4px; 
  border-radius: 8px; 
}

.sm-scope .sm-toggle:hover {
  transform: scale(1.05);
}

.sm-scope .sm-toggle-textWrap { 
  position: relative; 
  margin-right: 0.5em; 
  display: inline-block; 
  height: 1em; 
  overflow: hidden; 
  white-space: nowrap; 
  width: var(--sm-toggle-width, auto); 
  min-width: var(--sm-toggle-width, auto); 
}

.sm-scope .sm-toggle-textInner { 
  display: flex; 
  flex-direction: column; 
  line-height: 1; 
}

.sm-scope .sm-toggle-line { 
  display: block; 
  height: 1em; 
  line-height: 1; 
}

.sm-scope .sm-icon { 
  position: relative; 
  width: 16px; 
  height: 16px; 
  flex: 0 0 16px; 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  will-change: transform; 
  transition: transform 0.3s ease;
}

.sm-scope .sm-panel-itemWrap { 
  position: relative; 
  overflow: hidden; 
  line-height: 1; 
}

.sm-scope .staggered-menu-panel { 
  position: absolute; 
  top: 0; 
  right: 0; 
  width: clamp(320px, 40vw, 480px); 
  height: 100%; 
  background: linear-gradient(180deg, rgba(39,14,79,0.96), rgba(74,28,133,0.95), rgba(103,45,194,0.93)); 
  display: flex; 
  flex-direction: column; 
  padding: 4rem 2rem 2rem 2rem; 
  overflow-y: auto; 
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;
  z-index: 10; 
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
}

.sm-scope [data-position='left'] .staggered-menu-panel { 
  right: auto; 
  left: 0; 
  box-shadow: 10px 0 40px rgba(0, 0, 0, 0.3);
}

.sm-scope .sm-prelayers { 
  position: absolute; 
  top: 0; 
  right: 0; 
  bottom: 0; 
  width: clamp(320px, 40vw, 480px); 
  pointer-events: none; 
  z-index: 5; 
}

.sm-scope [data-position='left'] .sm-prelayers { 
  right: auto; 
  left: 0; 
}

.sm-scope .sm-prelayer { 
  position: absolute; 
  top: 0; 
  right: 0; 
  height: 100%; 
  width: 100%; 
  transform: translateX(0); 
}

.sm-scope .sm-panel-inner { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  justify-content: flex-start; 
  gap: 1.75rem;
  padding: 0 0.5rem;
} 

.sm-scope .sm-panel-list {
  gap: 0.75rem !important;
}

.sm-scope .sm-socials { 
  margin-top: auto; 
  padding-top: 2rem; 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.sm-scope .sm-socials-title { 
  margin: 0; 
  font-size: 1.25rem; 
  font-weight: 600; 
  color: rgba(255, 255, 255, 0.9); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.sm-scope .sm-socials-list { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  gap: 1.5rem; 
  flex-wrap: wrap; 
}

.sm-scope .sm-socials-link { 
  font-size: 1rem; 
  font-weight: 500; 
  color: rgba(255, 255, 255, 0.8); 
  text-decoration: none; 
  position: relative; 
  padding: 0.625rem 1.25rem; 
  display: inline-block; 
  transition: all 0.3s ease; 
  border-radius: 9999px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.sm-scope .sm-socials-link:hover { 
  color: rgb(255, 255, 255); 
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.sm-scope .sm-socials-link:focus-visible { 
  outline: 2px solid var(--sm-accent, #5227FF); 
  outline-offset: 2px; 
}

.sm-scope .sm-panel-list { 
  list-style: none; 
  margin: 0; 
  padding: 0; 
  display: flex; 
  flex-direction: column; 
  gap: 1.25rem; 
  width: 100%;
}

.sm-scope .sm-panel-listGrid { 
  display: grid !important; 
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
  gap: 1.2rem; 
}

.sm-scope .sm-menu-sectionHeader {
  align-items: flex-start;
}

.sm-scope .sm-menu-sectionBadge {
  font-variant-numeric: tabular-nums;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 8px 20px -14px rgba(255,255,255,0.6);
}

.sm-scope .sm-menu-sectionTitle {
  font-size: 1rem;
  line-height: 1.4;
}

.sm-scope .sm-menu-sectionSubtitle {
  line-height: 1.6;
}

.sm-scope .sm-panel-item { 
  position: relative; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  justify-content: flex-start; 
  gap: 0.45rem;
  width: 100%;
  text-decoration: none; 
  color: white; 
  padding: 0.9rem 1.2rem; 
  min-height: 86px; 
}

.sm-scope .sm-panel-item:hover { 

  border-color: rgba(255, 255, 255, 0.34); 
  background: linear-gradient(130deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08));
  box-shadow: 0 22px 38px -22px rgba(26, 13, 70, 0.65);
}

.sm-scope .sm-panel-item--list { 
  padding-left: 1.8rem;
}

.sm-scope .sm-panel-item--list::before {
  content: "";
  position: absolute;
  left: 0.95rem;
  top: 50%;
  width: 6px;
  height: 48%;
  min-height: 32px;
  border-radius: 999px;
  opacity: 0.65;
  transform: translateY(-50%);
  transition: opacity 0.25s ease;
}

.sm-scope .sm-panel-item--list:hover::before {
  opacity: 1;
}

.sm-scope .sm-panel-item--grid { 
  align-items: center; 
  text-align: center; 
  min-height: 130px; 
  padding: 1.2rem;
}

.sm-scope .sm-panel-item--grid::before {
  display: none;
}

.sm-scope .sm-panel-itemLabel { 
  display: inline-flex; 
  flex-direction: column; 
  align-items: flex-start; 
  text-align: left; 
  will-change: transform; 
  transform-origin: 50% 100%; 
  width: 100%;
}

.sm-scope .sm-panel-item--grid .sm-panel-itemLabel {
  align-items: center;
  text-align: center;
}

.sm-scope .sm-menu-itemTitle {
  font-size: clamp(1rem, 1.25vw, 1.18rem);
  line-height: 1.4;
  font-weight: 600;
}

.sm-scope .sm-menu-itemSubtitle {
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(255,255,255,0.72);
}

.sm-scope .sm-menu-itemExternal {
  font-size: 0.65rem;
  letter-spacing: 0.28em;
}

.sm-scope .sm-menu-sectionHeaderButton {
  min-height: 116px;
  padding: 1.1rem 1.35rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
}

.sm-scope .sm-menu-sectionMeta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.sm-scope .sm-menu-sectionHeaderButton[aria-expanded="true"] {
  border-color: rgba(255,255,255,0.38);
  background: linear-gradient(140deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08));
}

.sm-scope .sm-menu-sectionChevron {
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.sm-scope .sm-menu-sectionHeaderButton:hover .sm-menu-sectionChevron {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.16);
}

.sm-scope .sm-menu-sectionHeaderButton[aria-expanded="true"] .sm-menu-sectionChevron {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.2);
}

.sm-scope .sm-menu-sectionBadge {
  flex-shrink: 0;
}

.sm-scope .sm-menu-sectionTitle {
  font-size: clamp(1rem, 1.3vw, 1.25rem);
}

.sm-scope .sm-menu-sectionSubtitle {
  font-size: 0.92rem;
  max-width: 32ch;
}

.sm-scope .sm-menu-account {
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05));
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 25px 45px -25px rgba(23, 9, 54, 0.7);
}

.sm-scope .sm-menu-accountButton {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.sm-scope .sm-menu-accountButton:focus-visible {
  outline: 2px solid rgba(255,255,255,0.55);
  outline-offset: 2px;
}

.sm-scope .sm-panel-list[data-numbering] { 
  /* numbering disabled - generated numeric badges removed */
}

/* Responsive Design */
@media (max-width: 1024px) { 
  .sm-scope .staggered-menu-panel { 
    width: 100%; 
    left: 0; 
    right: 0; 
    padding: 3rem 1.5rem 1.5rem 1.5rem;
  } 
  .sm-scope .sm-panel-inner {
    gap: 1.5rem;
  }
  .sm-scope .sm-panel-list {
    gap: 1.25rem;
  }
}

@media (max-width: 768px) { 
  .sm-scope .staggered-menu-header {
    padding: 1rem 1.5rem;
  }
  .sm-scope .staggered-menu-panel { 
    width: 100%; 
    left: 0; 
    right: 0; 
    padding: 3rem 1.5rem 1.5rem 1.5rem;
  } 
  .sm-scope .sm-panel-item { 
    min-height: 95px; 
    padding: 0.8rem 1rem;
  } 
  .sm-scope .sm-panel-item--list {
    padding-left: 1.55rem;
  }
  .sm-scope .sm-panel-item--list::before {
    left: 0.75rem;
    height: 44%;
  }
  .sm-scope .sm-panel-itemLabel {
    gap: 0.35rem;
  }
  .sm-scope .sm-menu-itemSubtitle {
    font-size: 0.85rem;
  }
  .sm-scope .sm-menu-sectionHeaderButton {
    min-height: 108px;
    padding: 1rem 1.15rem;
  }
}

@media (max-width: 640px) { 
  .sm-scope .staggered-menu-panel { 
    padding: 2.5rem 1rem 1rem 1rem;
  } 
  .sm-scope .sm-panel-item { 
    min-height: 90px; 
    padding: 0.7rem 0.85rem;
  } 
  .sm-scope .sm-panel-item--list {
    padding-left: 1.45rem;
  }
  .sm-scope .sm-panel-item--list::before {
    left: 0.65rem;
    height: 42%;
  }
  .sm-scope .sm-panel-inner {
    gap: 1.25rem;
  }
  .sm-scope .sm-panel-listGrid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  .sm-scope .sm-menu-account {
    gap: 0.75rem;
  }
  .sm-scope .sm-menu-sectionHeaderButton {
    min-height: 102px;
    padding: 0.9rem 1rem;
  }
  .sm-scope .sm-menu-sectionSubtitle {
    max-width: 100%;
  }
}

/* Performance optimizations */
.sm-scope .sm-panel-item,
.sm-scope .sm-socials-link {
  will-change: transform, color;
}

.sm-scope .sm-panel-itemLabel {
  will-change: transform;
}

/* Smooth scrolling */
.sm-scope .staggered-menu-panel {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Focus management */
.sm-scope .sm-panel-item:focus-visible,
.sm-scope .sm-socials-link:focus-visible {
  outline: 2px solid var(--sm-accent, #5227FF);
  outline-offset: 2px;
  border-radius: 4px;
}
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
