import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import "../../../../styles/component/TimelineDemo.css";
import { motion, useScroll, useTransform } from "motion/react";

export default function TimelineDemo() {
  const events = [
    {
      status: "EmoChat",
      date: "24/01/2025",
      icon: "pi pi-comments",
      color: "#ffffff",
      banner: "/image/timeline/emoChat.webp",
      description:
        "Người bạn đồng hành thông minh, luôn lắng nghe bạn 24/7. EmoChatbot nhận diện cảm xúc, đưa ra gợi ý thư giãn, trích dẫn truyền cảm hứng và hướng dẫn thực hành để giúp bạn tìm lại sự cân bằng.",
    },
    {
      status: "EmoCommunity",
      date: "27/03/2025",
      icon: "pi pi-globe",
      color: "#ffffff",
      banner: "/image/timeline/emoCommunity.webp",
      description:
        "Một cộng đồng ẩn danh, nơi mọi cảm xúc đều được trân trọng. Người dùng có thể chia sẻ câu chuyện, suy nghĩ và cảm xúc cá nhân trong một không gian an toàn, không phán xét.",
    },
    {
      status: "EmoTest",
      date: "11/02/2025",
      icon: "pi pi-cog",
      color: "#ffffff",
      banner: "/image/timeline/emoTest.webp",
      description:
        "Các bài kiểm tra tâm lý khoa học giúp bạn hiểu rõ trạng thái cảm xúc hiện tại. Kết quả được trình bày trực quan và liên kết với lộ trình cá nhân hóa, đồng bộ với các tính năng khác để hỗ trợ toàn diện.",
    },
    {
      status: "EmoSpace",
      date: "03/03/2025",
      icon: "pi pi-compass",
      color: "#ffffff",
      banner: "/image/timeline/emoSpace.webp",
      description:
        "Kho self-care toàn diện với kiến thức, bài viết và công cụ thực hành như journaling hay breathing exercises. Đây là nơi bạn nuôi dưỡng kỹ năng quản lý cảm xúc và hình thành những thói quen tích cực hằng ngày.",
    },
    {
      status: "EmoBalance",
      date: "27/03/2025",
      icon: "pi pi-globe",
      color: "#ffffff",
      banner: "/image/timeline/emoBalance.webp",
      description:
        "Không gian thiền và chánh niệm với các audio, video và bài tập thực hành. EmoBalance xây dựng lộ trình rèn luyện dựa trên kết quả EmoTest, giúp hình thành thói quen sống cân bằng và bền vững.",
    },
  ];

  const customizedMarker = (item) => {
    const style = {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)",
      boxShadow: `0 0 0 4px ${item.color}22, 0 0 0 8px ${item.color}11, 0 10px 20px ${item.color}33`,
      border: `2px solid ${item.color}`,
      color: item.color,
    };
    return (
      <span className="marker-wrap">
        <span className="marker-circle" style={style}>
          <i className={`${item.icon} marker-icon`} />
        </span>
      </span>
    );
  };

  const customizedOpposite = (item) => (
    <div className="opposite relative group h-full flex items-center">
      <div className="opposite-media flex items-center justify-center">
        <div className="opposite-media-square relative overflow-hidden rounded-xl shadow-lg">
          {item.banner ? (
            <img
              src={item.banner}
              alt={item.status}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="opposite-media--placeholder bg-gray-700 w-full h-full rounded-xl" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>
    </div>
  );

  const customizedContent = (item) => {
    return (
      <div className="content-wrapper w-full flex">
        <Card
          className="content-card max-w-md w-full bg-transparent border-none shadow-none rounded-xl p-0"
          title={
            <div className="flex items-center gap-2 justify-start">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                {item.status}
              </span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          }>
          <div className="px-0 py-2">
            <p className="desc text-left text-gray-200 leading-relaxed">
              {item.description ||
                "Trải nghiệm mượt mà, trực quan và bảo mật – hỗ trợ bạn xử lý cảm xúc mọi lúc mọi nơi."}
            </p>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="card customized-timeline-root max-w-7xl mx-auto w-full">
      {/* Scroll-animated center line wrapper */}
      <TimelineWithProgress
        progressAvatarSrc={"/image/service/logo_timeline.webp"}>
        <Timeline
          value={events}
          align="alternate"
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
          opposite={customizedOpposite}
        />
      </TimelineWithProgress>
    </div>
  );
}

// A wrapper that draws a center line and an animated progress fill as you scroll.
function TimelineWithProgress({ children, progressAvatarSrc }) {
  const wrapRef = useRef(null);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    const measure = () => {
      if (!el) return;
      setHeight(el.getBoundingClientRect().height);
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== "undefined" && el) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }
    return () => {
      if (ro && el) ro.unobserve(el);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 10%", "end 80%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // When progress effectively reaches the end, emit a global event once
      if (v >= 0.995 && !firedRef.current) {
        firedRef.current = true;
        try { window.dispatchEvent(new Event("timeline:progress-complete")); } catch {}
      }
      // Reset when user scrolls far enough back up
      if (v < 0.7) firedRef.current = false;
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div ref={wrapRef} className="timeline-prog-container">
      {/* Background center line */}
      <div className="timeline-center-line" style={{ height: `${height}px` }} />

      {/* Animated progress fill */}
      <motion.div
        className="timeline-progress-fill"
        style={{ height: heightTransform, opacity: opacityTransform }}
      />

      {/* Moving progress dot */}
      <div className="timeline-progress-dot-wrap ">
        <motion.span
          className="timeline-progress-dot "
          style={{
            y: heightTransform,
            opacity: opacityTransform,
          }}>
          <span className="timeline-progress-dot-inner">
            {progressAvatarSrc ? (
              <img src={progressAvatarSrc} alt="progress" />
            ) : null}
          </span>
        </motion.span>
      </div>

      {/* Content above the line */}
      <div ref={contentRef} className="timeline-content-layer">
        {children}
      </div>
    </div>
  );
}
