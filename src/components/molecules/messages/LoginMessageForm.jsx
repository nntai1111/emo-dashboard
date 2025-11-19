import React, { useState } from "react";
import { FiSend, FiCheck } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const LoginMessageForm = ({ className = "" }) => {
  const [form, setForm] = useState({ message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success
  const MAX_CHARS = 280;
  const msgLen = form.message.length;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) return;
    setSubmitting(true);
    // Placeholder: integrate with your API later
    await new Promise((r) => setTimeout(r, 600));
    // Reset only the message to encourage multiple shares, keep email state
    setForm({ message: "" });
    setSubmitting(false);
    setStatus("success");
  };

  return (
    <div
      className={`relative w-full max-w-[22rem] sm:max-w-[24rem] ${className}`}>
      <div
        className="relative w-full aspect-square"
        style={{ aspectRatio: "1 / 1" }}>
        {/* Moving gradient layer (acts as the border) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl p-[1.5px] bg-gradient-to-r from-fuchsia-500/60 via-pink-500/60 to-cyan-300/60 bg-[length:200%_200%] [will-change:background-position] animate-[borderGradientMove_16s_linear_infinite] motion-reduce:animate-none pointer-events-none shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        />
        {/* Content wrapper above, leaving a thin gap so the border shows */}
        <div className="absolute inset-[1.5px] rounded-2xl overflow-hidden p-1">
          <div className="h-full w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative grid place-items-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
                <img
                  src="/logoTabBrowser/emo.webp"
                  alt="User"
                  className="h-10 w-10 object-cover rounded-full"
                />
              </div>
              <div className="leading-tight">
                <div className="text-slate-900 font-semibold">
                  Chia sẻ thông điệp
                </div>
                <div className="text-slate-500 text-xs">
                  Hãy nói điều bạn muốn hôm nay
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-100/80 mb-3" aria-hidden="true" />
            <div className="relative mt-1 flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16 }}
                    className="h-full w-full flex flex-col items-center justify-center text-center px-3">
                    {/* Empathy hearts rising near the center */}
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[68%] w-[320px] h-[320px]"
                      aria-hidden>
                      {[
                        {
                          left: "3%",
                          delay: 0.0,
                          size: 10,
                          cls: "text-rose-500/80",
                        },
                        {
                          left: "10%",
                          delay: 0.03,
                          size: 22,
                          cls: "text-pink-500/80",
                        },
                        {
                          left: "17%",
                          delay: 0.06,
                          size: 12,
                          cls: "text-fuchsia-500/80",
                        },
                        {
                          left: "24%",
                          delay: 0.09,
                          size: 26,
                          cls: "text-amber-500/80",
                        },
                        {
                          left: "31%",
                          delay: 0.12,
                          size: 14,
                          cls: "text-cyan-500/70",
                        },
                        {
                          left: "38%",
                          delay: 0.15,
                          size: 8,
                          cls: "text-rose-500/80",
                        },
                        {
                          left: "45%",
                          delay: 0.18,
                          size: 24,
                          cls: "text-pink-500/80",
                        },
                        {
                          left: "52%",
                          delay: 0.21,
                          size: 12,
                          cls: "text-fuchsia-500/80",
                        },
                        {
                          left: "59%",
                          delay: 0.24,
                          size: 20,
                          cls: "text-amber-500/80",
                        },
                        {
                          left: "66%",
                          delay: 0.27,
                          size: 11,
                          cls: "text-cyan-500/70",
                        },
                        {
                          left: "73%",
                          delay: 0.3,
                          size: 22,
                          cls: "text-rose-500/80",
                        },
                        {
                          left: "80%",
                          delay: 0.33,
                          size: 9,
                          cls: "text-pink-500/80",
                        },
                        {
                          left: "28%",
                          delay: 0.36,
                          size: 16,
                          cls: "text-fuchsia-500/80",
                        },
                        {
                          left: "48%",
                          delay: 0.39,
                          size: 18,
                          cls: "text-amber-500/80",
                        },
                        {
                          left: "68%",
                          delay: 0.42,
                          size: 10,
                          cls: "text-cyan-500/70",
                        },
                        {
                          left: "15%",
                          delay: 0.45,
                          size: 24,
                          cls: "text-rose-500/80",
                        },
                        {
                          left: "85%",
                          delay: 0.48,
                          size: 12,
                          cls: "text-pink-500/80",
                        },
                      ].map((h, i) => (
                        <motion.svg
                          key={`heart-${i}`}
                          viewBox="0 0 24 24"
                          width={h.size}
                          height={h.size}
                          className={`absolute ${h.cls}`}
                          style={{ left: h.left, bottom: 0 }}
                          initial={{
                            y: 0,
                            x: 0,
                            scale: h.size >= 20 ? 0.8 : 0.65,
                            opacity: 0,
                            rotate: 0,
                          }}
                          animate={{
                            y: -240,
                            x: [0, -6, 6],
                            scale: 1,
                            opacity: [0, 1, 0],
                            rotate: [0, -8, 6],
                          }}
                          transition={{
                            duration:
                              h.size >= 20 ? 3.0 : h.size <= 10 ? 2.2 : 2.6,
                            ease: "easeOut",
                            delay: 0.15 + h.delay,
                          }}>
                          <path
                            fill="currentColor"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.53 5.01 13.2 4 14.94 4 17.43 4 19.44 6 19.44 8.5c0 3.78-3.4 6.86-8.05 11.54L12 21.35z"
                          />
                        </motion.svg>
                      ))}
                    </div>
                    {/* Subtle floating bubbles as backdrop */}
                    <div
                      className="pointer-events-none absolute inset-0 -z-10"
                      aria-hidden>
                      <motion.span
                        className="absolute w-24 h-24 rounded-full bg-fuchsia-200/40 blur-2xl"
                        style={{ left: "8%", top: "10%" }}
                        animate={{ y: [0, -10, 0], opacity: [0.6, 0.9, 0.6] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.span
                        className="absolute w-20 h-20 rounded-full bg-cyan-200/40 blur-2xl"
                        style={{ right: "10%", top: "18%" }}
                        animate={{ y: [0, 12, 0], opacity: [0.5, 0.85, 0.5] }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                      />
                      <motion.span
                        className="absolute w-16 h-16 rounded-full bg-amber-200/40 blur-2xl"
                        style={{ left: "18%", bottom: "12%" }}
                        animate={{ y: [0, -8, 0], opacity: [0.5, 0.8, 0.5] }}
                        transition={{
                          duration: 5.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.4,
                        }}
                      />
                    </div>

                    {/* Gradient check badge */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 230,
                        damping: 18,
                      }}
                      className="grid place-items-center w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white shadow-lg"
                      aria-hidden>
                      <FiCheck className="text-white" size={28} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.25 }}
                      className="mt-3">
                      <div className="text-slate-900 font-semibold">
                        Cảm ơn bạn đã chia sẻ
                      </div>
                      <div className="text-slate-500 text-sm mt-1 max-w-[18rem]">
                        “Đôi khi chỉ cần nói ra thôi cũng đã nhẹ nhõm hơn một
                        chút.”
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.25 }}
                      className="mt-5 w-full">
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 shadow-sm transition">
                        Chia sẻ thêm một điều nữa
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16 }}
                    className="flex-1 min-h-0 flex flex-col">
                    <div className="space-y-2 min-h-0">
                      <label className="block">
                        <span className="block text-xs text-slate-600">
                          Thông điệp của bạn
                        </span>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={onChange}
                          rows={4}
                          placeholder="Chia sẻ điều bạn muốn nói hôm nay..."
                          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-slate-900 placeholder:text-slate-400 placeholder:italic outline-none shadow-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none"
                        />
                      </label>
                      <div className="flex items-center justify-end">
                        <span
                          className={`${
                            msgLen > MAX_CHARS
                              ? "text-red-500"
                              : msgLen > MAX_CHARS * 0.85
                              ? "text-amber-500"
                              : "text-slate-400"
                          } text-[11px]`}>
                          {msgLen}/{MAX_CHARS}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={submitting || !form.message}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500/90 via-pink-500/90 to-cyan-400/90 hover:from-fuchsia-500 hover:via-pink-500 hover:to-cyan-400 text-white font-medium py-2.5 shadow-sm active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiSend />
                        {submitting ? "Đang gửi..." : "Chia sẻ một chút…"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMessageForm;
