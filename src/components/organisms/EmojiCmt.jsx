import React from "react";
import data from "../../data/iconCmt.json"; // Adjust path as needed

const EmojiList = () => {
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
                Danh sách Emoji và Ý nghĩa
            </h1>

            {/* English Reactions Section */}
            <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    Reactions (English)
                </h2>
                <ul className="space-y-3">
                    {data.reactions_en.map((reaction, index) => (
                        <li
                            key={`en-${index}`}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                            <span className="text-xl sm:text-2xl">
                                {convertUnicodeToEmoji(reaction.icon)}
                            </span>
                            <div>
                                <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100">
                                    {reaction.reaction}
                                </span>
                                <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 ml-2">
                                    ({reaction.meaning_en})
                                </span>
                                <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400 block">
                                    VN: {reaction.suggested_translation_vn}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Vietnamese Reactions Section */}
            <div className="space-y-6">
                {Object.entries(data.reactions_vn).map(([groupKey, group], index) => (
                    <div
                        key={`vn-group-${index}`}
                        className="bg-white dark:bg-[#1C1C1E] shadow rounded-lg p-4 sm:p-6"
                    >
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                            {groupKey === "comfort_group" && "Nhóm An ủi"}
                            {groupKey === "empathy_group" && "Nhóm Đồng cảm"}
                            {groupKey === "encouragement_group" && "Nhóm Cổ vũ"}
                            {groupKey === "friendly_group" && "Nhóm Vui vẻ / Thân thiện"}
                        </h2>
                        <ul className="space-y-3">
                            {group.map((item, itemIndex) => (
                                <li
                                    key={`vn-${groupKey}-${itemIndex}`}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    <span className="text-xl sm:text-2xl">
                                        {convertUnicodeToEmoji(item.icon)}
                                    </span>
                                    <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100">
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmojiList;