import React from "react";
import styles from "../../../../styles/component/Community.module.css";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmoChat() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/AIChatBoxWithEmo");
    }

    return (
        <div className={`${styles.buttonContainer} w-full flex justify-center`}>
            <button
                type="button"
                onClick={handleClick}
                className={`${styles.spaceButton} w-full max-w-[200px] px-3 py-2 rounded-lg`}
                aria-label="Cộng đồng ẩn danh"
            >
                <div className={styles.brightParticles}></div>
                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Bot className="w-4 h-4" />
                    <span className="text-[11px] font-medium whitespace-nowrap">
                        Tâm sự cùng Emo
                    </span>
                </div>
            </button>

        </div>
    );
}
