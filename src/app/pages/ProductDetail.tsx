import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageContainer } from "@/app/components/PageContainer";
import { SummaryTile } from "@/app/components/SummaryTile";
import { InteractiveChart } from "@/app/components/InteractiveChart";
import { ParametersSection } from "@/app/components/ParametersSection";
import { TimescaleCoverage } from "@/app/components/TimescaleCoverage";
import { UseCaseNarrative } from "@/app/components/UseCaseNarrative";
import { Wind, Target, Clock, TrendingUp, ChevronLeft } from "lucide-react";
import { loadWindJson } from "@/app/data/windLoader";

// --------------------
// Mock data (fallback when demo JSON is missing)
// --------------------
const productData = {
  "wind-forecasting": {
    name: "Wind Power Forecasting",
    description:
      "This chart compares a 24-hour wind power forecast against observed generation. The forecast is produced in Python using ERA5 reanalysis wind data, where wind speed is derived from model components and converted to power using a simplified turbine power curve and fixed nameplate capacity. The forecast is intentionally labeled as a demo to showcase methodology rather than live operations. Accuracy is measured using Root Mean Square Error (RMSE) and expressed as a percentage of total capacity to keep results in scale. An 11.8% error (178 MW) means the forecast was typically within about twelve percent of full system output over this period.",
    icon: Wind,
    summaryTiles: [
      { icon: Target, title: "Accuracy", value: "95.2%", subtitle: "Day-ahead RMSE" },
      { icon: Clock, title: "Update Frequency", value: "15 min", subtitle: "Continuous refresh" },
      { icon: TrendingUp, title: "Forecast Horizon", value: "14 days", subtitle: "Hour-by-hour" },
    ],
    chartData: [
      { name: "00:00", forecast: 450, actual: 445, lower: 420, upper: 480 },
      { name: "04:00", forecast: 520, actual: 530, lower: 490, upper: 550 },
      { name: "08:00", forecast: 680, actual: 670, lower: 650, upper: 710 },
      { name: "12:00", forecast: 750, actual: 755, lower: 720, upper: 780 },
      { name: "16:00", forecast: 820, actual: 810, lower: 790, upper: 850 },
      { name: "20:00", forecast: 650, actual: 660, lower: 620, upper: 680 },
      { name: "24:00", forecast: 480, actual: 475, lower: 450, upper: 510 },
    ],
    parameters: [
      { name: "Wind Speed", description: "Hub-height wind velocity measurements and forecasts", unit: "m/s" },
      { name: "Wind Direction", description: "Directional data for wake effects and turbine optimization", unit: "degrees" },
      { name: "Power Output", description: "Site-specific generation forecasts based on turbine curves", unit: "MW" },
      { name: "Gust Factor", description: "Short-term variability and extreme wind event prediction", unit: "m/s" },
      { name: "Air Density", description: "Temperature and pressure corrections for power calculations", unit: "kg/m³" },
    ],
    timescales: [
      { label: "Nowcast", value: "0-6 hours", active: true },
      { label: "Day-ahead", value: "6-48 hours", active: true },
      { label: "Week-ahead", value: "2-7 days", active: true },
      { label: "Long-range", value: "7-14 days", active: true },
    ],
    useCases: [
      {
        title: "Day-Ahead Trading",
        description: "Optimize bid strategies with accurate generation forecasts and confidence intervals.",
        example: "A 500MW wind farm improved bid accuracy by 12%, reducing imbalance costs.",
      },
      {
        title: "Intraday Optimization",
        description: "Real-time adjustments based on changing weather conditions to maximize revenue.",
        example: "Captured $2.3M in additional revenue through improved intraday positioning.",
      },
      {
        title: "Maintenance Planning",
        description: "Schedule turbine maintenance during low-wind periods to minimize lost generation.",
        example: "Reduced maintenance-related downtime by 35% with optimized scheduling.",
      },
    ],
  },
} as const;

type ProductId = keyof typeof productData;

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const pid = (productId || "") as ProductId;
  const product = productData[pid];

  const isWind = pid === "wind-forecasting";

  // Wind demo JSON state
  const [windData, setWindData] = useState<any>(null);
  const [windError, setWindError] = useState<string | null>(null);
  const [windLoading, setWindLoading] = useState<boolean>(false);

  useEffect(() => {
    let alive = true;

    if (!isWind) return;

    setWindLoading(true);
    setWindError(null);

    loadWindJson()
      .then((d) => {
        if (!alive) return;
        setWindData(d);
      })
      .catch((e) => {
        if (!alive) return;
        console.error("Failed to load wind JSON", e);
        setWindError(String(e?.message || e));
        setWindData(null);
      })
      .finally(() => {
        if (!alive) return;
        setWindLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isWind]);

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

  // Build a "live" product view for wind if JSON is present; otherwise use mock.
  const liveProduct = useMemo(() => {
    if (!isWind || !windData) return product;

    const iconFor = (idOrTitle: string) => {
      const k = (idOrTitle || "").toLowerCase();
      if (k.includes("accuracy")) return Target;
      if (k.includes("update")) return Clock;
      if (k.includes("horizon")) return TrendingUp;
      return Target;
    };

    const summary = windData.summary || {};
    const ts = windData.timeseries || {};
    const params = windData.parameters || {};

    const summaryTiles = (summary.kpis || []).map((kpi: any) => ({
      icon: iconFor(kpi.id || kpi.title),
      title: kpi.title,
      value: kpi.value,
      subtitle: kpi.subtitle,
    }));

    // Accept a few possible keys for the series to make the export layer flexible.
    const series = ts.series || ts.wind_chart_24h || ts.chart_24h || [];
    const chartData = series.map((p: any) => ({
      name: p.name,
      forecast: p.forecast,
      actual: p.actual,
      upper: p.upper,
      lower: p.lower,
    }));

    const parameters = (params.parameters || []).map((p: any) => ({
      name: p.name,
      description: p.description,
      unit: p.unit,
    }));

    // Prefer parameters.timescales; fall back to summary.timescales if needed.
    const rawTimescales = params.timescales || summary.timescales || [];
    const timescales = rawTimescales.map((t: any) => ({
      label: t.label,
      value: t.value ?? `${t.min_h ?? "?"}-${t.max_h ?? "?"} hours`,
      active: t.active ?? true,
    }));

    return {
      ...product,
      summaryTiles: summaryTiles.length ? summaryTiles : product.summaryTiles,
      chartData: chartData.length ? chartData : product.chartData,
      parameters: parameters.length ? parameters : product.parameters,
      timescales: timescales.length ? timescales : product.timescales,
      // useCases remain mock narrative (demo-safe)
    };
  }, [isWind, windData, product]);

  const Icon = liveProduct.icon;

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
            <p className="text-lg text-muted-foreground max-w-3xl">{liveProduct.description}</p>
          </div>
        </div>
      </section>

      {/* Wind JSON status banner (only for wind) */}
      {isWind && (
        <section className="container mx-auto px-6 pb-2">
          {windLoading && (
            <div className="text-sm text-muted-foreground">Loading wind demo JSON…</div>
          )}
          {!windLoading && windError && (
            <div className="text-sm text-red-500">
              Wind JSON failed to load: {windError}
              <div className="text-muted-foreground mt-1">
                Check: /data/wind/wind_summary.json
              </div>
            </div>
          )}
        </section>
      )}

      {/* Executive Summary Tiles */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {liveProduct.summaryTiles.map((tile: any, index: number) => (
            <SummaryTile key={index} {...tile} />
          ))}
        </div>
      </section>

      {/* Interactive Chart */}
      <section className="container mx-auto px-6 py-8">
        <InteractiveChart
          type="line"
          data={liveProduct.chartData as any}
          dataKeys={[
            { key: "forecast", color: "#3b82f6", name: "Forecast" },
            { key: "actual", color: "#10b981", name: "Actual" },
            { key: "upper", color: "#e5e7eb", name: "Upper Bound" },
            { key: "lower", color: "#e5e7eb", name: "Lower Bound" },
          ]}
          title="24-Hour DEMO Forecast vs. Simulated Actual"
          subtitle="Built in Python from ERA5 wind data converted to power using a simplified turbine curve. Accuracy is summarized using Root Mean Square Error (RMSE) and % of capacity (11.8%, 178 MW). Confidence bounds reflect recent error behavior."
        />
      </section>

      {/* Parameters and Timescale */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ParametersSection parameters={liveProduct.parameters as any} />
          </div>
          <div>
            <TimescaleCoverage timescales={liveProduct.timescales as any} />
          </div>
        </div>
      </section>

      {/* Use Case Narrative */}
      <section className="container mx-auto px-6 py-8 pb-24">
        <UseCaseNarrative useCases={(liveProduct as any).useCases} />
      </section>
    </PageContainer>
  );
}
