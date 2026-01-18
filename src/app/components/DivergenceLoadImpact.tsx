import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, ReferenceLine, ReferenceArea } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity, Clock, ChevronRight } from 'lucide-react';

type ViewMode = 'lookback' | 'lookforward';
type LookbackPeriod = '7D' | '30D' | '90D' | '1Y' | '2Y';
type LookforwardPeriod = '48h' | '7D' | '14D' | '30D';
type RiskSkew = 'upside' | 'downside' | 'neutral';
type RiskRegime = 'low' | 'medium' | 'high';
type Trend = 'rising' | 'falling' | 'flat';

interface DivergenceEvent {
  id: string;
  date: string;
  time: string;
  location: string;
  spreadMagnitude: number;
  loadImpact: string;
  priceImpact?: string;
}

interface DivergenceLoadImpactProps {
  selectedLocation?: string;
}

export function DivergenceLoadImpact({ selectedLocation = 'Global' }: DivergenceLoadImpactProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('lookforward');
  const [lookbackPeriod, setLookbackPeriod] = useState<LookbackPeriod>('30D');
  const [lookforwardPeriod, setLookforwardPeriod] = useState<LookforwardPeriod>('7D');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Risk skew (could be dynamic based on location/conditions)
  const riskSkew: RiskSkew = 'upside';

  // Helper: Convert period string to hours
  const periodToHours = (period: LookbackPeriod | LookforwardPeriod): number => {
    if (period === '48h') return 48;
    if (period === '7D') return 7 * 24;
    if (period === '14D') return 14 * 24;
    if (period === '30D') return 30 * 24;
    if (period === '90D') return 90 * 24;
    if (period === '1Y') return 365 * 24;
    if (period === '2Y') return 730 * 24;
    return 48;
  };

  // Helper: Convert raw spread index to percentile (0-100)
  const spreadToPercentile = (spreadIndex: number): number => {
    const percentile = Math.min(100, Math.max(0, spreadIndex * 10));
    return parseFloat(percentile.toFixed(0));
  };

  // Helper: Get risk regime from percentile
  const getRegimeFromPercentile = (percentile: number): RiskRegime => {
    if (percentile >= 70) return 'high';
    if (percentile >= 30) return 'medium';
    return 'low';
  };

  // Generate realistic load data based on mode
  const loadForecastData = useMemo(() => {
    const data = [];
    const now = new Date();
    const nowTimestamp = now.getTime();
    
    // Base load varies by location (realistic MW levels)
    const baseLoadLevel = 850; // MW baseline
    
    if (viewMode === 'lookback') {
      // LOOKBACK MODE: Show historical data with realistic variation
      const hours = periodToHours(lookbackPeriod);
      
      // Determine interval
      let intervalHours = 1;
      if (hours > 720) intervalHours = 24;
      else if (hours > 168) intervalHours = 6;
      else if (hours > 48) intervalHours = 3;
      
      // Generate historical points
      for (let h = -hours; h <= 0; h += intervalHours) {
        const timestamp = new Date(nowTimestamp + h * 60 * 60 * 1000);
        
        // Realistic load variation: daily + seasonal
        const hourOfDay = timestamp.getHours();
        const dayOfYear = Math.floor((timestamp.getTime() - new Date(timestamp.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        
        // Daily pattern (higher during day, lower at night)
        const dailyPattern = Math.sin((hourOfDay - 6) / 24 * Math.PI * 2) * 80;
        
        // Seasonal pattern (higher in summer/winter)
        const seasonalPattern = Math.sin(dayOfYear / 365 * Math.PI * 2) * 150;
        
        // Random variation
        const randomVar = (Math.random() - 0.5) * 40;
        
        const forecastLoad = baseLoadLevel + dailyPattern + seasonalPattern + randomVar;
        const observedLoad = forecastLoad + (Math.random() - 0.5) * 60; // Add observation noise
        
        // Realistic spread index variation over time
        // Create regime periods with transitions
        const regimePhase = Math.sin(h / (hours / 6)) * 0.5 + 0.5; // 6 regime cycles
        let spreadIndex = 2.5 + regimePhase * 5; // Base range 2.5-7.5
        
        // Add occasional spikes
        if (Math.random() > 0.95) {
          spreadIndex += Math.random() * 3;
        }
        
        // Add local variation
        spreadIndex += (Math.random() - 0.5) * 1.5;
        spreadIndex = Math.max(1, Math.min(10, spreadIndex));
        
        const percentile = spreadToPercentile(spreadIndex);
        const regime = getRegimeFromPercentile(percentile);
        
        // Uncertainty bands scale with spread
        const uncertaintyWidth = spreadIndex * 14;
        const skewFactor = riskSkew === 'upside' ? 1.2 : riskSkew === 'downside' ? 0.8 : 1.0;
        
        const p90 = forecastLoad + uncertaintyWidth * skewFactor;
        const p10 = forecastLoad - uncertaintyWidth * (2 - skewFactor);
        const p75 = forecastLoad + (uncertaintyWidth * 0.6) * skewFactor;
        const p25 = forecastLoad - (uncertaintyWidth * 0.6) * (2 - skewFactor);
        
        // Format time label
        let timeLabel = '';
        if (intervalHours === 1) timeLabel = `${h}h`;
        else if (intervalHours <= 6) timeLabel = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
        else timeLabel = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        data.push({
          hour: h,
          timeLabel,
          fullDateTime: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • ' + timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          forecastLoad: parseFloat(forecastLoad.toFixed(1)),
          observedLoad: parseFloat(observedLoad.toFixed(1)),
          p90: parseFloat(p90.toFixed(1)),
          p10: parseFloat(p10.toFixed(1)),
          p75: parseFloat(p75.toFixed(1)),
          p25: parseFloat(p25.toFixed(1)),
          spreadIndex: parseFloat(spreadIndex.toFixed(1)),
          percentile,
          regime,
          impliedUncertainty: parseFloat(((p90 - p10) / 2).toFixed(1)),
          timestamp: timestamp.getTime(),
        });
      }
    } else {
      // LOOK-FORWARD MODE: Show recent context + forecast
      const forwardHours = periodToHours(lookforwardPeriod);
      const contextHours = 48; // Show 48h of recent history for context
      
      // Determine interval
      let intervalHours = 1;
      if (forwardHours > 168) intervalHours = 6;
      else if (forwardHours > 48) intervalHours = 3;
      
      // Generate data from -contextHours to +forwardHours
      for (let h = -contextHours; h <= forwardHours; h += intervalHours) {
        const timestamp = new Date(nowTimestamp + h * 60 * 60 * 1000);
        
        // Realistic load variation
        const hourOfDay = timestamp.getHours();
        const dayOfYear = Math.floor((timestamp.getTime() - new Date(timestamp.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        
        const dailyPattern = Math.sin((hourOfDay - 6) / 24 * Math.PI * 2) * 80;
        const seasonalPattern = Math.sin(dayOfYear / 365 * Math.PI * 2) * 150;
        const randomVar = (Math.random() - 0.5) * 30;
        
        const forecastLoad = baseLoadLevel + dailyPattern + seasonalPattern + randomVar;
        
        // Observed load only for history
        let observedLoad = undefined;
        if (h <= 0) {
          observedLoad = forecastLoad + (Math.random() - 0.5) * 60;
        }
        
        // Spread index evolves forward with plausible dynamics
        let spreadIndex;
        if (h <= 0) {
          // Recent history: moderate spread
          spreadIndex = 3.5 + (Math.random() - 0.5) * 2;
        } else {
          // Forward: create event-driven dynamics
          // Event 1: Spike around day 2-3
          const event1Phase = Math.max(0, 1 - Math.abs(h - 60) / 24);
          // Event 2: Moderate rise around day 5
          const event2Phase = Math.max(0, 1 - Math.abs(h - 120) / 36);
          // Event 3: Sharp spike if 30D selected, around day 20
          const event3Phase = forwardHours >= 600 ? Math.max(0, 1 - Math.abs(h - 480) / 48) : 0;
          
          // Base spread increases gradually with lead time
          const leadTimeIncrease = Math.min(3, h / forwardHours * 2);
          
          spreadIndex = 3 + leadTimeIncrease + event1Phase * 5 + event2Phase * 3 + event3Phase * 4;
          spreadIndex += (Math.random() - 0.5) * 1.2;
          spreadIndex = Math.max(1.5, Math.min(9.5, spreadIndex));
        }
        
        const percentile = spreadToPercentile(spreadIndex);
        const regime = getRegimeFromPercentile(percentile);
        
        // Uncertainty bands widen with spread and lead time
        const uncertaintyWidth = spreadIndex * 14;
        const skewFactor = riskSkew === 'upside' ? 1.2 : riskSkew === 'downside' ? 0.8 : 1.0;
        
        const p90 = forecastLoad + uncertaintyWidth * skewFactor;
        const p10 = forecastLoad - uncertaintyWidth * (2 - skewFactor);
        const p75 = forecastLoad + (uncertaintyWidth * 0.6) * skewFactor;
        const p25 = forecastLoad - (uncertaintyWidth * 0.6) * (2 - skewFactor);
        
        // Format time label
        let timeLabel = '';
        if (h === 0) {
          timeLabel = 'Now';
        } else if (intervalHours === 1) {
          timeLabel = `${h > 0 ? '+' : ''}${h}h`;
        } else if (intervalHours <= 6) {
          timeLabel = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
        } else {
          timeLabel = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        data.push({
          hour: h,
          timeLabel,
          fullDateTime: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • ' + timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          forecastLoad: parseFloat(forecastLoad.toFixed(1)),
          observedLoad: observedLoad !== undefined ? parseFloat(observedLoad.toFixed(1)) : undefined,
          p90: parseFloat(p90.toFixed(1)),
          p10: parseFloat(p10.toFixed(1)),
          p75: parseFloat(p75.toFixed(1)),
          p25: parseFloat(p25.toFixed(1)),
          spreadIndex: parseFloat(spreadIndex.toFixed(1)),
          percentile,
          regime,
          impliedUncertainty: parseFloat(((p90 - p10) / 2).toFixed(1)),
          timestamp: timestamp.getTime(),
        });
      }
    }

    return data;
  }, [viewMode, lookbackPeriod, lookforwardPeriod, riskSkew]);

  // Calculate signals based on oscillator (look-forward mode only)
  const signals = useMemo(() => {
    if (!loadForecastData.length || viewMode === 'lookback') {
      return { regime: 'low' as RiskRegime, trend: 'flat' as Trend, expansion: false };
    }

    // Get forward-looking data only (h > 0)
    const forwardData = loadForecastData.filter(d => d.hour > 0);
    if (!forwardData.length) return { regime: 'low' as RiskRegime, trend: 'flat' as Trend, expansion: false };

    // Get current/near-term regime (first 25% of forward window)
    const nearTermData = forwardData.slice(0, Math.max(1, Math.floor(forwardData.length * 0.25)));
    const avgPercentile = nearTermData.reduce((sum, d) => sum + d.percentile, 0) / nearTermData.length;
    const regime = getRegimeFromPercentile(avgPercentile);

    // Calculate trend across forward window
    const firstQuarter = forwardData.slice(0, Math.floor(forwardData.length * 0.25));
    const lastQuarter = forwardData.slice(Math.floor(forwardData.length * 0.75));
    const firstAvg = firstQuarter.reduce((sum, d) => sum + d.percentile, 0) / firstQuarter.length;
    const lastAvg = lastQuarter.reduce((sum, d) => sum + d.percentile, 0) / lastQuarter.length;
    
    let trend: Trend = 'flat';
    if (lastAvg > firstAvg + 8) trend = 'rising';
    else if (lastAvg < firstAvg - 8) trend = 'falling';

    // Expansion detection (sharp rise in forward window)
    const maxPercentile = Math.max(...forwardData.map(d => d.percentile));
    const expansion = maxPercentile >= 75 && trend === 'rising';

    return { regime, trend, expansion };
  }, [loadForecastData, viewMode]);

  // Generate top model spread events (for lookback table)
  const topEvents: DivergenceEvent[] = useMemo(() => {
    const events: DivergenceEvent[] = [
      {
        id: 'evt-1',
        date: 'Jan 14, 2026',
        time: '14:00',
        location: selectedLocation,
        spreadMagnitude: 9.2,
        loadImpact: '+1.8 GW vs forecast',
        priceImpact: '+$45/MWh spike',
      },
      {
        id: 'evt-2',
        date: 'Jan 8, 2026',
        time: '18:30',
        location: selectedLocation,
        spreadMagnitude: 8.7,
        loadImpact: '-1.2 GW vs forecast',
        priceImpact: '-$22/MWh drop',
      },
      {
        id: 'evt-3',
        date: 'Dec 28, 2025',
        time: '08:00',
        location: selectedLocation,
        spreadMagnitude: 7.9,
        loadImpact: '+0.9 GW vs forecast',
        priceImpact: '+$18/MWh',
      },
      {
        id: 'evt-4',
        date: 'Dec 15, 2025',
        time: '22:15',
        location: selectedLocation,
        spreadMagnitude: 7.4,
        loadImpact: '-0.7 GW vs forecast',
        priceImpact: '-$12/MWh',
      },
      {
        id: 'evt-5',
        date: 'Nov 30, 2025',
        time: '16:45',
        location: selectedLocation,
        spreadMagnitude: 6.8,
        loadImpact: '+1.1 GW vs forecast',
        priceImpact: '+$28/MWh',
      },
    ];

    return events;
  }, [selectedLocation]);

  // Custom tooltip for load fan chart
  const LoadTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isHistory = dataPoint.hour <= 0;
      
      if (viewMode === 'lookback') {
        // Lookback tooltip
        const loadMiss = dataPoint.observedLoad !== undefined 
          ? (dataPoint.observedLoad - dataPoint.forecastLoad).toFixed(1)
          : null;
        
        return (
          <div className="bg-card border border-neutral-border rounded-lg shadow-lg p-3 text-xs">
            <p className="font-medium text-foreground mb-2">{dataPoint.fullDateTime}</p>
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00a758]"></div>
                <span className="text-muted-foreground">Observed Load:</span>
              </div>
              <span className="font-medium text-foreground">{dataPoint.observedLoad} MW</span>
            </div>
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#9ca3af]"></div>
                <span className="text-muted-foreground">Forecast Load:</span>
              </div>
              <span className="font-medium text-foreground">{dataPoint.forecastLoad} MW</span>
            </div>
            
            {loadMiss && (
              <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-neutral-border">
                <span className="text-muted-foreground">Load Miss:</span>
                <span className={`font-medium ${parseFloat(loadMiss) > 0 ? 'text-risk-medium' : 'text-foreground'}`}>
                  {parseFloat(loadMiss) > 0 ? '+' : ''}{loadMiss} MW
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-muted-foreground">Range (P10–P90):</span>
              <span className="font-medium text-foreground">{dataPoint.p10}–{dataPoint.p90} MW</span>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Spread Percentile:</span>
              <span className="font-medium text-foreground">{dataPoint.percentile}</span>
            </div>
          </div>
        );
      } else {
        // Look-forward tooltip
        return (
          <div className="bg-card border border-neutral-border rounded-lg shadow-lg p-3 text-xs">
            <p className="font-medium text-foreground mb-2">{dataPoint.fullDateTime}</p>
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#9ca3af]"></div>
                <span className="text-muted-foreground">Forecast Load:</span>
              </div>
              <span className="font-medium text-foreground">{dataPoint.forecastLoad} MW</span>
            </div>
            
            {isHistory && dataPoint.observedLoad !== undefined && (
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00a758]"></div>
                  <span className="text-muted-foreground">Observed Load:</span>
                </div>
                <span className="font-medium text-foreground">{dataPoint.observedLoad} MW</span>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-muted-foreground">Range (P10–P90):</span>
              <span className="font-medium text-foreground">{dataPoint.p10}–{dataPoint.p90} MW</span>
            </div>
            
            <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-neutral-border">
              <span className="text-muted-foreground">Spread Percentile:</span>
              <span className="font-medium text-foreground">{dataPoint.percentile}</span>
            </div>
            
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-muted-foreground">Risk Regime:</span>
              <span className={`font-medium capitalize ${
                dataPoint.regime === 'high' ? 'text-risk-high' :
                dataPoint.regime === 'medium' ? 'text-risk-medium' :
                'text-risk-low'
              }`}>
                {dataPoint.regime}
              </span>
            </div>
            
            {!isHistory && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Trend:</span>
                <span className="font-medium text-foreground capitalize">{signals.trend}</span>
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Custom tooltip for spread oscillator
  const OscillatorTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      
      return (
        <div className="bg-card border border-neutral-border rounded-lg shadow-lg p-3 text-xs">
          <p className="font-medium text-foreground mb-2">{dataPoint.fullDateTime}</p>
          
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-muted-foreground">Percentile:</span>
            <span className="font-medium text-foreground">{dataPoint.percentile}</span>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Regime:</span>
            <span className={`font-medium capitalize ${
              dataPoint.regime === 'high' ? 'text-risk-high' :
              dataPoint.regime === 'medium' ? 'text-risk-medium' :
              'text-risk-low'
            }`}>
              {dataPoint.regime}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getRiskSkewIcon = () => {
    if (riskSkew === 'upside') return <TrendingUp className="w-3 h-3" />;
    if (riskSkew === 'downside') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  // Get mode label
  const getModeLabel = () => {
    if (viewMode === 'lookback') {
      if (lookbackPeriod === '7D') return 'History (7D)';
      if (lookbackPeriod === '30D') return 'History (30D)';
      if (lookbackPeriod === '90D') return 'History (90D)';
      if (lookbackPeriod === '1Y') return 'History (1Y)';
      if (lookbackPeriod === '2Y') return 'History (2Y)';
    } else {
      if (lookforwardPeriod === '48h') return 'Forecast (48h)';
      if (lookforwardPeriod === '7D') return 'Forecast (7D)';
      if (lookforwardPeriod === '14D') return 'Forecast (14D)';
      if (lookforwardPeriod === '30D') return 'Forecast (30D)';
    }
    return '';
  };

  // Determine tick interval
  const getTickInterval = () => {
    const dataLength = loadForecastData.length;
    if (dataLength > 180) return Math.floor(dataLength / 8);
    if (dataLength > 100) return Math.floor(dataLength / 10);
    return Math.floor(dataLength / 12);
  };

  return (
    <div>
      {/* Header with mode selector */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-foreground mb-1">
            Load Forecast Risk (Uncertainty Bands)
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Forecast fan chart + spread oscillator • Higher spread = higher load forecast error risk • Location: {selectedLocation}
          </p>
          {viewMode === 'lookforward' && (
            <p className="text-xs text-muted-foreground italic">
              Signals reflect forward-looking uncertainty only.
            </p>
          )}
        </div>

        {/* Signal Chips (Look-forward mode only) */}
        {viewMode === 'lookforward' && (
          <div className="flex items-center gap-2 ml-4">
            {/* Risk Regime */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${
              signals.regime === 'high' 
                ? 'bg-risk-high/10 border-risk-high/30 text-risk-high'
                : signals.regime === 'medium'
                ? 'bg-risk-medium/10 border-risk-medium/30 text-risk-medium'
                : 'bg-risk-low/10 border-risk-low/30 text-risk-low'
            }`}>
              <Activity className="w-3 h-3" />
              <span className="capitalize">{signals.regime} Risk</span>
            </div>

            {/* Trend */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-accent border border-neutral-border text-foreground">
              {signals.trend === 'rising' && <TrendingUp className="w-3 h-3 text-risk-medium" />}
              {signals.trend === 'falling' && <TrendingDown className="w-3 h-3 text-risk-low" />}
              {signals.trend === 'flat' && <Minus className="w-3 h-3 text-muted-foreground" />}
              <span className="capitalize">{signals.trend}</span>
            </div>

            {/* Expansion */}
            {signals.expansion && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-risk-high/10 border border-risk-high/30 text-risk-high">
                <AlertTriangle className="w-3 h-3" />
                <span>Expansion</span>
              </div>
            )}

            {/* Skew */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-accent border border-neutral-border text-foreground">
              {getRiskSkewIcon()}
              <span className="capitalize">{riskSkew} Skew</span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Selector + Period Controls */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-neutral-border">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Mode:</span>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('lookback')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm transition-all ${
                viewMode === 'lookback'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-3 h-3" />
              Lookback
            </button>
            <button
              onClick={() => setViewMode('lookforward')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm transition-all ${
                viewMode === 'lookforward'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ChevronRight className="w-3 h-3" />
              Look-forward
            </button>
          </div>
        </div>

        {/* Period Selector (changes based on mode) */}
        {viewMode === 'lookback' ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Period:</span>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(['7D', '30D', '90D', '1Y', '2Y'] as LookbackPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setLookbackPeriod(period)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    lookbackPeriod === period
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Period:</span>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(['48h', '7D', '14D', '30D'] as LookforwardPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setLookforwardPeriod(period)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    lookforwardPeriod === period
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-muted-foreground font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#9ca3af] rounded"></div>
            <span className="text-xs text-foreground">Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#00a758] rounded"></div>
            <span className="text-xs text-foreground">Observed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-[#d1d5db] opacity-40 rounded"></div>
            <span className="text-xs text-foreground">P25–P75</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-[#d1d5db] opacity-20 rounded"></div>
            <span className="text-xs text-foreground">P10–P90</span>
          </div>
        </div>
      </div>

      {/* Top Chart: Load Forecast Fan Chart */}
      <div className="mb-1">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={loadForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
            
            {/* "Now" reference line (look-forward mode only) */}
            {viewMode === 'lookforward' && (
              <ReferenceLine
                x="Now"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ 
                  value: 'NOW', 
                  position: 'top', 
                  fill: '#f59e0b', 
                  fontSize: 11, 
                  fontWeight: 600,
                  offset: 10
                }}
              />
            )}
            
            {/* High risk regime markers (look-forward, very subtle) */}
            {viewMode === 'lookforward' && loadForecastData.filter(d => d.percentile >= 70 && d.hour > 0).map((d, idx) => (
              <ReferenceLine
                key={`regime-${idx}`}
                x={d.timeLabel}
                stroke="#ef4444"
                strokeWidth={0.5}
                strokeOpacity={0.15}
                ifOverflow="extendDomain"
              />
            ))}
            
            <XAxis
              dataKey="timeLabel"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
              interval={getTickInterval()}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '11px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
              label={{ 
                value: 'Load (MW)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'var(--muted-foreground)', 
                style: { fontSize: '11px', fontWeight: 500 } 
              }}
            />
            
            <Tooltip content={<LoadTooltip />} />
            
            {/* P10-P90 band (very light neutral) */}
            <Area
              type="monotone"
              dataKey="p90"
              stroke="none"
              fill="#d1d5db"
              fillOpacity={0.15}
            />
            <Area
              type="monotone"
              dataKey="p10"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
            />
            
            {/* P25-P75 band (light neutral) */}
            <Area
              type="monotone"
              dataKey="p75"
              stroke="none"
              fill="#d1d5db"
              fillOpacity={0.35}
            />
            <Area
              type="monotone"
              dataKey="p25"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
            />
            
            {/* Forecast Load (muted gray line) */}
            <Line
              type="monotone"
              dataKey="forecastLoad"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={false}
              name="Forecast Load"
            />
            
            {/* Observed Load (green line) */}
            <Line
              type="monotone"
              dataKey="observedLoad"
              stroke="#00a758"
              strokeWidth={2.5}
              dot={false}
              name="Observed Load"
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Mode label */}
        <div className="flex justify-center px-12 -mt-2 mb-4">
          <span className="text-xs text-muted-foreground italic">{getModeLabel()}</span>
        </div>
      </div>

      {/* Bottom Chart: Model Spread Index Oscillator (RSI-style) */}
      <div className="mb-6 pt-4 border-t border-neutral-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-medium text-foreground">Model Spread Index (Percentile, 0–100)</h4>
            <p className="text-xs text-muted-foreground">0–100 scale: higher = greater model disagreement / higher load uncertainty</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={loadForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
            <XAxis
              dataKey="timeLabel"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '10px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
              interval={getTickInterval()}
              hide
            />
            <YAxis
              domain={[0, 100]}
              stroke="#d97706"
              style={{ fontSize: '10px' }}
              tick={{ fill: '#d97706' }}
              ticks={[0, 30, 70, 100]}
            />
            
            {/* Threshold bands */}
            <ReferenceArea y1={70} y2={100} fill="#ef4444" fillOpacity={0.08} />
            <ReferenceArea y1={0} y2={30} fill="#00a758" fillOpacity={0.08} />
            
            {/* Threshold lines */}
            <ReferenceLine
              y={70}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="4 4"
              label={{ value: 'High Risk (70)', position: 'right', fill: '#ef4444', fontSize: 10 }}
            />
            <ReferenceLine
              y={30}
              stroke="#00a758"
              strokeWidth={1}
              strokeDasharray="4 4"
              label={{ value: 'Low Risk (30)', position: 'right', fill: '#00a758', fontSize: 10 }}
            />
            
            {/* "Now" reference line (look-forward only) */}
            {viewMode === 'lookforward' && (
              <ReferenceLine x="Now" stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
            )}
            
            <Tooltip content={<OscillatorTooltip />} />
            
            {/* Oscillator line */}
            <Line
              type="monotone"
              dataKey="percentile"
              stroke="#d97706"
              strokeWidth={2}
              dot={false}
              name="Spread Percentile"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Event Table (Lookback mode only) */}
      {viewMode === 'lookback' && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            Top Historical Divergence Events ({lookbackPeriod})
          </h4>
          
          <div className="space-y-2">
            {topEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedEvent === event.id
                    ? 'border-primary bg-accent shadow-sm'
                    : 'border-neutral-border bg-card hover:border-muted-foreground'
                }`}
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Date/Time</p>
                    <p className="text-sm font-medium text-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">{event.location}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Model Spread Index</p>
                    <p className="text-sm font-semibold text-risk-medium">{event.spreadMagnitude.toFixed(1)} units</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Load Miss</p>
                    <p className="text-sm font-medium text-foreground">{event.loadImpact}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Price Impact (demo)</p>
                    <p className="text-sm font-medium text-foreground">{event.priceImpact || 'N/A'}</p>
                  </div>
                </div>

                {selectedEvent === event.id && (
                  <div className="mt-3 pt-3 border-t border-neutral-border">
                    <p className="text-xs text-foreground mb-1">
                      <span className="font-medium">Outcome:</span> Load forecast error {event.loadImpact}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      High model spread period caused by ECMWF/GFS disagreement on temperature forecast. 
                      Actual load exceeded forecast due to colder-than-expected conditions, 
                      driving up short-term demand and spot pricing.
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
