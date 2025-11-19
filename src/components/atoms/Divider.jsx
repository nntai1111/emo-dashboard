import React from "react";

const Divider = ({
  orientation = "horizontal",
  variant = "default",
  size = "md",
  className = "",
  children,
}) => {
  const variants = {
    default: "border-gray-500 dark:border-gray-500",
    light: "border-gray-100 dark:border-gray-800",
    strong: "border-gray-300 dark:border-gray-600",
    purple: "border-purple-200 dark:border-purple-800",
  };

  const sizes = {
    sm: orientation === "horizontal" ? "border-t" : "border-l w-px h-4",
    md: orientation === "horizontal" ? "border-t" : "border-l w-px h-6",
    lg: orientation === "horizontal" ? "border-t-2" : "border-l-2 w-0.5 h-8",
  };

  if (orientation === "vertical") {
    return (
      <div
        className={`
          ${sizes[size]} ${variants[variant]} ${className}
        `}
      />
    );
  }

  // Horizontal divider
  if (children) {
    return (
      <div className={`relative ${className}`}>
        <div className={`absolute inset-0 flex items-center`}>
          <div className={`w-full ${sizes[size]} ${variants[variant]}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            {children}
          </span>
        </div>
      </div>
    );
  }

  return <hr className={`${sizes[size]} ${variants[variant]} ${className}`} />;
};

export default Divider;
