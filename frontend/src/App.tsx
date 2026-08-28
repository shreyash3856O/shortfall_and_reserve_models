import React, { useState, useEffect } from 'react';
import Topbar from './components/layout/Topbar';
import Sidebar, { PageId } from './components/layout/Sidebar';
import ChatbotDrawer from './components/chatbot/ChatbotDrawer';
import LandingPage from './pages/LandingPage';
import OverviewPage from './pages/OverviewPage';
import ReserveMapPage from './pages/ReserveMapPage';
import ProductionTrendsPage from './pages/ProductionTrendsPage';
import RiskRootCausePage from './pages/RiskRootCausePage';
import RecommendedActionsPage from './pages/RecommendedActionsPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import DataHealthPage from './pages/DataHealthPage';
import { getLastSyncTime } from './api/client';
import './i18n';

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

  // When active page is landing, render full landing view with direct entry to dashboard
  if (activePage === 'landing') {
    return (
      <div className="min-h-screen bg-[#0B0D10]">
        <LandingPage onEnterDashboard={() => setActivePage('overview')} />
        <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#E6EDF3] font-sans antialiased select-none">
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

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0B0D10]">
          {activePage === 'overview' && <OverviewPage onSelectMine={handleSelectMine} />}
          {activePage === 'reserve' && <ReserveMapPage />}
          {activePage === 'trends' && <ProductionTrendsPage selectedMineId={selectedMineId} />}
          {activePage === 'risk' && <RiskRootCausePage selectedMineId={selectedMineId} />}
          {activePage === 'actions' && <RecommendedActionsPage />}
          {activePage === 'digitalTwin' && <DigitalTwinPage />}
          {activePage === 'dataHealth' && <DataHealthPage />}
        </main>
      </div>

      {/* Persistent Chatbot Drawer */}
      <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
