import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import UpgradeModal from './UpgradeModal';

const MobileChallengeCard = ({ id, title, description, category, duration, image, hasAccess: hasAccessFromData }) => {
    const navigate = useNavigate();
    const isOwner = useSelector((state) => state.auth.isOwner);
    // Use hasAccess from data if provided, otherwise fallback to isOwner
    const hasAccess = hasAccessFromData !== undefined ? hasAccessFromData : isOwner;
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleClick = () => {
        if (hasAccess) {
            navigate(`/space/challenge/${id}`);
        } else {
            setShowUpgradeModal(true);
        }
    };

    return (
        <motion.div
            whileTap={hasAccess ? { scale: 0.98 } : {}}
            className={`bg-[#111827] border border-white/10 rounded-xl shadow-lg p-3 cursor-pointer transition-all ${hasAccess
                ? 'active:border-sky-400 active:shadow-sky-500/20'
                : 'opacity-90'
                }`}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3">
                <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-white">
                    <h3 className="text-sm font-semibold line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                        {description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-sky-300">{category}</span>
                        <span className="text-xs text-amber-300">{duration}</span>
                    </div>
                </div>
            </div>
            <Button
                variant={hasAccess ? 'primary' : 'locked'}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                className={`w-full mt-3 text-sm py-2 min-h-[44px] ${!hasAccess ? 'cursor-not-allowed opacity-90' : ''}`}
                aria-disabled={!hasAccess}
            >
                Bắt đầu thử thách
            </Button>
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </motion.div>
    );
};

MobileChallengeCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    hasAccess: PropTypes.bool,
};

export default MobileChallengeCard;

