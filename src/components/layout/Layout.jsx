import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-80">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
