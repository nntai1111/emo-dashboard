

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Smile, Hash, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { addPost } from "../../store/postsSlice";
import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import categoryTagsData from "../../data/tagCategory.json";
import { v4 as uuidv4 } from "uuid";
import { postService } from "../../services/postService";
import { tagService, emotionService } from "../../services/apiService";
import tagEmotions from '../../data/tagEmotions1.json';
import { getUnicodeEmoji } from "../../utils/tagHelpers";
import { selectIsOwner } from '../../store/authSlice';
import UpgradeModal from '../molecules/UpgradeModal';

// Helper function để hiển thị emotion icon (ưu tiên mediaUrl, fallback unicodeCodepoint)
const getEmotionIcon = (emotion) => {
    if (!emotion) return "";

    // Nếu có mediaUrl, hiển thị ảnh (bất kể user có sở hữu hay không)
    if (emotion.mediaUrl) {
        return (
            <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-lg">
                <div className="w-full h-full overflow-hidden">
                    <img
                        src={emotion.mediaUrl}
                        alt={emotion.displayName}
                        className="w-25 h-10 md:w-10 md:h-10 object-cover object-center scale-325"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'inline';
                        }}
                    />
                </div>


                <span className="text-3xl hidden">
                    {getUnicodeEmoji(emotion.unicodeCodepoint)}
                </span>
            </div>

        );
    }

    // Nếu không có mediaUrl, hiển thị unicode
    return (
        <span className="text-lg">
            {getUnicodeEmoji(emotion.unicodeCodepoint)}
        </span>
    );
};

// Helper function để kiểm tra emotion có bị lock không
const isEmotionLocked = (emotion, isOwner) => {
    // return false;
    // Demo, gắn cứng đã mua gói. Thực tế có thể truyền prop hoặc lấy từ Redux/context
    if (emotion.isOwnedByUser) return false;
    return !isOwner;
};

// Gán màu sắc cho từng nhóm cảm xúc
const getCategoryColor = (categoryName) => {
    switch (categoryName) {
        case "Tích cực":
            return {
                bgLight: "bg-green-100",
                bgDark: "bg-green-900/30",
                borderLight: "border-green-300",
                borderDark: "border-green-600",
                textLight: "text-green-800",
                textDark: "text-green-200",
                headerBg: "bg-gradient-to-r from-white to-green-100 dark:from-purple-900/20 dark:to-green-900/30",
                gridBg: "bg-green-100 dark:bg-green-900/30"
            };
        case "Hạnh phúc":
            return {
                bgLight: "bg-yellow-100",
                bgDark: "bg-yellow-900/30",
                borderLight: "border-yellow-300",
                borderDark: "border-yellow-600",
                textLight: "text-yellow-800",
                textDark: "text-yellow-200",
                headerBg: "bg-gradient-to-r from-white to-yellow-100 dark:from-purple-900/20 dark:to-yellow-900/30",
                gridBg: "bg-yellow-100 dark:bg-yellow-900/30"
            };
        case "Buồn":
            return {
                bgLight: "bg-blue-100",
                bgDark: "bg-blue-900/30",
                borderLight: "border-blue-300",
                borderDark: "border-blue-600",
                textLight: "text-blue-800",
                textDark: "text-blue-200",
                headerBg: "bg-gradient-to-r from-white to-blue-100 dark:from-purple-900/20 dark:to-blue-900/30",
                gridBg: "bg-blue-100 dark:bg-blue-900/30"
            };
        case "Lo lắng":
            return {
                bgLight: "bg-orange-100",
                bgDark: "bg-orange-900/30",
                borderLight: "border-orange-300",
                borderDark: "border-orange-600",
                textLight: "text-orange-800",
                textDark: "text-orange-200",
                headerBg: "bg-gradient-to-r from-white to-orange-100 dark:from-purple-900/20 dark:to-orange-900/30",
                gridBg: "bg-orange-100 dark:bg-orange-900/30"
            };
        case "Tức giận":
            return {
                bgLight: "bg-red-100",
                bgDark: "bg-red-900/30",
                borderLight: "border-red-300",
                borderDark: "border-red-600",
                textLight: "text-red-800",
                textDark: "text-red-200",
                headerBg: "bg-gradient-to-r from-white to-red-100 dark:from-purple-900/20 dark:to-red-900/30",
                gridBg: "bg-red-100 dark:bg-red-900/30"
            };
        case "Trung lập":
            return {
                bgLight: "bg-gray-100",
                bgDark: "bg-gray-700/30",
                borderLight: "border-gray-300",
                borderDark: "border-gray-600",
                textLight: "text-gray-800",
                textDark: "text-gray-200",
                headerBg: "bg-gradient-to-r from-white to-gray-100 dark:from-purple-900/20 dark:to-gray-700/30",
                gridBg: "bg-gray-100 dark:bg-gray-700/30"
            };
        case "Sự không chắc chắn":
            return {
                bgLight: "bg-purple-100",
                bgDark: "bg-purple-900/30",
                borderLight: "border-purple-300",
                borderDark: "border-purple-600",
                textLight: "text-purple-800",
                textDark: "text-purple-200",
                headerBg: "bg-gradient-to-r from-white to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30",
                gridBg: "bg-purple-100 dark:bg-purple-900/30"
            };
        case "Đau buồn":
            return {
                bgLight: "bg-indigo-100",
                bgDark: "bg-indigo-900/30",
                borderLight: "border-indigo-300",
                borderDark: "border-indigo-600",
                textLight: "text-white",
                textDark: "text-indigo-200",
                headerBg: "bg-gradient-to-r from-white to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/30",
                gridBg: "bg-indigo-100 dark:bg-indigo-900/30"
            };
        default:
            return {
                bgLight: "bg-gray-100",
                bgDark: "bg-gray-700/30",
                borderLight: "border-gray-300",
                borderDark: "border-gray-600",
                textLight: "text-gray-800",
                textDark: "text-gray-200",
                headerBg: "bg-gradient-to-r from-white to-gray-100 dark:from-purple-900/20 dark:to-gray-700/30",
                gridBg: "bg-gray-100 dark:bg-gray-700/30"
            };
    }
};

// Mock upload media
const uploadMedia = async (files) => {
    const promises = files.map((file) =>
        new Promise((resolve) => {
            setTimeout(() => resolve({ mediaId: uuidv4(), url: URL.createObjectURL(file) }), 500);
        })
    );
    return Promise.all(promises);
};

// Reusable CreatePostForm
const CreatePostForm = ({
    content,
    setContent,
    title,
    setTitle,
    categoryTagId,
    setCategoryTagId,
    emotionId,
    setEmotionId,
    isPosting,
    handleSubmit,
    handleKeyPress,
    user,
    categoryTags,
    emotionCategories,
    loadingTags,
    loadingEmotions,
    categorySearch,
    setCategorySearch,
    showCategoryModal,
    setShowCategoryModal,
    showEmotionModal,
    setShowEmotionModal,
    selectedCategory,
    selectedEmotion,
    fetchTags,
    fetchEmotions,
    currentEmotionCategoryIndex,
    setCurrentEmotionCategoryIndex,
    isOwner,
}) => (
    <>
        <div className="flex items-center space-x-3 mb-4">
            <Avatar
                username={user?.aliasLabel || user?.displayName || user?.username || "Bạn"}
                size="md"
                className="w-10 h-10 flex-shrink-0"
                rounded={false}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">Ẩn danh</span>
                    <div className="w-1 h-1 bg-green-400 dark:bg-green-500 rounded-full"></div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Chia sẻ với cộng đồng</span>
                </div>
            </div>
        </div>
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <textarea
                    placeholder="Viết gì đó..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={4}
                    className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-sm leading-relaxed"
                    disabled={isPosting}
                />
            </div>

            {/* Category & Emotion Selection */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Thẻ & Cảm xúc</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => {
                            fetchTags();
                            setShowCategoryModal(true);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${categoryTagId
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600"
                            : "bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-600 shadow-sm hover:shadow-md"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${categoryTagId ? "bg-purple-500" : "bg-purple-100 dark:bg-purple-900/30"
                                }`}
                        >
                            {selectedCategory && (
                                <span className="text-lg">{getUnicodeEmoji(selectedCategory.unicodeCodepoint)}</span>
                            )}
                            {!selectedCategory && (
                                <Hash
                                    className={`w-4 h-4 ${categoryTagId ? "text-white" : "text-purple-600 dark:text-purple-400"}`}
                                />
                            )}
                        </div>
                        <div className="text-left">
                            <div
                                className={`text-sm font-medium ${categoryTagId ? "text-purple-800 dark:text-purple-200" : "text-gray-800 dark:text-gray-200"
                                    }`}
                            >
                                {selectedCategory ? (selectedCategory.displayNameVi || selectedCategory.displayName) : "Danh mục"}
                            </div>

                        </div>
                    </button>
                    <button
                        onClick={() => {
                            if (emotionCategories.length === 0) {
                                fetchEmotions();
                            }
                            setShowEmotionModal(true);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${emotionId
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600"
                            : "bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-600 shadow-sm hover:shadow-md"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-lg ${emotionId ? "bg-purple-500" : "bg-purple-100 dark:bg-purple-900/30"}`}
                        >
                            {selectedEmotion && getEmotionIcon(selectedEmotion)}
                            {!selectedEmotion && (
                                <Smile className={`w-4 h-4 ${emotionId ? "text-white" : "text-purple-600 dark:text-purple-400"}`} />
                            )}
                        </div>
                        <div className="text-left">
                            <div
                                className={`text-sm font-medium capitalize ${emotionId ? "text-purple-800 dark:text-purple-200" : "text-gray-800 dark:text-gray-200"
                                    }`}
                            >
                                {selectedEmotion ? (selectedEmotion.displayNameVi || selectedEmotion.displayName) : "Cảm xúc"}
                            </div>

                        </div>
                    </button>
                </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="flex items-center justify-between">
                    <span
                        className={`text-sm font-medium ${content.length > 500
                            ? "text-red-500 dark:text-red-400"
                            : content.length > 400
                                ? "text-amber-500 dark:text-amber-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        {content.length}/500
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || content.length > 500 || isPosting}
                        className={`px-6 py-3 text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all duration-200 ${!content.trim() || content.length > 500 || isPosting
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        <span>{isPosting ? "Đang đăng..." : "Đăng bài"}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Category Modal */}
        {showCategoryModal && (
            <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700 bg-gradient-to-r from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Hash className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Chọn Danh mục</h2>
                        </div>
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-purple-200 dark:border-purple-700">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                            />
                            <input
                                type="text"
                                placeholder="Tìm danh mục..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-600 rounded-xl bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            />
                            {categorySearch && (
                                <button
                                    onClick={() => setCategorySearch("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        {loadingTags ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Đang tải danh mục...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                {categoryTags
                                    ?.filter(
                                        (tag) =>
                                            !categorySearch || (tag.displayNameVi || tag.displayName).toLowerCase().includes(categorySearch.toLowerCase())
                                    )
                                    .map((tag) => {
                                        if (!tag || !tag.id || !tag.displayName) return null;
                                        const isSelected = categoryTagId === tag.id;
                                        return (
                                            <motion.button
                                                key={tag.id}
                                                onClick={() => {
                                                    setCategoryTagId(isSelected ? "" : tag.id);
                                                    setShowCategoryModal(false);
                                                }}
                                                className={`flex flex-col items-center space-y-1 px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${isSelected
                                                    ? "bg-purple-500 text-white shadow-lg"
                                                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-600"
                                                    }`}
                                                whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.span
                                                    whileHover={{ scale: 1.3, y: -4 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                    className="text-lg"
                                                >
                                                    {getUnicodeEmoji(tag.unicodeCodepoint)}
                                                </motion.span>
                                                <span className="text-center leading-tight text-xs">{tag.displayNameVi || tag.displayName}</span>
                                            </motion.button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Emotion Modal */}
        {showEmotionModal && (
            <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                    <div
                        className={`flex items-center justify-between p-4 border-b ${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName).borderLight
                            } dark:${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName).borderDark
                            } ${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName).headerBg}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Smile className="w-5 h-5 text-white" />
                            </div>
                            <h2
                                className={`text-lg font-semibold ${getCategoryColor(
                                    emotionCategories[currentEmotionCategoryIndex].categoryName
                                ).textLight
                                    } dark:${getCategoryColor(
                                        emotionCategories[currentEmotionCategoryIndex].categoryName
                                    ).textDark
                                    }`}
                            >
                                {emotionCategories[currentEmotionCategoryIndex].categoryName
                                    .charAt(0)
                                    .toUpperCase() +
                                    emotionCategories[currentEmotionCategoryIndex].categoryName.slice(1)}
                            </h2>

                        </div>
                        <button
                            onClick={() => setShowEmotionModal(false)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4">
                        {loadingEmotions ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Đang tải cảm xúc...</p>
                                </div>
                            </div>
                        ) : emotionCategories.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Không có cảm xúc nào</p>
                                    <button
                                        onClick={fetchEmotions}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <motion.button
                                        onClick={() =>
                                            setCurrentEmotionCategoryIndex(
                                                (currentEmotionCategoryIndex - 1 + emotionCategories.length) % emotionCategories.length
                                            )
                                        }
                                        className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ChevronLeft className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </motion.button>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {currentEmotionCategoryIndex + 1} / {emotionCategories.length}
                                    </span>
                                    <motion.button
                                        onClick={() =>
                                            setCurrentEmotionCategoryIndex(
                                                (currentEmotionCategoryIndex + 1) % emotionCategories.length
                                            )
                                        }
                                        className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </motion.button>
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentEmotionCategoryIndex}
                                        initial={{ x: currentEmotionCategoryIndex > 0 ? 100 : -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: currentEmotionCategoryIndex > 0 ? -100 : 100, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className={`grid grid-cols-4 gap-2 p-4 rounded-xl ${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName).gridBg}`}
                                    >
                                        {emotionCategories[currentEmotionCategoryIndex].emotions.map((emo) => {
                                            if (!emo || !emo.id || !emo.displayName) return null;
                                            const isSelected = emotionId === emo.id;
                                            const isLocked = isEmotionLocked(emo, isOwner);
                                            return (
                                                <motion.button
                                                    key={emo.id}
                                                    onClick={() => {
                                                        if (!isLocked) {
                                                            setEmotionId(isSelected ? "" : emo.id);
                                                            setShowEmotionModal(false);
                                                        } else {
                                                            setShowUpgradeModal(true);
                                                        }
                                                    }}
                                                    className={`flex flex-col items-center space-y-1 px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 relative cursor-pointer ${isSelected
                                                        ? "bg-purple-500 text-white shadow-lg"
                                                        : `bg-white dark:bg-gray-700 text-gray-700 dark:text-white border ${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName)
                                                            .borderLight
                                                        } dark:${getCategoryColor(emotionCategories[currentEmotionCategoryIndex].categoryName)
                                                            .borderDark
                                                        }`}
                                                        } ${isLocked ? 'opacity-60' : ''}`}
                                                    whileHover={!isLocked ? { scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" } : { scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <motion.div
                                                        whileHover={!isLocked ? { scale: 1.3, y: -4 } : {}}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                        className="text-lg"
                                                    >
                                                        {getEmotionIcon(emo)}
                                                    </motion.div>
                                                    <span className={`text-center leading-tight text-xs capitalize ${isLocked ? 'opacity-50' : ''}`}>
                                                        {emo.displayNameVi || emo.displayName}
                                                    </span>
                                                    {isLocked && (
                                                        <div className="absolute top-1 right-1">
                                                            <span className="text-xs">🔒</span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
);

// Error Boundary Component
class CreatePostErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("CreatePost Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-500">⚠️</span>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                            Có lỗi xảy ra khi tải form tạo bài viết. Vui lòng thử lại.
                        </p>
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const CreatePost = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.posts);
    const isOwner = useSelector(selectIsOwner);

    // Get user data from localStorage as fallback to ensure we have aliasLabel
    const getUserData = () => {
        try {
            const authUserStr = localStorage.getItem("auth_user");
            if (authUserStr) {
                const authUser = JSON.parse(authUserStr);
                // Merge Redux user with localStorage auth_user to ensure we have aliasLabel
                return {
                    ...user,
                    ...authUser
                };
            }
        } catch (error) {
            console.error("Error parsing auth_user from localStorage:", error);
        }
        return user;
    };

    const userData = getUserData();

    // State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryTagId, setCategoryTagId] = useState("");
    const [emotionId, setEmotionId] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showEmotionModal, setShowEmotionModal] = useState(false);
    const [categoryTags, setCategoryTags] = useState([]);
    const [emotionCategories, setEmotionCategories] = useState([]); // Sẽ load từ API
    const [loadingTags, setLoadingTags] = useState(false);
    const [loadingEmotions, setLoadingEmotions] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [currentEmotionCategoryIndex, setCurrentEmotionCategoryIndex] = useState(0); // Theo dõi nhóm cảm xúc hiện tại
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Fetch category tags từ API và merge với JSON local
    const fetchTags = async () => {
        setLoadingTags(true);
        try {
            // Không gọi API nữa, lấy trực tiếp từ JSON
            setCategoryTags(categoryTagsData.categoryTags || []);
        } catch {
            setCategoryTags([]);
        } finally {
            setLoadingTags(false);
        }
    };

    // Sửa fetchEmotions để group lại thành { topic, emotions } dạng mới từ tags json
    const fetchEmotions = async () => {
        setLoadingEmotions(true);
        try {
            setEmotionCategories(tagEmotions.emotionCategories || []);
        } catch (err) {
            setEmotionCategories([]);
        } finally {
            setLoadingEmotions(false);
        }
    };

    // Lấy thông tin danh mục và cảm xúc đã chọn
    const selectedCategory = categoryTags.find((tag) => tag.id === categoryTagId);
    const selectedEmotion = emotionCategories
        .flatMap((category) => category.emotions)
        .find((emo) => emo.id === emotionId);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!content.trim() || isPosting) return;

        // Require category and emotion before posting
        if (!categoryTagId || !emotionId) {
            setPendingSubmit(true);
            if (!categoryTagId) {
                if (!loadingTags) fetchTags();
                setShowCategoryModal(true);
            } else if (!emotionId) {
                setShowEmotionModal(true);
            }
            return;
        }
        setIsPosting(true);
        try {
            const sanitizedContent = sanitizeInput(content) || "";

            const body = {
                content: sanitizedContent,
                visibility: "Public",
            };

            if (title.trim()) body.title = title.trim();
            if (categoryTagId) body.categoryTagId = categoryTagId;
            if (emotionId) body.emotionId = emotionId;

            body.medias = [];

            const apiData = await postService.createPost(body);

            const responseData = apiData || {};
            const newPost = {
                id: responseData.postId || responseData.id || Date.now(),
                content: responseData.content || sanitizedContent,
                title: responseData.title || title.trim() || "",
                visibility: responseData.visibility || "Public",
                categoryTagId: responseData.categoryTagId || categoryTagId || "",
                emotionId: responseData.emotionId || emotionId || "",
                author: {
                    id: userData?.aliasId || userData?.id || "anonymous",
                    username: userData?.aliasLabel || userData?.displayName || userData?.username || generateAnonymousName(),
                    isOnline: true,
                },
                createdAt: apiData.createdAt || new Date().toISOString(),
                likesCount: apiData.likesCount || 0,
                commentsCount: apiData.commentsCount || 0,
                liked: apiData.liked || false,
                comments: apiData.comments || [],
                images: [],
                ...apiData,
            };

            dispatch(addPost(newPost));

            setTitle("");
            setContent("");
            setCategoryTagId("");
            setEmotionId("");
            setCategorySearch("");
            setCurrentEmotionCategoryIndex(0); // Reset về nhóm cảm xúc đầu tiên
            setShowPopup(false);
        } catch (error) {
            console.error("Failed to create post:", error);
            const errMsg = error.response?.data?.title || error.message || "Lỗi tạo bài viết";
            console.error(errMsg);
        } finally {
            setIsPosting(false);
        }
    };

    // Load emotions khi component mount
    useEffect(() => {
        if (emotionCategories.length === 0) {
            fetchEmotions();
        }
    }, []);

    // When user was prompted to choose and has selected both, auto-submit
    useEffect(() => {
        if (pendingSubmit) {
            if (!categoryTagId) {
                if (!loadingTags) fetchTags();
                setShowCategoryModal(true);
                return;
            }
            if (!emotionId) {
                setShowEmotionModal(true);
                return;
            }
            if (categoryTagId && emotionId && !isPosting && content.trim()) {
                setPendingSubmit(false);
                handleSubmit(null);
            }
        }
    }, [pendingSubmit, categoryTagId, emotionId]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
    };

    const handleContainerClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    return (
        <CreatePostErrorBoundary>
            <div
                onClick={handleContainerClick}
                className="bg-white dark:bg-[#1C1C1E] border border-purple-200 dark:border-purple-600 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
                <div className="flex items-start p-4 space-x-3">
                    <Avatar
                        username={user?.aliasLabel || user?.displayName || user?.username || "Bạn"}
                        size="md"
                        className="w-10 h-10 flex-shrink-0"
                        rounded={false}
                    />
                    <div className="flex-1">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span className="flex items-center space-x-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {user?.aliasLabel || user?.displayName || user?.username || "Bạn"}
                                </span>
                                <span>•</span>
                                <span className="text-green-500">Công khai</span>
                            </span>
                        </div>
                        <div className="relative">
                            <input
                                readOnly
                                onClick={handleContainerClick}
                                placeholder="Bạn đang nghĩ gì thế?"
                                value={content}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-purple-200 dark:border-purple-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none text-base leading-relaxed transition-all hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            />
                            <button
                                onClick={handleContainerClick}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-600">
                            <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Tạo bài viết</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                disabled={isPosting}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            <CreatePostForm
                                title={title}
                                setTitle={setTitle}
                                content={content}
                                setContent={setContent}
                                categoryTagId={categoryTagId}
                                setCategoryTagId={setCategoryTagId}
                                emotionId={emotionId}
                                setEmotionId={setEmotionId}
                                isPosting={isPosting}
                                handleSubmit={handleSubmit}
                                handleKeyPress={handleKeyPress}
                                user={userData}
                                categoryTags={categoryTags}
                                emotionCategories={emotionCategories}
                                loadingTags={loadingTags}
                                loadingEmotions={loadingEmotions}
                                categorySearch={categorySearch}
                                setCategorySearch={setCategorySearch}
                                showCategoryModal={showCategoryModal}
                                setShowCategoryModal={setShowCategoryModal}
                                showEmotionModal={showEmotionModal}
                                setShowEmotionModal={setShowEmotionModal}
                                selectedCategory={selectedCategory}
                                selectedEmotion={selectedEmotion}
                                fetchTags={fetchTags}
                                fetchEmotions={fetchEmotions}
                                currentEmotionCategoryIndex={currentEmotionCategoryIndex}
                                setCurrentEmotionCategoryIndex={setCurrentEmotionCategoryIndex}
                                isOwner={isOwner}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </CreatePostErrorBoundary>
    );
};

export default CreatePost;