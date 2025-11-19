import React from 'react';

const KnowledgeBreadcrumb = ({ rootLabel, category, topic, article, onNavigate }) => {
    const showTopic = Boolean(topic && (!article || topic !== article));
    return (
        <nav className="text-xs sm:text-sm text-orange-600 dark:text-purple-100 font-bold max-w-6xl mx-auto px-4">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:gap-2 font-sans">
                <li>
                    <button
                        onClick={() => onNavigate('home')}
                        aria-label="Trang chủ"
                        className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-600 dark:after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1"
                    >

                        <span className="">Trang chủ</span>
                    </button>
                </li>
                {rootLabel && (
                    <li className="flex items-center gap-1 max-w-[70vw] sm:max-w-none">
                        <span className="text-orange-500 dark:text-purple-300">›</span>
                        <button
                            onClick={() => onNavigate('root')}
                            className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-600 dark:after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full truncate max-w-[65vw] sm:max-w-[16rem]"
                            title={rootLabel}
                        >
                            {rootLabel}
                        </button>
                    </li>
                )}
                {category && (
                    <li className="flex items-center gap-1 max-w-[80vw] sm:max-w-none">
                        <span className="text-orange-500 dark:text-purple-300">›</span>
                        <button
                            onClick={() => onNavigate('category')}
                            className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-600 dark:after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full truncate max-w-[75vw] sm:max-w-[24rem]"
                            title={category}
                        >
                            {category}
                        </button>
                    </li>
                )}
                {showTopic && (
                    <li className="flex items-center gap-1 max-w-[85vw] sm:max-w-none">
                        <span className="text-orange-500 dark:text-purple-300">›</span>
                        <button
                            onClick={() => onNavigate('topic')}
                            className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-600 dark:after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full truncate max-w-[80vw] sm:max-w-[28rem]"
                            title={topic}
                        >
                            {topic}
                        </button>
                    </li>
                )}
                {article && (
                    <li className="flex items-center gap-1 max-w-[90vw] sm:max-w-none">
                        <span className="text-orange-500 dark:text-purple-300">›</span>
                        <span className="text-gray-900 dark:text-purple-100 truncate max-w-[86vw] sm:max-w-[32rem]" title={article}>{article}</span>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default KnowledgeBreadcrumb;