import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { aliasService } from '../../services/apiService';

// Compact modal-style alias picker with input field and dice to cycle suggestions
const AliasSelection = ({ onAliasSelected, onError }) => {
    // No console logging; surface issues via UI and callbacks
    // Validation rules (aligned with rename modal and backend)
    const PROHIBITED_PATTERNS = [
        "admin", "administrator", "mod", "moderator", "support", "staff",
        "root", "superuser", "owner", "dev", "developer", "bot",
        "fuck", "shit", "ass", "bitch", "cunt", "nigg", "porn", "sex",
        "xxx", "viagra", "casino", "login", "signup", "official"
    ];
    const REPEATED_CHARS_REGEX = /(.)\1{4,}/;

    const validateLabel = (label) => {
        const reasons = [];
        const trimmed = (label || '').trim();

        if (!trimmed) {
            reasons.push('Vui lòng nhập tên của bạn');
            return reasons;
        }
        if (trimmed.length < 3) {
            reasons.push('Tên phải có ít nhất 3 ký tự');
        }
        if (trimmed.length > 50) {
            reasons.push('Tên không được quá 50 ký tự');
        }
        if (REPEATED_CHARS_REGEX.test(trimmed)) {
            reasons.push('Không được lặp ký tự quá 4 lần liên tiếp');
        }
        const lower = trimmed.toLowerCase();
        for (const pattern of PROHIBITED_PATTERNS) {
            if (lower.includes(pattern)) {
                reasons.push(`Không được chứa từ cấm: "${pattern}"`);
                break;
            }
        }
        return reasons;
    };
    const [queue, setQueue] = useState([]); // cached suggestions
    const [current, setCurrent] = useState(null); // { label, reservationToken, expiredAt }
    const [customName, setCustomName] = useState(''); // User input
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [error, setError] = useState(null);
    const [isDiceSpinning, setIsDiceSpinning] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        refillQueue();
    }, []);

    const refillQueue = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await aliasService.getAliasSuggestions();
            const list = Array.isArray(data?.aliases) ? data.aliases : [];
            if (list.length > 0) {
                setCurrent(list[0]);
                setQueue(list.slice(1));
            } else {
                setCurrent(null);
                setQueue([]);
            }
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách tên gợi ý');
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDice = async () => {
        setIsDiceSpinning(true);

        try {
            if (queue.length > 0) {
                const [next, ...rest] = queue;
                setCurrent(next);
                setQueue(rest);
                // Update input with suggestion to keep them in sync
                setCustomName(next.label);
            } else {
                // Queue is empty, refill from server
                setLoading(true);
                const data = await aliasService.getAliasSuggestions();
                const list = Array.isArray(data?.aliases) ? data.aliases : [];
                if (list.length > 0) {
                    const first = list[0];
                    setCurrent(first);
                    setQueue(list.slice(1));
                    setCustomName(first.label);
                }
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Không thể tải tên gợi ý mới');
            onError?.(err);
        } finally {
            // Stop spinning after animation
            setTimeout(() => setIsDiceSpinning(false), 500);
        }
    };

    const handleConfirm = async () => {
        const nameToUse = customName.trim() || current?.label;

        if (!nameToUse) {
            setError('Vui lòng nhập tên hoặc chọn từ gợi ý');
            return;
        }

        // Client-side validation to give instant feedback
        const validationErrors = validateLabel(nameToUse);
        if (validationErrors.length > 0) {
            setError(validationErrors[0]);
            return;
        }

        try {
            setSelecting(true);
            setError(null);

            // Determine reservation token:
            // - If no custom input entered, use the suggestion's reservationToken
            // - If custom input matches the suggestion exactly, use reservationToken
            // - Otherwise, it's a custom name, so use null
            const hasCustomInput = customName.trim().length > 0;
            const nameMatchesSuggestion = hasCustomInput && current?.label && current.label === customName.trim();

            // Use reservationToken when: (no input) OR (input matches suggestion)
            const reservationToken = (!hasCustomInput || nameMatchesSuggestion)
                ? current?.reservationToken || null
                : null;

            await aliasService.issueAlias(nameToUse, reservationToken);

            // Update localStorage with alias info
            const authUserStr = localStorage.getItem("auth_user");
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                authUser.aliasLabel = nameToUse;
                authUser.aliasIssued = true;
                localStorage.setItem("auth_user", JSON.stringify(authUser));
            }

            await new Promise((r) => setTimeout(r, 800));
            const aliasInfo = await aliasService.getCurrentAlias();
            onAliasSelected?.(aliasInfo);
        } catch (err) {
            setError(err.message || 'Không thể chọn tên này');
            onError?.(err);
        } finally {
            setSelecting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-2xl border border-purple-200/60 dark:border-purple-800/40 bg-white dark:bg-neutral-900 shadow-2xl"
            >
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <span className="text-xl">🎭</span>
                            <span className="font-semibold">Chọn tên của bạn</span>
                        </div>
                        <button
                            className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300 transition-colors"
                            onClick={handleDice}
                            disabled={isDiceSpinning}
                            title="Random tên gợi ý"
                            aria-label="Random tên gợi ý"
                        >
                            <motion.span
                                animate={{ rotate: isDiceSpinning ? 360 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-lg"
                            >
                                🎲
                            </motion.span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* Input field for custom name */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tên của bạn
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => {
                                    let value = e.target.value || '';
                                    value = value.replace(/[^\p{L}\p{N}\s\-_.]/gu, '');
                                    if (value.length > 50) value = value.slice(0, 50);
                                    setCustomName(value);
                                    setError('');
                                }}
                                placeholder="Nhập tên của bạn..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                disabled={selecting}
                                maxLength={50}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                                {customName.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Suggestion display */}
                    {current && (
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tên gợi ý
                            </label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-purple-200/50 dark:border-purple-800/30">
                                <span className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                                    {loading ? 'Đang tải...' : current?.label}
                                </span>
                                <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                    {current?.expiredAt ? `Hết hạn: ${new Date(current.expiredAt).toLocaleTimeString('vi-VN')}` : ''}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-60"
                        disabled={loading || selecting || (!customName.trim() && !current)}
                        onClick={handleConfirm}
                    >
                        {selecting ? 'Đang tạo...' : 'XÁC NHẬN'}
                    </button>
                </div>

                {selecting && (
                    <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-white dark:bg-neutral-800 border border-purple-200/60 dark:border-purple-800/40 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            Đang tạo tên của bạn...
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AliasSelection;
