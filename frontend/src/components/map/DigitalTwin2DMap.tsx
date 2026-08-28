import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MineRiskSummary } from '../../api/client';

interface DigitalTwin2DMapProps {
  mines: MineRiskSummary[];
}

export default function DigitalTwin2DMap({ mines }: DigitalTwin2DMapProps) {
  const [showReserves, setShowReserves] = useState(true);
  const [showFleet, setShowFleet] = useState(true);
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showDroneOverlay, setShowDroneOverlay] = useState(true);
  const [selectedDroneFrame, setSelectedDroneFrame] = useState<string | null>(null);

  // Real MOIL mine geographic coordinates (Balaghat-Nagpur mining belt)
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
        <MapContainer
          center={[21.60, 79.80]}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> DarkMatter'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Layer 1: Geological Reserve Boundary Envelopes */}
          {showReserves && (
            <>
              {/* Balaghat Reserve Lease Box */}
              <Rectangle
                bounds={[[21.80, 80.15], [21.86, 80.23]]}
                pathOptions={{ color: '#3D8C5A', weight: 1.5, fillOpacity: 0.15 }}
              >
                <Popup>
                  <div className="font-mono text-[11px] p-1">
                    <div className="text-[#3D8C5A] font-bold">BALAGHAT HIGH-GRADE ZONE</div>
                    <div>Grade: 45.2% Mn | Seam: 14.5m</div>
                    <div>Reserve Category: Proved 111</div>
                  </div>
                </Popup>
              </Rectangle>

              {/* Dongri Buzurg Reserve Lease Box */}
              <Rectangle
                bounds={[[21.52, 79.74], [21.58, 79.82]]}
                pathOptions={{ color: '#3D8C5A', weight: 1.5, fillOpacity: 0.15 }}
              >
                <Popup>
                  <div className="font-mono text-[11px] p-1">
                    <div className="text-[#3D8C5A] font-bold">DONGRI BUZURG ORE LEASE</div>
                    <div>Grade: 46.5% Mn | Seam: 16.8m</div>
                    <div>Opencast Benches #1-4</div>
                  </div>
                </Popup>
              </Rectangle>

              {/* Chikla Reserve Lease Box */}
              <Rectangle
                bounds={[[21.49, 79.72], [21.54, 79.77]]}
                pathOptions={{ color: '#C4A238', weight: 1.5, fillOpacity: 0.15 }}
              >
                <Popup>
                  <div className="font-mono text-[11px] p-1">
                    <div className="text-[#C4A238] font-bold">CHIKLA MEDIUM-GRADE ZONE</div>
                    <div>Grade: 36.8% Mn | Seam: 10.2m</div>
                  </div>
                </Popup>
              </Rectangle>
            </>
          )}

          {/* Layer 2 & 3: Mine Locations, Telemetry Markers & Risk Heatmap */}
          {mines.map((m) => {
            const pos = mineCoords[m.mine_id] || [21.5, 79.5];
            const isHighRisk = m.risk_level === 'HIGH';
            const isMedRisk = m.risk_level === 'MEDIUM';

            return (
              <React.Fragment key={m.mine_id}>
                {/* Risk Heatmap Halo */}
                {showRiskHeatmap && (
                  <CircleMarker
                    center={pos}
                    radius={isHighRisk ? 32 : isMedRisk ? 22 : 14}
                    pathOptions={{
                      color: isHighRisk ? '#D9534F' : isMedRisk ? '#E09B3D' : '#4E9F6E',
                      fillColor: isHighRisk ? '#D9534F' : isMedRisk ? '#E09B3D' : '#4E9F6E',
                      fillOpacity: isHighRisk ? 0.25 : 0.15,
                      weight: 0,
                    }}
                  />
                )}

                {/* Core Mine Fleet Position Marker */}
                {showFleet && (
                  <CircleMarker
                    center={pos}
                    radius={6}
                    pathOptions={{
                      color: '#E6EDF3',
                      fillColor: isHighRisk ? '#D9534F' : isMedRisk ? '#E09B3D' : '#4E9F6E',
                      fillOpacity: 1.0,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="font-mono text-[11px] p-1 space-y-1">
                        <div className="font-bold text-[#E6EDF3] border-b border-[#232834] pb-1">
                          {m.mine_name} ({m.mine_id})
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#8B949E]">Shortfall Risk:</span>
                          <span
                            className={
                              isHighRisk
                                ? 'text-[#D9534F] font-bold'
                                : isMedRisk
                                ? 'text-[#E09B3D] font-bold'
                                : 'text-[#4E9F6E]'
                            }
                          >
                            {m.shortfall_probability}% ({m.risk_level})
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#8B949E]">Daily Extraction:</span>
                          <span>{m.daily_avg_tonnes} T/day</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#8B949E]">Equip Downtime:</span>
                          <span>{m.equipment_downtime_hrs} h</span>
                        </div>
                        <div className="text-[10px] text-[#C8A96E] pt-1">
                          {m.main_reason}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                )}
              </React.Fragment>
            );
          })}

          {/* Layer 4: Drone Orthomosaic Overlay (Balaghat Zone B) */}
          {showDroneOverlay && (
            <Rectangle
              bounds={[[21.82, 80.17], [21.84, 80.20]]}
              pathOptions={{
                color: '#C8A96E',
                dashArray: '4, 4',
                fillColor: '#C8A96E',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
              eventHandlers={{
                click: () => setSelectedDroneFrame('Balaghat Zone B — Flight #04 Frame'),
              }}
            >
              <Popup>
                <div className="font-mono text-[11px] p-1">
                  <div className="text-[#C8A96E] font-bold">UAV DRONE CAPTURE ZONE</div>
                  <div>Balaghat Pit Zone B (Flight #04)</div>
                  <div>Predicted Grade: 43.5% Mn</div>
                  <div className="text-[#8B949E] text-[10px] mt-1">[Click to view captured frame]</div>
                </div>
              </Popup>
            </Rectangle>
          )}
        </MapContainer>

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
