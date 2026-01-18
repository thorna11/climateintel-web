import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DivergenceLoadImpact } from './DivergenceLoadImpact';

const degreeDayData24h = [
  { range: 'Well Below Normal', hdd: 8, cdd: 5 },
  { range: 'Below Normal', hdd: 22, cdd: 18 },
  { range: 'Near Normal', hdd: 48, cdd: 42 },
  { range: 'Above Normal', hdd: 38, cdd: 40 },
  { range: 'Well Above Normal', hdd: 18, cdd: 25 },
];

const degreeDayData48h = [
  { range: 'Well Below Normal', hdd: 12, cdd: 8 },
  { range: 'Below Normal', hdd: 28, cdd: 22 },
  { range: 'Near Normal', hdd: 45, cdd: 38 },
  { range: 'Above Normal', hdd: 42, cdd: 44 },
  { range: 'Well Above Normal', hdd: 25, cdd: 30 },
];

const degreeDayData72h = [
  { range: 'Well Below Normal', hdd: 15, cdd: 10 },
  { range: 'Below Normal', hdd: 25, cdd: 20 },
  { range: 'Near Normal', hdd: 42, cdd: 35 },
  { range: 'Above Normal', hdd: 45, cdd: 48 },
  { range: 'Well Above Normal', hdd: 28, cdd: 35 },
];

const windSolarUncertaintyData = [
  { time: '00:00', windUncertainty: 8, solarUncertainty: 2 },
  { time: '03:00', windUncertainty: 12, solarUncertainty: 3 },
  { time: '06:00', windUncertainty: 15, solarUncertainty: 8 },
  { time: '09:00', windUncertainty: 18, solarUncertainty: 15 },
  { time: '12:00', windUncertainty: 22, solarUncertainty: 20 },
  { time: '15:00', windUncertainty: 20, solarUncertainty: 18 },
  { time: '18:00', windUncertainty: 16, solarUncertainty: 12 },
  { time: '21:00', windUncertainty: 10, solarUncertainty: 5 },
];

type TabId = 'degree-day' | 'model-divergence' | 'wind-solar';
type MetricType = 'temperature' | 'wind' | 'solar' | 'load';

interface RiskAnalyticsTabsProps {
  selectedLocation?: string;
}

export function RiskAnalyticsTabs({ selectedLocation = 'Global' }: RiskAnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('degree-day');
  const [degreeDayTimeRange, setDegreeDayTimeRange] = useState<'24' | '48' | '72'>('72');
  
  // Model Divergence State
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');
  const [visibleLines, setVisibleLines] = useState({
    observed: true,
    ecmwf: true,
    gfs: true,
    icon: true,
    ukmet: true,
  });

  const tabs = [
    { id: 'degree-day' as TabId, label: 'Degree-Day Risk' },
    { id: 'model-divergence' as TabId, label: 'Model Divergence' },
    { id: 'wind-solar' as TabId, label: 'Wind & Solar Uncertainty' },
  ];

  // Metric configuration
  const metricConfig: Record<MetricType, { label: string; unit: string; yAxisLabel: string }> = {
    temperature: { label: 'Temperature', unit: '°C', yAxisLabel: 'Temperature (°C)' },
    wind: { label: 'Wind Speed', unit: 'kt', yAxisLabel: 'Wind Speed (kt)' },
    solar: { label: 'Solar Irradiance', unit: 'W/m²', yAxisLabel: 'Solar Irradiance (W/m²)' },
    load: { label: 'Load', unit: 'MW', yAxisLabel: 'Load (MW)' },
  };

  // Generate 97-hour model divergence data (-48h to +48h)
  const modelDivergence97Data = useMemo(() => {
    const data = [];
    
    // Generate data points every 6 hours
    for (let hour = -48; hour <= 48; hour += 6) {
      const timeLabel = hour === 0 ? 'Now' : `${hour > 0 ? '+' : ''}${hour}h`;
      
      // Base value varies by metric
      const baseValue = selectedMetric === 'temperature' ? 18 + Math.sin(hour / 24) * 8 :
                       selectedMetric === 'wind' ? 15 + Math.abs(Math.sin(hour / 12)) * 10 :
                       selectedMetric === 'solar' ? Math.max(0, 300 + Math.sin(hour / 6) * 200) :
                       800 + Math.sin(hour / 24) * 100; // load
      
      const entry: any = {
        hour,
        timeLabel,
      };
      
      // Observed data only for past
      if (hour <= 0) {
        entry.observed = baseValue + (Math.random() - 0.5) * 2;
      }
      
      // Model forecasts - add variance
      entry.ecmwf = baseValue + (Math.random() - 0.5) * 3;
      entry.gfs = baseValue + (Math.random() - 0.5) * 6;
      entry.icon = baseValue + (Math.random() - 0.5) * 4;
      entry.ukmet = baseValue + (Math.random() - 0.5) * 4;
      
      data.push(entry);
    }
    
    return data;
  }, [selectedMetric]);

  // Select data based on time range
  const getDegreeDayData = () => {
    switch (degreeDayTimeRange) {
      case '24': return degreeDayData24h;
      case '48': return degreeDayData48h;
      case '72': return degreeDayData72h;
      default: return degreeDayData72h;
    }
  };

  const getWindowLabel = () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + parseInt(degreeDayTimeRange) * 60 * 60 * 1000);
    return `Window: ${now.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}–${endTime.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} local`;
  };

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  // Custom tooltip for model divergence
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const observedValue = dataPoint.observed;
      
      return (
        <div className="bg-card border border-neutral-border rounded-lg shadow-lg p-3 text-xs">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {observedValue !== undefined && (
            <div className="flex justify-between gap-4 mb-1">
              <span className="text-muted-foreground">Observed:</span>
              <span className="font-medium text-foreground">{observedValue.toFixed(1)} {metricConfig[selectedMetric].unit}</span>
            </div>
          )}
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === 'observed') return null;
            const delta = observedValue !== undefined ? entry.value - observedValue : null;
            return (
              <div key={index} className="flex justify-between gap-4">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-medium" style={{ color: entry.color }}>
                  {entry.value.toFixed(1)} {metricConfig[selectedMetric].unit}
                  {delta !== null && (
                    <span className="text-muted-foreground text-[10px] ml-1">
                      ({delta > 0 ? '+' : ''}{delta.toFixed(1)})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-neutral-border rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-neutral-border bg-neutral-bg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-card'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Degree-Day Risk */}
        {activeTab === 'degree-day' && (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Degree-Day Risk Distribution
                </h3>
                <p className="text-sm text-muted-foreground">
                  Probability of HDD/CDD anomalies relative to normal baseline
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Values shown relative to normal baseline.
                </p>
              </div>

              {/* Timeline Controls */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                  {['24', '48', '72'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDegreeDayTimeRange(range as '24' | '48' | '72')}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        degreeDayTimeRange === range
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Next {range}h
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{getWindowLabel()}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDegreeDayData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: string) => {
                    const label = name === 'hdd' 
                      ? 'HDD (Heating Degree Days)' 
                      : 'CDD (Cooling Degree Days)';
                    return [`${value}%`, label];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="hdd" fill="#00a758" name="HDD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cdd" fill="#0078a0" name="CDD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-accent rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">HDD Anomaly</p>
                <p className="text-2xl font-semibold text-foreground">+1.2 vs normal</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-risk-medium" />
                  <span className="text-xs text-risk-medium">Above Normal</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Higher heating demand risk
                </p>
              </div>
              <div className="bg-accent rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">CDD Anomaly</p>
                <p className="text-2xl font-semibold text-foreground">-0.3 vs normal</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-risk-low" />
                  <span className="text-xs text-risk-low">Below Normal</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Lower cooling demand risk
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Model Divergence - 97-hour chart */}
        {activeTab === 'model-divergence' && (
          <div>
            {/* Header with controls */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Model Divergence — 97-Hour Window
                </h3>
                <p className="text-sm text-muted-foreground">
                  48h history + current + 48h forecast • Location: {selectedLocation}
                </p>
              </div>

              {/* Metric Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Metric:</span>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                  className="px-3 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="temperature">Temperature</option>
                  <option value="wind">Wind Speed</option>
                  <option value="solar">Solar Irradiance</option>
                  <option value="load">Load</option>
                </select>
              </div>
            </div>

            {/* Legend with toggles */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-neutral-border">
              <span className="text-xs text-muted-foreground">Show/Hide:</span>
              {[
                { key: 'observed' as const, label: 'Observed', color: '#1f2937' },
                { key: 'ecmwf' as const, label: 'ECMWF', color: '#00a758' },
                { key: 'gfs' as const, label: 'GFS', color: '#d97706' },
                { key: 'icon' as const, label: 'ICON', color: '#0078a0' },
                { key: 'ukmet' as const, label: 'UKMET', color: '#8b5cf6' },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => toggleLine(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    visibleLines[key]
                      ? 'bg-accent border border-primary/30'
                      : 'bg-neutral-bg border border-neutral-border opacity-50'
                  }`}
                >
                  <div
                    className="w-3 h-0.5 rounded"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={modelDivergence97Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
                <XAxis
                  dataKey="timeLabel"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '11px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                  label={{ value: metricConfig[selectedMetric].yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)', style: { fontSize: '11px' } }}
                />
                
                {/* "Now" reference line */}
                <ReferenceLine
                  x="Now"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: 'Now', position: 'top', fill: '#f59e0b', fontSize: 11, fontWeight: 600 }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {/* Observed line - only for past */}
                {visibleLines.observed && (
                  <Line
                    type="monotone"
                    dataKey="observed"
                    stroke="#1f2937"
                    strokeWidth={3}
                    dot={false}
                    name="Observed"
                    connectNulls={false}
                  />
                )}
                
                {/* Model lines */}
                {visibleLines.ecmwf && (
                  <Line
                    type="monotone"
                    dataKey="ecmwf"
                    stroke="#00a758"
                    strokeWidth={2}
                    dot={false}
                    name="ECMWF"
                  />
                )}
                {visibleLines.gfs && (
                  <Line
                    type="monotone"
                    dataKey="gfs"
                    stroke="#d97706"
                    strokeWidth={2}
                    dot={false}
                    name="GFS"
                  />
                )}
                {visibleLines.icon && (
                  <Line
                    type="monotone"
                    dataKey="icon"
                    stroke="#0078a0"
                    strokeWidth={2}
                    dot={false}
                    name="ICON"
                  />
                )}
                {visibleLines.ukmet && (
                  <Line
                    type="monotone"
                    dataKey="ukmet"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    name="UKMET"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-card border border-neutral-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Max Model Spread (+48h)</p>
                <p className="text-xl font-semibold text-foreground">8.2 {metricConfig[selectedMetric].unit}</p>
                <p className="text-xs text-muted-foreground mt-1">GFS highest, ICON lowest</p>
              </div>
              <div className="bg-risk-medium/10 border border-risk-medium/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Divergence Trend</p>
                <p className="text-xl font-semibold text-risk-medium">Increasing</p>
                <p className="text-xs text-muted-foreground mt-1">Monitor after hour +24</p>
              </div>
              <div className="bg-green-muted border border-primary/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Obs-Model Bias</p>
                <p className="text-xl font-semibold text-foreground">-0.4 {metricConfig[selectedMetric].unit}</p>
                <p className="text-xs text-muted-foreground mt-1">Models running slightly warm</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-neutral-border"></div>

            {/* Divergence → Load Impact Section */}
            <DivergenceLoadImpact selectedLocation={selectedLocation} />
          </div>
        )}

        {/* Wind & Solar Uncertainty */}
        {activeTab === 'wind-solar' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground mb-1">
                Wind & Solar Uncertainty
              </h3>
              <p className="text-sm text-muted-foreground">
                Ramp window and irradiance uncertainty by hour
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={windSolarUncertaintyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} label={{ value: 'Uncertainty (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="windUncertainty"
                  stroke="#00a758"
                  strokeWidth={2}
                  dot={{ fill: '#00a758', r: 4 }}
                  name="Wind Uncertainty"
                />
                <Line
                  type="monotone"
                  dataKey="solarUncertainty"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ fill: '#d97706', r: 4 }}
                  name="Solar Uncertainty"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-green-muted border border-primary/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Peak Wind Uncertainty</p>
                <p className="text-xl font-semibold text-foreground">22% @ 12:00</p>
                <p className="text-xs text-muted-foreground mt-1">±150 MW ramp potential</p>
              </div>
              <div className="bg-risk-medium/10 border border-risk-medium/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Peak Solar Uncertainty</p>
                <p className="text-xl font-semibold text-foreground">20% @ 12:00</p>
                <p className="text-xs text-muted-foreground mt-1">±80 MW variability</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}