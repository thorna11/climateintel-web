import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageContainer } from "@/app/components/PageContainer";
import { SummaryTile } from "@/app/components/SummaryTile";
import { InteractiveChart } from "@/app/components/InteractiveChart";
import { ParametersSection } from "@/app/components/ParametersSection";
import { TimescaleCoverage } from "@/app/components/TimescaleCoverage";
import { UseCaseNarrative } from "@/app/components/UseCaseNarrative";
import { TemperatureAnalyticsDashboard } from "@/app/components/TemperatureAnalyticsDashboard";
import { Wind, Target, Clock, TrendingUp, ChevronLeft, Thermometer } from "lucide-react";

/**
 * IMPORTANT:
 * - Do NOT rely on any "generated demo" series.
 * - Always map chart data from /data/wind/wind_timeseries.json -> series[]
 * - Keep the Wind page text exactly as requested.
 */

type ChartPoint = {
  name: string;
  forecast: number;
  actual: number;
  upper: number;
  lower: number;
  ts_utc?: string;
};

type WindSummary = {
  kpis?: Array<{ id?: string; title: string; value: string; subtitle?: string }>;
  timescales?: Array<{ label: string; value?: string; min_h?: number; max_h?: number; active?: boolean }>;
};

type WindTimeseries = {
  series?: ChartPoint[] | Record<string, ChartPoint>;
  site?: { nameplate_mw?: number };
};

type WindParameters = {
  parameters?: Array<{ name: string; description: string; unit: string }> | Record<string, any>;
  timescales?: Array<{ label: string; value?: string; min_h?: number; max_h?: number; active?: boolean }>;
};

type WindAccuracy = Record<string, unknown>;

type WindBundle = {
  summary: WindSummary;
  timeseries: WindTimeseries;
  accuracy: WindAccuracy;
  parameters: WindParameters;
};

type ProductId = "wind-forecasting" | "temperature-analytics";

/** Required Wind header text */
const WIND_HEADER_PARAGRAPH =
  "This chart compares a 24-hour wind power forecast against observed generation. The forecast is produced in Python using ERA5 reanalysis wind data, where wind speed is derived from model components and converted to power using a simplified turbine power curve and fixed nameplate capacity. The forecast is intentionally labeled as a demo to showcase methodology rather than live operations. Accuracy is measured using Root Mean Square Error (RMSE) and expressed as a percentage of total capacity to keep results in scale. An 11.8% error (178 MW) means the forecast was typically within about twelve percent of full system output over this period.";

const WIND_CHART_TITLE = "24-Hour DEMO Forecast vs. Simulated Actual";

const WIND_CHART_SUBTITLE =
  "Built in Python from ERA5 wind data converted to power using a simplified turbine curve. Accuracy is summarized using Root Mean Square Error (RMSE) and % of capacity (11.8%, 178 MW). Confidence bounds reflect recent error behavior.";

/** Base product scaffold (non-wind can be plain mock) */
const productData: Record<ProductId, any> = {
  "wind-forecasting": {
    name: "Wind Power Forecasting",
    description: WIND_HEADER_PARAGRAPH,
    icon: Wind,
    summaryTiles: [
      { icon: Target, title: "Accuracy (Day-ahead)", value: "11.8%", subtitle: "RMSE 178 MW · demo" },
      { icon: Clock, title: "Update Frequency", value: "15 min", subtitle: "Deterministic export" },
      { icon: TrendingUp, title: "Forecast Horizon", value: "14 days", subtitle: "Hour-by-hour (demo)" },
    ],
    chartData: [],
    parameters: [],
    timescales: [],
    useCases: [
      {
        title: "Day-Ahead Trading",
        description: "Optimize bid strategies with forecast guidance and confidence intervals.",
        example: "Improved bid accuracy and reduced imbalance costs using day-ahead forecast skill.",
      },
      {
        title: "Intraday Optimization",
        description: "Adjust positions as ramps develop and decay to manage exposure and maximize revenue.",
        example: "Better intraday positioning during high-gradient ramp events.",
      },
      {
        title: "Maintenance Planning",
        description: "Target low-production windows to reduce opportunity cost of outages.",
        example: "Maintenance windows aligned with forecast minima.",
      },
    ],
  },

  "temperature-analytics": {
    name: "Temperature Analytics",
    description: "Detailed temperature analysis for energy demand forecasting and grid management.",
    icon: Thermometer,
    summaryTiles: [
      { icon: Target, title: "Accuracy", value: "98.5%", subtitle: "Hourly RMSE" },
      { icon: Clock, title: "Update Frequency", value: "5 min", subtitle: "Continuous refresh" },
      { icon: TrendingUp, title: "Forecast Horizon", value: "30 days", subtitle: "Hour-by-hour" },
    ],
    chartData: [
      { name: "00:00", forecast: 20, actual: 21, lower: 18, upper: 22 },
      { name: "04:00", forecast: 18, actual: 17, lower: 16, upper: 19 },
      { name: "08:00", forecast: 22, actual: 23, lower: 21, upper: 24 },
      { name: "12:00", forecast: 25, actual: 26, lower: 24, upper: 27 },
      { name: "16:00", forecast: 23, actual: 22, lower: 21, upper: 24 },
      { name: "20:00", forecast: 20, actual: 19, lower: 18, upper: 20 },
      { name: "24:00", forecast: 18, actual: 17, lower: 16, upper: 19 },
    ],
    parameters: [
      { name: "Temperature", description: "Ambient temperature measurements and forecasts", unit: "°C" },
      { name: "Humidity", description: "Relative humidity data for load prediction", unit: "%" },
      { name: "Dew Point", description: "Dew point temperature for condensation risk assessment", unit: "°C" },
    ],
    timescales: [
      { label: "Nowcast", value: "0-6 hours", active: true },
      { label: "Day-ahead", value: "6-48 hours", active: true },
      { label: "Week-ahead", value: "2-7 days", active: true },
      { label: "Long-range", value: "7-30 days", active: true },
    ],
    useCases: [],
  },
};

function iconForKpi(idOrTitle?: string) {
  const k = (idOrTitle ?? "").toLowerCase();
  if (k.includes("accuracy")) return Target;
  if (k.includes("update")) return Clock;
  if (k.includes("horizon")) return TrendingUp;
  return Target;
}

function toArray<T>(maybeArray: any): T[] {
  if (Array.isArray(maybeArray)) return maybeArray as T[];
  if (maybeArray && typeof maybeArray === "object") return Object.values(maybeArray) as T[];
  return [];
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return (await res.json()) as T;
}

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();

  // Robust slug support (your routes have changed a few times)
  const slug = (productId ?? "").toLowerCase().trim();
  const isWindSlug = slug === "wind-forecasting" || slug === "wind-power-forecasting" || slug === "wind";
  const pid = (isWindSlug ? "wind-forecasting" : slug) as ProductId;

  const product = productData[pid];

  const [wind, setWind] = useState<WindBundle | null>(null);
  const [windErr, setWindErr] = useState<string | null>(null);
  const [windLoading, setWindLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!isWindSlug) return;

    setWindLoading(true);
    setWindErr(null);

    Promise.all([
      fetchJson<WindSummary>("/data/wind/wind_summary.json"),
      fetchJson<WindTimeseries>("/data/wind/wind_timeseries.json"),
      fetchJson<WindAccuracy>("/data/wind/wind_accuracy.json"),
      fetchJson<WindParameters>("/data/wind/wind_parameters.json"),
    ])
      .then(([summary, timeseries, accuracy, parameters]) => {
        if (!alive) return;
        setWind({ summary, timeseries, accuracy, parameters });
      })
      .catch((e) => {
        if (!alive) return;
        console.error("Wind JSON load failed:", e);
        setWindErr(String(e?.message ?? e));
        setWind(null);
      })
      .finally(() => {
        if (!alive) return;
        setWindLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isWindSlug]);

  // Not found guard
  if (!product) {
    return (
      <PageContainer>
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      </PageContainer>
    );
  }

  const liveProduct = useMemo(() => {
    if (!isWindSlug || !wind) return product;

    // ---- KPIs ----
    const kpis = toArray<{ id?: string; title: string; value: string; subtitle?: string }>(wind.summary?.kpis);
    const summaryTiles =
      kpis.length > 0
        ? kpis.map((k) => ({
            icon: iconForKpi(k.id || k.title),
            title: k.title,
            value: k.value,
            subtitle: k.subtitle,
          }))
        : product.summaryTiles;

    // ---- Timescales (prefer summary.timescales) ----
    const rawTimescales = toArray<any>(wind.parameters?.timescales ?? wind.summary?.timescales ?? []);
    const timescales =
      rawTimescales.length > 0
        ? rawTimescales.map((t: any) => ({
            label: t.label,
            value: t.value ?? `${t.min_h ?? "?"}-${t.max_h ?? "?"} hours`,
            active: t.active ?? true,
          }))
        : product.timescales;

    // ---- Parameters ----
    const paramsArr = toArray<any>(wind.parameters?.parameters);
    const parameters =
      paramsArr.length > 0
        ? paramsArr.map((p: any) => ({
            name: p.name ?? "",
            description: p.description ?? "",
            unit: p.unit ?? "",
          }))
        : product.parameters;

    // ---- Chart data (THIS is the key fix) ----
    // Wind timeseries JSON is: { series: [ { name, ts_utc, forecast, actual, upper, lower }, ... ] }
    const series = toArray<ChartPoint>(wind.timeseries?.series);

    // Sort by ts_utc if present; fallback to stable order as given.
    const sorted =
      series.length > 0
        ? [...series].sort((a, b) => {
            const ta = a.ts_utc ? Date.parse(a.ts_utc) : NaN;
            const tb = b.ts_utc ? Date.parse(b.ts_utc) : NaN;
            if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta - tb;
            return 0;
          })
        : [];

    const chartData = sorted.map((p) => {
  // If we have ts_utc, create a unique X key and a display label
  if (p.ts_utc) {
    const d = new Date(p.ts_utc);
    const day = d.toISOString().slice(0, 10);      // YYYY-MM-DD
    const hhmm = d.toISOString().slice(11, 16);    // HH:MM (UTC)

    return {
      // xKey must be unique per point (avoid repeated "01:00" collision)
      xKey: p.ts_utc,
      // label is what we show on the axis
      name: hhmm,
      // also keep day so we can optionally format ticks
      day,
      forecast: Number(p.forecast ?? 0),
      actual: Number(p.actual ?? 0),
      upper: Number(p.upper ?? 0),
      lower: Number(p.lower ?? 0),
    };
  }

  // Fallback if ts_utc missing
  return {
    xKey: p.name,
    name: p.name,
    day: "",
    forecast: Number(p.forecast ?? 0),
    actual: Number(p.actual ?? 0),
    upper: Number(p.upper ?? 0),
    lower: Number(p.lower ?? 0),
  };
});


    // Debug (keeps you sane during demo wiring)
    // eslint-disable-next-line no-console
    console.log("[Wind] series:", series.length, "chartData:", chartData.length, "maxForecast:", Math.max(...chartData.map(d => d.forecast), 0));

    return {
      ...product,
      description: WIND_HEADER_PARAGRAPH,
      summaryTiles,
      timescales,
      parameters,
      chartData,
      _windSeriesCount: series.length,
    };
  }, [isWindSlug, wind, product]);

  const Icon = liveProduct.icon;
  const isWind = pid === "wind-forecasting";

  return (
    <PageContainer>
      {/* Header */}
      <section className="container mx-auto px-6 py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
            <Icon className="w-8 h-8 text-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-semibold text-foreground mb-3">{liveProduct.name}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {isWind ? WIND_HEADER_PARAGRAPH : liveProduct.description}
            </p>
          </div>
        </div>
      </section>

      {/* Wind status (helps you validate demo live) */}
      {isWind && (
        <section className="container mx-auto px-6 pb-2">
          {windLoading && <div className="text-sm text-muted-foreground">Loading wind demo JSON…</div>}
          {!windLoading && windErr && (
            <div className="text-sm text-red-500">
              Wind JSON failed to load: {windErr}
              <div className="text-muted-foreground mt-1">Expected: /data/wind/wind_timeseries.json</div>
            </div>
          )}
          {!windLoading && !windErr && (
            <div className="text-xs text-muted-foreground">
              Loaded wind series points: {String((liveProduct as any)._windSeriesCount ?? "n/a")}
            </div>
          )}
        </section>
      )}

      {/* Summary Tiles */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {liveProduct.summaryTiles.map((tile: any, idx: number) => (
            <SummaryTile key={idx} {...tile} />
          ))}
        </div>
      </section>

      {/* Temperature special dashboard */}
      {pid === "temperature-analytics" && (
        <section className="container mx-auto px-6 py-8">
          <TemperatureAnalyticsDashboard />
        </section>
      )}

      {/* Wind Chart */}
      {pid !== "temperature-analytics" && (
        <section className="container mx-auto px-6 py-8">
          <InteractiveChart
            type="line"
            data={liveProduct.chartData}
            dataKeys={[
              { key: "forecast", color: "#2563eb", name: "Forecast" },
              { key: "actual", color: "#10b981", name: "Actual" },
              { key: "upper", color: "#e5e7eb", name: "Upper Bound" },
              { key: "lower", color: "#e5e7eb", name: "Lower Bound" },
            ]}
            title={isWind ? WIND_CHART_TITLE : "24-Hour Forecast vs. Actual"}
            subtitle={isWind ? WIND_CHART_SUBTITLE : "Real-time comparison showing forecast accuracy and confidence intervals"}
          />
        </section>
      )}

      {/* Parameters + Timescales */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ParametersSection parameters={liveProduct.parameters ?? []} />
          </div>
          <div>
            <TimescaleCoverage timescales={liveProduct.timescales ?? []} />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-6 py-8 pb-24">
        <UseCaseNarrative useCases={liveProduct.useCases ?? []} />
      </section>
    </PageContainer>
  );
}
