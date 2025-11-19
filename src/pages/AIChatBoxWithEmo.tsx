


import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/molecules/Chat/MainLayout";
import TypewriterMessage from "../components/molecules/Chat/TypewriterMessage";
import tokenManager from "@/services/tokenManager";
import { connectSignalR, disconnectSignalR } from "@/services/realtime";
import ToastNotification from "@/components/atoms/Notification/ToastNotification";
import { useNotification } from "@/hooks/useNotification";

const BASE_URL = "https://api.emoease.vn/chatbox-service/api/AIChat";
const USER_MEMORY_BASE = "https://api.emoease.vn/user-memory-service/v1";

type ToastVariant = "success" | "error" | "warning" | "info";

type NotificationControls = {
  notification: { type: ToastVariant; message: string } | null;
  showNotification: (
    type: ToastVariant,
    message: string,
    duration?: number
  ) => void;
  hideNotification: () => void;
};

// Utils: download image by URL
async function downloadImage(url: string, suggestedName?: string) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileNameFromUrl = () => {
      try {
        const clean = url.split("?")[0];
        const last = clean.substring(clean.lastIndexOf("/") + 1) || "sticker";
        return last;
      } catch {
        return "sticker";
      }
    };
    a.href = objectUrl;
    a.download =
      suggestedName && suggestedName.length > 0
        ? suggestedName
        : fileNameFromUrl();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.error("Download failed", err);
  }
}

const ChatMessages = ({
  messages,
  isLoadingMessages,
  isLoadingMoreMessages,
  hasMoreMessages,
  onPreviewImage,
  onNavigate,
  onLoadMore,
}: {
  messages: any[];
  isLoadingMessages: boolean;
  isLoadingMoreMessages: boolean;
  hasMoreMessages: boolean;
  onPreviewImage: (url: string) => void;
  onNavigate: (url: string) => void;
  onLoadMore: () => void;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesStartRef = useRef<HTMLDivElement | null>(null);
  const lastIndex = messages.length - 1;
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const previousScrollHeightRef = useRef<number>(0);
  const previousScrollTopRef = useRef<number>(0);
  const isRestoringScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Preserve scroll position when starting to load more messages
  useEffect(() => {
    if (
      isLoadingMoreMessages &&
      messagesContainerRef.current &&
      !isRestoringScrollRef.current
    ) {
      const container = messagesContainerRef.current;
      previousScrollHeightRef.current = container.scrollHeight;
      previousScrollTopRef.current = container.scrollTop;
    }
  }, [isLoadingMoreMessages]);

  // Restore scroll position after loading more messages
  useEffect(() => {
    if (
      !isLoadingMoreMessages &&
      previousScrollHeightRef.current > 0 &&
      messagesContainerRef.current &&
      !isRestoringScrollRef.current
    ) {
      isRestoringScrollRef.current = true;
      const container = messagesContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const scrollDifference =
        newScrollHeight - previousScrollHeightRef.current;
      // Restore scroll position to maintain user's view
      container.scrollTop = previousScrollTopRef.current + scrollDifference;

      // Reset refs
      previousScrollHeightRef.current = 0;
      previousScrollTopRef.current = 0;

      // Allow scroll restoration for next load
      setTimeout(() => {
        isRestoringScrollRef.current = false;
      }, 100);
    }
  }, [isLoadingMoreMessages, messages.length]);

  // Auto scroll to bottom when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (!isUserScrolling && !isLoadingMoreMessages) {
      (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isUserScrolling, isLoadingMoreMessages]);

  // Detect user scrolling and load more when near top
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsUserScrolling(!isNearBottom);

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll handler
      scrollTimeoutRef.current = setTimeout(() => {
        // Load more messages when scrolling near the top
        if (
          hasMoreMessages &&
          !isLoadingMoreMessages &&
          scrollTop < 300 && // Near the top (300px threshold for earlier trigger)
          messages.length > 0
        ) {
          console.log("Triggering load more messages", {
            scrollTop,
            hasMoreMessages,
            isLoadingMoreMessages,
            messagesCount: messages.length,
          });
          onLoadMore();
        }
      }, 150); // 150ms debounce
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [hasMoreMessages, isLoadingMoreMessages, messages.length, onLoadMore]);

  // Reset user scrolling when loading messages
  useEffect(() => {
    if (isLoadingMessages) {
      setIsUserScrolling(false);
    }
  }, [isLoadingMessages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({
      behavior: "smooth",
    });
    setIsUserScrolling(false);
  };

  // Normalize message content for rendering
  const getRenderable = (
    raw: any
  ): { type: "text" | "sticker"; text?: string; url?: string } => {
    if (raw == null) return { type: "text", text: "" };
    if (typeof raw === "string") return { type: "text", text: raw };
    if (typeof raw === "object") {
      const t = (raw as any).type;
      const txt = (raw as any).text;
      const url = (raw as any).sticker_url || (raw as any).url;
      if ((t === "sticker" || t === "reward_sticker") && url)
        return {
          type: "sticker",
          url,
          text: typeof txt === "string" ? txt : undefined,
        };
      if (typeof txt === "string") return { type: "text", text: txt };
    }
    try {
      // Some backends might send JSON string
      const parsed = JSON.parse(String(raw));
      return getRenderable(parsed);
    } catch {
      return { type: "text", text: String(raw) };
    }
  };

  return (
    <div className="chat-messages-wrapper relative h-full">
      <div
        ref={messagesContainerRef}
        className="h-full overflow-y-auto p-3 sm:p-6 chat-messages-container smooth-scroll scrollbar-smooth">
        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-4 pb-5 sm:pb-6">
          {/* Loading indicator for loading more messages */}
          {isLoadingMoreMessages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <motion.div
                  className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
                <span className="ml-2">Đang tải tin nhắn cũ hơn...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesStartRef} />
          <AnimatePresence>
            {messages &&
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 sm:gap-4 ${
                    message.senderIsEmo ? "justify-start" : "justify-end"
                  }`}>
                  {message.senderIsEmo && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-[#C8A2C8] to-[#6B728E] flex items-center justify-center shrink-0 shadow-md ring-1 ring-white/20">
                      <img
                        src="/logoTabBrowser/emo.webp"
                        alt="Emo Avatar"
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                      />
                    </div>
                  )}
                  {(() => {
                    const renderable = getRenderable(message.content);
                    const showTyping =
                      message.senderIsEmo &&
                      index === lastIndex &&
                      isLoadingMessages;

                    // If this is a sticker message, render image card separately,
                    // then optionally a normal text bubble below it
                    if (renderable.type === "sticker" && renderable.url) {
                      return (
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          {/* Image Card - standalone UI */}
                          <motion.div
                            className="rounded-xl overflow-hidden bg-white/95 border border-white/30 shadow-md w-fit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400 }}>
                            <img
                              src={renderable.url}
                              alt="Sticker"
                              className="max-w-[220px] sm:max-w-[260px] cursor-zoom-in"
                              onClick={() =>
                                onPreviewImage(renderable.url as string)
                              }
                            />
                            <div className="p-2 flex items-center justify-between">
                              <span className="text-xs opacity-60">
                                {message.createdDate
                                  ? new Date(
                                      message.createdDate
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                              <button
                                className="text-xs px-2 py-1 rounded bg-[#C8A2C8] text-white hover:opacity-90"
                                onClick={() =>
                                  downloadImage(renderable.url as string)
                                }>
                                Tải xuống
                              </button>
                            </div>
                          </motion.div>

                          {/* Optional text bubble */}
                          {renderable.text ? (
                            <motion.div
                              className={`max-w-sm sm:max-w-md p-4 rounded-xl ${
                                message.senderIsEmo
                                  ? "bg-white/90 text-gray-700 shadow-md border border-white/20"
                                  : "bg-linear-to-r from-pink-200 via-purple-200 to-indigo-300 text-gray-800 ml-auto shadow-md border border-white/30"
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              transition={{ type: "spring", stiffness: 400 }}>
                              <span className="text-base sm:text-base leading-relaxed">
                                {renderable.text}
                              </span>
                              <p className="text-base opacity-50 mt-1 font-medium">
                                {message.createdDate
                                  ? new Date(
                                      message.createdDate
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </p>
                            </motion.div>
                          ) : null}
                        </div>
                      );
                    }

                    // Normal text bubble path
                    const textToShow = renderable.text ?? "";
                    const hasCTA = message.cta && message.cta.navigateUrl;
                    return (
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <motion.div
                          className={`max-w-sm sm:max-w-md p-4 rounded-xl ${
                            message.senderIsEmo
                              ? "bg-white/90 text-gray-700 shadow-md border border-white/20"
                              : "bg-linear-to-r from-pink-200 via-purple-200 to-indigo-300 text-gray-800 ml-auto shadow-md border border-white/30"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400 }}>
                          {showTyping ? (
                            <TypewriterMessage
                              text={textToShow}
                              onDone={() => {}}
                              className="text-base sm:text-base leading-relaxed"
                            />
                          ) : (
                            <span className="text-base sm:text-base leading-relaxed">
                              {textToShow}
                            </span>
                          )}
                          <p className="text-base opacity-50 mt-1 font-medium">
                            {message.createdDate
                              ? new Date(
                                  message.createdDate
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </motion.div>
                        {/* CTA Button */}
                        {hasCTA && message.cta.needed && (
                          <motion.button
                            onClick={() => {
                              const navigateUrl = message.cta.navigateUrl;
                              if (
                                navigateUrl &&
                                navigateUrl.includes("emoease.vn")
                              ) {
                                const route = navigateUrl.replace(
                                  "https://www.emoease.vn",
                                  ""
                                );
                                onNavigate(route);
                              }
                            }}
                            className={`max-w-sm sm:max-w-md px-4 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                              message.senderIsEmo
                                ? "bg-linear-to-r from-[#C8A2C8] to-[#a78bfa] text-white hover:shadow-lg border border-white/20"
                                : "bg-linear-to-r from-pink-200 via-purple-200 to-indigo-300 text-gray-800 ml-auto hover:shadow-lg border border-white/30"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}>
                            <span className="text-sm sm:text-base">
                              {message.cta.title || "Xem thêm"}
                            </span>
                          </motion.button>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              ))}
            {/* Hiển thị ... khi đang loading tin nhắn */}
            {isLoadingMessages && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 sm:gap-4 justify-start">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-[#C8A2C8] to-[#6B728E] flex items-center justify-center shrink-0 shadow-md ring-1 ring-white/20">
                  <img
                    src="/logoTabBrowser/emo.webp"
                    alt="Emo Avatar"
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                </div>
                <motion.div
                  className="max-w-sm sm:max-w-md p-4 rounded-xl bg-white/90 text-gray-700 shadow-md border border-white/20 flex items-center"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}>
                  <span className="text-base font-bold tracking-widest animate-pulse">
                    ...
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button - Positioned inside chat messages area, above input */}
      {isUserScrolling && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 lg:bottom-24 lg:right-8 bg-linear-to-r from-[#C8A2C8] to-[#6B728E] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all mobile-touch-target z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

// Claiming toast (fun UI while waiting for sticker)
const ClaimingToast = ({ visible }: { visible: boolean }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-auto">
          <div className="flex items-center gap-3 rounded-xl px-3 sm:px-4 py-3 bg-linear-to-r from-[#c8a2c8] to-[#6b728e] text-white shadow-lg border border-white/20">
            <motion.span
              className="text-lg"
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}>
              🎁
            </motion.span>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-semibold">
                Đang mở quà...
              </span>
              <span className="text-xs sm:text-sm opacity-90">
                Vui lòng chờ một chút, sticker đang được chuẩn bị ✨
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Component nhập tin nhắn
const ChatInput = ({
  onSendMessage,
  disabled,
  isLoadingMessages,
  stageImageUrl,
  progressPoint,
  onClaimClick,
  claiming,
  claimButtonState,
  onClaimError,
}: {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  isLoadingMessages: boolean;
  stageImageUrl: string;
  progressPoint: number;
  onClaimClick: () => void;
  claiming: boolean;
  claimButtonState: {
    enabled: boolean;
    disabledReason:
      | "no_quota"
      | "free_tier"
      | "no_claim_today"
      | "insufficient_points"
      | null;
    disabledMessage: string;
  };
  onClaimError: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled && !isLoadingMessages) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (claiming) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      handleSend();
    }
  };

  const lockedMessage = (() => {
    if (claiming) return "Emo đang chuẩn bị sticker, vui lòng chờ ✨";
    if (isLoadingMessages)
      return "Vui lòng đợi Emo phản hồi xong trước khi đổi quà";
    if (disabled)
      return "Vui lòng chọn hoặc tạo cuộc trò chuyện trước khi đổi thưởng";
    if (!claimButtonState.enabled)
      return claimButtonState.disabledMessage || "Nút tạm thời không khả dụng";
    return "";
  })();

  const isButtonLocked = Boolean(lockedMessage);

  const handleGenerateImage = () => {
    if (isButtonLocked) {
      onClaimError(lockedMessage);
      return;
    }
    onClaimClick();
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md shadow-sm border border-white/20 rounded-2xl p-2 sm:p-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}>
      {/* BỎ onSubmit ở form */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoadingMessages
                ? "Đang chờ phản hồi..."
                : "Bạn đang cảm thấy thế nào?"
            }
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white/60 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A2C8]/30 focus:border-[#C8A2C8] placeholder:text-gray-500/70 transition-all text-base mobile-touch-target resize-none"
            disabled={disabled || isLoadingMessages || claiming}
          />
        </div>

        <div className="flex gap-2">
          {/* Claim Button - Always visible, click shows toast when locked */}
          <motion.button
            type="button"
            onClick={handleGenerateImage}
            className={`p-2.5 rounded-xl border transition-all relative ${
              !isButtonLocked
                ? "bg-linear-to-r from-[#ffd86b] to-[#ff9ae8] border-transparent shadow-[0_0_18px_rgba(255,216,107,0.7)] ring-2 ring-[#ffd86b]/70 animate-pulse cursor-pointer"
                : "bg-gray-300/60 border-gray-400/40 shadow-none ring-0 opacity-60 cursor-not-allowed"
            }`}
            whileHover={!isButtonLocked ? { scale: 1.08 } : {}}
            whileTap={!isButtonLocked ? { scale: 0.96 } : {}}
            aria-disabled={isButtonLocked}
            aria-label={
              !isButtonLocked
                ? `Tiến trình: ${Math.min(
                    1000,
                    Math.max(0, progressPoint)
                  )}/1000`
                : "Nút đổi thưởng sticker"
            }>
            <img
              src={stageImageUrl}
              alt="progress stage"
              className={`w-6 h-6 scale-[7] rounded-full object-cover pointer-events-none ${
                isButtonLocked ? "grayscale" : ""
              }`}
            />
          </motion.button>

          {/* Send Button - GỌI handleSend TRỰC TIẾP */}
          <motion.button
            type="button"
            onClick={handleSend}
            className="p-2.5 bg-linear-to-br from-[#C8A2C8] to-[#a78bfa] hover:from-[#b894b8] hover:to-[#9c7ae8] text-white rounded-xl shadow-sm transition-all duration-200 mobile-touch-target disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={
              disabled || isLoadingMessages || claiming || !message.trim()
            }
            title="Gửi tin nhắn">
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Component chính

type Session = {
  id: string;
  name: string;
  createdDate?: string;
  [key: string]: any;
};
type Message = {
  senderIsEmo: boolean;
  content: string;
  createdDate?: string;
  cta?: {
    needed: boolean;
    title?: string;
    resourceKey?: string;
    navigateUrl?: string;
  } | null;
  [key: string]: any;
};

type QuotaResponse = {
  tier: string;
  canClaimToday: boolean;
  reason?: string;
  now: string;
  timezone: string;
  todayTotal: number;
  todayUsed: number;
  todayRemaining: number;
};

type ProgressResponse = {
  sessionId: string;
  progressPoint: number;
  lastIncrement: number;
  rewardCost: number;
  progressDate: string;
  canClaim?: boolean;
};

const AIChatBoxWithEmo = () => {
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification() as NotificationControls;

  // === STATE ===
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionName, setSessionName] = useState("Your Zen Companion");
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Reward / Progress states
  const [progressPoints, setProgressPoints] = useState<number>(0);
  const [rewardCost, setRewardCost] = useState<number>(1000);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [claimingSessionId, setClaimingSessionId] = useState<string | null>(
    null
  );
  const [pendingRewardId, setPendingRewardId] = useState<string | null>(null);
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [hasUserMessageInSession, setHasUserMessageInSession] =
    useState<boolean>(false);
  // Buffer progress updates while assistant messages are rendering
  const [queuedProgressPoints, setQueuedProgressPoints] = useState<
    number | null
  >(null);
  // Achievement UI states
  const [lastAchievementMilestone, setLastAchievementMilestone] =
    useState<number>(0);
  const latestServerAchievementRef = useRef<string | null>(null);

  // Quota states
  const [quota, setQuota] = useState<QuotaResponse | null>(null);

  // Claim button state - tracks enabled/disabled status with reason
  type ClaimButtonState = {
    enabled: boolean;
    disabledReason:
      | "no_quota"
      | "free_tier"
      | "no_claim_today"
      | "insufficient_points"
      | null;
    disabledMessage: string;
  };
  const [claimButtonState, setClaimButtonState] = useState<ClaimButtonState>({
    enabled: false,
    disabledReason: null,
    disabledMessage: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] =
    useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Cache for messages: Map<sessionId, Map<pageIndex, {messages, paginationInfo}>>
  const messagesCacheRef = useRef<
    Map<
      string,
      Map<
        number,
        {
          messages: Message[];
          paginationInfo: {
            pageIndex: number;
            pageSize: number;
            totalCount: number;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            isFirstPage: boolean;
            isLastPage: boolean;
          };
        }
      >
    >
  >(new Map());

  const aliasIdRef = useRef<string | null>(null);

  const STAGE_IMAGES = [
    "/image/progress/1.webp",
    "/image/progress/2.webp",
    "/image/progress/3.webp",
    "/image/progress/4.webp",
    "/image/progress/5.webp",
    "/image/progress/6.webp",
    "/image/progress/7.webp",
  ];

  const getStageImageUrl = (point: number) => {
    const clamped = Math.min(1000, Math.max(0, Number(point) || 0));
    const index = Math.min(6, Math.floor((clamped / 1000) * 7));
    return STAGE_IMAGES[index];
  };

  const getAliasId = () => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.aliasId ?? null;
    } catch {
      return null;
    }
  };

  // Lấy danh sách phiên và tự động chọn phiên có isLegacy: false
  const fetchSessions = async () => {
    try {
      setIsInitialLoading(true);
      const token = await tokenManager.ensureValidToken();
      const response = await fetch(
        `${BASE_URL}/sessions?PageIndex=1&PageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const sessionsList = Array.isArray(data.data) ? data.data : [];
      setSessions(sessionsList);

      // Tìm phiên có isLegacy: false
      const activeSession = sessionsList.find(
        (s: Session) => s.isLegacy === false
      );

      if (activeSession) {
        // Tự động load phiên này
        setCurrentSessionId(activeSession.id);
        setSessionName(activeSession.name || "Your Zen Companion");
        await loadInitialMessages(activeSession.id);
      } else {
        // Nếu không có phiên nào hoặc không có phiên nào có isLegacy: false
        // Tự động tạo phiên mới
        await createSessionWithCustomName("New Chat");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiên:", error);
      setIsInitialLoading(false);
    }
  };

  // Lấy tin nhắn của phiên với pagination và cache
  const fetchMessages = async (
    sessionId: string,
    pageIndex: number = 1,
    pageSize: number = 30,
    useCache: boolean = true
  ) => {
    try {
      // Check cache first
      if (useCache) {
        const sessionCache = messagesCacheRef.current.get(sessionId);
        if (sessionCache) {
          const cachedPage = sessionCache.get(pageIndex);
          if (cachedPage) {
            console.log(
              `Using cached messages for session ${sessionId}, page ${pageIndex}`
            );
            return {
              messages: cachedPage.messages,
              paginationInfo: cachedPage.paginationInfo,
            };
          }
        }
      }

      const token = await tokenManager.ensureValidToken();
      const response = await fetch(
        `${BASE_URL}/sessions/${sessionId}/messages?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const messagesList = Array.isArray(data.data) ? data.data : [];
      const paginationInfo = {
        pageIndex: data.pageIndex || pageIndex,
        pageSize: data.pageSize || pageSize,
        totalCount: data.totalCount || 0,
        hasPreviousPage: data.hasPreviousPage || false,
        hasNextPage: data.hasNextPage || false,
        isFirstPage: data.isFirstPage || false,
        isLastPage: data.isLastPage || false,
      };

      // Cache the result
      if (!messagesCacheRef.current.has(sessionId)) {
        messagesCacheRef.current.set(sessionId, new Map());
      }
      const sessionCache = messagesCacheRef.current.get(sessionId)!;
      sessionCache.set(pageIndex, {
        messages: messagesList,
        paginationInfo,
      });

      return {
        messages: messagesList,
        paginationInfo,
      };
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      return {
        messages: [],
        paginationInfo: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          totalCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
          isFirstPage: true,
          isLastPage: true,
        },
      };
    }
  };

  // Sort messages by createdDate (oldest first)
  const sortMessagesByDate = (msgs: Message[]): Message[] => {
    return [...msgs].sort((a, b) => {
      const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
      const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
      return dateA - dateB;
    });
  };

  // Load initial messages for a session (first page)
  const loadInitialMessages = async (sessionId: string) => {
    try {
      setIsInitialLoading(true);
      setCurrentPage(1);
      const result = await fetchMessages(sessionId, 1, 30, true);

      // Sort messages by date to ensure correct order (oldest first)
      const sortedMessages = sortMessagesByDate(result.messages);
      setMessages(sortedMessages);
      setTotalCount(result.paginationInfo.totalCount);
      // Use hasNextPage because API returns messages from newest to oldest
      // hasNextPage = true means there are older messages (next page) to load
      setHasMoreMessages(result.paginationInfo.hasNextPage);

      const hasUser = sortedMessages.some(
        (m: any) => m && m.senderIsEmo === false
      );
      setHasUserMessageInSession(hasUser);

      if (hasUser) {
        await syncProgress(sessionId);
        await fetchQuota();
      }

      // Mark messages as read
      const token = await tokenManager.ensureValidToken();
      await fetch(`${BASE_URL}/sessions/${sessionId}/messages/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsInitialLoading(false);
    } catch (error) {
      console.error("Lỗi khi load tin nhắn ban đầu:", error);
      setIsInitialLoading(false);
    }
  };

  // Load more messages (older messages) when scrolling up
  const loadMoreMessages = async (sessionId: string) => {
    if (isLoadingMoreMessages || !hasMoreMessages || !sessionId) return;

    try {
      setIsLoadingMoreMessages(true);
      const nextPage = currentPage + 1;
      const result = await fetchMessages(sessionId, nextPage, 30, true);

      if (result.messages.length > 0) {
        // Merge new messages with existing ones and sort by date
        setMessages((prev) => {
          const merged = [...prev, ...result.messages];
          return sortMessagesByDate(merged);
        });
        setCurrentPage(nextPage);
        // Use hasNextPage because API returns messages from newest to oldest
        // hasNextPage = true means there are older messages (next page) to load
        setHasMoreMessages(result.paginationInfo.hasNextPage);
        setTotalCount(result.paginationInfo.totalCount);
      } else {
        setHasMoreMessages(false);
      }

      setIsLoadingMoreMessages(false);
    } catch (error) {
      console.error("Lỗi khi load thêm tin nhắn:", error);
      setIsLoadingMoreMessages(false);
    }
  };

  // Tạo phiên mới với tên tuỳ chỉnh
  const createSessionWithCustomName = async (sessionName: string) => {
    try {
      const token = await tokenManager.ensureValidToken();
      const response = await fetch(
        `${BASE_URL}/sessions?sessionName=${encodeURIComponent(sessionName)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSessions((prev) => [data, ...prev]); // Thêm phiên mới vào đầu danh sách
      setCurrentSessionId(data.id);
      setSessionName(data.name);
      setMessages(data.initialMessage ? [data.initialMessage] : []);
      setHasUserMessageInSession(false);
      // Reset visual progress for new session immediately
      setProgressPoints(0);
      setQueuedProgressPoints(null);
      setCanClaim(false);
      setClaiming(false);
      setClaimingSessionId(null);
      // Reset pagination for new session
      setCurrentPage(1);
      setHasMoreMessages(false);
      setTotalCount(0);
      // Clear cache for this session if exists
      messagesCacheRef.current.delete(data.id);
      if (data?.id) {
        checkPendingReward(data.id);
        // Fetch progress for the new session right away so image is accurate
        syncProgress(data.id);
        fetchQuota();
        // Load messages for new session
        if (data.initialMessage) {
          // If there's an initial message, we already have it, but we should still set up pagination
          setCurrentPage(1);
          setHasMoreMessages(false);
        } else {
          await loadInitialMessages(data.id);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo phiên:", error);
    }
  };

  const checkPendingReward = (sessionId: string) => {
    const saved = localStorage.getItem(`pendingReward:${sessionId}`);
    if (saved) {
      setPendingRewardId(saved);
      setClaiming(true);
      setClaimingSessionId(sessionId);
    }
  };

  // Gửi tin nhắn
  const sendMessage = async (message: string) => {
    if (!currentSessionId) return;
    try {
      setIsLoadingMessages(true);
      const newUserMessage: Message = {
        senderIsEmo: false,
        content: message,
        createdDate: new Date().toISOString(),
      };
      setMessages((prev) => {
        const updated = [...prev, newUserMessage];
        // Sort to ensure correct order
        return sortMessagesByDate(updated);
      });

      const token = await tokenManager.ensureValidToken();
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
          sessionId: currentSessionId,
        }),
      });
      const data = await res.json();

      if (!hasUserMessageInSession) {
        setHasUserMessageInSession(true);
        await syncProgress(currentSessionId);
        await fetchQuota();
      }

      if (Array.isArray(data)) setPendingMessages(data);
    } catch (err) {
      setIsLoadingMessages(false);
      console.error("Send message failed", err);
    }
  };

  const syncProgress = async (sessionId: string) => {
    try {
      const token = await tokenManager.ensureValidToken();
      const res = await fetch(
        `${USER_MEMORY_BASE}/progress/${sessionId}/reward`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return;
      const data: ProgressResponse = await res.json();
      const point = Math.min(1000, Number(data?.progressPoint) || 0);
      const cost = Number(data?.rewardCost) || 1000;
      setProgressPoints(point);
      setRewardCost(cost);
      setCanClaim(Boolean(data?.canClaim));
      console.log("Sync progress:", { point, cost, canClaim: data?.canClaim });
    } catch (err) {
      console.error("Sync progress failed", err);
    }
  };

  // Fetch quota information
  const fetchQuota = async () => {
    try {
      const token = await tokenManager.ensureValidToken();
      const res = await fetch(`${USER_MEMORY_BASE}/me/quotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: QuotaResponse = await res.json();
      setQuota(data);
      console.log("Quota fetched:", data);
    } catch (err) {
      console.error("Fetch quota failed", err);
    }
  };

  // Determine claim button state (always visible, but may be disabled)
  useEffect(() => {
    // Case 1: No quota data yet
    if (!quota) {
      setClaimButtonState({
        enabled: false,
        disabledReason: "no_quota",
        disabledMessage: "Đang tải thông tin...",
      });
      return;
    }

    // Case 2: Free tier - user needs to upgrade
    if (quota.tier === "Free") {
      setClaimButtonState({
        enabled: false,
        disabledReason: "free_tier",
        disabledMessage: "Bạn cần nâng cấp gói để sử dụng tính năng này",
      });
      return;
    }

    // Case 3: Cannot claim today - daily limit reached
    if (!quota.canClaimToday) {
      const remaining = quota.todayRemaining ?? 0;
      const used = quota.todayUsed ?? 0;
      const total = quota.todayTotal ?? 0;
      setClaimButtonState({
        enabled: false,
        disabledReason: "no_claim_today",
        disabledMessage: `Bạn đã hết lượt tạo trong ngày hôm nay (${used}/${total})`,
      });
      return;
    }

    // Case 4: Insufficient progress points
    if (progressPoints < rewardCost) {
      const needed = rewardCost - progressPoints;
      setClaimButtonState({
        enabled: false,
        disabledReason: "insufficient_points",
        disabledMessage: `Cần thêm ${needed} điểm để nhận quà (${progressPoints}/${rewardCost})`,
      });
      return;
    }

    // Case 5: All conditions met - button enabled
    setClaimButtonState({
      enabled: true,
      disabledReason: null,
      disabledMessage: "",
    });
  }, [quota, progressPoints, rewardCost]);

  const handleClaim = async () => {
    if (!currentSessionId || claiming) return;

    // Check quota first
    if (!quota) {
      await fetchQuota();
      return;
    }

    // Check tier
    if (quota.tier === "Free") {
      showNotification(
        "warning",
        "Bạn cần nâng cấp gói để sử dụng tính năng này"
      );
      return;
    }

    // Check canClaimToday
    if (!quota.canClaimToday) {
      showNotification("warning", "Bạn đã hết lượt tạo trong ngày hôm nay");
      return;
    }

    // Check progress points
    if (progressPoints < rewardCost) {
      showNotification("warning", `Bạn cần ${rewardCost} điểm để nhận quà`);
      return;
    }

    try {
      setClaiming(true);
      setClaimingSessionId(currentSessionId);
      // Sync once to ensure the latest status
      await syncProgress(currentSessionId);

      // Double check eligibility
      if (progressPoints < rewardCost) {
        setClaiming(false);
        setClaimingSessionId(null);
        showNotification("warning", `Bạn cần ${rewardCost} điểm để nhận quà`);
        return;
      }

      const token = await tokenManager.ensureValidToken();
      const idempotencyKey =
        crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const res = await fetch(
        `${USER_MEMORY_BASE}/rewards/claim?chatSessionId=${currentSessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      if (!res.ok) throw new Error("Claim failed");
      const data = await res.json();
      const rewardId = data?.rewardId;
      if (rewardId) {
        setPendingRewardId(rewardId);
        localStorage.setItem(`pendingReward:${currentSessionId}`, rewardId);
        console.log("Claim submitted, pending:", rewardId);
      }
    } catch (err) {
      setClaiming(false);
      setClaimingSessionId(null);
      console.error("Claim error", err);
    }
  };

  const handleClaimError = (message: string) => {
    showNotification("warning", message);
  };

  const persistStickerToChat = async (sessionId: string) => {
    try {
      const token = await tokenManager.ensureValidToken();
      await fetch(`${BASE_URL}/sticker/claim?sessionId=${sessionId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Reload messages to show the new sticker
      // Clear cache and reload from page 1 to get latest messages
      messagesCacheRef.current.delete(sessionId);
      await loadInitialMessages(sessionId);
      console.log("Sticker persisted");
    } catch (err) {
      console.error("Persist failed", err);
    }
  };

  // === SIGNALR LISTENER ===
  useEffect(() => {
    const onProgress = (e: any) => {
      const data = e?.detail ?? {};

      // Only accept updates for the active session if provided
      const eventSessionId =
        data.sessionId ?? data.chatSessionId ?? data.sessionID ?? null;
      if (
        currentSessionId &&
        eventSessionId &&
        eventSessionId !== currentSessionId
      )
        return;

      // Prefer new payload shape; fallback to legacy keys
      const rawPoints =
        data.totalSessionPoints ?? data.progressPoint ?? data.point ?? 0;
      const point = Math.min(1000, Math.max(0, Number(rawPoints) || 0));
      const cost = Number(data?.rewardCost) || rewardCost;

      // If assistant messages are still rendering, queue the latest point
      const hasPending = pendingMessages.length > 0 || isLoadingMessages;
      if (hasPending) {
        setQueuedProgressPoints(point);
      } else {
        setProgressPoints(point);
      }

      // Update rewardCost if provided
      if (cost && cost !== rewardCost) {
        setRewardCost(cost);
      }

      // Update canClaim when provided by the event; otherwise keep current
      if (Object.prototype.hasOwnProperty.call(data, "canClaim")) {
        setCanClaim(Boolean(data.canClaim));
      }

      // Keep the latest achievement text from server if provided
      if (typeof data.achievement === "string" && data.achievement.trim()) {
        latestServerAchievementRef.current = data.achievement.trim();
      }

      console.log("UI: Progress update", {
        eventSessionId,
        point,
        rawPoints,
        canClaim: data.canClaim,
      });
    };

    const onReward = (e: any) => {
      const { rewardId, stickerUrl } = e.detail;
      if (!pendingRewardId || pendingRewardId === rewardId) {
        setStickerUrl(stickerUrl);
        if (currentSessionId) {
          localStorage.removeItem(`pendingReward:${currentSessionId}`);
          setPendingRewardId(null);
          setClaiming(false);
          setClaimingSessionId(null);
          persistStickerToChat(currentSessionId);
          console.log("UI: Sticker shown", { rewardId, stickerUrl });
        }
      }
    };

    // Handle reward failed but image is ready
    const onRewardFailed = (e: any) => {
      const { rewardId, stickerUrl } = e.detail || {};
      if (!rewardId) return;
      if (!pendingRewardId || pendingRewardId === rewardId) {
        setStickerUrl(stickerUrl);
        if (currentSessionId) {
          localStorage.removeItem(`pendingReward:${currentSessionId}`);
          setPendingRewardId(null);
          setClaiming(false);
          setClaimingSessionId(null);
          persistStickerToChat(currentSessionId);
          console.log("UI: Reward failed but sticker delivered", {
            rewardId,
            stickerUrl,
          });
        }
      }
    };

    window.addEventListener("progressUpdate", onProgress);
    window.addEventListener("rewardNotification", onReward);
    window.addEventListener("rewardFailedNotification", onRewardFailed);

    return () => {
      window.removeEventListener("progressUpdate", onProgress);
      window.removeEventListener("rewardNotification", onReward);
      window.removeEventListener("rewardFailedNotification", onRewardFailed);
    };
  }, [
    currentSessionId,
    pendingRewardId,
    pendingMessages.length,
    isLoadingMessages,
  ]);

  // Flush any queued progress once assistant messages finish rendering
  useEffect(() => {
    if (
      !isLoadingMessages &&
      pendingMessages.length === 0 &&
      queuedProgressPoints != null
    ) {
      setProgressPoints(queuedProgressPoints);
      setQueuedProgressPoints(null);
    }
  }, [isLoadingMessages, pendingMessages.length, queuedProgressPoints]);

  // Fetch quota on mount
  useEffect(() => {
    fetchQuota();
  }, []);

  // Show achievement banner when crossing milestones after progressPoints updates
  useEffect(() => {
    let nextMilestone = 0;
    let message = "";
    if (progressPoints >= 1000) {
      nextMilestone = 1000;
      message =
        latestServerAchievementRef.current ||
        "Bạn đã đạt 1,000 điểm! Có thể đổi thưởng rồi!";
    } else if (progressPoints >= 500) {
      nextMilestone = 500;
      message =
        latestServerAchievementRef.current ||
        "Đã kiếm được 500 điểm, sắp tới phần thưởng rồi!";
    }

    if (nextMilestone > 0 && nextMilestone !== lastAchievementMilestone) {
      if (message) {
        showNotification("success", message);
      }
      setLastAchievementMilestone(nextMilestone);
    }
  }, [progressPoints, lastAchievementMilestone, showNotification]);

  // Reset achievement tracking and pagination when switching sessions
  useEffect(() => {
    setLastAchievementMilestone(0);
    latestServerAchievementRef.current = null;
    // Reset pagination state when switching sessions
    setCurrentPage(1);
    setHasMoreMessages(false);
    setTotalCount(0);
    setIsLoadingMoreMessages(false);
  }, [currentSessionId]);

  // === CONNECT SIGNALR ===
  useEffect(() => {
    const aliasId = getAliasId();
    aliasIdRef.current = aliasId;

    if (aliasId) {
      tokenManager.ensureValidToken().then((token) => {
        connectSignalR(aliasId, token);
      });
    }

    return () => disconnectSignalR();
  }, []);

  // === PENDING MESSAGES ===
  useEffect(() => {
    if (pendingMessages.length === 0) {
      setIsLoadingMessages(false);
      return;
    }
    setIsLoadingMessages(true);
    const timer = setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev, pendingMessages[0]];
        // Sort to ensure correct order (new messages should be at the end)
        return sortMessagesByDate(updated);
      });
      setPendingMessages((prev) => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [pendingMessages]);

  // === FETCH SESSIONS ===
  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <MainLayout>
      {/* Background image layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/image/home/bg_HomeCenter.webp')",
        }}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:block relative z-20 h-screen max-w-5xl mx-auto p-2 sm:p-4">
        <div className="bento-grid">
          {/* Main Chat Area - Bento Card (Full width now) */}
          <div className="bento-card flex flex-col col-span-full">
            {isInitialLoading ? (
              // Loading Screen
              <div className="bento-card-compact h-full flex items-center justify-center">
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}>
                  <motion.img
                    src="/Emo/EmoChat.webp"
                    alt="EMO mascot"
                    className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-xl select-none"
                    draggable={false}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                  <p className="text-white/80 text-sm sm:text-base">
                    Đang tải tin nhắn...
                  </p>
                </motion.div>
              </div>
            ) : currentSessionId ? (
              <div className="h-full flex flex-col gap-2 sm:gap-3">
                {/* Chat Messages - Main Bento Card */}
                <div className="flex-1 bento-card-compact min-h-0">
                  <ChatMessages
                    messages={messages}
                    isLoadingMessages={isLoadingMessages}
                    isLoadingMoreMessages={isLoadingMoreMessages}
                    hasMoreMessages={hasMoreMessages}
                    onPreviewImage={(url: string) => setPreviewImageUrl(url)}
                    onNavigate={(url: string) => navigate(url)}
                    onLoadMore={() =>
                      currentSessionId && loadMoreMessages(currentSessionId)
                    }
                  />
                </div>

                {/* Progress indicator moved into the gift button in ChatInput */}

                {/* Chat Input - Compact Bento Card */}
                <div className="bento-card-compact p-3 sm:p-4">
                  <ChatInput
                    onSendMessage={sendMessage}
                    disabled={!currentSessionId}
                    isLoadingMessages={isLoadingMessages}
                    stageImageUrl={getStageImageUrl(progressPoints)}
                    progressPoint={progressPoints}
                    onClaimClick={handleClaim}
                    claiming={
                      claiming && claimingSessionId === currentSessionId
                    }
                    claimButtonState={claimButtonState}
                    onClaimError={handleClaimError}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Full width chat */}
      <div className="lg:hidden relative z-20 min-h-dvh w-full flex flex-col">
        {/* Mobile Chat Area - Full width */}
        <div className="flex-1 flex flex-col min-w-0 mobile-chat-area p-3">
          {isInitialLoading ? (
            // Loading Screen (Mobile)
            <div className="h-[calc(100dvh-32px)] flex items-center justify-center">
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}>
                <motion.img
                  src="/Emo/EmoChat.webp"
                  alt="EMO mascot"
                  className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-xl select-none"
                  draggable={false}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#C8A2C8] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <p className="text-white/80 text-sm sm:text-base">
                  Đang tải tin nhắn...
                </p>
              </motion.div>
            </div>
          ) : currentSessionId ? (
            <div className="h-[calc(100dvh-32px)] flex flex-col gap-2 sm:gap-3">
              {/* Chat Messages - Takes most space */}
              <div className="flex-1 mt-2 sm:mt-3 bento-card-compact min-h-0">
                <ChatMessages
                  messages={messages}
                  isLoadingMessages={isLoadingMessages}
                  isLoadingMoreMessages={isLoadingMoreMessages}
                  hasMoreMessages={hasMoreMessages}
                  onPreviewImage={(url: string) => setPreviewImageUrl(url)}
                  onNavigate={(url: string) => navigate(url)}
                  onLoadMore={() =>
                    currentSessionId && loadMoreMessages(currentSessionId)
                  }
                />
              </div>

              {/* Progress indicator moved into the gift button in ChatInput (mobile) */}

              {/* Chat Input - Fixed at bottom */}
              <div className="bento-card-compact p-2 sm:p-4">
                <ChatInput
                  onSendMessage={sendMessage}
                  disabled={!currentSessionId}
                  isLoadingMessages={isLoadingMessages}
                  stageImageUrl={getStageImageUrl(progressPoints)}
                  progressPoint={progressPoints}
                  onClaimClick={handleClaim}
                  claiming={claiming && claimingSessionId === currentSessionId}
                  claimButtonState={claimButtonState}
                  onClaimError={handleClaimError}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Sticker Modal */}
      <AnimatePresence>
        {stickerUrl && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStickerUrl(null)}>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Sticker của bạn
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm px-3 py-1.5 rounded bg-[#C8A2C8] text-white hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (stickerUrl) downloadImage(stickerUrl);
                    }}>
                    Tải xuống
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setStickerUrl(null)}>
                    ✕
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg overflow-hidden border border-gray-100">
                <img src={stickerUrl} alt="Sticker" className="w-full h-auto" />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Sticker cũng đã được lưu vào cuộc trò chuyện của bạn.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImageUrl && (
          <motion.div
            className="fixed inset-0 z-55 bg-black/70 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImageUrl(null)}>
            <motion.div
              className="relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}>
              <img
                src={previewImageUrl}
                alt="Preview"
                className="max-h-[82vh] max-w-[92vw] rounded-2xl shadow-2xl"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  className="px-3 py-1.5 rounded bg-white/90 text-gray-800 hover:bg-white"
                  onClick={() => downloadImage(previewImageUrl!)}>
                  Tải xuống
                </button>
                <button
                  className="px-3 py-1.5 rounded bg-black/50 text-white hover:bg-black/60"
                  onClick={() => setPreviewImageUrl(null)}>
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastNotification
        notification={notification}
        onClose={hideNotification}
      />
      {/* Claiming Toast */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 pointer-events-none">
        <ClaimingToast
          visible={claiming && claimingSessionId === currentSessionId}
        />
      </div>
    </MainLayout>
  );
};

export default AIChatBoxWithEmo;

