import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'boneyard-js/react';
import DigitalTwin2DMap from '../components/map/DigitalTwin2DMap';
import { api, MineRiskSummary } from '../api/client';
import { DigitalTwinSkeleton } from '../components/layout/ViewSkeletons';

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
    <Skeleton
      name="digital-twin"
      loading={isLoading}
      fallback={<DigitalTwinSkeleton />}
    >
      <div className="p-6 lg:p-8 space-y-5 max-w-6xl mx-auto font-sans h-full flex flex-col animate-fade-in">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C0BDB8]">
            Geographical Information System (GIS)
          </div>
          <h1 className="text-2xl font-bold text-[#EFEFEF] tracking-tight mt-0.5">{t('digitalTwin.heading')}</h1>
          <p className="text-[13px] text-[#888888] mt-0.5">{t('digitalTwin.subheading')}</p>
        </div>

        {/* 2D Digital Twin Map */}
        <div className="flex-1 min-h-[560px] rounded-2xl overflow-hidden shadow-sm animate-fade-in-up stagger-1">
          <DigitalTwin2DMap mines={mines} />
        </div>

        {/* Technical Footnote */}
        <div className="bg-[#16161A] border border-[#24242A] rounded-xl px-4 py-3 text-[11px] text-[#666666] flex flex-col sm:flex-row justify-between gap-2 shadow-sm animate-fade-in-up stagger-2">
          <div className="font-medium text-[#888888]">
            Coordinates: WGS-84 &bull; UTM Zone 44N &bull; Balaghat-Nagpur Manganese Belt
          </div>
          <div className="text-[#4A4A4A]">
            Tile Provider: Stadia / ESRI / OpenTopoMap &bull; Overlay: Leaflet.js
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
