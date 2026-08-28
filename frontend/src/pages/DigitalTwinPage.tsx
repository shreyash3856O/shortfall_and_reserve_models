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
    <div className="p-6 lg:p-8 space-y-5 max-w-7xl mx-auto font-sans h-full flex flex-col">
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">
          Geographical Information System (GIS)
        </div>
        <h1 className="text-2xl font-bold text-[#EFEFEF] mt-1">{t('digitalTwin.heading')}</h1>
        <p className="text-[13px] text-[#888888] mt-1">{t('digitalTwin.subheading')}</p>
      </div>

      {/* 2D Digital Twin Map */}
      <div className="flex-1 min-h-[580px]">
        {isLoading ? (
          <div className="h-full flex items-center gap-2 p-8 text-[13px] text-[#888888]">
            <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            Loading GIS layers and telemetry markers...
          </div>
        ) : (
          <DigitalTwin2DMap mines={mines} />
        )}
      </div>

      {/* Technical Footnote */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg px-4 py-3 text-[11px] text-[#666666] flex flex-col sm:flex-row justify-between gap-2">
        <div className="font-medium text-[#888888]">
          Coordinates: WGS-84 &bull; UTM Zone 44N &bull; Balaghat-Nagpur Manganese Belt
        </div>
        <div className="text-[#4A4A4A]">
          Tile Provider: Mapbox &bull; Overlay: Leaflet.js &bull; Phase 4: UAV 3D Photogrammetry Mesh
        </div>
      </div>
    </div>
  );
}
