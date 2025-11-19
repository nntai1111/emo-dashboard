import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, size = 24, color = 'text-gray-600', className }) => {
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return null;

    return (
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <IconComponent className={`${color} ${className}`} size={size} />
        </motion.div>
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default Icon;