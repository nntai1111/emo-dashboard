import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, ChevronUp, Check } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import Button from "../atoms/Button";

const LanguageSwitcher = ({ variant = "default", className = "" }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const languages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-0 p-2"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <ChevronUp
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] "
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-500 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[9999] max-h-64 overflow-y-auto"
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-purple-500" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;