import React from "react";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  username = "Anonymous",
  online = false,
  className = "",
  rounded = true,
}) => {
  const sizes = {
    xs: "w-5 h-5 sm:w-6 sm:h-6 text-xs",
    sm: "w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm",
    md: "w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base",
    lg: "w-11 h-11 sm:w-12 sm:h-12 text-base sm:text-lg",
    xl: "w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl",
    "2xl": "w-18 h-18 sm:w-20 sm:h-20 text-xl sm:text-2xl",
  };

  const baseClasses = `relative inline-flex items-center justify-center ${rounded ? "rounded-full" : "rounded-[8px]"} bg-purple-500 text-white font-medium ${sizes[size]} ${className}`;

  // Generate initials from username
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={baseClasses}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${rounded ? "rounded-full" : "rounded-[8px]"}`}
        />
      ) : (
        <span className="select-none">{getInitials(username)}</span>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-400 ring-1 sm:ring-2 ring-white dark:ring-gray-800"></span>
      )}
    </div>
  );
};

export default Avatar;
