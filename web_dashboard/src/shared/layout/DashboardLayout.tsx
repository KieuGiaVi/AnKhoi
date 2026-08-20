/**
 * Adapted from TailAdmin Free React Dashboard
 * Source: https://github.com/TailAdmin/free-react-tailwind-admin-dashboard
 * License: MIT
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { Backdrop } from './Backdrop';

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered } = useSidebar();
  const sidebarExpanded = isExpanded || isHovered;

  return (
    <div className="min-h-screen xl:flex bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />
      <Backdrop />

      {/* Main content area */}
      <div
        className={[
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          sidebarExpanded ? 'lg:ml-[260px]' : 'lg:ml-[72px]',
        ].join(' ')}
      >
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 max-w-screen-2xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);
