import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}) => {
  // base classes (không thêm focus:ring cố định ở đây)
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-purple-500 hover:bg-purple-600 text-white  shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    locked:
      "bg-gray-400 hover:bg-gray-400 text-gray-100 dark:bg-gray-600 dark:hover:bg-gray-600 dark:text-gray-200 shadow-none cursor-not-allowed",
    calm:
      "bg-sky-500 hover:bg-sky-400 text-white shadow-lg hover:shadow-xl",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-0 focus:ring-offset-0", // 👈 không có viền
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md",
    success:
      "bg-green-500 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs sm:text-sm rounded-lg",
    md: "px-3 sm:px-4 py-2 text-sm rounded-xl",
    lg: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl",
    xl: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
