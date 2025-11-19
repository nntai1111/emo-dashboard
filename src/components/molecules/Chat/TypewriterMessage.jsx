// TypewriterMessage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TypewriterMessage = ({ text, onDone, speed = 18, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setIsTyping(true);
    
    if (!text) {
      setIsTyping(false);
      return;
    }

    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onDone) onDone();
      }
    }, speed);
    
    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [text, speed, onDone]);

  return (
    <motion.span 
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayed}
      {isTyping && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-[#C8A2C8] ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ 
            duration: 0.8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}
    </motion.span>
  );
};

export default TypewriterMessage;
