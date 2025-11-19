import React from 'react';
import { motion } from 'framer-motion';
import LeftSection from '../components/molecules/WellnessLeft';
import RightSection from '../components/molecules/WellnessRight';

export default function WellnessHub() {
    return (
        <motion.div
            className="rounded-lg flex flex-col scrollbar-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-1 gap-4 mt-4 flex-col md:flex-row md:h-[calc(100vh-8rem)]">
                <div className="order-1 md:order-2 md:flex-[2] md:h-full md:overflow-y-auto">
                    <LeftSection />
                </div>
                {/* 
                <div className="order-2 md:order-1 md:flex-[3] md:h-full">
                    <RightSection />
                </div> */}
            </div>
        </motion.div>
    );
}