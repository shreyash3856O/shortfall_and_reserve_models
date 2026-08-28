import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'boneyard-js/react';
import { EquipmentSkeleton } from '../components/layout/ViewSkeletons';

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'MACHINERY' | 'PUMPS' | 'DRILL' | 'HYDRAULICS' | 'TIRES';
  oem: string;
  partNumber: string;
  priceLakhs: number;
  stockCount: number;
  depotLocation: string;
  leadTimeHours: number;
  aiRecommendedForMine?: string;
  aiReason?: string;
  urgency: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  specs: string;
}

export const CATALOG_ITEMS: EquipmentItem[] = [
  {
    id: 'EQ-01',
    name: 'Komatsu PC1250-8 Hydraulic Excavator',
    category: 'MACHINERY',
    oem: 'Komatsu Ltd.',
    partNumber: 'KMT-PC1250-8R',
    priceLakhs: 480.0,
    stockCount: 2,
    depotLocation: 'Nagpur Central Fleet Depot',
    leadTimeHours: 24,
    aiRecommendedForMine: 'MN01 (Balaghat Pit)',
    aiReason: 'Eliminates 10.5h/day breakdown risk & restores +350 T/day extraction quota.',
    urgency: 'CRITICAL',
    specs: '6.7m³ Heavy Rock Bucket • 502 kW Engine • 115 T Operating Weight',
  },
  {
    id: 'EQ-02',
    name: 'Kirloskar 75HP Submersible Slurry Dewatering Pump',
    category: 'PUMPS',
    oem: 'Kirloskar Brothers Ltd.',
    partNumber: 'KBL-DS-75HP-SS',
    priceLakhs: 14.5,
    stockCount: 6,
    depotLocation: 'Nagpur Central Depot',
    leadTimeHours: 12,
    aiRecommendedForMine: 'MN06 (Dongri Buzurg)',
    aiReason: 'High monsoon precipitation (45mm) mitigation. Drains opencast bench #2.',
    urgency: 'CRITICAL',
    specs: '75 HP • 450 m³/hr Flow • 60m Head • Tungsten Carbide Mechanical Seal',
  },
  {
    id: 'EQ-03',
    name: 'Komatsu PC1250 Main Hydraulic Cylinder Seal Kit',
    category: 'HYDRAULICS',
    oem: 'Komatsu OEM Spares',
    partNumber: 'KMT-707-99-78210',
    priceLakhs: 4.2,
    stockCount: 14,
    depotLocation: 'Balaghat Field Storage',
    leadTimeHours: 6,
    aiRecommendedForMine: 'MN01 (Balaghat Pit)',
    aiReason: 'Telemetry telemetry flags 86% pressure loss risk in primary boom cylinder.',
    urgency: 'CRITICAL',
    specs: 'Viton & PTFE High-Pressure Seals • Rated 380 Bar • OEM Certified',
  },
  {
    id: 'EQ-04',
    name: 'Sandvik T51 Carbide Mining Drill Bits (Crate of 50)',
    category: 'DRILL',
    oem: 'Sandvik Mining',
    partNumber: 'SND-T51-89MM-HD',
    priceLakhs: 18.0,
    stockCount: 8,
    depotLocation: 'Nagpur Central Depot',
    leadTimeHours: 18,
    aiRecommendedForMine: 'MN03 (Tirodi)',
    aiReason: 'Routine blast hole advance in Braunite hard quartzite rock seams.',
    urgency: 'HIGH',
    specs: '89mm Diameter • 8x Carbide Inserts • Retrac Skirt for Sausar Gondite',
  },
  {
    id: 'EQ-05',
    name: 'Bridgestone 27.00R49 E-4 Giant Haul Truck Radial Tires',
    category: 'TIRES',
    oem: 'Bridgestone Mining',
    partNumber: 'BST-2700R49-VRPS',
    priceLakhs: 12.8,
    stockCount: 16,
    depotLocation: 'Nagpur Central Fleet Depot',
    leadTimeHours: 24,
    aiRecommendedForMine: 'MN05 (Chikla)',
    aiReason: 'Haulage cycle optimization. Prevents heat tread separation.',
    urgency: 'HIGH',
    specs: '100-Ton Payload Rated • Cut-Resistant Compound • 104mm Tread Depth',
  },
  {
    id: 'EQ-06',
    name: 'BEML BD155 Heavy Mining Bulldozer (320 HP)',
    category: 'MACHINERY',
    oem: 'BEML India',
    partNumber: 'BEML-BD155-PLUS',
    priceLakhs: 290.0,
    stockCount: 3,
    depotLocation: 'BEML Regional Yard, Nagpur',
    leadTimeHours: 48,
    urgency: 'ROUTINE',
    specs: '320 HP BS-IV Engine • Semi-U Blade 8.8m³ • Multi-Shank Heavy Ripper',
  },
  {
    id: 'EQ-07',
    name: '6-inch HDPE Flexible Dewatering Discharge Hose (500m)',
    category: 'PUMPS',
    oem: 'Jindal Polytech',
    partNumber: 'JDL-HDPE-160-PN16',
    priceLakhs: 6.4,
    stockCount: 12,
    depotLocation: 'Nagpur Central Depot',
    leadTimeHours: 12,
    urgency: 'HIGH',
    specs: 'PN16 High Pressure • Quick-Lock Camlock Couplers • Abrasion Resistant',
  },
  {
    id: 'EQ-08',
    name: 'Cummins QSK19 Diesel Generator Power Pack (650 kVA)',
    category: 'HYDRAULICS',
    oem: 'Cummins India',
    partNumber: 'CUM-QSK19-G8',
    priceLakhs: 78.0,
    stockCount: 4,
    depotLocation: 'Nagpur Central Depot',
    leadTimeHours: 24,
    urgency: 'ROUTINE',
    specs: '650 kVA • 415V 50Hz • Weatherproof Sound-Attenuated Acoustic Enclosure',
  },
];

interface CartItem {
  item: EquipmentItem;
  quantity: number;
}

export default function EquipmentStorePage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [destinationMine, setDestinationMine] = useState('MN01 - Balaghat Pit Head');
  const [isEmergencyExpress, setIsEmergencyExpress] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCat = category === 'ALL' || item.category === category;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.oem.toLowerCase().includes(search.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.specs.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: EquipmentItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartValue = cart.reduce(
    (sum, c) => sum + c.item.priceLakhs * c.quantity,
    0
  );
  const totalCartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const poNumber = `PO-MOIL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderSuccess(poNumber);
      setIsSubmitting(false);
      setCart([]);
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans animate-fade-in relative">
      {/* Header with Cart Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#F5F5F7] tracking-tight">
              {t('equipment.heading')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4F9067]/15 text-[#4F9067] border border-[#4F9067]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067] animate-pulse"></span>
              PREDICTIVE DISPATCH ACTIVE
            </span>
          </div>
          <p className="text-[13px] text-[#888888] mt-0.5">
            {t('equipment.subheading')}
          </p>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2.5 shadow-lg transition-all hover:scale-[1.02] relative"
        >
          <svg className="w-4 h-4 text-[#C0BDB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Requisition Cart</span>
          {totalCartCount > 0 && (
            <span className="bg-[#4F9067] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* AI Telemetry Predictive Breakdown Alert Banner */}
      <div className="glass-tile p-5 rounded-3xl space-y-3 animate-fade-in-up stagger-1 border-l-4 border-l-[#C98040]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C98040] font-bold text-[13px]">
              <span className="w-2 h-2 rounded-full bg-[#C98040] animate-ping"></span>
              AI Telemetry Wear-Out Alert • 2 Critical Requisitions Recommended
            </div>
            <div className="text-[12px] text-[#888888] leading-relaxed max-w-2xl">
              SCADA telemetry at <strong className="text-[#EFEFEF]">Balaghat Pit</strong> indicates 86% hydraulic seal wear (10.5h downtime risk). Monsoon sensors at <strong className="text-[#EFEFEF]">Dongri Buzurg</strong> detect rising pit water requiring emergency pump allocation.
            </div>
          </div>
          <button
            onClick={() => {
              addToCart(CATALOG_ITEMS[2]); // Hydraulic seal kit
              addToCart(CATALOG_ITEMS[1]); // Kirloskar pump
              setIsCartOpen(true);
            }}
            className="bg-[#2A1E14] hover:bg-[#382618] border border-[#54341C] text-[#E5B580] px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 flex-shrink-0 hover:scale-[1.02]"
          >
            Auto-Queue AI Requisition &rarr;
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="glass-tile-static p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 animate-fade-in-up stagger-2">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
          {[
            { id: 'ALL', label: 'All Equipment & Spares' },
            { id: 'MACHINERY', label: 'Heavy Machinery' },
            { id: 'PUMPS', label: 'Pit Pumps & Dewatering' },
            { id: 'DRILL', label: 'Drill & Blast Tooling' },
            { id: 'HYDRAULICS', label: 'Hydraulics & Engine' },
            { id: 'TIRES', label: 'Fleet Radial Tires' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all duration-200 ${
                category === cat.id
                  ? 'bg-white/[0.14] text-white font-bold border border-white/[0.18] shadow-sm'
                  : 'bg-white/[0.03] text-[#888888] hover:text-[#CCCCCC] border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by OEM, part code, specs..."
            className="w-full bg-[#121216] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-1.5 text-[12px] text-[#EFEFEF] focus:outline-none focus:border-[#4F9067]/70 placeholder-[#666666] transition-all"
          />
          <svg className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up stagger-3">
        {filteredItems.map((item) => {
          const isCritical = item.urgency === 'CRITICAL';
          const isHigh = item.urgency === 'HIGH';

          return (
            <div
              key={item.id}
              className="glass-tile p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:border-white/[0.16] transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Meta Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                      {item.oem} • {item.partNumber}
                    </span>
                    <h3 className="text-[15px] font-extrabold text-[#F5F5F7] leading-snug group-hover:text-white transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex-shrink-0 ${
                      isCritical
                        ? 'bg-[#D94F4F]/15 text-[#D94F4F] border-[#D94F4F]/30'
                        : isHigh
                        ? 'bg-[#C98040]/15 text-[#C98040] border-[#C98040]/30'
                        : 'bg-white/[0.06] text-[#888888] border-white/[0.08]'
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-[11px] text-[#A0A0A8] leading-relaxed">
                  {item.specs}
                </div>

                {/* AI Recommendation Badge if applicable */}
                {item.aiRecommendedForMine && (
                  <div className="p-2.5 rounded-xl bg-[#4F9067]/10 border border-[#4F9067]/25 text-[11px] text-[#A5D6B6] space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-[#4F9067]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"></span>
                      AI Recommendation: {item.aiRecommendedForMine}
                    </div>
                    <div className="text-[10px] text-[#88B098]">{item.aiReason}</div>
                  </div>
                )}
              </div>

              {/* Bottom Price, Lead Time & Add Button */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-[18px] font-extrabold text-[#F5F5F7]">
                      ₹ {item.priceLakhs.toFixed(1)} <span className="text-[12px] text-[#777777] font-normal">Lakh</span>
                    </div>
                    <div className="text-[10px] text-[#666666]">
                      {item.stockCount} units in stock • {item.depotLocation}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-[#4F9067]">
                      {item.leadTimeHours}h Express ETA
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white py-2.5 rounded-xl text-[12px] font-semibold transition-all shadow-sm hover:scale-[1.01] flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add to Requisition</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Checkout Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#14141A]/95 border border-white/[0.12] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-pop-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] text-[#C0BDB8] font-bold text-xs flex items-center justify-center">
                  PO
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F5F5F7]">
                    Emergency Supply Requisition Cart
                  </h3>
                  <span className="text-[11px] text-[#777777]">
                    MOIL Central Inventory Allocation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#888888] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs transition-colors"
              >
                &times; Close
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-[#777777] text-[13px]">
                Requisition cart is empty. Add equipment or spares above.
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-white/[0.04]">
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-3 flex justify-between items-center gap-3">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#EFEFEF] truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#777777]">
                        ₹ {item.priceLakhs.toFixed(1)} Lakh/unit • {item.depotLocation}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#121216] border border-white/[0.08] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-0.5 text-[#888888] hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-[12px] font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-0.5 text-[#888888] hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-[13px] font-extrabold text-[#F5F5F7] w-20 text-right">
                        ₹ {(item.priceLakhs * quantity).toFixed(1)} L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Controls & Destination */}
            {cart.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-white/[0.08]">
                <div>
                  <label className="block text-[#888888] text-[11px] font-medium mb-1">
                    Destination Mine Unit / Pit Head:
                  </label>
                  <select
                    value={destinationMine}
                    onChange={(e) => setDestinationMine(e.target.value)}
                    className="w-full bg-[#121216] border border-white/[0.08] rounded-xl px-3.5 py-2 text-[12px] text-[#EFEFEF] focus:outline-none focus:border-[#4F9067]/70"
                  >
                    <option>MN01 - Balaghat Pit Head (High Priority)</option>
                    <option>MN06 - Dongri Buzurg Opencast Bench</option>
                    <option>MN05 - Chikla Underground & Pit</option>
                    <option>MN03 - Tirodi Open Cast Pit</option>
                    <option>MN02 - Ukwa Underground Mine</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4F9067] animate-pulse"></span>
                    <span className="text-[12px] text-[#CCCCCC] font-medium">
                      Emergency Express Heavy Haul (24h Dispatch)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergencyExpress}
                    onChange={(e) => setIsEmergencyExpress(e.target.checked)}
                    className="w-4 h-4 accent-[#4F9067]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1.5 text-[12px]">
                  <div className="flex justify-between text-[#888888]">
                    <span>Total Purchase Value:</span>
                    <span className="text-white font-bold">₹ {totalCartValue.toFixed(2)} Lakhs</span>
                  </div>
                  <div className="flex justify-between text-[#888888]">
                    <span>Depot Clearance:</span>
                    <span className="text-[#4F9067] font-semibold">Immediate Approval</span>
                  </div>
                  <div className="flex justify-between text-[#888888]">
                    <span>Transit Lead Time:</span>
                    <span className="text-[#CCCCCC]">{isEmergencyExpress ? '24 Hours' : '3-5 Days'}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-[#4F9067] hover:bg-[#3D7852] disabled:opacity-40 text-white py-3.5 rounded-2xl text-[13px] font-extrabold transition-all shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Allocating Central Depot Inventory...</span>
                  ) : (
                    <span>Submit &amp; Dispatch Purchase Requisition &rarr;</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Dispatch Confirmation Pop-up */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#14141A]/95 border border-[#4F9067]/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center animate-pop-up">
            <div className="w-12 h-12 rounded-full bg-[#4F9067]/20 border border-[#4F9067]/40 flex items-center justify-center text-[#4F9067] text-xl font-bold mx-auto">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#F5F5F7]">
                Requisition Dispatched Successfully!
              </h3>
              <p className="text-[12px] text-[#888888]">
                Purchase Order <strong className="text-white">{orderSuccess}</strong> has been authorized for destination <strong className="text-[#EFEFEF]">{destinationMine}</strong>.
              </p>
            </div>

            {/* Simulated Live Tracking Steps */}
            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-3 text-left text-[11px]">
              <div className="flex items-center gap-2.5 text-[#4F9067] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
                <span>1. Requisition Approved by MOIL Materials Mgmt</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#4F9067] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
                <span>2. Nagpur Central Depot Inventory Reserved</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#C0BDB8]">
                <span className="w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
                <span>3. Heavy Haul Carrier En Route to Pit Head (ETA 24h)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                setIsCartOpen(false);
              }}
              className="w-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white py-3 rounded-xl text-[12px] font-bold transition-all"
            >
              Back to Operations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
