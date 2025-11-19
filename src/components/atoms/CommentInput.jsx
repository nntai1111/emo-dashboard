import React from "react";

const CommentInput = ({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Viết bình luận...",
  disabled = false,
  loading = false,
  maxLength = 500,
  className = "",
  avatar,
  autoFocus = false,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSubmit && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleKeyDown = (e) => {
    // Allow Shift+Enter for new lines
    if (e.key === "Enter" && e.shiftKey) {
      // Let the default behavior happen (add new line)
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      {avatar && <div className="flex-shrink-0">{avatar}</div>}

      <form onSubmit={handleSubmit} className="flex-1 flex space-x-2">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          rows="1"
          className={`
    flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700 
    bg-white dark:bg-[#1C1C1E] px-3 py-2 text-sm
    text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200 break-words
  `}
          style={{
            minHeight: "38px",
            maxHeight: "120px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        />

        <button
          type="submit"
          disabled={disabled || loading || !value.trim()}
          className={`
            px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${value.trim() && !disabled && !loading
              ? "bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            }
          `}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Gửi"
          )}
        </button>
      </form>

      {maxLength && (
        <div className="text-xs text-gray-400 mt-1">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default CommentInput;
