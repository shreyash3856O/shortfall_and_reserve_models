import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MineRiskSummary } from '../../api/client';

interface DigitalTwin2DMapProps {
  mines: MineRiskSummary[];
}

export default function DigitalTwin2DMap({ mines }: DigitalTwin2DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [21.60, 79.80],
      zoom: 9,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Dark CartoDB Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB DarkMatter',
      maxZoom: 18,
    }).addTo(map);

    // Attach Layer Groups
    layersRef.current.reserves.addTo(map);
    layersRef.current.risk.addTo(map);
    layersRef.current.fleet.addTo(map);
    layersRef.current.drone.addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when props/state change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { reserves, fleet, risk, drone } = layersRef.current;

    // 1. Reserves Layer
    reserves.clearLayers();
    if (showReserves) {
      // Balaghat Lease
      L.rectangle([[21.80, 80.15], [21.86, 80.23]], {
        color: '#3D8C5A',
        weight: 1.5,
        fillOpacity: 0.15,
      })
        .bindPopup(
          '<div style="font-family:monospace;font-size:11px;padding:2px;"><strong style="color:#3D8C5A;">BALAGHAT HIGH-GRADE ZONE</strong><br/>Grade: 45.2% Mn | Seam: 14.5m<br/>Reserve Category: Proved 111</div>'
        )
        .addTo(reserves);

      // Dongri Buzurg Lease
      L.rectangle([[21.52, 79.74], [21.58, 79.82]], {
        color: '#3D8C5A',
        weight: 1.5,
        fillOpacity: 0.15,
      })
        .bindPopup(
          '<div style="font-family:monospace;font-size:11px;padding:2px;"><strong style="color:#3D8C5A;">DONGRI BUZURG ORE LEASE</strong><br/>Grade: 46.5% Mn | Seam: 16.8m<br/>Opencast Benches #1-4</div>'
        )
        .addTo(reserves);

      // Chikla Lease
      L.rectangle([[21.49, 79.72], [21.54, 79.77]], {
        color: '#C4A238',
        weight: 1.5,
        fillOpacity: 0.15,
      })
        .bindPopup(
          '<div style="font-family:monospace;font-size:11px;padding:2px;"><strong style="color:#C4A238;">CHIKLA MEDIUM-GRADE ZONE</strong><br/>Grade: 36.8% Mn | Seam: 10.2m</div>'
        )
        .addTo(reserves);
    }

    // 2 & 3. Fleet & Risk Heatmap Layers
    fleet.clearLayers();
    risk.clearLayers();

    mines.forEach((m) => {
      const pos = mineCoords[m.mine_id] || [21.5, 79.5];
      const isHigh = m.risk_level === 'HIGH';
      const isMed = m.risk_level === 'MEDIUM';
      const color = isHigh ? '#D9534F' : isMed ? '#E09B3D' : '#4E9F6E';

      if (showRiskHeatmap) {
        L.circleMarker(pos, {
          radius: isHigh ? 32 : isMed ? 22 : 14,
          color,
          fillColor: color,
          fillOpacity: isHigh ? 0.25 : 0.15,
          weight: 0,
        }).addTo(risk);
      }

      if (showFleet) {
        L.circleMarker(pos, {
          radius: 6,
          color: '#E6EDF3',
          fillColor: color,
          fillOpacity: 1.0,
          weight: 1.5,
        })
          .bindPopup(
            `<div style="font-family:monospace;font-size:11px;padding:2px;line-height:1.4;">` +
              `<strong style="color:#E6EDF3;">${m.mine_name} (${m.mine_id})</strong><br/>` +
              `Shortfall Risk: <span style="color:${color};font-weight:bold;">${m.shortfall_probability}% (${m.risk_level})</span><br/>` +
              `Extraction: ${m.daily_avg_tonnes} T/day<br/>` +
              `Downtime: ${m.equipment_downtime_hrs} h/day<br/>` +
              `<span style="color:#C8A96E;font-size:10px;">${m.main_reason}</span>` +
              `</div>`
          )
          .addTo(fleet);
      }
    });

    // 4. Drone Frame Overlay
    drone.clearLayers();
    if (showDroneOverlay) {
      const droneRect = L.rectangle([[21.82, 80.17], [21.84, 80.20]], {
        color: '#C8A96E',
        dashArray: '4, 4',
        fillColor: '#C8A96E',
        fillOpacity: 0.2,
        weight: 1.5,
      });

      droneRect.on('click', () => {
        setSelectedDroneFrame('Balaghat Zone B — Flight #04 Frame');
      });

      droneRect
        .bindPopup(
          '<div style="font-family:monospace;font-size:11px;padding:2px;"><strong style="color:#C8A96E;">UAV DRONE CAPTURE ZONE</strong><br/>Balaghat Pit Zone B (Flight #04)<br/>Predicted Grade: 43.5% Mn</div>'
        )
        .addTo(drone);
    }
  }, [mines, showReserves, showFleet, showRiskHeatmap, showDroneOverlay]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0D10] border border-[#232834]">
      {/* Control Toolbar */}
      <div className="p-3 bg-[#12151B] border-b border-[#232834] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono select-none">
        <div className="text-[#C8A96E] font-bold">2D GIS OPERATIONAL DIGITAL TWIN</div>

        {/* Toggleable Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 text-[#8B949E]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#E6EDF3]">
            <input
              type="checkbox"
              checked={showReserves}
              onChange={(e) => setShowReserves(e.target.checked)}
              className="accent-[#C8A96E]"
            />
            <span>[1] Reserve Ore Zones</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#E6EDF3]">
            <input
              type="checkbox"
              checked={showFleet}
              onChange={(e) => setShowFleet(e.target.checked)}
              className="accent-[#C8A96E]"
            />
            <span>[2] Fleet Telemetry</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#E6EDF3]">
            <input
              type="checkbox"
              checked={showRiskHeatmap}
              onChange={(e) => setShowRiskHeatmap(e.target.checked)}
              className="accent-[#C8A96E]"
            />
            <span>[3] Risk Heatmap</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#E6EDF3]">
            <input
              type="checkbox"
              checked={showDroneOverlay}
              onChange={(e) => setShowDroneOverlay(e.target.checked)}
              className="accent-[#C8A96E]"
            />
            <span>[4] UAV Drone Overlay</span>
          </label>
        </div>
      </div>

      {/* Leaflet 2D Map Container */}
      <div className="flex-1 relative min-h-[500px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Drone Captured Frame Modal */}
        {selectedDroneFrame && (
          <div className="absolute top-4 right-4 z-[1000] w-80 bg-[#12151B] border border-[#232834] p-3 shadow-2xl font-mono text-[11px]">
            <div className="flex justify-between items-center border-b border-[#232834] pb-2 mb-2">
              <div className="text-[#C8A96E] font-bold">{selectedDroneFrame}</div>
              <button
                onClick={() => setSelectedDroneFrame(null)}
                className="text-[#8B949E] hover:text-[#E6EDF3] px-1 bg-[#1D222A]"
              >
                [X]
              </button>
            </div>
            <div className="bg-[#0B0D10] border border-[#232834] p-2 text-center text-[#8B949E] text-[10px] mb-2">
              <div className="h-32 flex flex-col items-center justify-center border border-dashed border-[#2E3544]">
                <div className="text-[#C8A96E] font-bold">ZONE B ORE BENCH 4</div>
                <div className="text-[#586069] mt-1">Resolution: 3.2cm/px | GSD Calibrated</div>
                <div className="text-[#4E9F6E] mt-2">Mn Grade: 43.5% (High Ore)</div>
              </div>
            </div>
            <div className="text-[10px] text-[#586069]">
              Live telemetry matched to Sentinel-2 NDVI 0.48 &amp; LST 31.4C.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
