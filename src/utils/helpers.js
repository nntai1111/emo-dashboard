// Anonymous name generator
const ADJECTIVES = [
  "Mysterious",
  "Silent",
  "Gentle",
  "Peaceful",
  "Dreamy",
  "Serene",
  "Calm",
  "Quiet",
  "Soft",
  "Kind",
  "Warm",
  "Cool",
  "Bright",
  "Dark",
  "Light",
  "Deep",
  "Sweet",
  "Pure",
  "Clear",
  "Fresh",
  "Wild",
  "Free",
  "Bold",
  "Brave",
  "Wise",
  "Smart",
  "Quick",
  "Swift",
  "Strong",
  "Gentle",
  "Noble",
  "Royal",
  "Magic",
  "Mystic",
  "Ancient",
  "Modern",
  "Young",
  "Golden",
  "Silver",
  "Crystal",
  "Velvet",
  "Silk",
  "Satin",
  "Pearl",
  "Diamond",
  "Ruby",
  "Sapphire",
  "Emerald",
  "Jade",
  "Amber",
  "Rose",
  "Lily",
  "Iris",
  "Violet",
  "Lavender",
];

const NOUNS = [
  "Wolf",
  "Fox",
  "Cat",
  "Owl",
  "Eagle",
  "Dove",
  "Swan",
  "Deer",
  "Rabbit",
  "Panda",
  "Tiger",
  "Lion",
  "Bear",
  "Dolphin",
  "Whale",
  "Butterfly",
  "Dragonfly",
  "Firefly",
  "Moon",
  "Star",
  "Sun",
  "Cloud",
  "Rain",
  "Snow",
  "Wind",
  "Fire",
  "Water",
  "Earth",
  "Sky",
  "Ocean",
  "River",
  "Mountain",
  "Forest",
  "Garden",
  "Flower",
  "Tree",
  "Leaf",
  "Petal",
  "Seed",
  "Root",
  "Branch",
  "Stone",
  "Crystal",
  "Gem",
  "Pearl",
  "Shell",
  "Feather",
  "Wing",
  "Heart",
  "Soul",
  "Dream",
  "Hope",
  "Wish",
  "Light",
  "Shadow",
];

export const generateAnonymousName = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 99) + 1;

  return `${adjective}${noun}${number}`;
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Vừa xong";
  const time = new Date(timestamp);
  if (isNaN(time.getTime())) return "Vừa xong";

  const now = new Date();
  const diffInSecondsRaw = (now.getTime() - time.getTime()) / 1000;
  if (!isFinite(diffInSecondsRaw) || diffInSecondsRaw < 0) return "Vừa xong";

  const diffInSeconds = Math.floor(diffInSecondsRaw);
  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} tháng trước`;
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const isContentSensitive = (content) => {
  const sensitiveKeywords = [
    "tự tử",
    "tự sát",
    "chết",
    "đau khổ",
    "trầm cảm",
    "lo âu",
    "stress",
    "áp lực",
    "buồn",
    "cô đơn",
    "tuyệt vọng",
  ];

  const lowerContent = content.toLowerCase();
  return sensitiveKeywords.some((keyword) => lowerContent.includes(keyword));
};

export const getAvatarUrl = (userId) => {
  // Generate consistent avatar based on user ID
  const colors = [
    "#a855f7",
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
  ];
  const color = colors[userId ? userId.length % colors.length : 0];

  return `https://ui-avatars.com/api/?name=${userId || "Anonymous"
    }&background=${color.substring(1)}&color=fff&size=40&rounded=true`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, wait) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};
