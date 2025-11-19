import React from "react";
import { Outlet } from "react-router-dom";
import AuthRedirect from "@/services/AuthRedirect";

const PrivateLayout = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <AuthRedirect />;
  }

  return (
    <div className="private-layout">
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
