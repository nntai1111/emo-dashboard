// src/components/molecules/CategoryList.jsx
import React from "react";

const CategoryList = ({ categories, onSelectCategory }) => {
    if (!categories || categories.length === 0) {
        return <p className="text-center text-gray-500 font-sans">Không có danh mục nào.</p>;
    }

    const handleCategoryClick = (cat) => {
        // Don't lock categories - they don't have hasAccess in API response
        // Only lock at section detail level (hasAccess from /me/module-sections/{id})
        console.log('🔓 CategoryList - Clicking category:', {
            categoryId: cat.id,
            categoryName: cat.name,
            hasAccess: cat.hasAccess,
            note: 'Categories should not be locked - no hasAccess check here'
        });
        onSelectCategory?.(cat);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto px-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col w-80 bg-white rounded-2xl shadow transition-all duration-300 p-5 border hover:shadow-xl border-gray-100 hover:border-[#8131ad]/30 transform hover:-translate-y-1"
                >
                    {/* Hình ảnh */}
                    <img
                        src={cat.imageURL || cat.mediaUrl}
                        alt={cat.name}
                        className="w-full h-52 object-cover rounded-xl mb-4 shadow-md"
                    />

                    {/* Tên chủ đề */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 text-center mb-2 font-sans">
                            {cat.name}
                        </h3>

                        {/* Mô tả */}
                        <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2 font-sans">
                            {cat.description || "Không có mô tả."}
                        </p>

                        {/* Số phần học */}
                        <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1 bg-[#8131ad]/10 text-[#8131ad] px-3 py-1 rounded-full text-xs font-medium font-sans">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {cat.sectionCount} phần
                            </span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CategoryList;