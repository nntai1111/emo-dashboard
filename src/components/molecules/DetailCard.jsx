import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import Button from '../atoms/Button';
import Portal from '../Portal';
import { createChallengeProgress } from '../../services/challengeService';

const DetailCard = ({ id, title, description, duration, tasks, mediaUrl }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleStartChallenge = async () => {
        setLoading(true);
        setError(null);

        try {
            // Call API to register for challenge
            // Note: id might be UUID string from API, or number from static data
            const challengeId = typeof id === 'string' ? id : id.toString();
            await createChallengeProgress(challengeId);

            // Navigate to challenge module and switch to task view
            navigate('/space/challenge?view=task');
        } catch (err) {
            console.error('Error starting challenge:', err);

            // Check if error is 400 (user already in challenge)
            const is400Error =
                err.response?.status === 400 ||
                err.status === 400 ||
                err.message?.includes('400') ||
                err.message?.includes('Request failed with status code 400');

            if (is400Error) {
                setShowModal(true);
            } else {
                setError(err.message || 'Failed to start challenge. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Hero Image Section */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-xl">
                <img
                    src={mediaUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-sky-200 text-sky-900 border border-sky-300/70 rounded-full text-sm font-semibold shadow-sm">
                            {duration}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-black border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
                {/* Description */}
                <div className="mb-6">
                    <p className="text-lg text-white leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-orange-400 rounded"></span>
                        Các hoạt động
                    </h3>
                    <div className="space-y-4">
                        {tasks.map((dayTask, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-xl border border-white/10 hover:border-orange-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-sky-400/30"
                            >
                                {/* Day Header */}
                                <div className="px-4 py-3  border-b border-orange-500/20">
                                    <h4 className="text-base font-semibold text-white tracking-wide">
                                        Ngày {dayTask.day}
                                    </h4>
                                </div>
                                {/* Activities for this day */}
                                <div className="p-4 space-y-2">
                                    {dayTask.activities.map((activity, actIndex) => (
                                        <div
                                            key={actIndex}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                                                <span className="text-sm font-semibold text-orange-200">
                                                    {actIndex + 1}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-200 flex-1 pt-0.5">
                                                {activity}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Message - only show for non-400 errors */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Start Button */}
                <Button
                    variant="primary"
                    className="w-full py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={handleStartChallenge}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang bắt đầu...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            Bắt đầu thử thách
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    )}
                </Button>
            </div>

            {/* Modal Popup for already in challenge */}
            <AnimatePresence>
                {showModal && (
                    <Portal>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            Thông báo
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-6">
                                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        Bạn đang làm thử thách này rồi, hãy kiểm tra lại nhé!
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <Button
                                        variant="calm"
                                        onClick={() => {
                                            setShowModal(false);
                                            navigate('/space/challenge?view=task');
                                        }}
                                        className="px-6"
                                    >
                                        Đi đến thử thách
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    );
};

DetailCard.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.number.isRequired,
            activities: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
};

export default DetailCard;