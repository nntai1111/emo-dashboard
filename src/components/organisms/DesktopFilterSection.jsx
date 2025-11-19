import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import Portal from '../Portal';

const DesktopFilterSection = ({ isOpen, onClose, durationFilter, categoryFilter, toggleFilter }) => {
    const durations = ['1 Day', '3 Days', '7 Days'];
    const categories = ['Mental Health', 'PhysicalBalance', 'SocialConnection', 'Creative Relaxation', 'Combined'];

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 mx-4"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                zIndex: 10000
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Filter Challenges
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl"
                                    aria-label="Close filter"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Duration
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <input
                                            type="radio"
                                            name="duration"
                                            checked={durationFilter === null}
                                            onChange={() => toggleFilter('duration', 'All')}
                                            className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            All
                                        </span>
                                    </label>
                                    {durations.map(duration => (
                                        <label
                                            key={duration}
                                            className="flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <input
                                                type="radio"
                                                name="duration"
                                                checked={durationFilter === duration}
                                                onChange={() => toggleFilter('duration', duration)}
                                                className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {duration}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Category
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={categoryFilter === null}
                                            onChange={() => toggleFilter('category', 'All')}
                                            className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            All
                                        </span>
                                    </label>
                                    {categories.map(category => (
                                        <label
                                            key={category}
                                            className="flex items-center gap-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={categoryFilter === category}
                                                onChange={() => toggleFilter('category', category)}
                                                className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button variant="primary" className="w-full" onClick={onClose}>
                                Apply Filters
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Portal>
    );
};

DesktopFilterSection.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    durationFilter: PropTypes.string, // Changed from array to single value (null means "All")
    categoryFilter: PropTypes.string, // Changed from array to single value (null means "All")
    toggleFilter: PropTypes.func.isRequired,
};

export default DesktopFilterSection;

