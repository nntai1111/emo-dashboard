import React from "react";

const TagSuggestionList = ({ tags, onSelect }) => (
    <div className="mb-4">
        <h4 className="text-base font-semibold mb-2">Gợi ý tag phổ biến</h4>
        <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
                <button
                    key={tag.value}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 transition shadow-sm min-w-[120px]"
                    onClick={() => onSelect(tag.label)}
                >
                    <span className="mr-2 text-xl">{tag.icon}</span>
                    <span className="font-medium text-gray-700">{tag.label}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">{tag.count}</span>
                </button>
            ))}
        </div>
    </div>
);

export default TagSuggestionList;
