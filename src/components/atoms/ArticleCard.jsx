import React, { useState } from 'react';
import UpgradeModal from '../molecules/UpgradeModal';

const ArticleCard = ({ item, onClick, isModule = false }) => {
    // Only lock if hasAccess is explicitly false
    // If hasAccess is undefined or true, allow access
    const hasAccess = item?.hasAccess !== false;
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const percent = isModule
        ? item.percent ?? Math.round((item.completedDuration / item.totalDuration) * 100)
        : null;

    const handleClick = () => {
        if (hasAccess) {
            onClick?.();
        } else {
            setShowUpgradeModal(true);
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer ${hasAccess
                ? 'hover:shadow-xl'
                : ''
                }`}
            onClick={handleClick}
        >
            {item.imageURL && (
                <div className="relative">
                    <img
                        src={item.imageURL}
                        alt={item.name || item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    {isModule ? (
                        <>
                            {item.totalDuration ? (
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                                    {item.totalDuration} phút
                                </span>
                            ) : null}
                            <span
                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow ${percent === 100 ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-800'}`}
                            >
                                {percent === 100 ? 'Hoàn thành' : `${percent || 0}%`}
                            </span>
                        </>
                    ) : (
                        <>
                            {item.orderIndex ? (
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-purple-700 shadow">
                                    Bài {item.orderIndex}
                                </span>
                            ) : null}
                            {item.completed && (
                                <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium shadow flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    Hoàn thành
                                </span>
                            )}
                            {!item.completed && item.duration ? (
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                                    {item.duration} phút
                                </span>
                            ) : null}
                        </>
                    )}
                </div>
            )}
            <div className={`p-5 ${!hasAccess ? 'opacity-50' : ''}`}>
                <h3 className="text-xl font-sans font-semibold text-gray-900 mb-3">{item.name || item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{item.description || item.content}</p>
                <button className="text-blue-600 font-sans font-medium hover:underline">
                    Đọc thêm
                </button>
            </div>
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default ArticleCard;