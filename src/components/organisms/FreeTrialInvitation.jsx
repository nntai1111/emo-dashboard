import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { freeTrialService } from '../../services/apiService';
import { tokenManager } from '../../services/tokenManager';
import { updateToken, setIsOwner } from '../../store/authSlice';
import { jwtDecode } from 'jwt-decode';

const FreeTrialInvitation = ({ onActivated }) => {
    const dispatch = useDispatch();
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const shouldReduceMotion = useReducedMotion();

    const features = [
        { icon: '💬', text: 'Nói chuyện với Emo mọi lúc, 24/7 luôn nè' },
        { icon: '🫶', text: 'Vô cộng đồng ẩn danh, tám chuyện thoải mái' },
        { icon: '🖼️', text: 'Tạo 1 ảnh cảm xúc AI/ngày, 3 ngày liền' },
        { icon: '😍', text: 'Mở khóa 3 bộ emoji Feelback xịn xò' },
        { icon: '🎯', text: 'Thử thách 3–7 ngày, theo dõi mood' },
        { icon: '🌈', text: 'Đọc hết CareSpace, không giới hạn' },
        { icon: '🧠', text: 'Làm EmoTest + nhận PDF chi tiết' },
        { icon: '💾', text: 'Dữ liệu được lưu lại hết, không mất' },
    ];

    const handleActivate = async () => {
        try {
            setIsActivating(true);
            setError(null);

            const response = await freeTrialService.activateFreeTrial();
            const message = response?.message || "Xong rồi nè! Chào mừng bạn đến với Emo! 🎉";
            setSuccessMessage(message);

            try {
                const newToken = await tokenManager.refreshToken();
                if (newToken) {
                    dispatch(updateToken({ token: newToken }));
                    try {
                        const decoded = jwtDecode(newToken);
                        const isOwner = decoded?.SubscriptionPlanName && decoded.SubscriptionPlanName !== 'Free Plan';
                        dispatch(setIsOwner(isOwner));
                    } catch (e) {
                        console.error('Error decoding token:', e);
                    }
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
            }

            setShowSuccessModal(true);
        } catch (err) {
            setError(err.message || 'Oops, có lỗi rồi. Thử lại nha?');
            console.error('Error activating free trial:', err);
        } finally {
            setIsActivating(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onActivated?.();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            >
                {/* Header - đơn giản, thân thiện */}
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                                🎉
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Dùng thử 3 ngày miễn phí!
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Không cần thẻ, không lo gì hết
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 py-2 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Bạn sẽ được:</p>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-xl">{feature.icon}</span>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 ">
                        <button
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:bg-purple-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {isActivating ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Đang bật...
                                </>
                            ) : (
                                '💖 Trải nghiệm 3 ngày miễn phí!'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Success Modal - Chill & Fun */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                        animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                        className="w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-xl"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center text-3xl">
                            🎉
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Hoàn hảo rồi đó! 💫
                        </h3>
                        <p className="text-gray-600 text-sm mb-5">
                            Mọi thứ đã sẵn sàng, cùng Emo khám phá cảm xúc của bạn nha 💜
                            Hành trình nhỏ – cảm xúc lớn đang chờ!
                        </p>
                        <button
                            onClick={handleSuccessModalClose}
                            className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                        >
                            Bắt đầu thôi
                        </button>
                    </motion.div>
                </div>

            )}
        </div>
    );
};

export default FreeTrialInvitation;