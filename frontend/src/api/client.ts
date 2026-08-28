/**
 * MIDAS Type-safe API Client with Offline Caching.
 */

export interface ReserveSummaryItem {
  zone: string;
  zone_id: number;
  grid_cells: number;
  area_km2: number;
  tonnage_mt: number;
  mean_grade_mn_pct: number;
  mean_thickness_m: number;
}

export interface ReserveGridBlock {
  easting: number;
  northing: number;
  depth_m: number;
  ndvi_grid: number;
  ndmi_grid: number;
  lst_grid: number;
  grade_pct: number;
  thickness_m: number;
  grade_kriging_var: number;
  tonnage_mt: number;
  zone_id: number;
}

export interface ReserveGridResponse {
  total_blocks: number;
  page: number;
  limit: number;
  blocks: ReserveGridBlock[];
}

export interface ReservePredictInput {
  easting: number;
  northing: number;
  depth_m: number;
  ndvi: number;
  moisture: number;
  lst?: number | null;
}

export interface ReservePredictResponse {
  easting: number;
  northing: number;
  depth_m: number;
  grade_pct: number;
  grade_ci_lower: number;
  grade_ci_upper: number;
  thickness_m: number;
  tonnage_mt_per_100m_block: number;
  zone: string;
}

export interface MineRiskSummary {
  mine_id: string;
  mine_name: string;
  shortfall_probability: number;
  risk_level: string;
  is_shortfall_likely: boolean;
  mtd_actual_tonnes: number;
  target_tonnes: number;
  daily_avg_tonnes: number;
  equipment_downtime_hrs: number;
  rainfall_mm: number;
  blasting_delay_days: number;
  workers_present: number;
  main_reason: string;
  top_actions: string[];
}

export interface ShapFeature {
  feature: string;
  impact_pct: number;
}

export interface PredictionResponse {
  shortfall_probability: number;
  risk_level: string;
  main_reason: string;
  is_shortfall_likely: boolean;
  shap_breakdown: ShapFeature[];
  recommended_actions: string[];
}

export interface MineHistoryRecord {
  year: number;
  month: number;
  date: string;
  actual_tonnes: number;
  target_tonnes: number;
  achievement_pct: number;
  is_shortfall: number;
  shortfall_probability: number;
}

export interface PrescriptiveActionItem {
  rank: number;
  mine_id: string;
  mine_name: string;
  action: string;
  trigger_driver: string;
  trigger_value: string;
  priority: string;
  expected_impact: string;
}

export interface DataHealthItem {
  feed_name: string;
  source_origin: string;
  record_count: number;
  last_sync: string;
  status: string;
  cadence: string;
}

export interface DataHealthResponse {
  overall_status: string;
  system_time_utc: string;
  sources: DataHealthItem[];
}

export interface ChatResponse {
  reply: string;
  language: string;
  sources_used: string[];
  suggested_queries: string[];
}

const CACHE_KEY_PREFIX = 'midas_cache_';
const SYNC_KEY = 'midas_last_sync_timestamp';

function setCached<T>(key: string, data: T): void {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(data));
    localStorage.setItem(SYNC_KEY, new Date().toISOString());
  } catch {
    // Storage full or unavailable
  }
}

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(SYNC_KEY);
}

export async function fetchWithCache<T>(endpoint: string, cacheKey?: string): Promise<{ data: T; isCached: boolean }> {
  const key = cacheKey || endpoint;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = (await res.json()) as T;
    setCached(key, data);
    return { data, isCached: false };
  } catch (err) {
    const cached = getCached<T>(key);
    if (cached) {
      return { data: cached, isCached: true };
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export const api = {
  getHealth: () => fetchWithCache<any>('/health', 'health'),
  
  getReserveSummary: () => fetchWithCache<ReserveSummaryItem[]>('/reserve/summary', 'reserve_summary'),
  
  getReserveVariograms: () => fetchWithCache<any>('/reserve/variogram', 'variograms'),
  
  getReserveGrid: (page = 1, limit = 500, min_grade?: number) => {
    let url = `/reserve/grid?page=${page}&limit=${limit}`;
    if (min_grade !== undefined) url += `&min_grade=${min_grade}`;
    return fetchWithCache<ReserveGridResponse>(url, `reserve_grid_${page}_${limit}_${min_grade ?? 'all'}`);
  },

  predictReservePoint: async (payload: ReservePredictInput): Promise<ReservePredictResponse> => {
    const res = await fetch('/reserve/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Reserve prediction error');
    return res.json();
  },

  getShortfallMines: () => fetchWithCache<MineRiskSummary[]>('/shortfall/mines', 'shortfall_mines'),

  getMineDetail: (mineId: string) => fetchWithCache<PredictionResponse>(`/shortfall/${mineId}`, `mine_detail_${mineId}`),

  getMineHistory: (mineId: string, limit = 24) => fetchWithCache<MineHistoryRecord[]>(`/shortfall/${mineId}/history?limit=${limit}`, `mine_history_${mineId}`),

  getMineActions: (mineId: string) => fetchWithCache<PrescriptiveActionItem[]>(`/actions/${mineId}`, `mine_actions_${mineId}`),

  getDataHealth: () => fetchWithCache<DataHealthResponse>('/data-health', 'data_health'),

  sendChatMessage: async (message: string, language = 'en'): Promise<ChatResponse> => {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });
    if (!res.ok) throw new Error('Chatbot response error');
    return res.json();
  },
};
