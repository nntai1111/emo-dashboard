import React from "react";

const NotificationBadge = ({
  count = 0,
  variant = "danger",
  size = "md",
  show = true,
  className = "",
  animate = true,
}) => {
  if (!show || count <= 0) return null;

  const variants = {
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    purple: "bg-purple-500 text-white",
  };

  const sizes = {
    sm: "text-xs w-4 h-4 min-w-[16px]",
    md: "text-xs w-5 h-5 min-w-[20px]",
    lg: "text-sm w-6 h-6 min-w-[24px]",
  };

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <span
      className={`
        inline-flex items-center justify-center font-bold rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}>
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
