import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWellnessModules, getModuleSections } from '../../services/wellnessService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RightSection = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const scrollRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const modulesRes = await getWellnessModules(1, 20, "vi");
                const modulesData = modulesRes.data || [];

                const modulesWithSections = await Promise.all(
                    modulesData.map(async (module) => {
                        try {
                            const sectionsRes = await getModuleSections(module.id, 1, 10, "vi");
                            const sectionsData = sectionsRes.data || [];

                            const mappedSections = sectionsData.map((s) => {
                                let percent = 0;
                                if (s.processStatus === "Completed") {
                                    percent = 100;
                                } else if (s.processStatus === "InProgress" && s.totalDuration > 0) {
                                    percent = Math.round((s.completedDuration || 0) / s.totalDuration * 100);
                                }

                                return {
                                    id: s.id,
                                    name: s.title,
                                    imageURL: s.mediaUrl || s.meidaUrl,
                                    totalDuration: s.totalDuration,
                                    completedDuration: s.completedDuration || 0,
                                    percent,
                                    processStatus: s.processStatus,
                                };
                            });

                            return {
                                id: module.id,
                                name: module.name,
                                sections: mappedSections,
                            };
                        } catch (err) {
                            console.error(`Error fetching sections for module ${module.id}:`, err);
                            return { id: module.id, name: module.name, sections: [] };
                        }
                    })
                );

                setModules(modulesWithSections);
            } catch (err) {
                setError("Không thể tải dữ liệu.");
                console.error("Error fetching modules:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewAll = (moduleId) => {
        navigate(`/space/knowledge?categoryId=${moduleId}`);
    };

    const handleSectionClick = (sectionId) => {
        navigate(`/space/knowledge?sectionId=${sectionId}`);
    };

    // Cuộn mượt
    const scrollLeft = (moduleId) => {
        const el = scrollRefs.current[moduleId];
        if (el) el.scrollBy({ left: -280, behavior: 'smooth' });
    };

    const scrollRight = (moduleId) => {
        const el = scrollRefs.current[moduleId];
        if (el) el.scrollBy({ left: 280, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl dark:bg-gray-900 p-4 md:p-6 rounded-lg min-h-[500px] md:h-[700px] overflow-y-auto scrollbar-none flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl dark:bg-gray-900 p-4 md:p-6 rounded-lg min-h-[500px] md:h-[700px] overflow-y-auto scrollbar-none flex items-center justify-center">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl dark:bg-gray-900 p-4 md:p-6 rounded-lg min-h-[500px] md:h-[700px] overflow-y-auto scrollbar-none">
            {modules.map((module) => {
                const moduleId = module.id;

                return (
                    <div key={moduleId} className="mb-8 group"> {/* group để hover */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold dark:text-white">{module.name}</h2>
                            {/* Bỏ "Swipe →" */}
                        </div>

                        <div className="relative">
                            {/* Danh sách section – mobile vuốt, desktop không kéo */}
                            <div
                                ref={(el) => (scrollRefs.current[moduleId] = el)}
                                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-none snap-x"
                                style={{ scrollSnapType: 'x mandatory' }}
                            >
                                {module.sections.map((section) => {
                                    const progress = section.percent;
                                    const isCompleted = section.processStatus === "Completed";

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => handleSectionClick(section.id)}
                                            className="relative aspect-video w-[240px] md:w-[280px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform snap-center"
                                        >
                                            {section.imageURL && (
                                                <img
                                                    src={section.imageURL}
                                                    alt={section.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div> */}

                                            <div className="relative z-10 flex flex-col justify-between h-full p-4">
                                                <h3 className="text-white text-lg font-semibold truncate">
                                                    {section.name}
                                                </h3>

                                                <div>
                                                    <div className="w-full bg-white/30 rounded-full h-1.5 mb-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-400 to-pink-400 h-1.5 rounded-full transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-white text-xs">
                                                        <span>{section.totalDuration} MINS</span>
                                                        {isCompleted ? (
                                                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white text-sm">
                                                                Done
                                                            </span>
                                                        ) : (
                                                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white text-sm">
                                                                Play
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 2 nút mũi tên – chỉ hiện khi HOVER + desktop */}
                            <div className="hidden md:flex absolute right-0 bottom-0 transform translate-y-12 gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                <button
                                    onClick={() => scrollLeft(moduleId)}
                                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                                    aria-label="Cuộn trái"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => scrollRight(moduleId)}
                                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                                    aria-label="Cuộn phải"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => handleViewAll(module.id)}
                            className="mt-6 px-6 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Xem Tất Cả
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default RightSection;