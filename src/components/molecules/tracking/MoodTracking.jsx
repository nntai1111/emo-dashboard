import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import tokenManager from "@/services/tokenManager";
import Portal from "@/components/Portal"; // ← NEW

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const genUUID = () =>
  crypto?.randomUUID?.() ??
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const decodeIcon = (code) => {
  if (!code) return "";
  try {
    return JSON.parse('"' + code.replace(/"/g, '\\"') + '"');
  } catch {
    return code;
  }
};

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
const MoodTracking = forwardRef(function MoodTracking(
  { onSkip, onSuccess },
  ref
) {
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const queryClient = useQueryClient();

  // -----------------------------------------------------------------
  // Toast
  // -----------------------------------------------------------------
  const dispatchToast = (type, msg) => {
    try {
      window.dispatchEvent(
        new CustomEvent("app:toast", { detail: { type, msg } })
      );
    } catch (e) {
      console.warn(e);
    }
  };

  // -----------------------------------------------------------------
  // Token
  // -----------------------------------------------------------------
  const ensureTokenHeader = async () => ({
    Authorization: `Bearer ${await tokenManager.ensureValidToken()}`,
  });

  // -----------------------------------------------------------------
  // 1. Kiểm tra mood status
  // -----------------------------------------------------------------
  const { data: moodStatus, isLoading: checkingStatus } = useQuery({
    queryKey: ["moodStatus"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.emoease.vn/wellness-service/v1/me/journal-moods/status",
        { headers: await ensureTokenHeader() }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // -----------------------------------------------------------------
  // 2. Lấy danh sách mood – chỉ khi modal thực sự mở
  // -----------------------------------------------------------------
  const { data: moods = [], isLoading: loadingMoods } = useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://api.emoease.vn/wellness-service/v1/moods?TargetLang=vi",
        { headers: await ensureTokenHeader() }
      );
      return Array.isArray(data.moods) ? data.moods : [];
    },
    enabled: open && moodStatus?.hasMood === false, // chỉ chạy khi chắc chắn chưa ghi mood
    staleTime: 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });

  // -----------------------------------------------------------------
  // 3. Mở modal (imperative)
  // -----------------------------------------------------------------
  const openMoodModal = useCallback(() => {
    if (checkingStatus) return;

    // Nếu đã ghi nhận cảm xúc trong ngày, bỏ qua
    if (moodStatus?.hasMood === true) {
      onSkip?.();
      return;
    }

    // Nếu trạng thái chưa xác định (lỗi mạng, chưa fetch xong), không mở vội
    // Thay vào đó, yêu cầu refetch để đảm bảo tính chính xác
    if (moodStatus?.hasMood !== false) {
      queryClient.invalidateQueries({ queryKey: ["moodStatus"] });
      return;
    }

    // Đảm bảo mood list đã có (đôi khi query chưa chạy)
    if (moods.length === 0) {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    }

    setSelectedMood(moods[0]?.id ?? null);
    setOpen(true);
  }, [checkingStatus, moodStatus, moods, onSkip, queryClient]);

  useImperativeHandle(ref, () => ({ open: openMoodModal }));

  // -----------------------------------------------------------------
  // 4. Global event / localStorage trigger
  // -----------------------------------------------------------------
  useEffect(() => {
    const handler = () => openMoodModal();
    window.addEventListener("app:openMoodModal", handler);

    const pending = localStorage.getItem("openMoodAfterLogin");
    if (pending) {
      localStorage.removeItem("openMoodAfterLogin");
      setTimeout(openMoodModal, 120);
    }

    return () => window.removeEventListener("app:openMoodModal", handler);
  }, [openMoodModal]);

  // -----------------------------------------------------------------
  // 5. Submit
  // -----------------------------------------------------------------
  const handleSubmit = async () => {
    if (!selectedMood) return;

    try {
      const payload = { moodId: selectedMood, note: null };
      await axios.post(
        "https://api.emoease.vn/wellness-service/v1/me/journal-moods",
        payload,
        {
          headers: {
            ...(await ensureTokenHeader()),
            "Content-Type": "application/json",
            "Idempotency-Key": genUUID(),
          },
        }
      );

      queryClient.setQueryData(["moodStatus"], { hasMood: true });
      // Ngăn modal mở lại cho tới khi hết ngày
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      dispatchToast("success", "Ghi nhận tâm trạng thành công.");
      setOpen(false);
      setSelectedMood(null);
      onSuccess?.();
    } catch (err) {
      const msg = err?.response?.data?.message || "Gửi thất bại";
      dispatchToast("error", msg);
    }
  };

  const isLoading = checkingStatus || loadingMoods;

  // -----------------------------------------------------------------
  // 6. Render – **Portal + z-[9999]** + debug attribute
  // -----------------------------------------------------------------
  if (typeof window === "undefined") return null;

  return (
    <Portal>
      {open && (
        <div
          data-open={open}
          className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Glass Card */}
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
              {/* Header */}
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🫶</span>
                  <h3 className="text-sm font-semibold text-white/90">
                    Tâm trạng của bạn hôm nay
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm flex items-center justify-center border border-white/20">
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 border-2 border-white/30 border-t-white/90 rounded-full animate-spin" />
                  </div>
                ) : moods.length === 0 ? (
                  <p className="text-xs text-white/80 text-center py-6">
                    Không có trạng thái nào.
                  </p>
                ) : (
                  <div>
                    {/* Legend: Increasing scale from sad to happy */}

                    {/* Horizontal progressive layout: left (sad) → right (happy) */}
                    <ul className="grid grid-cols-7 gap-2 sm:gap-3 mt-5">
                      {moods.map((m) => (
                        <li key={m.id}>
                          <label
                            className={`group relative flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-xl border cursor-pointer transition-all bg-white/5 hover:bg-white/10 border-white/15 ${
                              selectedMood === m.id
                                ? "ring-2 ring-pink-300/60 bg-white/15"
                                : ""
                            }`}>
                            <input
                              type="radio"
                              name="mood"
                              value={m.id}
                              checked={selectedMood === m.id}
                              onChange={() => setSelectedMood(m.id)}
                              className="hidden"
                              aria-label={m.name}
                            />
                            <div className="text-2xl sm:text-3xl drop-shadow-sm select-none">
                              {decodeIcon(m.iconCode)}
                            </div>
                            {/* Name hidden by default; show on hover as tooltip */}
                            <div className="pointer-events-none absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md bg-black/60 text-white/90 text-[10px] sm:text-xs whitespace-nowrap">
                              {m.name}
                            </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[11px] text-white/70 mb-1">
                        <span className="flex items-center gap-1">
                          <span>😔</span>
                          <span>Thấp</span>
                        </span>
                        <span className="font-medium text-white/80">
                          Mức độ cảm xúc tăng dần
                        </span>
                        <span className="flex items-center gap-1">
                          <span>Cao</span>
                          <span>😄</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-indigo-400/70 via-pink-400/70 to-rose-400/70" />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 bg-white/5 border-t border-white/10">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 border border-white/20">
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedMood || isLoading}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow disabled:opacity-50 bg-gradient-to-r from-pink-400/80 to-indigo-500/80 hover:from-pink-400 hover:to-indigo-500">
                  {isLoading ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
});

export default MoodTracking;