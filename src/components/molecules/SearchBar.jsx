import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import SearchInput from "../atoms/SearchInput";
import FilterList from "./FilterList";
import TagSuggestionList from "./TagSuggestionList";

const SearchBar = ({ onSearch, tags, search, setSearch, selectedFilter, setSelectedFilter }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const filterOptions = [
        { value: "all", label: "Tất cả bài viết" },
        { value: "my", label: "Bài viết của tôi" },
        { value: "liked", label: "Bài viết đã thích" },
        { value: "group", label: "Bài viết trong nhóm" },
    ];
    return (
        <div className="relative w-full">
            <SearchInput
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={() => setIsExpanded(true)}
                onEnter={() => onSearch(search, selectedFilter)}
                onSearch={() => onSearch(search, selectedFilter)}
            />
            {isExpanded && createPortal(
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center justify-center z-[1000]">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl dark:bg-neutral-900 max-h-[90vh] overflow-y-auto"
                    >
                        <SearchInput
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={() => { }}
                            onEnter={() => onSearch(search, selectedFilter)}
                            onSearch={() => onSearch(search, selectedFilter)}
                        />
                        <FilterList options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
                        <TagSuggestionList tags={tags} onSelect={setSearch} />
                        <button
                            className="w-full p-2 sm:p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mt-2 text-sm sm:text-base"
                            onClick={() => {
                                onSearch(search, selectedFilter);
                                setIsExpanded(false);
                            }}
                        >
                            Áp dụng
                        </button>
                        <button
                            className="mt-2 w-full p-2 sm:p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                            onClick={() => setIsExpanded(false)}
                        >
                            Đóng
                        </button>
                    </motion.div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SearchBar;
