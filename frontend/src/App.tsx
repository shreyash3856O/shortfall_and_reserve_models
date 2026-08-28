import React, { useState, useEffect, Suspense, lazy } from 'react';
import { configureBoneyard } from 'boneyard-js/react';
import Topbar from './components/layout/Topbar';
import Sidebar, { PageId } from './components/layout/Sidebar';
import PageSkeletonLoader from './components/layout/PageSkeletonLoader';
import { getLastSyncTime } from './api/client';
import './i18n';

// Configure Boneyard global skeleton styling to match graphite design system
configureBoneyard({
  darkColor: '#16161A',
  darkShimmerColor: '#24242A',
  animate: 'shimmer',
  stagger: 60,
  transition: 300,
});

// Code-split and lazy load all pages & heavy components for instant initial load
const LandingPage = lazy(() => import('./pages/LandingPage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const ReserveMapPage = lazy(() => import('./pages/ReserveMapPage'));
const ProductionTrendsPage = lazy(() => import('./pages/ProductionTrendsPage'));
const RiskRootCausePage = lazy(() => import('./pages/RiskRootCausePage'));
const RecommendedActionsPage = lazy(() => import('./pages/RecommendedActionsPage'));
const DigitalTwinPage = lazy(() => import('./pages/DigitalTwinPage'));
const DataHealthPage = lazy(() => import('./pages/DataHealthPage'));
const ChatbotDrawer = lazy(() => import('./components/chatbot/ChatbotDrawer'));

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [selectedMineId, setSelectedMineId] = useState<string>('MN01');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTime());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setLastSync(getLastSyncTime());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSelectMine = (mineId: string) => {
    setSelectedMineId(mineId);
    setActivePage('risk');
  };

  // Full-screen Landing Experience
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-[#0D0D10]">
        <Suspense fallback={<PageSkeletonLoader />}>
          <LandingPage onEnterDashboard={() => setActivePage('overview')} />
          {isChatOpen && (
            <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          )}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D10] text-[#EFEFEF] font-sans antialiased select-none">
      {/* Top Header */}
      <Topbar
        isOffline={isOffline}
        lastSync={lastSync}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Navigation Sidebar */}
        <Sidebar activePage={activePage} onNavigate={(p) => setActivePage(p)} />

        {/* Dynamic Page Viewport with Smooth Fade Transitions */}
        <main className="flex-1 overflow-y-auto bg-[#0D0D10]">
          <Suspense fallback={<PageSkeletonLoader />}>
            <div key={activePage} className="animate-fade-in">
              {activePage === 'overview' && <OverviewPage onSelectMine={handleSelectMine} />}
              {activePage === 'reserve' && <ReserveMapPage />}
              {activePage === 'trends' && <ProductionTrendsPage selectedMineId={selectedMineId} />}
              {activePage === 'risk' && <RiskRootCausePage selectedMineId={selectedMineId} />}
              {activePage === 'actions' && <RecommendedActionsPage />}
              {activePage === 'digitalTwin' && <DigitalTwinPage />}
              {activePage === 'dataHealth' && <DataHealthPage />}
            </div>
          </Suspense>
        </main>
      </div>

      {/* Lazy Chatbot Drawer */}
      {isChatOpen && (
        <Suspense fallback={null}>
          <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
