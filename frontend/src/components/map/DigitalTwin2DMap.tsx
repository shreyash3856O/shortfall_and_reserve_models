import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineRiskSummary } from '../../api/client';

interface DigitalTwin2DMapProps {
  mines: MineRiskSummary[];
}

type BaseLayerKey = 'dark' | 'satellite' | 'terrain';

const BASE_LAYERS: Record<BaseLayerKey, { label: string; url: string; attribution: string; isDarkFilter?: boolean; maxZoom?: number; subdomains?: string[] }> = {
  dark: {
    label: 'Dark Tactical',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull; MIDAS Dark Mesh',
    isDarkFilter: true,
    maxZoom: 19,
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: USGS, NASA, NGA',
    isDarkFilter: false,
    maxZoom: 19,
  },
  terrain: {
    label: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> &copy; OpenStreetMap',
    isDarkFilter: false,
    maxZoom: 17,
    subdomains: ['a', 'b', 'c'],
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
  }>({
    reserves: L.layerGroup(),
    fleet: L.layerGroup(),
    risk: L.layerGroup(),
    drone: L.layerGroup(),
  });

  const [showReserves, setShowReserves] = useState(true);
  const [showFleet, setShowFleet] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showDroneOverlay, setShowDroneOverlay] = useState(true);
  const [activeBase, setActiveBase] = useState<BaseLayerKey>('dark');
  const [selectedDroneFrame, setSelectedDroneFrame] = useState<string | null>(null);

  // Real MOIL mine geographical coordinates
  const mineCoords: Record<string, [number, number]> = {
    MN01: [21.83, 80.19], // Balaghat
    MN02: [21.92, 80.45], // Ukwa
    MN03: [21.68, 79.72], // Tirodi
    MN04: [21.61, 79.68], // Sitapatore
    MN05: [21.52, 79.75], // Chikla
    MN06: [21.55, 79.78], // Dongri Buzurg
    MN07: [21.32, 79.35], // Beldongri
    MN08: [21.42, 79.28], // Kandri
    MN09: [21.45, 79.31], // Munsar
    MN10: [21.28, 78.98], // Gumgaon
  };

  // Initialize Map with explicit dimensions & multiple size invalidations
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [21.60, 79.80],
      zoom: 9,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Zoom control at top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Initial base tile
    const cfg = BASE_LAYERS[activeBase];
    const tile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom ?? 19,
      subdomains: cfg.subdomains ?? ['a', 'b', 'c'],
      className: cfg.isDarkFilter ? 'dark-mode-tiles' : '',
    }).addTo(map);
    baseTileRef.current = tile;

    // Attach layer groups to map
    layersRef.current.reserves.addTo(map);
    layersRef.current.risk.addTo(map);
    layersRef.current.fleet.addTo(map);
    layersRef.current.drone.addTo(map);

    // Ensure map tiles render properly after DOM layout calculation
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    const t3 = setTimeout(() => map.invalidateSize(), 800);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      baseTileRef.current = null;
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
      subdomains: cfg.subdomains ?? ['a', 'b', 'c'],
      className: cfg.isDarkFilter ? 'dark-mode-tiles' : '',
    }).addTo(map);
    baseTileRef.current = newTile;

    setTimeout(() => map.invalidateSize(), 100);
  }, [activeBase]);

  // Update overlay markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { reserves, fleet, risk, drone } = layersRef.current;

    // 1. Reserve Ore Zone Rectangles
    reserves.clearLayers();
    if (showReserves) {
      const popupStyle = 'font-family:"Plus Jakarta Sans",sans-serif;font-size:12px;line-height:1.5;padding:4px;';

      L.rectangle([[21.80, 80.15], [21.86, 80.23]], {
        color: '#4F9067', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;font-size:13px;">BALAGHAT HIGH-GRADE ZONE</strong><br/>Grade: 45.2% Mn &nbsp;|&nbsp; Seam: 14.5m<br/>Reserve Category: Proved 111</div>`)
        .addTo(reserves);

      L.rectangle([[21.52, 79.74], [21.58, 79.82]], {
        color: '#4F9067', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;font-size:13px;">DONGRI BUZURG ORE LEASE</strong><br/>Grade: 46.5% Mn &nbsp;|&nbsp; Seam: 16.8m<br/>Opencast Benches #1-4</div>`)
        .addTo(reserves);

      L.rectangle([[21.49, 79.72], [21.54, 79.77]], {
        color: '#C98040', weight: 2, fillOpacity: 0.18,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#C98040;font-size:13px;">CHIKLA MEDIUM-GRADE ZONE</strong><br/>Grade: 36.8% Mn &nbsp;|&nbsp; Seam: 10.2m</div>`)
        .addTo(reserves);
    }

    // 2 & 3. Fleet markers & risk heatmap
    fleet.clearLayers();
    risk.clearLayers();

    // Default fallback mines if empty
    const effectiveMines = mines.length > 0 ? mines : [
      { mine_id: 'MN01', mine_name: 'Balaghat', shortfall_probability: 100, risk_level: 'HIGH', mtd_actual_tonnes: 3089.2, target_tonnes: 4045.6, daily_avg_tonnes: 99.65, equipment_downtime_hrs: 10.5, main_reason: 'Excavator breakdown + monsoon' },
      { mine_id: 'MN02', mine_name: 'Ukwa', shortfall_probability: 0, risk_level: 'LOW', mtd_actual_tonnes: 769.8, target_tonnes: 746.9, daily_avg_tonnes: 24.83, equipment_downtime_hrs: 3.2, main_reason: 'Normal operation' },
      { mine_id: 'MN03', mine_name: 'Tirodi', shortfall_probability: 0, risk_level: 'LOW', mtd_actual_tonnes: 959.3, target_tonnes: 933.6, daily_avg_tonnes: 30.95, equipment_downtime_hrs: 4.1, main_reason: 'Normal operation' },
      { mine_id: 'MN06', mine_name: 'Dongri Buzurg', shortfall_probability: 88, risk_level: 'HIGH', mtd_actual_tonnes: 1420.0, target_tonnes: 1850.0, daily_avg_tonnes: 45.8, equipment_downtime_hrs: 9.4, main_reason: 'Pump battery offline' },
      { mine_id: 'MN05', mine_name: 'Chikla', shortfall_probability: 45, risk_level: 'MEDIUM', mtd_actual_tonnes: 820.0, target_tonnes: 910.0, daily_avg_tonnes: 26.5, equipment_downtime_hrs: 6.8, main_reason: 'Haulage delay' },
    ];

    effectiveMines.forEach((m) => {
      const pos = mineCoords[m.mine_id] || [21.5, 79.5];
      const isHigh = m.risk_level === 'HIGH';
      const isMed = m.risk_level === 'MEDIUM';
      const color = isHigh ? '#D94F4F' : isMed ? '#C98040' : '#4F9067';
      const popupStyle = 'font-family:"Plus Jakarta Sans",sans-serif;font-size:12px;line-height:1.6;padding:4px;';

      if (showRiskHeatmap) {
        L.circleMarker(pos, {
          radius: isHigh ? 36 : isMed ? 24 : 14,
          color,
          fillColor: color,
          fillOpacity: isHigh ? 0.25 : 0.14,
          weight: 0,
        }).addTo(risk);
      }

      if (showFleet) {
        L.circleMarker(pos, {
          radius: 7,
          color: '#FFFFFF',
          fillColor: color,
          fillOpacity: 1.0,
          weight: 2,
        })
          .bindPopup(
            `<div style="${popupStyle}">` +
            `<strong style="color:#FFFFFF;font-size:13px;">${m.mine_name} (${m.mine_id})</strong><br/>` +
            `Shortfall Risk: <span style="color:${color};font-weight:bold;">${m.shortfall_probability}% (${m.risk_level})</span><br/>` +
            `Extraction Pace: ${m.daily_avg_tonnes} T/day<br/>` +
            `Downtime: ${m.equipment_downtime_hrs} h/day<br/>` +
            `<span style="color:#C0BDB8;font-size:11px;">${m.main_reason}</span>` +
            `</div>`
          )
          .addTo(fleet);
      }
    });

    // 4. UAV Drone Frame Overlay
    drone.clearLayers();
    if (showDroneOverlay) {
      const droneRect = L.rectangle([[21.82, 80.17], [21.84, 80.20]], {
        color: '#C0BDB8',
        dashArray: '6, 6',
        fillColor: '#C0BDB8',
        fillOpacity: 0.15,
        weight: 2,
      });

      droneRect.on('click', () => {
        setSelectedDroneFrame('Balaghat Zone B — UAV Flight #04 Frame');
      });

      droneRect
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;padding:4px;line-height:1.5;">` +
          `<strong style="color:#C0BDB8;font-size:13px;">UAV DRONE CAPTURE ZONE</strong><br/>` +
          `Balaghat Pit Zone B (Flight #04)<br/>` +
          `Predicted Grade: 43.5% Mn</div>`
        )
        .addTo(drone);
    }
  }, [mines, showReserves, showFleet, showRiskHeatmap, showDroneOverlay]);

  return (
    <div className="w-full h-full flex flex-col glass-tile-static rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Control Toolbar - Glass Effect */}
      <div className="px-5 py-3.5 bg-[#14141A]/90 backdrop-blur-xl border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 select-none z-10">
        {/* Base Layer Switcher */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="text-[#888888] mr-1">Basemap:</span>
          {(Object.keys(BASE_LAYERS) as BaseLayerKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveBase(key)}
              className={`px-3 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                activeBase === key
                  ? 'bg-white/[0.15] border-white/[0.2] text-white shadow-sm font-bold'
                  : 'bg-white/[0.03] border-white/[0.05] text-[#888888] hover:text-[#CCCCCC]'
              }`}
            >
              {BASE_LAYERS[key].label}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-[12px]">
          {[
            { label: 'Reserve Zones', state: showReserves, setState: setShowReserves, dot: '#4F9067' },
            { label: 'Fleet Telemetry', state: showFleet, setState: setShowFleet, dot: '#C0BDB8' },
            { label: 'Risk Heatmap', state: showRiskHeatmap, setState: setShowRiskHeatmap, dot: '#D94F4F' },
            { label: 'UAV Overlay', state: showDroneOverlay, setState: setShowDroneOverlay, dot: '#C98040' },
          ].map(({ label, state, setState, dot }) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer group">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-opacity ${state ? 'opacity-100' : 'opacity-25'}`}
                style={{ backgroundColor: dot }}
              />
              <input
                type="checkbox"
                checked={state}
                onChange={(e) => setState(e.target.checked)}
                className="sr-only"
              />
              <span className={`transition-colors ${state ? 'text-[#EFEFEF]' : 'text-[#666666]'} group-hover:text-white text-[11px] font-medium`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Leaflet Map Viewport with Explicit Pixel Height */}
      <div className="relative w-full" style={{ height: '580px', minHeight: '580px' }}>
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

        {/* UAV Drone Frame Detail Pop-up */}
        {selectedDroneFrame && (
          <div className="absolute top-4 right-4 z-[1000] w-80 bg-[#16161C]/95 backdrop-blur-xl border border-white/[0.12] p-5 shadow-2xl rounded-2xl text-[12px] animate-pop-up">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-2.5 mb-3">
              <div className="text-[#C0BDB8] font-bold text-[13px]">{selectedDroneFrame}</div>
              <button
                onClick={() => setSelectedDroneFrame(null)}
                className="text-[#888888] hover:text-white px-2 py-0.5 bg-[#202028] border border-white/[0.08] rounded-md text-[11px] transition-colors"
              >
                &times; Close
              </button>
            </div>
            <div className="bg-[#101014] border border-white/[0.06] rounded-xl p-3 text-center text-[#888888] text-[11px] mb-3">
              <div className="h-28 flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-lg">
                <div className="text-[#C0BDB8] font-bold text-[12px]">ZONE B ORE BENCH 4</div>
                <div className="text-[#666666] mt-1 text-[10px]">Resolution: 3.2cm/px &bull; GSD Calibrated</div>
                <div className="text-[#4F9067] mt-2 font-bold">Mn Grade: 43.5% (High Ore)</div>
              </div>
            </div>
            <div className="text-[11px] text-[#777777]">
              Live telemetry matched to Sentinel-2 NDVI 0.48 &amp; LST 31.4&deg;C.
            </div>
          </div>
        )}

        {/* Floating Coordinates Watermark */}
        <div className="absolute bottom-3 left-3 z-[500] bg-[#121216]/85 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-lg text-[10px] text-[#888888] pointer-events-none select-none shadow-md">
          WGS-84 &bull; UTM 44N &bull; Balaghat-Nagpur Manganese Belt &bull; Live Telemetry Feed
        </div>
      </div>
    </div>
  );
}
