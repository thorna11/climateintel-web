import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, MapPin } from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';
type Uncertainty = 'Low' | 'Med' | 'High';

interface RiskCell {
  probability: number;
  uncertainty: Uncertainty;
  models: string[];
}

interface RiskRow {
  id: string;
  label: string;
  subRows?: { id: string; label: string }[];
  data: RiskCell[];
}

const timeBlocks = [
  '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00',
  '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00',
  '00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00',
];

const generateMockData = (): RiskCell[] => {
  return timeBlocks.map((_, idx) => {
    const baseProb = Math.random() * 100;
    return {
      probability: Math.round(baseProb),
      uncertainty: baseProb > 70 ? 'High' : baseProb > 40 ? 'Med' : 'Low' as Uncertainty,
      models: ['ECMWF', 'GFS', 'NBM'],
    };
  });
};

const riskCategories: RiskRow[] = [
  {
    id: 'wind',
    label: 'Wind',
    subRows: [
      { id: 'wind-gust-35', label: 'Gusts >35 kt' },
      { id: 'wind-gust-50', label: 'Gusts >50 kt' },
      { id: 'wind-ramp', label: 'Wind ramp probability' },
    ],
    data: generateMockData(),
  },
  {
    id: 'solar',
    label: 'Solar',
    subRows: [
      { id: 'solar-irradiance', label: 'Irradiance volatility' },
      { id: 'solar-cloud', label: 'Cloud-driven variability' },
    ],
    data: generateMockData(),
  },
  {
    id: 'winter',
    label: 'Winter',
    subRows: [
      { id: 'snow-01', label: 'Snow >0.1 in' },
      { id: 'snow-2', label: 'Snow >2 in' },
      { id: 'snow-6', label: 'Snow >6 in' },
      { id: 'freezing-rain', label: 'Freezing rain' },
    ],
    data: generateMockData(),
  },
  {
    id: 'convective',
    label: 'Convective',
    subRows: [
      { id: 'thunderstorm', label: 'Thunderstorm probability' },
      { id: 'hail', label: 'Hail probability' },
      { id: 'tornado', label: 'Tornado probability' },
    ],
    data: generateMockData(),
  },
  {
    id: 'visibility',
    label: 'Visibility/Ceiling',
    subRows: [
      { id: 'vis-1', label: 'Vis <1 mi' },
      { id: 'vis-3', label: 'Vis <3 mi' },
      { id: 'vis-5', label: 'Vis <5 mi' },
    ],
    data: generateMockData(),
  },
  {
    id: 'tropical',
    label: 'Tropical',
    subRows: [
      { id: 'hurricane', label: 'Hurricane/Typhoon threat' },
    ],
    data: generateMockData(),
  },
];

const getRiskColor = (probability: number): string => {
  if (probability >= 60) return 'bg-risk-high/20 border-risk-high/40';
  if (probability >= 30) return 'bg-risk-medium/20 border-risk-medium/40';
  return 'bg-risk-low/20 border-risk-low/40';
};

const getRiskTextColor = (probability: number): string => {
  if (probability >= 60) return 'text-risk-high';
  if (probability >= 30) return 'text-risk-medium';
  return 'text-risk-low';
};

interface WeatherRiskMatrixProps {
  selectedLocation: string;
}

export function WeatherRiskMatrix({ selectedLocation }: WeatherRiskMatrixProps) {
  const [selectedModel, setSelectedModel] = useState<'ECMWF' | 'GFS' | 'ICON' | 'UKMET'>('ECMWF');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['wind', 'solar'])
  );
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: number } | null>(null);
  
  const topScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Sync scrollbars
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const mainScroll = mainScrollRef.current;

    if (!topScroll || !mainScroll) return;

    const syncFromTop = () => {
      if (mainScroll) mainScroll.scrollLeft = topScroll.scrollLeft;
    };

    const syncFromMain = () => {
      if (topScroll) topScroll.scrollLeft = mainScroll.scrollLeft;
    };

    topScroll.addEventListener('scroll', syncFromTop);
    mainScroll.addEventListener('scroll', syncFromMain);

    return () => {
      topScroll.removeEventListener('scroll', syncFromTop);
      mainScroll.removeEventListener('scroll', syncFromMain);
    };
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const nowIndex = 5; // Mock "now" position

  // Get run time based on selected model
  const getModelRunTime = () => {
    const runTimes: Record<string, string> = {
      'ECMWF': '00Z',
      'GFS': '12Z',
      'ICON': '00Z',
      'UKMET': '12Z',
    };
    return runTimes[selectedModel] || '00Z';
  };

  return (
    <div className="bg-card border border-neutral-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-foreground mb-1">
            High-Impact Weather Risk Matrix
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Location: <span className="font-medium text-foreground">{selectedLocation}</span></span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'ECMWF' | 'GFS' | 'ICON' | 'UKMET')}
              className="px-3 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="ECMWF">ECMWF</option>
              <option value="GFS">GFS</option>
              <option value="ICON">ICON</option>
              <option value="UKMET">UKMET (Global)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Container */}
      <div className="border border-neutral-border rounded-lg overflow-hidden">
        {/* Top Scrollbar */}
        <div ref={topScrollRef} className="overflow-x-auto bg-neutral-bg border-b border-neutral-border">
          <div style={{ height: '12px', width: `${timeBlocks.length * 80 + 224}px` }}></div>
        </div>

        {/* Main Scroll Area */}
        <div ref={mainScrollRef} className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Time Header - Sticky */}
            <div className="flex bg-neutral-bg border-b border-neutral-border sticky top-0 z-20">
              <div className="w-56 flex-shrink-0 px-4 py-3 bg-neutral-bg sticky left-0 z-30 border-r border-neutral-border">
                <span className="text-sm font-medium text-muted-foreground">Risk Parameter</span>
              </div>
              <div className="flex">
                {timeBlocks.map((time, idx) => (
                  <div
                    key={idx}
                    className={`w-20 flex-shrink-0 px-2 py-3 text-center border-r border-neutral-border last:border-r-0 ${
                      idx === nowIndex ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="text-xs font-medium text-foreground">{time}</div>
                    {idx === nowIndex && (
                      <div className="text-[10px] text-primary font-medium mt-0.5">NOW</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Categories */}
            {riskCategories.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-accent hover:bg-accent/70 border-b border-neutral-border transition-colors text-left"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                </button>

                {/* Sub-rows */}
                {expandedCategories.has(category.id) && category.subRows?.map((subRow) => (
                  <div key={subRow.id} className="flex border-b border-neutral-border hover:bg-neutral-bg/50">
                    <div className="w-56 flex-shrink-0 px-4 py-3 sticky left-0 z-10 bg-card border-r border-neutral-border">
                      <span className="text-xs text-muted-foreground pl-6">{subRow.label}</span>
                    </div>
                    <div className="flex">
                      {category.data.slice(0, timeBlocks.length).map((cell, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredCell({ row: subRow.id, col: idx })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-20 flex-shrink-0 px-2 py-3 border-r border-neutral-border last:border-r-0 relative group cursor-pointer ${
                            idx === nowIndex ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className={`text-center p-2 rounded border ${getRiskColor(cell.probability)}`}>
                            <div className={`text-lg font-semibold ${getRiskTextColor(cell.probability)}`}>
                              {cell.probability}
                            </div>
                            <div className="text-[10px] text-muted-foreground">%</div>
                          </div>

                          {/* Tooltip */}
                          {hoveredCell?.row === subRow.id && hoveredCell?.col === idx && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-popover border border-neutral-border rounded-lg shadow-lg z-50 w-56 pointer-events-none">
                              <div className="text-xs space-y-1">
                                <div className="font-medium text-foreground">
                                  Probability: {cell.probability}%
                                </div>
                                <div className="text-muted-foreground">
                                  Model: <span className="font-medium text-primary">{selectedModel}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Run: <span className="font-medium">{getModelRunTime()}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Uncertainty: <span className="font-medium">{cell.uncertainty}</span>
                                </div>
                                <div className="text-muted-foreground pt-1 border-t border-border">
                                  3-hour window ±30 min
                                </div>
                                <div className="text-muted-foreground text-[10px] italic">
                                  Higher uncertainty indicates greater model disagreement
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-border">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-risk-low/20 border border-risk-low/40 rounded"></div>
            <span className="text-muted-foreground">Low (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-risk-medium/20 border border-risk-medium/40 rounded"></div>
            <span className="text-muted-foreground">Medium (30-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-risk-high/20 border border-risk-high/40 rounded"></div>
            <span className="text-muted-foreground">High (&gt;60%)</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <AlertTriangle className="inline w-3 h-3 mr-1" />
          Hover cells for detailed model info
        </div>
      </div>
    </div>
  );
}