import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TopTabBar } from './TopTabBar';
import { ToastContainer } from './ToastContainer';

export const AppLayout: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // Protected Route Guard
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0f14] font-sans antialiased selection:bg-slate-700 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main panel canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar headers */}
        <Topbar />

        {/* Sub horizontal module switcher */}
        <TopTabBar />

        {/* Main nested content scroll frame */}
        <main className="flex-1 overflow-y-auto bg-[#0d0f14] custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Global notification toaster portal */}
      <ToastContainer />
    </div>
  );
};
