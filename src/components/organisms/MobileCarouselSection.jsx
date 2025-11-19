import { motion } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import UpgradeModal from "../molecules/UpgradeModal";

const MobileCarouselSection = ({ challenges, carouselIndex, setCarouselIndex }) => {
    const navigate = useNavigate();
    const isOwner = useSelector((state) => state.auth.isOwner);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const nextSlide = () => {
        setCarouselIndex((prev) => (prev + 1) % challenges.length);
    };

    const prevSlide = () => {
        setCarouselIndex((prev) => (prev - 1 + challenges.length) % challenges.length);
    };

    const handleStartChallenge = (challengeId) => {
        // Find challenge to check hasAccess
        const challenge = challenges.find(c => c.id === challengeId);
        const hasAccess = challenge?.hasAccess !== undefined ? challenge.hasAccess !== false : isOwner;

        if (hasAccess) {
            navigate(`/space/challenge/${challengeId}`);
        } else {
            setShowUpgradeModal(true);
        }
    };

    return (
        <div className="relative mb-4 px-2">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
                Đề xuất
            </h2>

            <div className="relative flex justify-center items-center">
                {challenges.length > 0 ? (
                    <div className="w-full">
                        {/* Active card - full width on mobile */}
                        {challenges[carouselIndex] && (() => {
                            const currentChallenge = challenges[carouselIndex];
                            const challengeHasAccess = currentChallenge.hasAccess !== undefined ? currentChallenge.hasAccess !== false : isOwner;

                            return (
                                <motion.div
                                    key={currentChallenge.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full"
                                >
                                    <div className={`bg-white dark:bg-gray-800 border-2 ${challengeHasAccess ? 'border-purple-400' : 'border-gray-300'} rounded-lg shadow-lg overflow-hidden`}>
                                        <img
                                            src={currentChallenge.image}
                                            alt={currentChallenge.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-3">
                                            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                                                {currentChallenge.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                                {currentChallenge.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-purple-400">
                                                    {currentChallenge.category}
                                                </span>
                                                <span className="text-xs text-yellow-500">
                                                    {currentChallenge.duration}
                                                </span>
                                            </div>
                                            <Button
                                                variant={challengeHasAccess ? 'primary' : 'locked'}
                                                className={`mt-2 w-full text-sm py-2 ${!challengeHasAccess ? 'cursor-not-allowed opacity-90' : ''}`}
                                                aria-disabled={!challengeHasAccess}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStartChallenge(currentChallenge.id);
                                                }}
                                            >
                                                Bắt đầu thử thách
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {/* Pagination dots */}
                        {challenges.length > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-3">
                                {challenges.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCarouselIndex(index)}
                                        className={`h-2 rounded-full transition-all ${index === carouselIndex
                                            ? "w-6 bg-purple-400"
                                            : "w-2 bg-gray-300 dark:bg-gray-600"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                        Không tìm thấy thử thách. Hãy thử điều chỉnh bộ lọc!
                    </p>
                )}

                {/* Navigation buttons - smaller on mobile */}
                {challenges.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-gray-900/70 hover:bg-gray-900 rounded-full p-0 min-h-[44px] min-w-[44px] z-30 pointer-events-auto"
                            onClick={prevSlide}
                            aria-label="Previous slide"
                        >
                            <Icon name="ChevronLeft" size={20} color="text-white" />
                        </Button>

                        <Button
                            variant="secondary"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-gray-900/70 hover:bg-gray-900 rounded-full p-0 min-h-[44px] min-w-[44px] z-30 pointer-events-auto"
                            onClick={nextSlide}
                            aria-label="Next slide"
                        >
                            <Icon name="ChevronRight" size={20} color="text-white" />
                        </Button>
                    </>
                )}
            </div>
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

MobileCarouselSection.propTypes = {
    challenges: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
    carouselIndex: PropTypes.number.isRequired,
    setCarouselIndex: PropTypes.func.isRequired,
};

export default MobileCarouselSection;

