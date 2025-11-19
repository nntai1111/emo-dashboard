import React from 'react';
import blooksData from '../../data/avtBlooket.json';

const AvtBlooket = () => {
    return (
        <div className="min-h-screen text-white p-6 dark:bg-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold text-center text-blue-400 mb-8 dark:text-blue-300">Blooket Avatar Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blooksData.blooks.map((blook, index) => (
                    <div
                        key={index}
                        className=" rounded-lg shadow-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105 dark:bg-[#1C1C1E] dark:shadow-gray-600"
                    >
                        <img
                            src={blook.url}
                            alt={blook.name}
                            className="w-32 h-32 object-contain mb-4"
                        />
                        <h2 className="text-xl font-semibold text-black dark:text-gray-200">{blook.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Rarity: {blook.rarity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvtBlooket;