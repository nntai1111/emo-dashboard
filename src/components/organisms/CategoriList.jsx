
import React from "react";
import data from "../../data/categories.json"; // Adjust the path as needed

const CategoriList = () => {
    // Function to convert Unicode string to emoji
    const convertUnicodeToEmoji = (unicode) => {
        try {
            const codes = unicode
                .split("\\u")
                .filter(Boolean)
                .map((code) => parseInt(code, 16));
            return String.fromCodePoint(...codes);
        } catch (error) {
            console.error("Error converting Unicode:", unicode, error);
            return unicode;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 font-sans dark:bg-gray-900 min-h-screen transition-colors">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                Danh sách Emoji và Tên
            </h1>
            <div className="space-y-6">
                {data.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white dark:bg-[#1C1C1E] shadow rounded-lg p-4 sm:p-6"
                    >
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <span className="text-xl sm:text-2xl">
                                {convertUnicodeToEmoji(category.icon)}
                            </span>
                            <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100">
                                {category.name}
                            </span>
                            <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                                ({category.nameVi})
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriList;