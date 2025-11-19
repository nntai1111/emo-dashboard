import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Button from "../atoms/Button";

const FEED_TABS = [
    // { key: "most_recent", label: "Most Recent" },
    { key: "feed", label: "Bảng tin" },
    // { key: "news", label: "News" },
    { key: "mine", label: "Của tôi" },
];

const FeedNav = ({ selected, onSelect }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // sm breakpoint
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <nav className="flex p-4 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            {FEED_TABS.map(tab => (
                <Button
                    key={tab.key}
                    variant={selected === tab.key ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => onSelect(tab.key)}
                    className="rounded-full text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
                >
                    {tab.label}
                </Button>
            ))}

            {/* Emo Chat Button for Mobile */}
            {isMobile && (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/AIChatBoxWithEmo")}
                    className="rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ml-auto flex items-center gap-1"
                >
                    <MessageSquare className="w-3 h-3" />
                    <span>Emo Chat</span>
                </Button>
            )}
        </nav>
    );
};

export default FeedNav;
