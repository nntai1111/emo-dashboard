
import React from "react";
import data from "../../data/gift.json";

const GiftList = () => {
    return (
        <div className="max-w-5xl mx-auto p-4 font-sans dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 tracking-tight">
                Danh sách Quà tặng
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="relative bg-white dark:bg-[#1C1C1E] shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        {/* Hình ảnh */}
                        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700">
                            <img
                                src={item.imageName}
                                alt={item.name}
                                className="w-full h-full object-contain p-3 mix-blend-multiply dark:mix-blend-normal"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/150?text=No+Image";
                                }}
                                aria-label={`Hình ảnh của ${item.name}`}
                            />
                        </div>

                        {/* Nội dung */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                                {item.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                <span className="font-medium">Cost:</span> {item.cost} VNĐ
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                <span className="font-medium">Free:</span>{" "}
                                {item.isFree ? (
                                    <span className="text-green-500 font-semibold">Yes</span>
                                ) : (
                                    <span className="text-red-500 font-semibold">No</span>
                                )}
                            </p>
                            <button
                                className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 text-sm"
                                aria-label={`Xem chi tiết ${item.name}`}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GiftList;
