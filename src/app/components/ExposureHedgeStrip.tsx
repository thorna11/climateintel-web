import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wind, Sun, Zap } from 'lucide-react';

interface ScenarioRow {
  label: string;
  probability: string;
  netTightness: number;
  tightnessLevel: 'loose' | 'balanced' | 'tight';
  keyDriver: string;
  driverIcon: 'wind' | 'solar' | 'load';
  assumption: string;
}

interface HedgeSummary {
  hedgeBias: 'up' | 'down' | 'neutral';
  hedgeBiasLabel: string;
  mostLikelyMiss: string;
  missDirection: 'up' | 'down' | 'neutral';
  confidence: 'low' | 'medium' | 'high';
}

interface ExposureData {
  scenarios: ScenarioRow[];
  hedgeSummary: HedgeSummary;
}

const exposureDataByLocation: Record<string, ExposureData> = {
  'Hong Kong': {
    scenarios: [
      {
        label: 'Base',
        probability: 'P50',
        netTightness: -200,
        tightnessLevel: 'balanced',
        keyDriver: 'Wind',
        driverIcon: 'wind',
        assumption: 'Median forecast from ensemble spread',
      },
      {
        label: 'Downside',
        probability: 'P25',
        netTightness: -450,
        tightnessLevel: 'tight',
        keyDriver: 'Wind ↓',
        driverIcon: 'wind',
        assumption: 'P(lower) 75% applied to wind; P(higher) 75% applied to load',
      },
      {
        label: 'Upside',
        probability: 'P75',
        netTightness: +100,
        tightnessLevel: 'loose',
        keyDriver: 'Wind ↑',
        driverIcon: 'wind',
        assumption: 'P(higher) 75% applied to wind; P(lower) 75% applied to load',
      },
    ],
    hedgeSummary: {
      hedgeBias: 'up',
      hedgeBiasLabel: 'Tightness ↑',
      mostLikelyMiss: 'Wind ↓',
      missDirection: 'down',
      confidence: 'high',
    },
  },
  'Seoul': {
    scenarios: [
      {
        label: 'Base',
        probability: 'P50',
        netTightness: -150,
        tightnessLevel: 'balanced',
        keyDriver: 'Solar',
        driverIcon: 'solar',
        assumption: 'Median forecast from ensemble spread',
      },
      {
        label: 'Downside',
        probability: 'P25',
        netTightness: -520,
        tightnessLevel: 'tight',
        keyDriver: 'Solar ↓',
        driverIcon: 'solar',
        assumption: 'P(lower) 68% applied to solar; timing risk → earlier storms',
      },
      {
        label: 'Upside',
        probability: 'P75',
        netTightness: +80,
        tightnessLevel: 'loose',
        keyDriver: 'Solar ↑',
        driverIcon: 'solar',
        assumption: 'P(higher) 75% applied to solar; storms arrive later',
      },
    ],
    hedgeSummary: {
      hedgeBias: 'up',
      hedgeBiasLabel: 'Tightness ↑',
      mostLikelyMiss: 'Solar ↓',
      missDirection: 'down',
      confidence: 'medium',
    },
  },
  'Singapore': {
    scenarios: [
      {
        label: 'Base',
        probability: 'P50',
        netTightness: -100,
        tightnessLevel: 'balanced',
        keyDriver: 'Solar',
        driverIcon: 'solar',
        assumption: 'Median forecast from ensemble spread',
      },
      {
        label: 'Downside',
        probability: 'P25',
        netTightness: -280,
        tightnessLevel: 'tight',
        keyDriver: 'Solar ↓',
        driverIcon: 'solar',
        assumption: 'P(lower) 60% applied to solar; sea breeze earlier',
      },
      {
        label: 'Upside',
        probability: 'P75',
        netTightness: +40,
        tightnessLevel: 'loose',
        keyDriver: 'Solar ↑',
        driverIcon: 'solar',
        assumption: 'P(higher) 75% applied to solar; sea breeze delayed',
      },
    ],
    hedgeSummary: {
      hedgeBias: 'up',
      hedgeBiasLabel: 'Tightness ↑',
      mostLikelyMiss: 'Solar ↓',
      missDirection: 'down',
      confidence: 'medium',
    },
  },
  'Tokyo': {
    scenarios: [
      {
        label: 'Base',
        probability: 'P50',
        netTightness: +50,
        tightnessLevel: 'balanced',
        keyDriver: 'Wind',
        driverIcon: 'wind',
        assumption: 'Median forecast from ensemble spread',
      },
      {
        label: 'Downside',
        probability: 'P25',
        netTightness: -180,
        tightnessLevel: 'tight',
        keyDriver: 'Wind ↓',
        driverIcon: 'wind',
        assumption: 'P(lower) 70% applied to wind + solar; front timing shift',
      },
      {
        label: 'Upside',
        probability: 'P75',
        netTightness: +220,
        tightnessLevel: 'loose',
        keyDriver: 'Wind ↑',
        driverIcon: 'wind',
        assumption: 'P(higher) 75% applied to wind + solar; stable ridge holds',
      },
    ],
    hedgeSummary: {
      hedgeBias: 'up',
      hedgeBiasLabel: 'Tightness ↑',
      mostLikelyMiss: 'Wind ↓',
      missDirection: 'down',
      confidence: 'medium',
    },
  },
  'Sydney': {
    scenarios: [
      {
        label: 'Base',
        probability: 'P50',
        netTightness: +80,
        tightnessLevel: 'balanced',
        keyDriver: 'Solar',
        driverIcon: 'solar',
        assumption: 'Median forecast from ensemble spread',
      },
      {
        label: 'Downside',
        probability: 'P25',
        netTightness: -20,
        tightnessLevel: 'balanced',
        keyDriver: 'Solar ↓',
        driverIcon: 'solar',
        assumption: 'P(lower) 55% applied to solar; fog lingers slightly',
      },
      {
        label: 'Upside',
        probability: 'P75',
        netTightness: +140,
        tightnessLevel: 'loose',
        keyDriver: 'Solar ↑',
        driverIcon: 'solar',
        assumption: 'P(higher) 75% applied to solar; fog clears faster',
      },
    ],
    hedgeSummary: {
      hedgeBias: 'neutral',
      hedgeBiasLabel: 'Neutral',
      mostLikelyMiss: 'Solar ↓',
      missDirection: 'down',
      confidence: 'low',
    },
  },
};

const tightnessColors = {
  loose: 'bg-green-500',
  balanced: 'bg-yellow-500',
  tight: 'bg-red-500',
};

const confidenceColors = {
  high: 'bg-primary text-white',
  medium: 'bg-risk-medium text-white',
  low: 'bg-neutral-border text-foreground',
};

interface ExposureHedgeStripProps {
  selectedLocation: string;
}

export function ExposureHedgeStrip({ selectedLocation }: ExposureHedgeStripProps) {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const data = exposureDataByLocation[selectedLocation] || exposureDataByLocation['Sydney'];

  const getDriverIcon = (type: 'wind' | 'solar' | 'load') => {
    if (type === 'wind') return <Wind className="w-3 h-3 text-muted-foreground" />;
    if (type === 'solar') return <Sun className="w-3 h-3 text-muted-foreground" />;
    return <Zap className="w-3 h-3 text-muted-foreground" />;
  };

  const getDirectionIcon = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return <TrendingUp className="w-3 h-3" />;
    if (direction === 'down') return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  // Calculate bar width based on tightness value
  const getBarWidth = (value: number) => {
    const maxValue = 600; // Maximum expected absolute value
    return `${Math.min((Math.abs(value) / maxValue) * 100, 100)}%`;
  };

  return (
    <div className="my-4">
      <h4 className="text-xs font-medium text-muted-foreground mb-3">
        Exposure & Hedge Strip (Next 6–12h)
      </h4>

      {/* Compact 3-row scenario strip */}
      <div className="space-y-2 mb-3">
        {data.scenarios.map((scenario, idx) => (
          <div
            key={idx}
            className="relative group hover:bg-card/50 rounded transition-colors cursor-help px-2 py-1.5"
            onMouseEnter={() => setHoveredScenario(scenario.label)}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-3">
              {/* Label + Probability */}
              <div className="w-24 flex-shrink-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-foreground">{scenario.label}</span>
                  <span className="text-[9px] text-muted-foreground">({scenario.probability})</span>
                </div>
              </div>

              {/* Net Tightness Bar + Value */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tightnessColors[scenario.tightnessLevel]} transition-all duration-300`}
                    style={{ width: getBarWidth(scenario.netTightness) }}
                  ></div>
                </div>
                <span
                  className={`text-xs font-medium w-16 text-right ${
                    scenario.netTightness > 0
                      ? 'text-green-600'
                      : scenario.netTightness < 0
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {scenario.netTightness > 0 ? '+' : ''}
                  {scenario.netTightness} MW
                </span>
              </div>

              {/* Key Driver Icon */}
              <div className="w-16 flex items-center gap-1 justify-end">
                {getDriverIcon(scenario.driverIcon)}
                <span className="text-[10px] text-muted-foreground">{scenario.keyDriver}</span>
              </div>
            </div>

            {/* Tooltip */}
            {hoveredScenario === scenario.label && (
              <div className="absolute left-0 top-full mt-2 z-50 w-full p-2.5 bg-popover border border-neutral-border rounded-lg shadow-lg">
                <p className="text-xs text-foreground leading-relaxed">
                  Derived from directional skew + uncertainty bands. {scenario.assumption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hedge Bias Summary Line */}
      <div className="pt-2 border-t border-neutral-border">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Hedge Bias */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Hedge:</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 border border-primary/30 text-primary">
              {getDirectionIcon(data.hedgeSummary.hedgeBias)}
              <span>{data.hedgeSummary.hedgeBiasLabel}</span>
            </div>
          </div>

          <div className="h-3 w-px bg-neutral-border"></div>

          {/* Most Likely Miss */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Miss:</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-risk-high/10 border border-risk-high/30 text-risk-high">
              {getDirectionIcon(data.hedgeSummary.missDirection)}
              <span>{data.hedgeSummary.mostLikelyMiss}</span>
            </div>
          </div>

          <div className="h-3 w-px bg-neutral-border"></div>

          {/* Confidence */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Conf:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                confidenceColors[data.hedgeSummary.confidence]
              }`}
            >
              {data.hedgeSummary.confidence}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
