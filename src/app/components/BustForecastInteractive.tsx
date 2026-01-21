import React, { useState } from 'react';
import { Sun, Wind, ArrowDown, ArrowUp, ArrowRight, Zap, TrendingDown } from 'lucide-react';
import { ExposureHedgeStrip } from '@/app/components/ExposureHedgeStrip';

interface TimelineForecast {
  variable: string;
  direction: 'up' | 'down' | 'neutral';
  probability: number;
  expectedMiss: string;
  bustRiskScore: number;
  timeWindow: string;
  uncertaintyBand: {
    p25: number;
    p50: number;
    p75: number;
  };
  worstCase: string;
}

interface FailureMode {
  rank: number;
  label: string;
  likelihood: 'low' | 'medium' | 'high';
  trigger: string;
  explanation: string;
  window?: string; // Optional time window for the scenario
}

interface BustForecastInteractiveProps {
  selectedLocation: string;
  timelineForecasts: Record<string, TimelineForecast>;
  likelyFailureModes: FailureMode[];
}

const likelihoodColors = {
  high: 'text-risk-high',
  medium: 'text-risk-medium',
  low: 'text-risk-low',
};

export function BustForecastInteractive({
  selectedLocation,
  timelineForecasts,
  likelyFailureModes,
}: BustForecastInteractiveProps) {
  const [hoveredTimelineChip, setHoveredTimelineChip] = useState<string | null>(null);
  const [pinnedFailureMode, setPinnedFailureMode] = useState<number | null>(null);
  const [hoveredDirectionZone, setHoveredDirectionZone] = useState<'arrow' | 'probability' | 'timeWindow' | null>(null);

  // Get default timeline forecast (first available)
  const defaultTimeWindow = Object.keys(timelineForecasts)[0];
  const activeForecast = hoveredTimelineChip && timelineForecasts[hoveredTimelineChip]
    ? timelineForecasts[hoveredTimelineChip]
    : timelineForecasts[defaultTimeWindow];

  const getVariableIcon = (variable: string) => {
    if (variable.toLowerCase().includes('solar')) return <Sun className="w-8 h-8" />;
    if (variable.toLowerCase().includes('wind')) return <Wind className="w-8 h-8" />;
    return <Zap className="w-8 h-8" />;
  };

  const getDirectionArrow = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'down') return <ArrowDown className="w-16 h-16" />;
    if (direction === 'up') return <ArrowUp className="w-16 h-16" />;
    return <ArrowRight className="w-16 h-16" />;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 7) return 'text-risk-high';
    if (score >= 4) return 'text-risk-medium';
    return 'text-risk-low';
  };

  const getRiskMeterColor = (score: number) => {
    if (score >= 7) return 'from-risk-high/20 via-risk-high/60 to-risk-high';
    if (score >= 4) return 'from-risk-medium/20 via-risk-medium/60 to-risk-medium';
    return 'from-risk-low/20 via-risk-low/60 to-risk-low';
  };

  const handleFailureModeClick = (rank: number) => {
    setPinnedFailureMode(pinnedFailureMode === rank ? null : rank);
  };

  return (
    <div className="space-y-4">
      {/* Quick Read Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Direction Tile with Hover Zones */}
        <div className="bg-card border border-neutral-border rounded-lg p-4">
          <div className="flex items-center gap-4">
            {/* Variable Icon */}
            <div className="flex-shrink-0 text-primary">
              {getVariableIcon(activeForecast.variable)}
            </div>

            {/* Arrow with hover zone + uncertainty fan */}
            <div 
              className="relative flex-shrink-0 cursor-help group"
              onMouseEnter={() => setHoveredDirectionZone('arrow')}
              onMouseLeave={() => setHoveredDirectionZone(null)}
            >
              {/* Uncertainty Fan Background (1D band graphic) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="relative w-16 h-12 flex items-center justify-center">
                  {/* Center line (forecast) */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-border transform -translate-y-1/2"></div>
                  {/* Uncertainty band (shaded area) */}
                  <div className="absolute top-1/2 left-0 right-0 h-6 bg-primary/10 transform -translate-y-1/2"></div>
                  {/* Most likely outcome dot (skewed) */}
                  <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
              
              <div className={`relative text-foreground ${hoveredDirectionZone === 'arrow' ? 'text-primary' : ''} transition-colors`}>
                {getDirectionArrow(activeForecast.direction)}
              </div>

              {/* Arrow Zone Tooltip */}
              {hoveredDirectionZone === 'arrow' && (
                <div className="absolute left-full ml-2 top-0 z-50 w-48 p-2 bg-popover border border-neutral-border rounded-lg shadow-lg text-xs">
                  <p className="font-medium text-foreground mb-1">Direction:</p>
                  <p className="text-muted-foreground">{activeForecast.direction === 'down' ? 'Forecast likely LOWER than guidance' : activeForecast.direction === 'up' ? 'Forecast likely HIGHER than guidance' : 'Neutral vs forecast'}</p>
                </div>
              )}
            </div>

            {/* Stoplight Circle with Probability */}
            <div 
              className="relative flex-shrink-0 cursor-help"
              onMouseEnter={() => setHoveredDirectionZone('probability')}
              onMouseLeave={() => setHoveredDirectionZone(null)}
            >
              <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                activeForecast.probability >= 70 ? 'border-risk-high bg-risk-high/10' :
                activeForecast.probability >= 60 ? 'border-risk-medium bg-risk-medium/10' :
                'border-risk-low bg-risk-low/10'
              } ${hoveredDirectionZone === 'probability' ? 'scale-110' : ''} transition-transform`}>
                <span className={`text-2xl font-bold ${getRiskScoreColor(activeForecast.bustRiskScore)}`}>
                  {activeForecast.probability}%
                </span>
              </div>

              {/* Probability Zone Tooltip */}
              {hoveredDirectionZone === 'probability' && (
                <div className="absolute left-full ml-2 top-0 z-50 w-48 p-2 bg-popover border border-neutral-border rounded-lg shadow-lg text-xs">
                  <p className="font-medium text-foreground mb-1">Probability:</p>
                  <p className="text-muted-foreground">{activeForecast.probability}% chance of this directional bias based on model spread and regime history</p>
                </div>
              )}
            </div>

            {/* Caption + Time Window */}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                Chance {activeForecast.direction === 'down' ? 'LOWER' : activeForecast.direction === 'up' ? 'HIGHER' : 'NEUTRAL'}
              </p>
              <div 
                className="relative cursor-help"
                onMouseEnter={() => setHoveredDirectionZone('timeWindow')}
                onMouseLeave={() => setHoveredDirectionZone(null)}
              >
                <p className={`text-xs font-medium ${hoveredDirectionZone === 'timeWindow' ? 'text-primary' : 'text-muted-foreground'} transition-colors`}>
                  {activeForecast.timeWindow}
                </p>

                {/* Time Window Zone Tooltip */}
                {hoveredDirectionZone === 'timeWindow' && (
                  <div className="absolute left-0 top-full mt-1 z-50 w-56 p-2 bg-popover border border-neutral-border rounded-lg shadow-lg text-xs">
                    <p className="font-medium text-foreground mb-1">Why this window:</p>
                    <p className="text-muted-foreground">Peak uncertainty window where model divergence is highest and forecast bust risk concentrates</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uncertainty Band Labels (on hover) */}
          {hoveredDirectionZone === 'arrow' && (
            <div className="mt-3 pt-3 border-t border-neutral-border">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="text-center">
                  <p className="font-medium">P25</p>
                  <p>{activeForecast.uncertaintyBand.p25}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">P50</p>
                  <p className="text-primary font-semibold">{activeForecast.uncertaintyBand.p50}</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">P75</p>
                  <p>{activeForecast.uncertaintyBand.p75}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Bust Thermometer */}
        <div className="bg-card border border-neutral-border rounded-lg p-4">
          <div className="flex items-center gap-4">
            {/* Vertical Thermometer */}
            <div className="flex-shrink-0 relative w-12 h-32">
              <div className="absolute inset-0 bg-gradient-to-t from-risk-low/10 via-risk-medium/10 to-risk-high/10 rounded-full border-2 border-neutral-border"></div>
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getRiskMeterColor(activeForecast.bustRiskScore)} rounded-full transition-all duration-1000 ease-out border-2 border-transparent`}
                style={{ height: `${(activeForecast.bustRiskScore / 10) * 100}%` }}
              />
              <div className="absolute inset-0 flex flex-col justify-between py-2 px-1">
                <span className="text-[8px] text-muted-foreground">10</span>
                <span className="text-[8px] text-muted-foreground">5</span>
                <span className="text-[8px] text-muted-foreground">0</span>
              </div>
            </div>

            {/* Risk Label + Score */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Bust Risk:</p>
              <p className={`text-2xl font-bold ${getRiskScoreColor(activeForecast.bustRiskScore)}`}>
                {activeForecast.bustRiskScore >= 7 ? 'High' : activeForecast.bustRiskScore >= 4 ? 'Medium' : 'Low'}
              </p>
              <p className={`text-lg font-semibold ${getRiskScoreColor(activeForecast.bustRiskScore)} mt-1`}>
                {activeForecast.bustRiskScore.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Worst Case Chip (Always Visible) */}
      <div className="flex items-center gap-2 px-4 py-2 bg-risk-high/10 border border-risk-high/30 rounded-lg">
        <TrendingDown className="w-4 h-4 text-risk-high" />
        <span className="text-sm font-medium text-foreground">
          Worst case: <span className="text-risk-high font-semibold">{activeForecast.worstCase}</span>
        </span>
      </div>

      {/* Exposure & Hedge Strip */}
      <ExposureHedgeStrip selectedLocation={selectedLocation} />

      {/* Key Risk Scenarios */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Key Risk Scenarios (Next 6–12h)</h4>
        <div className="space-y-2">
          {likelyFailureModes.slice(0, 2).map((mode) => (
            <div
              key={mode.rank}
              onClick={() => handleFailureModeClick(mode.rank)}
              className={`relative flex items-start gap-3 px-3 py-2 bg-card rounded border cursor-pointer transition-all ${
                pinnedFailureMode === mode.rank
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-neutral-border hover:border-primary/50'
              }`}
            >
              {/* Rank indicator */}
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                pinnedFailureMode === mode.rank
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 border border-primary/30 text-primary'
              }`}>
                <span className="text-[10px] font-medium">#{mode.rank}</span>
              </div>

              <div className="flex-1">
                {/* Scenario label */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-foreground">{mode.label}</span>
                  {pinnedFailureMode === mode.rank && (
                    <span className="text-[10px] text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                      Pinned
                    </span>
                  )}
                  {mode.window && (
                    <span className="ml-auto text-[10px] text-muted-foreground px-2 py-0.5 bg-accent border border-neutral-border rounded">
                      Window: {mode.window}
                    </span>
                  )}
                </div>

                {/* Probability + Watch for */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Probability:</span>
                  <span className={`font-medium capitalize ${likelihoodColors[mode.likelihood]}`}>
                    {mode.likelihood}
                  </span>
                  <div className="h-3 w-px bg-neutral-border"></div>
                  <span className="text-muted-foreground">Watch for:</span>
                  <span className="text-foreground">{mode.trigger}</span>
                </div>

                {/* Expanded explanation (when pinned) */}
                {pinnedFailureMode === mode.rank && (
                  <div className="mt-2 pt-2 border-t border-neutral-border">
                    <p className="text-xs text-foreground leading-relaxed">
                      {mode.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}