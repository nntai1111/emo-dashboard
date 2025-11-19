import React from "react";
import styles from "../../../../styles/component/Community.module.css";
import { User } from "lucide-react";

export default function Community({ onClick }) {
  return (
    <div className={`${styles.buttonContainer} w-full flex justify-center`}>
      <button
        type="button"
        onClick={onClick}
        className={`${styles.spaceButton} w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-xl`}
        aria-label="Cộng đồng ẩn danh">
        <div className={styles.brightParticles}></div>
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <User className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-semibold">
            Cộng đồng ẩn danh
          </span>
        </div>
      </button>
    </div>
  );
}
