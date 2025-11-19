import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Hash, X } from "lucide-react";
import Button from "../atoms/Button";

const CategoryFilterBreadcrumb = ({
    selectedCategory,
    onClearFilter,
    onBackToHome,
    className = ""
}) => {
    if (!selectedCategory) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mb-4 ${className}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBackToHome}
                        className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50"
                        title="Quay về trang chính"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center space-x-2">
                        {/* <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-800/50 rounded-full">
                            <Hash className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                Đang xem chủ đề:
                            </span>
                        </div> */}

                        <div className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-full shadow-sm">
                            <span className="text-lg">
                                {(() => {
                                    try {
                                        if (selectedCategory.unicodeCodepoint) {
                                            const codePoint = parseInt(selectedCategory.unicodeCodepoint, 16);
                                            if (!isNaN(codePoint) && codePoint > 0) {
                                                return String.fromCodePoint(codePoint);
                                            }
                                        }
                                        return "🏷️";
                                    } catch (error) {
                                        console.warn("Invalid unicode codepoint:", selectedCategory.unicodeCodepoint);
                                        return "🏷️";
                                    }
                                })()}
                            </span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {selectedCategory.displayNameVi || selectedCategory.displayName || "Unknown"}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilter}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Xóa bộ lọc"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
};

export default CategoryFilterBreadcrumb;
