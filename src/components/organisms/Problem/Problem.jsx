import React from "react";
import ScrollReveal from "./ScrollReveal";
import styles from "../../../../styles/Font/Font.module.css";
const Problem = () => {
  return (
    <div className={` ${styles.dancingScript} w-full`}>
      <div className="h-[10vh] "></div>
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={100}>
        Mỗi cảm xúc đều xứng đáng được lắng nghe và thấu hiểu...
      </ScrollReveal>
    </div>
  );
};

export default Problem;
