import { motion } from "framer-motion";
import Button from "../atoms/Button";
const HeroSection = ({ title, description, img, button, fullHeight = true, compact = false, whiteBackground = false }) => {
  return (
    <div className={`${compact ? (fullHeight ? "min-h-[70vh] md:min-h-[80vh]" : "h-auto") : (fullHeight ? "h-screen" : "h-auto")} flex flex-col md:flex-row items-start justify-center ${compact ? "gap-x-12 md:gap-x-20 pt-6 md:pt-10 pb-4 md:pb-6" : "gap-x-20 pt-4 md:pt-12"}`}
    >
      <div className="max-w-xl md:w-1/2 mb-12">
        <h1 className="text-2xl font-bold dark:text-orange-300 mb-4">
          {title}
        </h1>
        {/* Mobile image between title and description */}
        <div className={`md:hidden w-full ${compact ? "mb-3" : "mb-4"}`}>
          {img && (
            <img
              src={img}
              alt="Hero Illustration"
              className={`w-full h-auto object-contain ${compact ? "max-h-48" : ""} `}
            />
          )}
        </div>
        <p className={`text-lg dark:text-gray-100  ${compact
          ? `mb-4 md:mb-8 ${whiteBackground ? "bg-white rounded-lg shadow-sm p-4 dark:text-gray-600" : ""}`
          : `mb-8  ${whiteBackground ? "bg-white rounded-lg shadow-sm p-4 dark:text-gray-600" : ""}`
          }`}>
          {/* <p className={`text-lg  ${whiteBackground ? "bg-white rounded-lg shadow-sm p-4 dark:text-gray-600" : "dark:text-gray-100"} ${compact ? "mb-4 md:mb-8" : "mb-8"}`}> */}
          {description}
        </p>
        {button && (
          <motion.div
            animate={button.animate || { y: [0, -10, 0] }}
            transition={button.transition || { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="md:block flex justify-center"
          >
            <Button
              type="button"
              onClick={button.onClick}
              className="relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#8131ad] via-purple-600 to-pink-500 text-white rounded-full hover:from-[#6b287f] hover:via-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              {button.label}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        )}
      </div>
      <div className="hidden md:block md:w-1/3 w-full">
        {img && (
          <img
            src={img}
            alt="Hero Illustration"
            className={`w-full h-auto object-contain ${compact ? "max-w-md max-h-[360px] ml-auto" : ""}${whiteBackground ? "mt-12" : ""} `}
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
