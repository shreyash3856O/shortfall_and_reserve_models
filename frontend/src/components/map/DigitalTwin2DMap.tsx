import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineRiskSummary } from '../../api/client';

// Tile providers — all free, no API key required

interface DigitalTwin2DMapProps {
  mines: MineRiskSummary[];
}

type BaseLayerKey = 'dark' | 'satellite' | 'streets';

const BASE_LAYERS: Record<BaseLayerKey, { label: string; url: string; attribution: string; maxZoom?: number }> = {
  dark: {
    label: 'Dark',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: USGS, NASA, NGA, CGIAR',
    maxZoom: 19,
  },
  streets: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 17,
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

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [21.60, 79.80],
      zoom: 9,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Mapbox Dark base tile (default)
    const tile = L.tileLayer(BASE_LAYERS.dark.url, {
      attribution: BASE_LAYERS.dark.attribution,
      maxZoom: BASE_LAYERS.dark.maxZoom ?? 19,
    }).addTo(map);
    baseTileRef.current = tile;

    // Attach layer groups
    layersRef.current.reserves.addTo(map);
    layersRef.current.risk.addTo(map);
    layersRef.current.fleet.addTo(map);
    layersRef.current.drone.addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      baseTileRef.current = null;
    };
  }, []);

  // Switch base tile when user changes it
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
    }).addTo(map);
    baseTileRef.current = newTile;

    // Re-add overlays on top
    layersRef.current.reserves.addTo(map);
    layersRef.current.risk.addTo(map);
    layersRef.current.fleet.addTo(map);
    layersRef.current.drone.addTo(map);
  }, [activeBase]);

  // Update overlay layers when data / toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { reserves, fleet, risk, drone } = layersRef.current;

    // 1. Reserve Ore Zone Rectangles
    reserves.clearLayers();
    if (showReserves) {
      const popupStyle = 'font-family:"Plus Jakarta Sans",sans-serif;font-size:12px;line-height:1.5;padding:2px;';

      L.rectangle([[21.80, 80.15], [21.86, 80.23]], {
        color: '#4F9067', weight: 1.5, fillOpacity: 0.15,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;">BALAGHAT HIGH-GRADE ZONE</strong><br/>Grade: 45.2% Mn &nbsp;|&nbsp; Seam: 14.5m<br/>Reserve Category: Proved 111</div>`)
        .addTo(reserves);

      L.rectangle([[21.52, 79.74], [21.58, 79.82]], {
        color: '#4F9067', weight: 1.5, fillOpacity: 0.15,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#4F9067;">DONGRI BUZURG ORE LEASE</strong><br/>Grade: 46.5% Mn &nbsp;|&nbsp; Seam: 16.8m<br/>Opencast Benches #1-4</div>`)
        .addTo(reserves);

      L.rectangle([[21.49, 79.72], [21.54, 79.77]], {
        color: '#C98040', weight: 1.5, fillOpacity: 0.15,
      })
        .bindPopup(`<div style="${popupStyle}"><strong style="color:#C98040;">CHIKLA MEDIUM-GRADE ZONE</strong><br/>Grade: 36.8% Mn &nbsp;|&nbsp; Seam: 10.2m</div>`)
        .addTo(reserves);
    }

    // 2 & 3. Fleet markers & risk heatmap
    fleet.clearLayers();
    risk.clearLayers();

    mines.forEach((m) => {
      const pos = mineCoords[m.mine_id] || [21.5, 79.5];
      const isHigh = m.risk_level === 'HIGH';
      const isMed = m.risk_level === 'MEDIUM';
      const color = isHigh ? '#D94F4F' : isMed ? '#C98040' : '#4F9067';
      const popupStyle = 'font-family:"Plus Jakarta Sans",sans-serif;font-size:12px;line-height:1.6;padding:2px;';

      if (showRiskHeatmap) {
        L.circleMarker(pos, {
          radius: isHigh ? 34 : isMed ? 22 : 14,
          color,
          fillColor: color,
          fillOpacity: isHigh ? 0.22 : 0.13,
          weight: 0,
        }).addTo(risk);
      }

      if (showFleet) {
        L.circleMarker(pos, {
          radius: 6,
          color: '#EFEFEF',
          fillColor: color,
          fillOpacity: 1.0,
          weight: 1.5,
        })
          .bindPopup(
            `<div style="${popupStyle}">` +
            `<strong style="color:#EFEFEF;">${m.mine_name} (${m.mine_id})</strong><br/>` +
            `Risk: <span style="color:${color};font-weight:bold;">${m.shortfall_probability}% ${m.risk_level}</span><br/>` +
            `Extraction: ${m.daily_avg_tonnes} T/day<br/>` +
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
        dashArray: '5, 5',
        fillColor: '#C0BDB8',
        fillOpacity: 0.12,
        weight: 1.5,
      });

      droneRect.on('click', () => {
        setSelectedDroneFrame('Balaghat Zone B — UAV Flight #04 Frame');
      });

      droneRect
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;padding:2px;line-height:1.5;">` +
          `<strong style="color:#C0BDB8;">UAV DRONE CAPTURE ZONE</strong><br/>` +
          `Balaghat Pit Zone B (Flight #04)<br/>` +
          `Predicted Grade: 43.5% Mn</div>`
        )
        .addTo(drone);
    }
  }, [mines, showReserves, showFleet, showRiskHeatmap, showDroneOverlay]);

  const toggleClass = (active: boolean) =>
    active
      ? 'bg-[#272727] border-[#3C3C3C] text-[#EFEFEF]'
      : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#888888] hover:text-[#CCCCCC]';

  return (
    <div className="w-full h-full flex flex-col bg-[#111111] border border-[#2E2E2E] rounded-lg overflow-hidden">
      {/* Control Toolbar */}
      <div className="px-4 py-3 bg-[#1A1A1A] border-b border-[#2E2E2E] flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Base Layer Switcher */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="text-[#777777] mr-1">Basemap:</span>
          {(Object.keys(BASE_LAYERS) as BaseLayerKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveBase(key)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${toggleClass(activeBase === key)}`}
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
              <span className={`transition-colors ${state ? 'text-[#CCCCCC]' : 'text-[#555555]'} group-hover:text-[#EFEFEF] text-[11px] font-medium`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Leaflet Map Viewport */}
      <div className="flex-1 relative min-h-[500px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* UAV Drone Frame Detail Panel */}
        {selectedDroneFrame && (
          <div className="absolute top-4 right-4 z-[1000] w-80 bg-[#1A1A1A]/95 backdrop-blur-md border border-[#333333] p-4 shadow-2xl rounded-lg text-[12px]">
            <div className="flex justify-between items-center border-b border-[#2E2E2E] pb-2 mb-3">
              <div className="text-[#C0BDB8] font-bold text-[12px]">{selectedDroneFrame}</div>
              <button
                onClick={() => setSelectedDroneFrame(null)}
                className="text-[#888888] hover:text-[#EFEFEF] px-2 py-0.5 bg-[#242424] border border-[#333333] rounded text-[11px] transition-colors"
              >
                Close
              </button>
            </div>
            <div className="bg-[#111111] border border-[#2E2E2E] rounded p-3 text-center text-[#888888] text-[11px] mb-3">
              <div className="h-28 flex flex-col items-center justify-center border border-dashed border-[#333333] rounded">
                <div className="text-[#C0BDB8] font-bold text-[12px]">ZONE B ORE BENCH 4</div>
                <div className="text-[#555555] mt-1 text-[10px]">Resolution: 3.2cm/px &bull; GSD Calibrated</div>
                <div className="text-[#4F9067] mt-2 font-semibold">Mn Grade: 43.5% (High Ore)</div>
              </div>
            </div>
            <div className="text-[11px] text-[#666666]">
              Live telemetry matched to Sentinel-2 NDVI 0.48 &amp; LST 31.4&deg;C.
            </div>
          </div>
        )}

        {/* Coordinate Watermark */}
        <div className="absolute bottom-2 left-2 z-[500] bg-[#1A1A1A]/80 border border-[#2E2E2E] px-2.5 py-1 rounded text-[10px] text-[#666666] pointer-events-none select-none">
          WGS-84 &bull; UTM 44N &bull; Balaghat-Nagpur Mn Belt &bull; CARTO / ESRI / OpenTopoMap
        </div>
      </div>
    </div>
  );
}
