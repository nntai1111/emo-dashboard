import React, { useState, useEffect } from "react";
import { easeIn, motion } from "framer-motion";
import { MessageCircle, Sparkles, Star, Heart, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Start = ({ 
  // Icon props
  icon = "sparkles", // "sparkles", "star", "heart", "zap", "target", "message"
  size = "w-5 h-5",
  color = "text-white",
  
  // Animation props
  animation = "twinkle", // "twinkle", "pulse", "bounce", "rotate", "float", "none"
  duration = 1.5,
  delay = 1,
  repeat = Infinity,
  
  // Interaction props
  onClick,
  href,
  target = "_self",
  disabled = false,
  
  // Tooltip navigation props
  tooltipHref, // URL for tooltip click navigation
  tooltipTarget = "_self", // Target for tooltip navigation (_self, _blank)
  tooltipOnClick, // Custom onClick for tooltip
  tooltipTo, // Internal route for React Router navigation
  
  // Tooltip props
  tooltip,
  tooltipPosition = "top", // "top", "bottom", "left", "right"
  showTooltipAlways = false, // Always show tooltip without hover
  
  // Styling props
  className = "",
  style = {},
  
  // Accessibility
  ariaLabel,
  role = "button"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  


  // Icon mapping
  const iconMap = {
    sparkles: Sparkles,
    star: Star,
    heart: Heart,
    zap: Zap,
    target: Target,
    message: MessageCircle
  };

  const IconComponent = iconMap[icon] || Sparkles;

  // Animation configurations
  const getAnimationProps = () => {
    const baseProps = {
      duration,
      repeat,
      delay
    };

    switch (animation) {
      case "twinkle":
        return {
          animate: {
            scale: [0.5, 1.5, 0.5],
            opacity: [1, 1, 1],
          },
          ...baseProps
        };
      case "pulse":
        return {
          animate: {
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          },
          ...baseProps
        };
      case "bounce":
        return {
          animate: {
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          },
          ...baseProps
        };
      case "rotate":
        return {
          animate: {
            rotate: [0, 360],
          },
          ...baseProps
        };
      case "float":
        return {
          animate: {
            y: [0, -5, 0],
            x: [0, 2, 0],
          },
          ...baseProps
        };
      case "none":
        return {
          animate: {},
          transition: {}
        };
      default:
        return {
          animate: {
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          },
          ...baseProps
        };
    }
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    if (onClick) {
      onClick(e);
    }
    
    if (href) {
      if (target === "_blank") {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
    }
  };

  // Helper function to check if user is authenticated
  const isUserAuthenticated = () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      return !!(accessToken && refreshToken);
    } catch (error) {
      console.warn("Error checking authentication:", error);
      return false;
    }
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation(); // Prevent triggering the main icon click
    
    if (disabled) return;
    
    // Custom tooltip onClick handler
    if (tooltipOnClick) {
      tooltipOnClick(e);
      return;
    }
    
    // External link navigation
    if (tooltipHref) {
      if (tooltipTarget === "_blank") {
        window.open(tooltipHref, "_blank");
      } else {
        window.location.href = tooltipHref;
      }
      return;
    }
    
    // Internal route navigation (React Router) with authentication check
    if (tooltipTo) {
      if (isUserAuthenticated()) {
        // User is authenticated, navigate to the intended route
        navigate(tooltipTo);
      } else {
        // User is not authenticated, redirect to login page
        navigate("/login");
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (tooltip && !showTooltipAlways) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (tooltip && !showTooltipAlways) {
      setShowTooltip(false);
    }
  };

  // Always show tooltip if showTooltipAlways is true
  useEffect(() => {
    if (showTooltipAlways && tooltip) {
      setShowTooltip(true);
    }
  }, [showTooltipAlways, tooltip]);

  const animationProps = getAnimationProps();

  return (
    <div className="relative inline-block">
      <motion.div
        className={`
          cursor-pointer select-none transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
          ${className}
        `}
        style={style}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={animationProps.animate}
        transition={animationProps.transition}
        role={role}
        aria-label={ariaLabel || tooltip}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
      >
        <IconComponent 
          className={`${size} ${color} transition-colors duration-200 ${
            isHovered && !disabled ? 'text-yellow-300' : ''
          }`} 
        />
      </motion.div>

      {/* Luxury Glass Tooltip - Clickable */}
      {showTooltip && tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0,
            rotateY: 0
          }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          onClick={handleTooltipClick}
          className={`
            absolute z-50 px-4 py-2 text-sm font-medium text-white
            whitespace-nowrap cursor-pointer
            backdrop-blur-xl bg-white/10 border border-white/20
            rounded-2xl shadow-2xl
            before:absolute before:inset-0 before:rounded-2xl
            before:bg-gradient-to-r before:from-white/20 before:to-white/5
            before:backdrop-blur-sm before:-z-10
            after:absolute after:inset-0 after:rounded-2xl
            after:bg-gradient-to-br after:from-cyan-400/20 after:via-purple-500/10 after:to-pink-400/20
            after:backdrop-blur-sm after:-z-10
            hover:scale-105 hover:bg-white/15 transition-all duration-300
            ${tooltipPosition === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-3' : ''}
            ${tooltipPosition === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-3' : ''}
            ${tooltipPosition === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-3' : ''}
            ${tooltipPosition === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-3' : ''}
            ${(tooltipHref || tooltipOnClick || tooltipTo) ? 'hover:shadow-3xl' : ''}
          `}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.3),
              0 0 0 1px rgba(255,255,255,0.1),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))',
                'linear-gradient(45deg, rgba(147,51,234,0.1), rgba(236,72,153,0.1))',
                'linear-gradient(45deg, rgba(236,72,153,0.1), rgba(59,130,246,0.1))'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Content */}
          <span className="relative z-10 flex items-center gap-2">
            {tooltip}
            {/* Click indicator for clickable tooltips */}
            {(tooltipHref || tooltipOnClick || tooltipTo) && (
              <motion.span
                className="text-xs opacity-70"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔗
              </motion.span>
            )}
          </span>

          {/* Luxury arrow with gradient */}
          <div className={`
            absolute w-3 h-3 transform rotate-45
            backdrop-blur-xl bg-white/20 border border-white/30
            shadow-lg
            ${tooltipPosition === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1.5' : ''}
            ${tooltipPosition === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1.5' : ''}
            ${tooltipPosition === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1.5' : ''}
            ${tooltipPosition === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1.5' : ''}
          `} 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }} />

          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.3)',
                '0 0 30px rgba(147,51,234,0.3)',
                '0 0 20px rgba(236,72,153,0.3)',
                '0 0 20px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Start;
