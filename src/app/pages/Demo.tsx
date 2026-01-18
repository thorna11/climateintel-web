import React, { useEffect, useMemo, useState } from 'react';
import { loadWindBundle } from '@/services/windData';
import { PageContainer } from '@/app/components/PageContainer';
import { InteractiveChart } from '@/app/components/InteractiveChart';
import { RiskBadge, RiskLevel } from '@/app/components/RiskBadge';
import { WeatherRiskMatrix } from '@/app/components/WeatherRiskMatrix';
import { AlertsBanner } from '@/app/components/AlertsBanner';
import { MeteorologistDiscussion } from '@/app/components/MeteorologistDiscussion';
import { RiskAnalyticsTabs } from '@/app/components/RiskAnalyticsTabs';
import { GlobalLocationViewer } from '@/app/components/GlobalLocationViewer';
import { FindLocation } from '@/app/components/FindLocation';
import { Wind, Sun, Thermometer, Download } from 'lucide-react';

export function Demo() {
  const [selectedLocation, setSelectedLocation] = useState('Hong Kong');
  const [favorites, setFavorites] = useState(['Hong Kong', 'Seoul', 'Singapore', 'Sydney', 'Tokyo']);
  const [activeTab, setActiveTab] = useState<'locations' | 'find-location'>('locations');
  const [selectedMetric, setSelectedMetric] = useState('wind');

  const [wind, setWind] = useState<null | {
    summary: any;
    timeseries: any;
    accuracy: any;
    parameters: any;
  }>(null);

  const [windErr, setWindErr] = useState<string | null>(null);

  useEffect(() => {
    loadWindBundle()
      .then(setWind)
      .catch((e) => setWindErr(String(e?.message ?? e)));
  }, []);

  const chartData = useMemo(() => {
    const series = wind?.timeseries?.series ?? [];
    return series.map((p: any) => ({
      name: p.name,
      forecast: p.forecast,
      actual: p.actual,
      upper: p.upper,
      lower: p.lower,
    }));
  }, [wind]);

  const handleAddFavorite = (location: string) => {
    if (!favorites.includes(location)) {
      setFavorites([...favorites, location]);
    }
  };

  const metrics = useMemo(() => {
    const kpis = wind?.summary?.kpis ?? [];
    const iconById: Record<string, any> = {
      accuracy: Wind,
      update_freq: Thermometer,
      horizon: Sun,
    };

    return kpis.map((k: any) => ({
      id: k.id,
      name: k.title,
      icon: iconById[k.id] ?? Wind,
      value: k.value,
      risk: 'low' as RiskLevel,
    }));
  }, [wind]);

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <section className="bg-gradient-to-br from-accent to-card border-b border-neutral-border">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <button
                      className="hover:underline"
                      onClick={() => {
                        // If you have routing, replace this with navigate('/products')
                        window.history.back();
                      }}
                    >
                      ← Back to Products
                    </button>
                  </div>

                  <h1 className="text-4xl font-semibold text-foreground mb-3">
                    Wind Power Forecasting
                  </h1>

                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    This chart compares a 24-hour wind power forecast against observed generation. The forecast is produced in Python
                    using ERA5 reanalysis wind data, where wind speed is derived from model components and converted to power using a
                    simplified turbine power curve and fixed nameplate capacity. The forecast is intentionally labeled as a demo to
                    showcase methodology rather than live operations. Accuracy is measured using Root Mean Square Error (RMSE) and
                    expressed as a percentage of total capacity to keep results in scale. An 11.8% error (178 MW) means the forecast
                    was typically within about twelve percent of full system output over this period.
                  </p>
                </div>

                {/* Compact Controls */}
                <div className="flex items-center ml-8">
                  <button className="px-4 py-2 bg-card border border-neutral-border rounded-lg text-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Global Location Viewer */}
              <GlobalLocationViewer
                selectedLocation={selectedLocation}
                favorites={favorites}
                onLocationChange={setSelectedLocation}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === 'locations' ? (
              <>
                {/* Active Alerts */}
                <AlertsBanner />

                {windErr && (
                  <div className="max-w-5xl mx-auto p-4 border rounded-lg text-sm">
                    Wind JSON load failed: {windErr}
                  </div>
                )}

                {!wind && !windErr && (
                  <div className="max-w-5xl mx-auto p-4 border rounded-lg text-sm text-muted-foreground">
                    Loading wind data…
                  </div>
                )}

                {/* Meteorologist Forecast Discussion */}
                <MeteorologistDiscussion selectedLocation={selectedLocation} />

                {/* KPI Metrics Row */}
                {metrics.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {metrics.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <button
                          key={metric.id}
                          onClick={() => setSelectedMetric(metric.id)}
                          className={`text-left bg-card border rounded-lg p-5 transition-all ${
                            selectedMetric === metric.id
                              ? 'border-primary shadow-lg ring-2 ring-primary/20'
                              : 'border-neutral-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <RiskBadge level={metric.risk} />
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{metric.name}</p>
                          <p className="text-xl font-semibold text-foreground">{metric.value}</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 24-Hour Forecast vs. Simulated Actual */}
                <div className="max-w-5xl mx-auto space-y-2">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      24-Hour DEMO Forecast vs. Simulated Actual
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Built in Python from ERA5 wind data converted to power using a simplified turbine curve. Accuracy is summarized using
                      Root Mean Square Error (RMSE) and % of capacity (11.8%, 178 MW). Confidence bounds reflect recent error behavior.
                    </p>
                  </div>

                  <InteractiveChart
                    type="area"
                    data={chartData}
                    dataKeys={[
                      { key: 'forecast', color: '#00a758', name: 'Forecast (MW)' },
                      { key: 'actual', color: '#6b7280', name: 'Actual (MW)' },
                      { key: 'upper', color: '#94a3b8', name: 'Upper (MW)' },
                      { key: 'lower', color: '#94a3b8', name: 'Lower (MW)' },
                    ]}
                    title={wind?.timeseries?.chart?.title ?? 'Forecast vs Actual'}
                    subtitle={`Interval ${wind?.timeseries?.chart?.interval_minutes ?? 60} min · Lead ${wind?.timeseries?.chart?.lead_hours ?? 0}h`}
                  />
                </div>

                {/* Risk Analytics Tabs */}
                <RiskAnalyticsTabs selectedLocation={selectedLocation} />

                {/* High-Impact Weather Risk Matrix */}
                <WeatherRiskMatrix selectedLocation={selectedLocation} />

                {/* Data Source Note */}
                <div className="max-w-5xl mx-auto">
                  <div className="p-5 bg-accent rounded-lg border border-primary/10">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Data Source:</strong> This dashboard is currently powered by local JSON feeds
                      served from <code>/data/wind</code>. Production systems will use live data feeds, custom alert thresholds, and API integration.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Find Location Panel */}
                <FindLocation
                  selectedLocation={selectedLocation}
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onLocationChange={setSelectedLocation}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
