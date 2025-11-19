import React from "react";

const SearchInput = ({ value, onChange, onClick, onEnter, onSearch }) => (
    <div className="relative w-full ">
        <div
            className="w-full px-2 pl-4 pr-10 border border-gray-900 dark:border-white dark:bg-gray-100 rounded-lg  transition-all duration-300"
            onClick={onClick}
        >
            <input
                type="text"
                className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed"
                placeholder="Tìm kiếm"
                value={value}
                onChange={onChange}
                onKeyPress={e => e.key === 'Enter' && onEnter()}
            />
            <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
                onClick={onSearch}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </div>
);

export default SearchInput;
