import React from "react";

const MainLayout = ({
  sidebar,
  children,
  isMobile = false,
  sidebarWidth = "w-72",
  className = "",
}) => {
  return (
    <div className={`main-content min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && sidebar && (
          <div
            className={`${sidebarWidth} min-h-screen fixed left-0 top-0 z-20`}>
            {sidebar}
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 ${!isMobile && sidebar ? `ml-${sidebarWidth.split("-")[1]}` : ""
            }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
