import React from "react";

const FilterList = ({ options, selected, onSelect }) => (
    <div className="mb-4">
        <h4 className="text-base font-semibold mb-2">Bộ lọc</h4>
        <div className="space-y-2">
            {options.map((filter) => (
                <button
                    key={filter.value}
                    className={`w-full text-left px-3 py-2 rounded transition border ${selected === filter.value ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'} hover:bg-blue-50`}
                    onClick={() => onSelect(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    </div>
);

export default FilterList;
