import React from "react";
import { motion } from "framer-motion";
import DesktopChallengeModule from "../components/organisms/DesktopChallengeModule";
import MobileChallengeModule from "./MobileChallengeModule";
import useIsMobile from "../hooks/useIsMobile";

const ChallengeModulePage = () => {
    const isMobile = useIsMobile();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black text-white"
        >
            {isMobile ? <MobileChallengeModule /> : <DesktopChallengeModule />}
        </motion.div>
    );
};

export default ChallengeModulePage;