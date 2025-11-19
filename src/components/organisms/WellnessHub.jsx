import React, { useState } from "react";
import { createPortal } from "react-dom";
import data from "../../data/wellness.json";

const WellnessHub = () => {
    const renderDuration = (completed, total) => {
        return `${total} MINS`;
    };

    const isCompleted = (completed, total) => completed === total;

    const cleanDescription = (description) => {
        return description.replace(/\s*(?:&nbsp;)+/g, " ").replace(/<p><span[^>]*>(.*?)<\/span><\/p>/g, "<p>$1</p>");
    };

    const [selectedModule, setSelectedModule] = useState(null);

    return (
        <div className="max-w-4xl mx-auto p-4 font-sans dark:bg-gray-900 min-h-screen transition-colors">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                Wellness Hub
            </h1>
            <div className="space-y-6">
                {data.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white dark:bg-[#1C1C1E] shadow rounded-lg p-4 sm:p-6"
                    >
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {category.modules.map((module) => {
                                const gradientStyle = {
                                    background: `linear-gradient(135deg, ${module.moduleColor1}, ${module.moduleColor2})`,
                                };
                                const isModuleCompleted = isCompleted(module.completedDuration, module.totalDuration);

                                return (
                                    <div
                                        key={module.id}
                                        className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                                        style={gradientStyle}
                                        onClick={() => setSelectedModule(module)}
                                    >
                                        <img
                                            src={module.imageURL}
                                            alt={module.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/256")}
                                        />
                                        <div className="relative h-full flex flex-col justify-between p-4 text-white">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold">{module.name}</h3>
                                                {isModuleCompleted && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 mt-2">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm sm:text-base">{renderDuration(module.completedDuration, module.totalDuration)}</span>
                                                {!isModuleCompleted && (
                                                    <button className="text-2xl sm:text-3xl bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-colors" onClick={e => { e.stopPropagation(); setSelectedModule(module); }}>
                                                        ▶
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {selectedModule && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white dark:bg-[#1C1C1E] rounded-lg shadow-lg max-w-2xl w-full p-6 relative animate-fadeIn">
                        {/* Nút đóng */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-bold"
                            onClick={() => setSelectedModule(null)}
                            aria-label="Đóng"
                        >
                            ×
                        </button>

                        {/* Tiêu đề */}
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                            {selectedModule.name}
                        </h3>

                        {/* Ảnh nhỏ + căn giữa */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={selectedModule.imageURL}
                                alt={selectedModule.name}
                                className="w-2/3 max-w-sm h-56 object-cover rounded-lg shadow"
                                onError={(e) =>
                                    (e.target.src = "https://via.placeholder.com/400x200")
                                }
                            />
                        </div>

                        {/* Nội dung text căn trái */}
                        <div className="flex flex-col gap-3 text-left">
                            <div className="text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Thời lượng:</span>{" "}
                                {renderDuration(
                                    selectedModule.completedDuration,
                                    selectedModule.totalDuration
                                )}
                            </div>

                            <div className="text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">Trạng thái:</span>{" "}
                                {isCompleted(
                                    selectedModule.completedDuration,
                                    selectedModule.totalDuration
                                ) ? (
                                    <span className="font-bold text-green-600">Đã hoàn thành</span>
                                ) : (
                                    <span className="font-bold text-red-600">Chưa hoàn thành</span>
                                )}
                            </div>

                            {selectedModule.description && (
                                <div className="text-gray-700 dark:text-gray-200">
                                    <span className="font-semibold">Mô tả:</span>
                                    <div
                                        className="mt-1"
                                        dangerouslySetInnerHTML={{
                                            __html: cleanDescription(selectedModule.description),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                ,
                document.body
            )}
        </div>
    );
};

export default WellnessHub;