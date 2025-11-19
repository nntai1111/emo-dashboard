import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DesktopNotificationsNew from "../components/organisms/DesktopNotificationsNew";
import MobileNotificationsPage from "./MobileNotificationsPage";

const NotificationsPage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
            {isMobile ? <MobileNotificationsPage /> : <DesktopNotificationsNew />}
        </motion.div>
    );
};

export default NotificationsPage;