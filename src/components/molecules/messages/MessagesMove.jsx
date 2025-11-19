import React, { useEffect, useMemo, useState } from "react";
import { FiUser } from "react-icons/fi";

const MessagesMove = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mql.matches);
    setReduceMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const messages = useMemo(
    () => [
      {
        text: "Mình ổn, chỉ hơi mệt một chút.",
        time: "vừa xong",
        tags: ["tâm_sự", "tự_care"],
      },
      {
        text: "Có lẽ hôm nay không ổn lắm...",
        time: "3 phút trước",
        tags: ["chán_nản"],
      },
      {
        text: "Cảm ơn vì đã hỏi, điều đó ý nghĩa lắm.",
        time: "8 phút trước",
        tags: ["biết_ơn"],
      },
      {
        text: "Mình đang cố gắng tốt hơn từng ngày.",
        time: "12 phút trước",
        tags: ["cố_gắng", "hy_vọng"],
      },
      {
        text: "Có thể nói chuyện một lát không?",
        time: "16 phút trước",
        tags: ["cần_lắng_nghe"],
      },
      {
        text: "Mọi thứ sẽ ổn thôi. Mình tin vậy.",
        time: "22 phút trước",
        tags: ["tích_cực"],
      },
      {
        text: "Hôm nay khá nặng nề...",
        time: "35 phút trước",
        tags: ["thành_thật"],
      },
      {
        text: "Chỉ muốn được ôm một cái.",
        time: "1 giờ trước",
        tags: ["an_ủi"],
      },
      {
        text: "Ổn hơn hôm qua rồi.",
        time: "2 giờ trước",
        tags: ["tiến_triển"],
      },
      {
        text: "Không sao đâu, mình chịu được.",
        time: "3 giờ trước",
        tags: ["kiên_cường"],
      },
      {
        text: "Muốn nghỉ ngơi một chút.",
        time: "5 giờ trước",
        tags: ["nghỉ_ngơi"],
      },
      { text: "Thật sự không ổn.", time: "hôm qua", tags: ["cần_giúp_đỡ"] },
    ],
    []
  );

  const renderCards = (keyPrefix) =>
    messages.map((msg, idx) => (
      <div
        key={`${keyPrefix}-${idx}`}
        className="group shrink-0 snap-start rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-4 sm:p-5 md:p-6 min-w-[16rem] sm:min-w-[18rem] md:min-w-[20rem] hover:bg-white/15 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-fuchsia-500/60 to-cyan-400/60 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative grid place-items-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <FiUser className="text-white/80" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-white/90 font-medium">Ẩn danh</div>
            <div className="text-white/50 text-xs">{msg.time}</div>
          </div>
        </div>
        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
          {msg.text}
        </p>
        {msg.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs px-2 py-1 rounded-full border border-white/15 bg-white/5 text-white/70">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    ));

  return (
    <section className="relative w-full py-8 sm:py-10">
      {/* soft lights */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* marquee container (edge-to-edge) */}
      <div className="relative w-full">
        <div className="relative overflow-hidden border-t border-b border-white/10 bg-white/[0.03] backdrop-blur-xl py-2">
          {reduceMotion ? (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2">
              {renderCards("rm")}
            </div>
          ) : (
            <div className="relative w-full py-2">
              <div
                className="flex gap-4 marquee will-change-transform"
                aria-hidden="true">
                {renderCards("a")}
                {renderCards("b")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* local styles for marquee animation */}
      <style>{`
        /* Seamless loop: two concatenated sets, shift by 50% width */
        @keyframes messages-marquee-right { from { transform: translateX(0%); } to { transform: translateX(-50%); } }
        .marquee { animation: messages-marquee-right 60s linear infinite; width: max-content; }
      `}</style>
    </section>
  );
};

export default MessagesMove;
