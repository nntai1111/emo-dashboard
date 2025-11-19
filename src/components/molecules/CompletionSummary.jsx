import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const CompletionSummary = ({ streak, xp, badge }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-md text-center"
        >
            <img src="https://via.placeholder.com/150?text=Congrats" alt="Celebration" className="w-32 h-32 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-2">You've completed the challenge!</p>
            <p className="text-sm text-gray-600">Streak: {streak} days</p>
            <p className="text-sm text-gray-600 mb-4">XP Earned: {xp}</p>
            <Badge label={badge} />
            <Button variant="primary" className="mt-4 w-full">Share Achievement</Button>
            <Button variant="outline" className="mt-2 w-full">Start New Challenge</Button>
        </motion.div>
    );
};

CompletionSummary.propTypes = {
    streak: PropTypes.number.isRequired,
    xp: PropTypes.number.isRequired,
    badge: PropTypes.string.isRequired,
};

export default CompletionSummary;