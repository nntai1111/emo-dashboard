import { StartButton } from "@/components/atoms";
import styles from "../../../../styles/Title/DownloadSection.module.css";

export function DownloadSection({
  logoSrc = "/image/home/messageStory.webp",
  alt = "EmoEase logo",
}) {
  return (
    // <div className={`${styles.container}`}>
    //   <h1 className={`${styles.title} leading-tight`}>Your story matters</h1>
    //   <h1 className={`${styles.title} leading-tight`}>We're here to listen.</h1>

    //   <p className={`${styles.subtitle} leading-tight`}>
    //     Find comfort, healing, and hope through every conversation.
    //   </p>
    // </div>
    <div className="h-[18rem] w-full bg-[#ffffff00] flex flex-col items-center justify-center overflow-hidden rounded-md">
      <img
        src={logoSrc}
        alt={alt}
        className="relative z-20 h-28 md:h-50 lg:h-42 w-auto select-none pointer-events-none"
        draggable={false}
        loading="eager"
      />
    </div>
  );
}

export default DownloadSection;
