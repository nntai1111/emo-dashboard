import React from "react";

const IconButton = ({
  icon: Icon,
  variant = "ghost",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  title,
  badge,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative";

  const variants = {
    primary:
      "bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-gray-500",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    success:
      "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "p-1.5 rounded-md",
    md: "p-2 rounded-lg",
    lg: "p-3 rounded-xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      {...props}>
      {loading ? (
        <div className={`animate-spin ${iconSizes[size]}`}>
          <div className="border-2 border-current border-t-transparent rounded-full w-full h-full"></div>
        </div>
      ) : (
        <Icon className={iconSizes[size]} />
      )}

      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
};

export default IconButton;
