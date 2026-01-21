import React, { useState } from 'react';
import { PageContainer } from '@/app/components/PageContainer';
import { InteractiveChart } from '@/app/components/InteractiveChart';
import { RiskBadge, RiskLevel } from '@/app/components/RiskBadge';
import { WeatherRiskMatrix } from '@/app/components/WeatherRiskMatrix';
import { AlertsBanner } from '@/app/components/AlertsBanner';
import { MeteorologistDiscussion } from '@/app/components/MeteorologistDiscussion';
import { RiskAnalyticsTabs } from '@/app/components/RiskAnalyticsTabs';
import { GlobalLocationViewer } from '@/app/components/GlobalLocationViewer';
import { FindLocation } from '@/app/components/FindLocation';
import { Wind, Sun, Droplets, Thermometer, Download } from 'lucide-react';

// Mock real-time data
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 30 * 60000); // 30-min intervals
    // Format as UTC "Z" time (e.g., 03Z, 14Z, 23Z)
    const utcHour = time.getUTCHours();
    const timeLabel = `${utcHour.toString().padStart(2, '0')}Z`;
    data.push({
      name: timeLabel,
      windPower: 500 + Math.random() * 300 + Math.sin(i / 6) * 200,
      solarPower: Math.max(0, 400 * Math.sin((i / 48) * Math.PI)),
      demand: 800 + Math.random() * 200,
    });
  }
  return data;
};

export function Demo() {
  const [selectedLocation, setSelectedLocation] = useState('Seoul');
  const [favorites, setFavorites] = useState(['Beijing', 'Seoul', 'Osaka', 'Tokyo', 'Shanghai', 'Chongqing', 'Guangzhou']);
  const [activeTab, setActiveTab] = useState<'locations' | 'find-location'>('locations');
  const [selectedMetric, setSelectedMetric] = useState('wind');
  
  const chartData = generateTimeSeriesData();

  const handleAddFavorite = (location: string) => {
    if (!favorites.includes(location)) {
      setFavorites([...favorites, location]);
    }
  };

  const metrics = [
    { id: 'wind', name: 'Wind Power', icon: Wind, value: '652 MW', risk: 'low' as RiskLevel },
    { id: 'solar', name: 'Solar Power', icon: Sun, value: '234 MW', risk: 'medium' as RiskLevel },
    { id: 'temperature', name: 'Temperature', icon: Thermometer, value: '18°C', risk: 'low' as RiskLevel },
    { id: 'precipitation', name: 'Precipitation', icon: Droplets, value: '0.2 mm', risk: 'low' as RiskLevel },
  ];

  return (
    <PageContainer>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <section className="bg-gradient-to-br from-accent to-card border-b border-neutral-border">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-semibold text-foreground mb-3">
                    Interactive Weather Risk Dashboard
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Real-time monitoring and ensemble-aware forecasting for trading and operations. 
                    Updates every 15 minutes.
                  </p>
                </div>

                {/* Compact Controls */}
                <div className="flex items-center ml-8">
                  {/* Export Button */}
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
                <AlertsBanner selectedLocation={selectedLocation} />

                {/* Meteorologist Forecast Discussion */}
                <MeteorologistDiscussion selectedLocation={selectedLocation} />

                {/* KPI Metrics Row */}
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

                {/* 48-Hour Generation & Demand Forecast - CENTERED & PROMINENT */}
                <div className="max-w-5xl mx-auto">
                  <InteractiveChart
                    type="area"
                    data={chartData}
                    dataKeys={[
                      { key: 'windPower', color: '#00a758', name: 'Wind Power (MW)' },
                      { key: 'solarPower', color: '#d97706', name: 'Solar Power (MW)' },
                      { key: 'demand', color: '#6b7280', name: 'Demand (MW)' },
                    ]}
                    title="48-Hour Generation & Demand Forecast"
                    subtitle="Updated 3 minutes ago"
                  />
                </div>

                {/* Risk Analytics Tabs */}
                <RiskAnalyticsTabs selectedLocation={selectedLocation} />

                {/* High-Impact Weather Risk Matrix - BOTTOM, FULL WIDTH */}
                <WeatherRiskMatrix selectedLocation={selectedLocation} />

                {/* Demo Data Note */}
                <div className="max-w-5xl mx-auto">
                  <div className="p-5 bg-accent rounded-lg border border-primary/10">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Demo Data:</strong> This dashboard displays 
                      simulated data for demonstration purposes. Production systems provide live data feeds, 
                      custom alert thresholds, and API integration.
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

export default Demo;