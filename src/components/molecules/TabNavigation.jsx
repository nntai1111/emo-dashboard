import React from "react";
import { motion } from "framer-motion";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="sticky top-0 z-50 my-6 md:my-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 md:gap-5">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "text-black bg-[#ffffff] shadow-lg"
                  : "text-white/80 md:text-white/70 hover:text-white hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout>
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
