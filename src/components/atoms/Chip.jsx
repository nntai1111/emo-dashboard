import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Chip = ({ label, isSelected, onClick, type }) => {
    const colorStyles = {
        duration: isSelected ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800',
        category: isSelected ? 'bg-purple-300 text-white' : 'bg-gray-200 text-gray-800',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-sm font-sans ${colorStyles[type]}`}
            onClick={onClick}
        >
            {label}
        </motion.button>
    );
};

Chip.propTypes = {
    label: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['duration', 'category']).isRequired,
};

export default Chip;