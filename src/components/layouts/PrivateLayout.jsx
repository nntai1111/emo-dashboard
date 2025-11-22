import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateLayout = ({ isAuthenticated }) => {
    // If user is not authenticated, redirect to login instead of rendering nothing
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="private-layout">
            <Outlet />
        </div>
    );
};

export default PrivateLayout;

