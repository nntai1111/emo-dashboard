import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle, Check, AlertCircle } from "lucide-react";
import Button from "../atoms/Button";
import { aliasService } from "../../services/apiService";

const RenameAliasModal = ({ isOpen, onClose, currentAlias, onSuccess }) => {
    const [newLabel, setNewLabel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    // Đã xoá: isRandomizing, suggestions, usedSuggestions, randomizeCount

    // === DANH SÁCH TỪ BỊ CẤM (giống backend) ===
    const PROHIBITED_PATTERNS = [
        "admin", "administrator", "mod", "moderator", "support", "staff",
        "root", "superuser", "owner", "dev", "developer", "bot",
        "fuck", "shit", "ass", "bitch", "cunt", "nigg", "porn", "sex",
        "xxx", "viagra", "casino", "login", "signup", "official"
    ];

    // Regex: chỉ cho phép chữ, số, space, - _ .
    const REPEATED_CHARS_REGEX = /(.)\1{4,}/;

    // === VALIDATION FUNCTION (giống backend C#) ===
    const validateLabel = (label) => {
        const reasons = [];
        const trimmed = label.trim();

        if (!trimmed) {
            reasons.push("Vui lòng nhập tên mới");
            return reasons;
        }

        if (trimmed.length < 3) {
            reasons.push("Tên phải có ít nhất 3 ký tự");
        }

        if (trimmed.length > 50) {
            reasons.push("Tên không được quá 50 ký tự");
        }

        if (REPEATED_CHARS_REGEX.test(trimmed)) {
            reasons.push("Không được lặp ký tự quá 4 lần liên tiếp");
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

    // === XỬ LÝ INPUT: LOẠI BỎ KÝ TỰ KHÔNG HỢP LỆ ===
    const handleInputChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^\p{L}\p{N}\s\-_.]/gu, '');

        // Giới hạn 50 ký tự
        if (value.length > 50) {
            value = value.slice(0, 50);
        }

        setNewLabel(value);
        setError(""); // Xóa lỗi khi người dùng sửa
    };

    // Reset state
    useEffect(() => {
        if (isOpen) {
            setNewLabel(currentAlias || "");
            setError("");
            setSuccess(false);
            // Đã xoá: setUsedSuggestions, setRandomizeCount, loadSuggestions()
        }
    }, [isOpen]);

    // Đã xoá: loadSuggestions, generateFallbackAlias (không cần random gì cả)

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = newLabel.trim();

        if (trimmed === currentAlias) {
            setError("Tên mới phải khác tên hiện tại");
            return;
        }

        const validationErrors = validateLabel(trimmed);
        if (validationErrors.length > 0) {
            setError(validationErrors[0]); // Hiển thị lỗi đầu tiên
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await aliasService.renameAlias(trimmed);

            const authUserStr = localStorage.getItem("auth_user");
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                authUser.aliasLabel = trimmed;
                localStorage.setItem("auth_user", JSON.stringify(authUser));
                setSuccess(true);
                setTimeout(() => {
                    onSuccess?.(trimmed);
                    onClose();
                }, 1500);
                try {
                    window.dispatchEvent(new Event("app:auth-changed"));
                } catch { }
            }

        } catch (error) {
            setError(error.message || "Tên đã được sử dụng, hãy chọn tên khác");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => !isLoading && onClose();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white dark:bg-[#1C1C1E] rounded-2xl w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Shuffle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Đổi tên</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {success ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Đổi tên thành công!</h3>
                                <p className="text-gray-600 dark:text-gray-400">Tên của bạn đã được cập nhật thành "{newLabel}"</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tên mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newLabel}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên mới..."
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                            disabled={isLoading}
                                            maxLength={50}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{newLabel.length}/50 ký tự</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Chỉ dùng: chữ, số, - _ .
                                        </p>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 text-white">
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !newLabel.trim() || newLabel.trim() === currentAlias}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                                    >
                                        {!isLoading ? "Đổi tên" : (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang đổi...</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RenameAliasModal;