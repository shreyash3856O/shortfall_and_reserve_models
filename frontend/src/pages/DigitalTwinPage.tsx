import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DigitalTwin2DMap from '../components/map/DigitalTwin2DMap';
import { api, MineRiskSummary } from '../api/client';

export default function DigitalTwinPage() {
  const { t } = useTranslation();
  const [mines, setMines] = useState<MineRiskSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMines() {
      try {
        const res = await api.getShortfallMines();
        setMines(res.data);
      } catch (err) {
        console.error('Failed to load mines', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMines();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans h-full flex flex-col">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96E]">
          Geographical Information System (GIS)
        </div>
        <h1 className="text-2xl font-bold text-[#E6EDF3] mt-1">{t('digitalTwin.heading')}</h1>
        <p className="text-[13px] text-[#8B949E] mt-1">{t('digitalTwin.subheading')}</p>
      </div>

      {/* 2D Digital Twin Map Viewport */}
      <div className="flex-1 min-h-[560px]">
        {isLoading ? (
          <div className="p-8 font-mono text-[12px] text-[#8B949E]">
            Loading GIS layers and telemetry markers...
          </div>
        ) : (
          <DigitalTwin2DMap mines={mines} />
        )}
      </div>

      {/* Technical Footnote & Roadmap */}
      <div className="bg-[#12151B] border border-[#232834] p-4 text-[10px] font-mono text-[#8B949E] flex flex-col sm:flex-row justify-between gap-2">
        <div>
          COORDINATES: WGS-84 / UTM ZONE 44N | BALAGHAT-NAGPUR MANGANESE BELT
        </div>
        <div className="text-[#586069]">
          [ROADMAP NOTE: High-resolution UAV 3D photogrammetry mesh pipeline scheduled for Phase 4 rollout]
        </div>
      </div>
    </div>
  );
}
