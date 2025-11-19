import React from "react";
import styles from "../../../../styles/button/LuxuryBtn.module.css";

export default function LuxuryBtn({ text, onClick, variant = "default" }) {
  const buttonClass =
    variant === "responsive"
      ? `${styles.luxuryBtn} ${styles.luxuryBtnResponsive}`
      : styles.luxuryBtn;

  return (
    <button className={buttonClass} onClick={onClick} type="button">
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        height="100%"
        width="100%"
        className={styles.luxuryBtn__border}>
        <path
          stroke="currentColor"
          fill="none"
          d="M5,20 Q50,5 95,20 Q95,50 95,80 Q50,95 5,80 Q5,50 5,20"
          className={styles.luxuryBtn__borderPath}></path>
      </svg>
      <svg
        viewBox="0 0 15 15"
        height="15"
        width="15"
        className={styles.luxuryBtn__ornamentLeft}>
        <path
          fill="none"
          stroke="currentColor"
          d="M7.5,1 L14,7.5 L7.5,14 L1,7.5 L7.5,1Z"></path>
        <circle fill="currentColor" r="2" cy="7.5" cx="7.5"></circle>
      </svg>
      <span className={styles.luxuryBtn__text}>{text}</span>
      <svg
        viewBox="0 0 15 15"
        height="15"
        width="15"
        className={styles.luxuryBtn__ornamentRight}>
        <path
          fill="none"
          stroke="currentColor"
          d="M7.5,1 L14,7.5 L7.5,14 L1,7.5 L7.5,1Z"></path>
        <circle fill="currentColor" r="2" cy="7.5" cx="7.5"></circle>
      </svg>
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        height="100%"
        width="100%"
        className={styles.luxuryBtn__shine}>
        <defs>
          <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="shineGradient">
            <stop stopColor="transparent" offset="0%"></stop>
            <stop stopColor="rgba(255,255,255,0.2)" offset="50%"></stop>
            <stop stopColor="transparent" offset="100%"></stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#shineGradient)"
          d="M0,0 L100,0 L100,100 L0,100Z"></path>
      </svg>
    </button>
  );
}
