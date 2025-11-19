import React from "react";
import { motion } from "framer-motion";

const AuthLayout = ({
  children,
  title,
  subtitle,
  backgroundPattern = true,
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4 ${className}`}>
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse"></div>
          <div
            className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-100 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "3s" }}></div>
          <div
            className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "6s" }}></div>
        </div>
      )}

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
