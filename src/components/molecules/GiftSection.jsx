import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, X, Sparkles, Users, Lock } from "lucide-react";
import { digitalGoodsService } from "../../services/apiService";
import { formatTimeAgo } from "../../utils/helpers";
import { getGiftSmart } from "../../utils/giftHelpers";
import digitalGoods from '../../data/digitalGoods.json';
import { useSelector } from 'react-redux';
import { selectIsOwner } from '../../store/authSlice';
import UpgradeModal from './UpgradeModal';

const GiftSection = ({ postId, userId, giftCount, onGiftSent }) => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sentGift, setSentGift] = useState(null);
    const [showGiftGiversModal, setShowGiftGiversModal] = useState(false);
    const [giftGivers, setGiftGivers] = useState([]);
    const [giftGiversLoading, setGiftGiversLoading] = useState(false);
    const [giftGiversError, setGiftGiversError] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const isOwner = useSelector(selectIsOwner);

    useEffect(() => {
        // Không fetch từ API nữa, lấy trực tiếp từ JSON
        setGifts(digitalGoods.digitalGoods || []);
    }, []);

    const fetchGiftGivers = async () => {
        if (!postId) return;
        setGiftGiversLoading(true);
        setGiftGiversError(null);
        try {
            const data = await digitalGoodsService.getGiftGivers(postId);
            setGiftGivers(data.gifts?.data || []);
        } catch (error) {
            console.error("Error fetching gift givers:", error);
            setGiftGiversError("Không thể tải danh sách người tặng quà");
        } finally {
            setGiftGiversLoading(false);
        }
    };

    // Helper function để kiểm tra gift có bị lock không (dựa vào việc đã mua gói)
    const isGiftLocked = (gift) => {
        if (gift.isOwnedByUser) return false;
        return !isOwner;
    };

    const handleGiftSelect = (gift) => {
        setSelectedGift(gift);
    };

    const handleSendGift = async () => {
        if (!selectedGift || !postId) return;
        setIsSending(true);
        try {
            await digitalGoodsService.sendGift(postId, selectedGift.id, selectedGift.name);
            setSentGift(selectedGift);
            setShowSuccess(true);
            if (onGiftSent) {
                onGiftSent(postId);
            }
            setTimeout(() => {
                setShowSuccess(false);
                setShowModal(false);
                setSelectedGift(null);
                setSentGift(null);
            }, 2000);
        } catch (error) {
            console.error("Error sending gift:", error);
            alert("Không thể gửi quà. Vui lòng thử lại sau.");
        } finally {
            setIsSending(false);
        }
    };

    const handleShowGifts = () => {
        if (gifts.length === 0) {
            // fetchGifts(); // Không cần fetch nữa
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedGift(null);
    };

    const handleShowGiftGivers = () => {
        fetchGiftGivers();
        setShowGiftGiversModal(true);
    };

    const handleCloseGiftGiversModal = () => {
        setShowGiftGiversModal(false);
    };

    return (
        <>
            <div className="mt-3 sm:mt-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShowGifts}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 group"
                    >
                        <Gift className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Tặng quà</span>
                    </button>
                    <button
                        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 group"
                        onClick={handleShowGiftGivers}
                        title="Xem danh sách người tặng quà"
                    >
                        <span className="text-xs">•</span>
                        <span className="text-xs group-hover:underline">{giftCount} quà</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-pink-500" />
                                    Chọn quà tặng 💝
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Đang tải quà tặng</span>
                                        </div>
                                    </div>
                                ) : gifts.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {gifts.map((gift) => {
                                            const locked = isGiftLocked(gift);
                                            return (
                                                <motion.button
                                                    key={gift.id}
                                                    onClick={() => {
                                                        if (!locked) {
                                                            handleGiftSelect(gift);
                                                        } else {
                                                            setShowUpgradeModal(true);
                                                        }
                                                    }}
                                                    whileHover={!locked ? { scale: 1.05 } : { scale: 1.02 }}
                                                    whileTap={!locked ? { scale: 0.95 } : { scale: 0.98 }}
                                                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 group relative cursor-pointer ${selectedGift?.id === gift.id
                                                        ? "bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-300 dark:border-pink-600"
                                                        : locked
                                                            ? "opacity-60"
                                                            : "hover:bg-pink-50 dark:hover:bg-gray-700"
                                                        }`}
                                                    title={gift.name}
                                                >
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-500 mb-2 relative">
                                                        <img
                                                            src={gift.mediaUrl}
                                                            alt={gift.name}
                                                            className={`w-full h-full object-cover transition-transform duration-200 ${locked ? '' : 'group-hover:scale-110'}`}
                                                            onError={(e) => {
                                                                e.target.style.display = "none";
                                                                e.target.nextSibling.style.display = "flex";
                                                            }}
                                                        />
                                                        <div className="hidden w-full h-full items-center justify-center text-pink-400">
                                                            <Heart className="w-6 h-6" />
                                                        </div>
                                                        {locked && (
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                <Lock className="w-6 h-6 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs text-center text-gray-600 dark:text-gray-300 line-clamp-2 font-medium leading-tight ${locked ? 'opacity-50' : ''}`}>
                                                        {gift.name}
                                                    </span>
                                                    {gift.price === 0 && !locked && (
                                                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                                            Miễn phí
                                                        </span>
                                                    )}
                                                    {locked && (
                                                        <span className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">
                                                            Đã khóa
                                                        </span>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">Không có quà tặng nào</p>
                                    </div>
                                )}
                            </div>
                            {gifts.length > 0 && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    {selectedGift ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                                <img
                                                    src={selectedGift.mediaUrl}
                                                    alt={selectedGift.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {selectedGift.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Đã chọn quà tặng</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCloseModal}
                                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={handleSendGift}
                                                    disabled={isSending}
                                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    {isSending ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Đang gửi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Gift className="w-4 h-4" />
                                                            Gửi quà
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-sm text-gray-500 py-2">
                                            Chọn một món quà để gửi
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
                            >
                                <Sparkles className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                            >
                                Quà đã được gửi! 🎉
                            </motion.h3>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-center gap-3 mb-4"
                            >
                                {sentGift && (
                                    <>
                                        <img
                                            src={sentGift.mediaUrl}
                                            alt={sentGift.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {sentGift.name}
                                            </p>
                                            <p className="text-sm text-gray-500">Đã gửi thành công!</p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGiftGiversModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-800/50 z-50 flex items-center justify-center p-4"
                        onClick={handleCloseGiftGiversModal}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-pink-500" />
                                    Danh sách người tặng quà
                                </h3>

                                <button
                                    onClick={handleCloseGiftGiversModal}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {giftGiversLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Đang tải danh sách...</span>
                                        </div>
                                    </div>
                                ) : giftGiversError ? (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-red-500">{giftGiversError}</p>
                                    </div>
                                ) : giftGivers.length > 0 ? (
                                    <div className="space-y-3">
                                        {giftGivers.map((gift) => {
                                            const giftData = getGiftSmart(gift.giftId, gift.message);
                                            return (
                                                <div
                                                    key={gift.giftId}
                                                    className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {giftData?.mediaUrl ? (
                                                            <img
                                                                src={giftData.mediaUrl}
                                                                alt={giftData.name}
                                                                className="w-12 h-12 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                <Gift className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {giftData?.name || gift.message || "Quà tặng"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {gift.author.displayName} - {formatTimeAgo(gift.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">Chưa có ai tặng quà</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </>
    );
};

export default GiftSection;