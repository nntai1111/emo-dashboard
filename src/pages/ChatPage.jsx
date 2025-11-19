import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MobileChatPage from "./MobileChatPage";
import DesktopChatSimple from "../components/organisms/DesktopChatSimple";

const ChatPage = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Memoize query parsing to avoid recreating on every render
    const selectedConversationId = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get("id");
    }, [location.search]);

    // Memoize resize handler to avoid recreating on every render
    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-0 md:p-8"
        >
            {isMobile ? (
                <MobileChatPage selectedConversationId={selectedConversationId} />
            ) : (
                <DesktopChatSimple selectedConversationId={selectedConversationId} />
            )}
        </motion.div>
    );
};

export default ChatPage;