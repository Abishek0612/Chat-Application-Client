import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { setSidebarOpen, toggleSidebar } from "../../store/slices/uiSlice";

export const Layout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) {
        dispatch(setSidebarOpen(true));
      } else if (mobile) {
        dispatch(setSidebarOpen(false));
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [dispatch]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-80">
          <Sidebar />
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={handleCloseSidebar}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-xl"
            >
              <Sidebar onItemClick={handleCloseSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen && isMobile}
        />
        <main className="flex-1 relative overflow-hidden focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
