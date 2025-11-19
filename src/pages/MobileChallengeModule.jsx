import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChallengeHubPage from './ChallengeHubPage';
import TaskTimeline from '../components/organisms/TaskTimeline';
import { Target, CheckSquare } from 'lucide-react';

const MobileChallengeModule = () => {
    const [searchParams] = useSearchParams();
    const viewParam = searchParams.get('view');
    const [activeView, setActiveView] = useState(viewParam === 'task' ? 'task' : 'challenge');

    // Update view when URL param changes
    useEffect(() => {
        if (viewParam === 'task') {
            setActiveView('task');
        } else {
            setActiveView('challenge');
        }
    }, [viewParam]);

    return (
        <div className="w-full h-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
            {/* Tab Switcher */}
            <div className="flex items-center justify-around bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 pt-2 pb-2">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('challenge')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-t-lg font-medium transition-all min-h-[44px] ${activeView === 'challenge'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <Target className={`w-5 h-5 ${activeView === 'challenge' ? 'scale-110' : ''}`} />
                    <span className="text-sm font-semibold">Challenges</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('task')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-t-lg font-medium transition-all min-h-[44px] ${activeView === 'task'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <CheckSquare className={`w-5 h-5 ${activeView === 'task' ? 'scale-110' : ''}`} />
                    <span className="text-sm font-semibold">Tasks</span>
                </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeView === 'challenge' ? (
                    <motion.div
                        key="challenge"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChallengeHubPage />
                    </motion.div>
                ) : (
                    <motion.div
                        key="task"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <TaskTimeline />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MobileChallengeModule;
