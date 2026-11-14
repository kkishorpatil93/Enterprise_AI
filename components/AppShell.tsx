'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNexoraStore } from '@/lib/store';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { JudgeTourOverlay } from './JudgeTourOverlay';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useNexoraStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Protect all dashboard routes if session is logged out or unauthenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthLoading, isAuthenticated]);

  // Prevent back navigation to cached pages after logout (bfcache protection)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !isAuthenticated) {
        window.location.replace('/login');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-electric-blue border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Verifying enterprise session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100 antialiased selection:bg-electric-blue selection:text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 4-Minute Judge Tour Overlay Widget */}
      <JudgeTourOverlay />
    </div>
  );
};
