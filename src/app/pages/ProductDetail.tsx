import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '@/app/components/PageContainer';
import { SummaryTile } from '@/app/components/SummaryTile';
import { InteractiveChart } from '@/app/components/InteractiveChart';
import { ParametersSection } from '@/app/components/ParametersSection';
import { TimescaleCoverage } from '@/app/components/TimescaleCoverage';
import { UseCaseNarrative } from '@/app/components/UseCaseNarrative';
import { TemperatureAnalyticsDashboard } from '@/app/components/TemperatureAnalyticsDashboard';
import { Wind, Target, Clock, TrendingUp, ChevronLeft, Thermometer } from 'lucide-react';

// Mock data - would come from API in production
const productData = {
  'wind-forecasting': {
    name: 'Wind Power Forecasting',
    description: 'High-resolution wind speed and power generation forecasts optimized for energy trading and operations.',
    icon: Wind,
    summaryTiles: [
      { icon: Target, title: 'Accuracy', value: '95.2%', subtitle: 'Day-ahead RMSE' },
      { icon: Clock, title: 'Update Frequency', value: '15 min', subtitle: 'Continuous refresh' },
      { icon: TrendingUp, title: 'Forecast Horizon', value: '14 days', subtitle: 'Hour-by-hour' },
    ],
    chartData: [
      { name: '00:00', forecast: 450, actual: 445, lower: 420, upper: 480 },
      { name: '04:00', forecast: 520, actual: 530, lower: 490, upper: 550 },
      { name: '08:00', forecast: 680, actual: 670, lower: 650, upper: 710 },
      { name: '12:00', forecast: 750, actual: 755, lower: 720, upper: 780 },
      { name: '16:00', forecast: 820, actual: 810, lower: 790, upper: 850 },
      { name: '20:00', forecast: 650, actual: 660, lower: 620, upper: 680 },
      { name: '24:00', forecast: 480, actual: 475, lower: 450, upper: 510 },
    ],
    parameters: [
      { name: 'Wind Speed', description: 'Hub-height wind velocity measurements and forecasts', unit: 'm/s' },
      { name: 'Wind Direction', description: 'Directional data for wake effects and turbine optimization', unit: 'degrees' },
      { name: 'Power Output', description: 'Site-specific generation forecasts based on turbine curves', unit: 'MW' },
      { name: 'Gust Factor', description: 'Short-term variability and extreme wind event prediction', unit: 'm/s' },
      { name: 'Air Density', description: 'Temperature and pressure corrections for power calculations', unit: 'kg/m³' },
    ],
    timescales: [
      { label: 'Nowcast', value: '0-6 hours', active: true },
      { label: 'Day-ahead', value: '6-48 hours', active: true },
      { label: 'Week-ahead', value: '2-7 days', active: true },
      { label: 'Long-range', value: '7-14 days', active: true },
    ],
    useCases: [
      {
        title: 'Day-Ahead Trading',
        description: 'Optimize bid strategies with accurate generation forecasts and confidence intervals.',
        example: 'A 500MW wind farm improved bid accuracy by 12%, reducing imbalance costs.'
      },
      {
        title: 'Intraday Optimization',
        description: 'Real-time adjustments based on changing weather conditions to maximize revenue.',
        example: 'Captured $2.3M in additional revenue through improved intraday positioning.'
      },
      {
        title: 'Maintenance Planning',
        description: 'Schedule turbine maintenance during low-wind periods to minimize lost generation.',
        example: 'Reduced maintenance-related downtime by 35% with optimized scheduling.'
      },
    ],
  },
  'temperature-analytics': {
    name: 'Temperature Analytics',
    description: 'Detailed temperature analysis for energy demand forecasting and grid management.',
    icon: Thermometer,
    summaryTiles: [
      { icon: Target, title: 'Accuracy', value: '98.5%', subtitle: 'Hourly RMSE' },
      { icon: Clock, title: 'Update Frequency', value: '5 min', subtitle: 'Continuous refresh' },
      { icon: TrendingUp, title: 'Forecast Horizon', value: '30 days', subtitle: 'Hour-by-hour' },
    ],
    chartData: [
      { name: '00:00', forecast: 20, actual: 21, lower: 18, upper: 22 },
      { name: '04:00', forecast: 18, actual: 17, lower: 16, upper: 19 },
      { name: '08:00', forecast: 22, actual: 23, lower: 21, upper: 24 },
      { name: '12:00', forecast: 25, actual: 26, lower: 24, upper: 27 },
      { name: '16:00', forecast: 23, actual: 22, lower: 21, upper: 24 },
      { name: '20:00', forecast: 20, actual: 19, lower: 18, upper: 20 },
      { name: '24:00', forecast: 18, actual: 17, lower: 16, upper: 19 },
    ],
    parameters: [
      { name: 'Temperature', description: 'Ambient temperature measurements and forecasts', unit: '°C' },
      { name: 'Humidity', description: 'Relative humidity data for load prediction', unit: '%' },
      { name: 'Dew Point', description: 'Dew point temperature for condensation risk assessment', unit: '°C' },
      { name: 'Wind Speed', description: 'Hub-height wind velocity measurements and forecasts', unit: 'm/s' },
      { name: 'Air Density', description: 'Temperature and pressure corrections for power calculations', unit: 'kg/m³' },
    ],
    timescales: [
      { label: 'Nowcast', value: '0-6 hours', active: true },
      { label: 'Day-ahead', value: '6-48 hours', active: true },
      { label: 'Week-ahead', value: '2-7 days', active: true },
      { label: 'Long-range', value: '7-30 days', active: true },
    ],
    useCases: [
      {
        title: 'Demand Forecasting',
        description: 'Accurate energy demand forecasts for grid management and load balancing.',
        example: 'Reduced peak demand by 15% with optimized load forecasting.'
      },
      {
        title: 'Grid Management',
        description: 'Real-time grid management based on temperature and load predictions.',
        example: 'Avoided grid overloads by 20% with proactive grid management.'
      },
      {
        title: 'Renewable Integration',
        description: 'Optimize integration of renewable energy sources with temperature forecasts.',
        example: 'Increased renewable energy utilization by 10% with better integration.'
      },
    ],
  },
  // Add more product data as needed
};

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = productData[productId as keyof typeof productData];

  if (!product) {
    return (
      <PageContainer>
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">← Back to Products</Link>
        </div>
      </PageContainer>
    );
  }

  const Icon = product.icon;

  return (
    <PageContainer>
      {/* Header */}
      <section className="container mx-auto px-6 py-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-green-muted rounded-lg flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-semibold text-foreground mb-3">{product.name}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{product.description}</p>
          </div>
        </div>
      </section>

      {/* Executive Summary Tiles */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {product.summaryTiles.map((tile, index) => (
            <SummaryTile key={index} {...tile} />
          ))}
        </div>
      </section>

      {/* Temperature Analytics Dashboard - Special View */}
      {productId === 'temperature-analytics' && (
        <section className="container mx-auto px-6 py-8">
          <TemperatureAnalyticsDashboard />
        </section>
      )}

      {/* Interactive Chart */}
      {productId !== 'temperature-analytics' && (
        <section className="container mx-auto px-6 py-8">
          <InteractiveChart
            type="line"
            data={product.chartData}
            dataKeys={[
              { key: 'forecast', color: '#00a758', name: 'Forecast' },
              { key: 'actual', color: '#00753a', name: 'Actual' },
              { key: 'upper', color: '#e5e7eb', name: 'Upper Bound' },
              { key: 'lower', color: '#e5e7eb', name: 'Lower Bound' },
            ]}
            title="24-Hour Forecast vs. Actual"
            subtitle="Real-time comparison showing forecast accuracy and confidence intervals"
          />
        </section>
      )}

      {/* Parameters and Timescale */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ParametersSection parameters={product.parameters} />
          </div>
          <div>
            <TimescaleCoverage timescales={product.timescales} />
          </div>
        </div>
      </section>

      {/* Use Case Narrative */}
      <section className="container mx-auto px-6 py-8 pb-24">
        <UseCaseNarrative useCases={product.useCases} />
      </section>
    </PageContainer>
  );
}