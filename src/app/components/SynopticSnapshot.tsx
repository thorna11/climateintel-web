import React, { useState } from 'react';
import { Map, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ChartCallout {
  text: string;
  position: { x: number; y: number };
}

interface ChartData {
  id: string;
  title: string;
  validTime: string;
  legendLabel: string;
  legendUnits: string;
  callouts: ChartCallout[];
  imageType: 'mslp-wind' | 'precip' | 'pwat-850' | '500mb-vort';
}

interface LocationChartConfig {
  charts: ChartData[];
  lngTag?: string;
}

type FieldSet = 'default' | 'wind-focus' | 'convective-focus';
type ValidTime = 'now' | '+6h' | '+12h' | '+24h';

interface SynopticSnapshotProps {
  selectedLocation: string;
}

// Location-aware chart configurations with preset logic
const locationChartConfigs: Record<string, LocationChartConfig> = {
  'Hong Kong': {
    charts: [
      {
        id: 'mslp-wind',
        title: 'MSLP + 10m Wind',
        validTime: 'Now',
        legendLabel: 'Wind Speed',
        legendUnits: 'kt',
        callouts: [
          { text: 'Tightened gradient → ramp risk window', position: { x: 45, y: 35 } },
        ],
        imageType: 'mslp-wind',
      },
      {
        id: 'precip',
        title: '24h Accumulated Precip',
        validTime: 'Now',
        legendLabel: 'Precipitation',
        legendUnits: 'mm',
        callouts: [],
        imageType: 'precip',
      },
      {
        id: 'pwat-850',
        title: 'PWAT Anomaly + 850mb Wind',
        validTime: 'Now',
        legendLabel: 'PWAT Anomaly',
        legendUnits: 'σ',
        callouts: [
          { text: 'Low-level jet / channeling → gust spikes', position: { x: 50, y: 60 } },
        ],
        imageType: 'pwat-850',
      },
      {
        id: '500mb-vort',
        title: '500mb Heights + Vorticity',
        validTime: 'Now',
        legendLabel: 'Vorticity',
        legendUnits: '×10⁻⁵ s⁻¹',
        callouts: [],
        imageType: '500mb-vort',
      },
    ],
  },
  'Seoul': {
    charts: [
      {
        id: 'mslp-wind',
        title: 'MSLP + 10m Wind',
        validTime: 'Now',
        legendLabel: 'Wind Speed',
        legendUnits: 'kt',
        callouts: [
          { text: 'Surface trough / boundary position', position: { x: 40, y: 40 } },
        ],
        imageType: 'mslp-wind',
      },
      {
        id: 'precip',
        title: '24h Accumulated Precip',
        validTime: 'Now',
        legendLabel: 'Precipitation',
        legendUnits: 'mm',
        callouts: [
          { text: 'Convective corridor / highest QPF zone', position: { x: 35, y: 55 } },
        ],
        imageType: 'precip',
      },
      {
        id: 'pwat-850',
        title: 'PWAT Anomaly + 850mb Wind',
        validTime: 'Now',
        legendLabel: 'PWAT Anomaly',
        legendUnits: 'σ',
        callouts: [
          { text: 'Moisture pooling → storm coverage risk', position: { x: 50, y: 50 } },
        ],
        imageType: 'pwat-850',
      },
      {
        id: '500mb-vort',
        title: '500mb Heights + Vorticity',
        validTime: 'Now',
        legendLabel: 'Vorticity',
        legendUnits: '×10⁻⁵ s⁻¹',
        callouts: [
          { text: 'Shortwave timing → earlier/later initiation', position: { x: 45, y: 30 } },
        ],
        imageType: '500mb-vort',
      },
    ],
  },
  'Singapore': {
    lngTag: 'LNG ops sensitivity: squall timing vs port windows',
    charts: [
      {
        id: 'mslp-wind',
        title: 'MSLP + 10m Wind',
        validTime: 'Now',
        legendLabel: 'Wind Speed',
        legendUnits: 'kt',
        callouts: [
          { text: 'Marine wind shifts → port/berth window sensitivity', position: { x: 55, y: 45 } },
        ],
        imageType: 'mslp-wind',
      },
      {
        id: 'precip',
        title: '24h Accumulated Precip',
        validTime: 'Now',
        legendLabel: 'Precipitation',
        legendUnits: 'mm',
        callouts: [
          { text: 'Convective timing windows (ops sensitivity)', position: { x: 50, y: 40 } },
        ],
        imageType: 'precip',
      },
      {
        id: 'pwat-850',
        title: 'PWAT Anomaly + 850mb Wind',
        validTime: 'Now',
        legendLabel: 'PWAT Anomaly',
        legendUnits: 'σ',
        callouts: [
          { text: 'Moisture surge → squall window risk', position: { x: 45, y: 50 } },
        ],
        imageType: 'pwat-850',
      },
      {
        id: '500mb-vort',
        title: '500mb Heights + Vorticity',
        validTime: 'Now',
        legendLabel: 'Vorticity',
        legendUnits: '×10⁻⁵ s⁻¹',
        callouts: [],
        imageType: '500mb-vort',
      },
    ],
  },
  'Tokyo': {
    charts: [
      {
        id: 'mslp-wind',
        title: 'MSLP + 10m Wind',
        validTime: 'Now',
        legendLabel: 'Wind Speed',
        legendUnits: 'kt',
        callouts: [
          { text: 'Gradient shift → wind timing changes', position: { x: 50, y: 35 } },
        ],
        imageType: 'mslp-wind',
      },
      {
        id: 'precip',
        title: '24h Accumulated Precip',
        validTime: 'Now',
        legendLabel: 'Precipitation',
        legendUnits: 'mm',
        callouts: [
          { text: 'Frontal precip shield placement', position: { x: 40, y: 50 } },
        ],
        imageType: 'precip',
      },
      {
        id: 'pwat-850',
        title: 'PWAT Anomaly + 850mb Wind',
        validTime: 'Now',
        legendLabel: 'PWAT Anomaly',
        legendUnits: 'σ',
        callouts: [
          { text: 'Cloud/column moisture → PV suppression risk', position: { x: 55, y: 55 } },
        ],
        imageType: 'pwat-850',
      },
      {
        id: '500mb-vort',
        title: '500mb Heights + Vorticity',
        validTime: 'Now',
        legendLabel: 'Vorticity',
        legendUnits: '×10⁻⁵ s⁻¹',
        callouts: [
          { text: 'Jet support → frontal timing', position: { x: 45, y: 25 } },
        ],
        imageType: '500mb-vort',
      },
    ],
  },
  'Sydney': {
    charts: [
      {
        id: 'mslp-wind',
        title: 'MSLP + 10m Wind',
        validTime: 'Now',
        legendLabel: 'Wind Speed',
        legendUnits: 'kt',
        callouts: [
          { text: 'Stable ridge → low spread', position: { x: 50, y: 40 } },
        ],
        imageType: 'mslp-wind',
      },
      {
        id: 'precip',
        title: '24h Accumulated Precip',
        validTime: 'Now',
        legendLabel: 'Precipitation',
        legendUnits: 'mm',
        callouts: [],
        imageType: 'precip',
      },
      {
        id: 'pwat-850',
        title: 'PWAT Anomaly + 850mb Wind',
        validTime: 'Now',
        legendLabel: 'PWAT Anomaly',
        legendUnits: 'σ',
        callouts: [
          { text: 'Weak gradient → minor timing risk', position: { x: 45, y: 50 } },
        ],
        imageType: 'pwat-850',
      },
      {
        id: '500mb-vort',
        title: '500mb Heights + Vorticity',
        validTime: 'Now',
        legendLabel: 'Vorticity',
        legendUnits: '×10⁻⁵ s⁻¹',
        callouts: [],
        imageType: '500mb-vort',
      },
    ],
  },
};

// Chart Thumbnail Component
interface ChartThumbnailProps {
  chart: ChartData;
  selectedLocation: string;
  onClick: () => void;
}

function ChartThumbnail({ chart, selectedLocation, onClick }: ChartThumbnailProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-card border border-neutral-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
    >
      {/* Chart Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 bg-gradient-to-b from-card/95 to-transparent">
        <span className="text-[10px] font-medium text-foreground">{chart.title}</span>
        <span className="text-[9px] text-muted-foreground">{chart.validTime}</span>
      </div>

      {/* Simulated Chart Area */}
      <div className="relative aspect-square bg-neutral-bg">
        {/* Simulated weather map - use gradient patterns to mimic charts */}
        {chart.imageType === 'mslp-wind' && (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-neutral-100 to-blue-50 opacity-60">
            {/* Simulated isobars */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 10 30 Q 30 25, 50 30 T 90 30" stroke="currentColor" className="text-neutral-400" strokeWidth="0.5" fill="none" />
              <path d="M 10 50 Q 30 45, 50 50 T 90 50" stroke="currentColor" className="text-neutral-400" strokeWidth="0.5" fill="none" />
              <path d="M 10 70 Q 30 65, 50 70 T 90 70" stroke="currentColor" className="text-neutral-400" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        )}
        {chart.imageType === 'precip' && (
          <div className="w-full h-full bg-gradient-to-br from-green-50 via-blue-100 to-blue-200 opacity-50"></div>
        )}
        {chart.imageType === 'pwat-850' && (
          <div className="w-full h-full bg-gradient-to-tr from-orange-50 via-yellow-100 to-green-50 opacity-40"></div>
        )}
        {chart.imageType === '500mb-vort' && (
          <div className="w-full h-full bg-gradient-to-bl from-purple-50 via-blue-50 to-neutral-100 opacity-50">
            {/* Simulated contours */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="40" cy="40" r="15" stroke="currentColor" className="text-neutral-300" strokeWidth="0.5" fill="none" />
              <circle cx="60" cy="60" r="20" stroke="currentColor" className="text-neutral-300" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        )}

        {/* Focus Box for Selected Location */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-primary rounded-full bg-primary/20 animate-pulse"></div>
        </div>

        {/* Callout Labels */}
        {chart.callouts.map((callout, idx) => (
          <div
            key={idx}
            className="absolute"
            style={{ left: `${callout.position.x}%`, top: `${callout.position.y}%` }}
          >
            <div className="relative">
              <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-primary/90 text-white text-[7px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-md border border-white/20 font-medium">
                {callout.text}
              </div>
              <div className="absolute w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm border-t border-neutral-border p-1">
        <div className="flex items-center justify-between text-[8px]">
          <span className="text-muted-foreground">{chart.legendLabel}</span>
          <span className="text-foreground font-medium">{chart.legendUnits}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}

// Chart Lightbox Modal Component
interface ChartLightboxModalProps {
  chart: ChartData;
  selectedLocation: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCharts: number;
}

function ChartLightboxModal({ chart, selectedLocation, onClose, onNext, onPrev, currentIndex, totalCharts }: ChartLightboxModalProps) {
  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-card hover:bg-accent transition-colors"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 p-3 rounded-full bg-card hover:bg-accent transition-colors"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 p-3 rounded-full bg-card hover:bg-accent transition-colors"
        disabled={currentIndex === totalCharts - 1}
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Chart Content */}
      <div className="relative max-w-4xl w-full mx-4">
        <div className="bg-card rounded-lg border border-neutral-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-border">
            <div>
              <h3 className="text-base font-medium text-foreground">{chart.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{selectedLocation}</span>
                <span>•</span>
                <span>Valid: {chart.validTime}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {currentIndex + 1} / {totalCharts}
            </div>
          </div>

          {/* Large Chart */}
          <div className="relative aspect-video bg-neutral-bg">
            {/* Simulated large chart */}
            {chart.imageType === 'mslp-wind' && (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-neutral-100 to-blue-50 opacity-70">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path d="M 5 20 Q 30 18, 50 20 T 95 20" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                  <path d="M 5 30 Q 30 28, 50 30 T 95 30" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                  <path d="M 5 40 Q 30 38, 50 40 T 95 40" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                  <path d="M 5 50 Q 30 48, 50 50 T 95 50" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                  <path d="M 5 60 Q 30 58, 50 60 T 95 60" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                  <path d="M 5 70 Q 30 68, 50 70 T 95 70" stroke="currentColor" className="text-neutral-500" strokeWidth="0.3" fill="none" />
                </svg>
              </div>
            )}
            {chart.imageType === 'precip' && (
              <div className="w-full h-full bg-gradient-to-br from-green-50 via-blue-100 to-blue-300 opacity-60"></div>
            )}
            {chart.imageType === 'pwat-850' && (
              <div className="w-full h-full bg-gradient-to-tr from-orange-100 via-yellow-100 to-green-100 opacity-50"></div>
            )}
            {chart.imageType === '500mb-vort' && (
              <div className="w-full h-full bg-gradient-to-bl from-purple-100 via-blue-100 to-neutral-100 opacity-60">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="35" cy="35" r="12" stroke="currentColor" className="text-neutral-400" strokeWidth="0.3" fill="none" />
                  <circle cx="35" cy="35" r="18" stroke="currentColor" className="text-neutral-400" strokeWidth="0.3" fill="none" />
                  <circle cx="65" cy="65" r="15" stroke="currentColor" className="text-neutral-400" strokeWidth="0.3" fill="none" />
                  <circle cx="65" cy="65" r="22" stroke="currentColor" className="text-neutral-400" strokeWidth="0.3" fill="none" />
                </svg>
              </div>
            )}

            {/* Focus Box for Selected Location */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary rounded-full bg-primary/20 animate-pulse"></div>
            </div>

            {/* Expanded Callout Labels */}
            {chart.callouts.map((callout, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{ left: `${callout.position.x}%`, top: `${callout.position.y}%` }}
              >
                <div className="relative">
                  <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs px-2.5 py-1 rounded shadow-lg border border-white/20 font-medium whitespace-nowrap">
                    {callout.text}
                  </div>
                  <div className="absolute w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-neutral-border bg-accent">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{chart.legendLabel}:</span>
              <span className="font-medium text-foreground">{chart.legendUnits}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}

// Main Synoptic Snapshot Component
export function SynopticSnapshot({ selectedLocation }: SynopticSnapshotProps) {
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);
  const [validTime, setValidTime] = useState<ValidTime>('now');
  const [fieldSet, setFieldSet] = useState<FieldSet>('default');

  const config = locationChartConfigs[selectedLocation] || locationChartConfigs['Sydney'];
  const charts = config.charts;

  const handleChartClick = (chart: ChartData) => {
    setSelectedChart(chart);
  };

  const handleCloseModal = () => {
    setSelectedChart(null);
  };

  const handleNext = () => {
    if (!selectedChart) return;
    const currentIndex = charts.findIndex(c => c.id === selectedChart.id);
    if (currentIndex < charts.length - 1) {
      setSelectedChart(charts[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedChart) return;
    const currentIndex = charts.findIndex(c => c.id === selectedChart.id);
    if (currentIndex > 0) {
      setSelectedChart(charts[currentIndex - 1]);
    }
  };

  const currentIndex = selectedChart ? charts.findIndex(c => c.id === selectedChart.id) : 0;

  return (
    <>
      <div className="bg-card border border-neutral-border rounded-lg p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Synoptic Snapshot</h3>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Charts update with selected location • Click to expand
            </p>
          </div>

          {/* Chart Selector Controls */}
          <div className="flex items-center gap-2">
            <select
              value={validTime}
              onChange={(e) => setValidTime(e.target.value as ValidTime)}
              className="px-2 py-1 bg-input-background border border-neutral-border rounded text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="now">Now</option>
              <option value="+6h">+6h</option>
              <option value="+12h">+12h</option>
              <option value="+24h">+24h</option>
            </select>

            <select
              value={fieldSet}
              onChange={(e) => setFieldSet(e.target.value as FieldSet)}
              className="px-2 py-1 bg-input-background border border-neutral-border rounded text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="default">Default</option>
              <option value="wind-focus">Wind-focus</option>
              <option value="convective-focus">Convective-focus</option>
            </select>
          </div>
        </div>

        {/* LNG Tag for Singapore */}
        {config.lngTag && (
          <div className="mb-3 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] text-primary font-medium">
            {config.lngTag}
          </div>
        )}

        {/* 2×2 Chart Grid */}
        <div className="grid grid-cols-2 gap-2">
          {charts.map((chart) => (
            <ChartThumbnail
              key={chart.id}
              chart={chart}
              selectedLocation={selectedLocation}
              onClick={() => handleChartClick(chart)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedChart && (
        <ChartLightboxModal
          chart={selectedChart}
          selectedLocation={selectedLocation}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          currentIndex={currentIndex}
          totalCharts={charts.length}
        />
      )}
    </>
  );
}