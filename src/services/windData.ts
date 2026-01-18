export type WindSummary = {
  site: { name: string; nameplate_mw: number; region: string; timezone: string };
  kpis: Array<{ id: string; title: string; value: string; subtitle?: string; trend?: string }>;
  risk_outlook?: { verdict?: string };
};

export type WindTimeseries = {
  chart: { series_keys: string[]; title: string; interval_minutes: number; lead_hours: number };
  series: Array<{
    name: string;          // "01:00"
    ts_utc: string;        // ISO
    forecast: number;
    actual: number;
    upper: number;
    lower: number;
  }>;
  site: { name: string; nameplate_mw: number; region: string; timezone: string };
};

export type WindAccuracy = {
  by_lead: Array<{ lead_h: number; mae_mw: number; rmse_mw: number; nrmse_pct: number; bias_mw: number; n: number }>;
  by_timescale: Array<{ timescale: string; mae_mw: number; rmse_mw: number; nrmse_pct: number; bias_mw: number }>;
  site: { name: string; nameplate_mw: number; region: string; timezone: string };
};

export type WindParameters = {
  parameters: Array<{ name: string; unit: string; available: boolean; description?: string }>;
  site: { name: string; nameplate_mw: number; region: string; timezone: string };
};

async function loadJson<T>(path: string): Promise<T> {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}`);
  return (await r.json()) as T;
}

export async function loadWindBundle() {
  const [summary, timeseries, accuracy, parameters] = await Promise.all([
    loadJson<WindSummary>("/data/wind/wind_summary.json"),
    loadJson<WindTimeseries>("/data/wind/wind_timeseries.json"),
    loadJson<WindAccuracy>("/data/wind/wind_accuracy.json"),
    loadJson<WindParameters>("/data/wind/wind_parameters.json"),
  ]);
  return { summary, timeseries, accuracy, parameters };
}
