import React from "react";
import { Outlet } from "react-router-dom";

const PrivateLayout = ({ isAuthenticated }) => {
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="private-layout">
            <Outlet />
        </div>
    );
};

export default PrivateLayout;

