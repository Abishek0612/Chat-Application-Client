import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-80">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 relative overflow-hidden focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
