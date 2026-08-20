/**
 * Adapted from TailAdmin Free React Dashboard
 * Source: https://github.com/TailAdmin/free-react-tailwind-admin-dashboard
 * License: MIT
 */
import React from 'react';
import { useSidebar } from './SidebarContext';

export const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={toggleMobileSidebar}
      aria-hidden="true"
    />
  );
};
