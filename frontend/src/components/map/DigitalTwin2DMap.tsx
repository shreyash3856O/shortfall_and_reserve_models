import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineRiskSummary } from '../../api/client';

interface DigitalTwin2DMapProps {
  mines: MineRiskSummary[];
}

type BaseLayerKey = 'dark' | 'satellite' | 'terrain';

const BASE_LAYERS: Record<BaseLayerKey, { label: string; url: string; attribution: string; maxZoom?: number; subdomains?: string }> = {
  dark: {
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, NASA',
    maxZoom: 19,
  },
  terrain: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
    subdomains: 'abc',
  },
};

export default function DigitalTwin2DMap({ mines }: DigitalTwin2DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileRef = useRef<L.TileLayer | null>(null);
  const layersRef = useRef<{
    reserves: L.LayerGroup;
    fleet: L.LayerGroup;
    risk: L.LayerGroup;
    drone: L.LayerGroup;
  } | null>(null);

  const [showReserves, setShowReserves] = useState(true);
  const [showFleet, setShowFleet] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showDroneOverlay, setShowDroneOverlay] = useState(true);
  const [activeBase, setActiveBase] = useState<BaseLayerKey>('dark');
  const [selectedDroneFrame, setSelectedDroneFrame] = useState<string | null>(null);

  // Real MOIL mine geographical coordinates
  const mineCoords: Record<string, [number, number]> = {
    MN01: [21.83, 80.19],
    MN02: [21.92, 80.45],
    MN03: [21.68, 79.72],
    MN04: [21.61, 79.68],
    MN05: [21.52, 79.75],
    MN06: [21.55, 79.78],
    MN07: [21.32, 79.35],
    MN08: [21.42, 79.28],
    MN09: [21.45, 79.31],
    MN10: [21.28, 78.98],
  };

  // Initialize Map once with explicit height fix
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const container = mapContainerRef.current;

    const map = L.map(container, {
      center: [21.60, 79.80],
      zoom: 9,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Custom zoom control bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Carto Dark tiles — reliable, free, no API key
    const cfg = BASE_LAYERS.dark;
    const tile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom ?? 19,
      subdomains: (cfg.subdomains ?? '') as any,
    }).addTo(map);
    baseTileRef.current = tile;

    const reserves = L.layerGroup();
    const fleet = L.layerGroup();
    const risk = L.layerGroup();
    const drone = L.layerGroup();
    layersRef.current = { reserves, fleet, risk, drone };

    reserves.addTo(map);
    risk.addTo(map);
    fleet.addTo(map);
    drone.addTo(map);

    // Force map to recalculate size after render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      baseTileRef.current = null;
      layersRef.current = null;
    };
  }, []);

  // Switch base tile layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileRef.current) {
      map.removeLayer(baseTileRef.current);
    }

    const cfg = BASE_LAYERS[activeBase];
    const newTile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom ?? 19,
      subdomains: (cfg.subdomains ?? '') as any,
    });
    newTile.addTo(map);
    baseTileRef.current = newTile;

    // Bring overlays to front
    if (layersRef.current) {
      const { reserves, risk, fleet, drone } = layersRef.current;
      reserves.addTo(map);
      risk.addTo(map);
      fleet.addTo(map);
      drone.addTo(map);
    }
  }, [activeBase]);

  // Draw overlays whenever mines / toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    const { reserves, fleet, risk, drone } = layers;
    const popupStyle = 'font-family:"Plus Jakarta Sans",sans-serif;font-size:12px;line-height:1.6;';

    // Reserve Zones
    reserves.clearLayers();
    if (showReserves) {
      L.rectangle([[21.80, 80.15], [21.86, 80.23]] as L.LatLngBoundsLiteral, {
        color: '#4F9067', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;">BALAGHAT HIGH-GRADE ZONE</strong><br/>Grade: 45.2% Mn &nbsp;|&nbsp; Seam: 14.5m<br/>Reserve Category: Proved 111</div>`)
        .addTo(reserves);

      L.rectangle([[21.52, 79.74], [21.58, 79.82]] as L.LatLngBoundsLiteral, {
        color: '#4F9067', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;">DONGRI BUZURG ORE LEASE</strong><br/>Grade: 46.5% Mn &nbsp;|&nbsp; Seam: 16.8m<br/>Opencast Benches #1–4</div>`)
        .addTo(reserves);

      L.rectangle([[21.49, 79.72], [21.54, 79.77]] as L.LatLngBoundsLiteral, {
        color: '#C98040', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#C98040;">CHIKLA MEDIUM-GRADE ZONE</strong><br/>Grade: 36.8% Mn &nbsp;|&nbsp; Seam: 10.2m</div>`)
        .addTo(reserves);
    }

    // Fleet & Risk Heatmap
    fleet.clearLayers();
    risk.clearLayers();

    mines.forEach((m) => {
      const pos = mineCoords[m.mine_id] || [21.5, 79.5];
      const isHigh = m.risk_level === 'HIGH';
      const isMed = m.risk_level === 'MEDIUM';
      const color = isHigh ? '#D94F4F' : isMed ? '#C98040' : '#4F9067';

      if (showRiskHeatmap) {
        L.circleMarker(pos as L.LatLngExpression, {
          radius: isHigh ? 36 : isMed ? 24 : 16,
          color,
          fillColor: color,
          fillOpacity: isHigh ? 0.20 : 0.12,
          weight: 0,
        }).addTo(risk);
      }

      if (showFleet) {
        const marker = L.circleMarker(pos as L.LatLngExpression, {
          radius: 7,
          color: '#EFEFEF',
          fillColor: color,
          fillOpacity: 1.0,
          weight: 2,
        });
        marker.bindPopup(
          `<div style="${popupStyle}">` +
          `<strong style="color:#EFEFEF;">${m.mine_name} (${m.mine_id})</strong><br/>` +
          `Risk: <span style="color:${color};font-weight:bold;">${m.shortfall_probability}% ${m.risk_level}</span><br/>` +
          `Extraction: ${m.daily_avg_tonnes} T/day<br/>` +
          `Downtime: ${m.equipment_downtime_hrs} h/day<br/>` +
          `<span style="color:#C0BDB8;font-size:11px;">${m.main_reason}</span>` +
          `</div>`
        );
        marker.addTo(fleet);
      }
    });

    // UAV Drone Overlay
    drone.clearLayers();
    if (showDroneOverlay) {
      const droneRect = L.rectangle([[21.82, 80.17], [21.84, 80.20]] as L.LatLngBoundsLiteral, {
        color: '#C0BDB8',
        dashArray: '5, 5',
        fillColor: '#C0BDB8',
        fillOpacity: 0.10,
        weight: 1.5,
      });
      droneRect.on('click', () => setSelectedDroneFrame('Balaghat Zone B — UAV Flight #04 Frame'));
      droneRect.bindPopup(
        `<div style="${popupStyle}"><strong style="color:#C0BDB8;">UAV DRONE CAPTURE ZONE</strong><br/>` +
        `Balaghat Pit Zone B (Flight #04)<br/>Predicted Grade: 43.5% Mn</div>`
      );
      droneRect.addTo(drone);
    }
  }, [mines, showReserves, showFleet, showRiskHeatmap, showDroneOverlay]);

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] bg-[#111114]/80 backdrop-blur-sm">
      {/* Glass Toolbar */}
      <div className="px-4 py-3 bg-[#16161A]/90 backdrop-blur-md border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="text-[#666666] mr-1">Basemap:</span>
          {(Object.keys(BASE_LAYERS) as BaseLayerKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveBase(key)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all duration-200 ${
                activeBase === key
                  ? 'bg-[#24242C]/90 border-[#3C3C48] text-[#EFEFEF] shadow-sm'
                  : 'bg-transparent border-[#24242A] text-[#888888] hover:text-[#CCCCCC] hover:border-[#333340]'
              }`}
            >
              {BASE_LAYERS[key].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          {[
            { label: 'Reserve Zones', state: showReserves, setState: setShowReserves, dot: '#4F9067' },
            { label: 'Fleet Telemetry', state: showFleet, setState: setShowFleet, dot: '#C0BDB8' },
            { label: 'Risk Heatmap', state: showRiskHeatmap, setState: setShowRiskHeatmap, dot: '#D94F4F' },
            { label: 'UAV Overlay', state: showDroneOverlay, setState: setShowDroneOverlay, dot: '#C98040' },
          ].map(({ label, state, setState, dot }) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer group">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-opacity ${state ? 'opacity-100' : 'opacity-25'}`}
                style={{ backgroundColor: dot }}
              />
              <input type="checkbox" checked={state} onChange={(e) => setState(e.target.checked)} className="sr-only" />
              <span className={`transition-colors ${state ? 'text-[#CCCCCC]' : 'text-[#555555]'} group-hover:text-[#EFEFEF] font-medium`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Leaflet Viewport — explicit height forces correct rendering */}
      <div className="flex-1 relative" style={{ minHeight: '480px' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

        {/* UAV Detail Panel */}
        {selectedDroneFrame && (
          <div className="absolute top-4 right-4 z-[1000] w-80 bg-[#16161A]/95 backdrop-blur-md border border-[#2E2E3A] p-4 shadow-2xl rounded-xl text-[12px] animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[#222228] pb-2 mb-3">
              <div className="text-[#C0BDB8] font-bold text-[12px]">{selectedDroneFrame}</div>
              <button
                onClick={() => setSelectedDroneFrame(null)}
                className="text-[#888888] hover:text-[#EFEFEF] px-2 py-0.5 bg-[#202026] border border-[#2C2C34] rounded text-[11px] transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="bg-[#0D0D10] border border-dashed border-[#2E2E3A] rounded-lg p-3 text-center mb-3">
              <div className="h-28 flex flex-col items-center justify-center gap-1">
                <div className="text-[#C0BDB8] font-bold text-[12px]">ZONE B ORE BENCH 4</div>
                <div className="text-[#555555] text-[10px]">Resolution: 3.2cm/px &bull; GSD Calibrated</div>
                <div className="text-[#4F9067] mt-2 font-semibold text-[12px]">Mn Grade: 43.5% (High Ore)</div>
              </div>
            </div>
            <div className="text-[11px] text-[#666666]">
              Live telemetry matched to Sentinel-2 NDVI 0.48 &amp; LST 31.4&deg;C.
            </div>
          </div>
        )}

        {/* Coordinate Watermark */}
        <div className="absolute bottom-2 left-2 z-[500] bg-[#111114]/80 backdrop-blur-sm border border-white/[0.05] px-2.5 py-1 rounded-md text-[10px] text-[#555566] pointer-events-none select-none">
          WGS-84 &bull; UTM 44N &bull; Balaghat-Nagpur Mn Belt &bull; CARTO / ESRI / OpenTopoMap
        </div>
      </div>
    </div>
  );
}
