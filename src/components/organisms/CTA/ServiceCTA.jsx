import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function ServiceCTA() {
  const navigate = useNavigate();
  const features = [
    "Trải nghiệm miễn phí",
    "Chuyên gia đồng hành",
    "Bảo mật 100%",
  ];

  const handleCTAClick = () => {
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      // User đã đăng nhập, đi đến /home (web phụ)
      navigate("/home");
    } else {
      // User chưa đăng nhập, đi đến /onboarding
      navigate("/onboarding");
    }
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "clamp(56px, 8vw, 112px) 0",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 45%, #eef2ff 100%)",
      }}>
      {/* Subtle gradient beams */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "140%",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(216, 180, 254, 0.35) 0%, rgba(216, 180, 254, 0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "50%",
          height: "120%",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(147, 197, 253, 0.35) 0%, rgba(147, 197, 253, 0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "64px",
          left: "36px",
          width: "110px",
          height: "110px",
          background:
            "linear-gradient(90deg, rgba(196,181,253,0.35) 0%, rgba(251,207,232,0.35) 100%)",
          borderRadius: "9999px",
          filter: "blur(36px)",
        }}
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{
          position: "absolute",
          bottom: "64px",
          right: "36px",
          width: "140px",
          height: "140px",
          background:
            "linear-gradient(90deg, rgba(129,140,248,0.35) 0%, rgba(196,181,253,0.35) 100%)",
          borderRadius: "9999px",
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 16px",
          textAlign: "center",
        }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}>
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: "clamp(2rem, 4.8vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#0f172a",
              margin: "0 auto 16px",
            }}>
            Bạn xứng đáng có một hành trình <br />
            <span
              style={{
                background: "linear-gradient(90deg,#8b5cf6 0%,#ec4899 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}>
              chữa lành nhẹ nhàng
            </span>
          </motion.h2>

          {/* Sub heading */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "clamp(1.05rem, 2.3vw, 1.25rem)",
              color: "#475569",
              lineHeight: 1.7,
              maxWidth: "780px",
              margin: "0 auto 24px",
            }}>
            Chúng tôi ở đây để đồng hành cùng bạn. Bắt đầu từ bước nhỏ nhất –
            trải nghiệm thử, trò chuyện cùng chuyên gia, hoặc tìm kiếm sự cân
            bằng qua các công cụ hỗ trợ cảm xúc.
          </motion.p>

          {/* CTA actions */}
          {/* <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
            }}>
      
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: "relative",
                padding: 2,
                borderRadius: 16,
                background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
              }}>
              <button
                onClick={handleCTAClick}
                aria-label="Khám phá lựa chọn phù hợp với bạn"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 28px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  background: "white",
                  color: "#6d28d9",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  boxShadow: "0 12px 24px rgba(109,40,217,0.15)",
                }}>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 14,
                    background: "linear-gradient(90deg, #ede9fe, #fce7f3)",
                    opacity: 0.6,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                  Khám phá lựa chọn phù hợp với bạn
                  <motion.svg
                    style={{
                      width: 20,
                      height: 20,
                      fill: "none",
                      stroke: "currentColor",
                    }}
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </span>
              </button>
            
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.35 }}
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: 18,
                  background:
                    "radial-gradient(60% 60% at 50% 50%, rgba(236,72,153,0.25), rgba(139,92,246,0.2))",
                  filter: "blur(18px)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </motion.div> */}

          {/* Social proof */}
          <motion.p
            variants={itemVariants}
            style={{ color: "#64748b", marginTop: 14 }}>
            Hơn <strong>1000+</strong> người dùng đã bắt đầu hành trình chữa
            lành cùng Emo.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceCTA;
