import React from "react";

const AppButton = ({ onClick }) => (
    <button
        className="w-12 h-12 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center text-blue-700 font-bold shadow text-base"
        title="Tải app"
        onClick={onClick}
    >
        <span role="img" aria-label="app">📱</span>
    </button>
);

export default AppButton;
