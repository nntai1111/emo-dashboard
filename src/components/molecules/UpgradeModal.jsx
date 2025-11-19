import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Crown } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        // Navigate to packages page
        const currentPath = window.location.pathname;

        if (currentPath === '/trang-chu') {
            // Nếu đang ở trang chủ, scroll trực tiếp
            setTimeout(() => {
                const packagesSection = document.querySelector('#packages-section');
                if (packagesSection) {
                    packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Nếu không tìm thấy, thử lại sau một chút
                    setTimeout(() => {
                        const retrySection = document.querySelector('#packages-section');
                        if (retrySection) {
                            retrySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 500);
                }
            }, 100);
        } else {
            // Nếu đang ở route khác, lưu target section và navigate
            localStorage.setItem('scrollToSection', 'packages-section');
            navigate('/trang-chu', { replace: false });
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Nâng cấp gói dịch vụ
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Tính năng này chỉ dành cho thành viên Premium. Vui lòng nâng cấp gói dịch vụ để tiếp tục sử dụng.
                            </p>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4">
                                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <span className="text-purple-500">✓</span>
                                        <span>Truy cập đầy đủ các thử thách và bài viết</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-purple-500">✓</span>
                                        <span>Theo dõi tiến độ học tập chi tiết</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-purple-500">✓</span>
                                        <span>Nhiều tính năng độc quyền khác</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpgrade}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                            >
                                Nâng cấp ngay
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default UpgradeModal;

