/**
 * Adapted from TailAdmin Free React Dashboard
 * Source: https://github.com/TailAdmin/free-react-tailwind-admin-dashboard
 * License: MIT
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setIsHovered: (val: boolean) => void;
  toggleMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsExpanded((prev) => !prev), []);
  const toggleMobileSidebar = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider
      value={{ isExpanded, isHovered, isMobileOpen, toggleSidebar, setIsHovered, toggleMobileSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
