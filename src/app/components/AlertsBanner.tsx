import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Wind, Cloud, Snowflake, Zap, Eye, MapPin, TrendingUp, TrendingDown, Minus, Info, Thermometer, Droplets } from 'lucide-react';
import { createPortal } from 'react-dom';

type AlertSeverity = 'warning' | 'watch' | 'low';

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  validTime: string;
  impact: string;
  location: string;
  icon: typeof Wind;
  directionalSkew: {
    direction: 'higher' | 'lower' | 'earlier' | 'later' | 'neutral';
    probability: string;
    whyItMatters: string;
  };
}

const mockAlerts: Alert[] = [
  // Beijing
  {
    id: 'beijing-1',
    severity: 'warning',
    title: 'Extreme Cold Event',
    validTime: '00:00 - 12:00',
    impact: 'Siberian high brings temps −8 to −12°C → heating load +2.5 GW.',
    location: 'Beijing',
    icon: Snowflake,
    directionalSkew: {
      direction: 'higher',
      probability: '78%',
      whyItMatters: 'Load spike extreme → coal plant stress + emissions risk',
    },
  },
  {
    id: 'beijing-2',
    severity: 'watch',
    title: 'Wind Ramp Event',
    validTime: '06:00 - 18:00',
    impact: 'NW gradient tightening → wind gen ramps +400 MW with volatility.',
    location: 'Beijing',
    icon: Wind,
    directionalSkew: {
      direction: 'higher',
      probability: '65%',
      whyItMatters: 'Wind gen spikes → curtailment risk at peak gusts',
    },
  },
  
  // Seoul
  {
    id: 'seoul-1',
    severity: 'warning',
    title: 'Snow Timing Risk',
    validTime: '14:00 - 20:00',
    impact: 'Orographic snow 3-6 cm → timing uncertainty ±2h shifts load curve.',
    location: 'Seoul',
    icon: Snowflake,
    directionalSkew: {
      direction: 'earlier',
      probability: '65%',
      whyItMatters: 'Snow arrives 2h early → transport disruption + load spike',
    },
  },
  {
    id: 'seoul-2',
    severity: 'warning',
    title: 'Heating Load Spike',
    validTime: 'All periods',
    impact: 'Cold advection −4 to −6°C → heating demand +1.8 GW.',
    location: 'Seoul',
    icon: Thermometer,
    directionalSkew: {
      direction: 'higher',
      probability: '72%',
      whyItMatters: 'Temps colder than forecast → extreme heating demand',
    },
  },

  // Osaka
  {
    id: 'osaka-1',
    severity: 'watch',
    title: 'Solar PV Collapse',
    validTime: '10:00 - 16:00',
    impact: 'Winter monsoon cloud deck → solar output drops 50-70%.',
    location: 'Osaka',
    icon: Cloud,
    directionalSkew: {
      direction: 'lower',
      probability: '68%',
      whyItMatters: 'Cloud deck earlier + longer → extended solar suppression',
    },
  },
  {
    id: 'osaka-2',
    severity: 'low',
    title: 'Cloud Timing Variance',
    validTime: '09:00 - 17:00',
    impact: 'Sea-effect clouds → arrival timing ±2-4h uncertainty.',
    location: 'Osaka',
    icon: Cloud,
    directionalSkew: {
      direction: 'earlier',
      probability: '62%',
      whyItMatters: 'Earlier cloud development → solar PV ramp delayed',
    },
  },

  // Tokyo
  {
    id: 'tokyo-1',
    severity: 'watch',
    title: 'Front Timing Uncertainty',
    validTime: '12:00 - 16:00',
    impact: 'Coastal front + sea breeze → solar/wind timing variance ±2-3h.',
    location: 'Tokyo',
    icon: Cloud,
    directionalSkew: {
      direction: 'earlier',
      probability: '55%',
      whyItMatters: 'Front arrives early → solar PV drops 40-60%',
    },
  },
  {
    id: 'tokyo-2',
    severity: 'watch',
    title: 'AM Cold Load Spike',
    validTime: '06:00 - 10:00',
    impact: 'Morning temps 2-3°C colder → heating demand +0.7 GW.',
    location: 'Tokyo',
    icon: Thermometer,
    directionalSkew: {
      direction: 'higher',
      probability: '60%',
      whyItMatters: 'AM cold snap → morning peak load spike',
    },
  },

  // Shanghai
  {
    id: 'shanghai-1',
    severity: 'warning',
    title: 'Cold Rain + Marine Layer',
    validTime: '08:00 - 18:00',
    impact: 'Precip 5-12 mm + marine layer → solar PV drops 70-85%.',
    location: 'Shanghai',
    icon: Droplets,
    directionalSkew: {
      direction: 'lower',
      probability: '72%',
      whyItMatters: 'Extended marine layer → solar collapse all day',
    },
  },
  {
    id: 'shanghai-2',
    severity: 'warning',
    title: 'Heating Load Spike',
    validTime: 'All periods',
    impact: 'Temps 2-4°C colder + wet → heating demand +2.0 GW.',
    location: 'Shanghai',
    icon: Thermometer,
    directionalSkew: {
      direction: 'higher',
      probability: '75%',
      whyItMatters: 'Wet cold amplifies heating needs → load spike',
    },
  },

  // Chongqing
  {
    id: 'chongqing-1',
    severity: 'warning',
    title: 'Basin Inversion Stratus',
    validTime: 'All daylight',
    impact: 'Persistent stratus deck → solar PV output drops 80-90%.',
    location: 'Chongqing',
    icon: Cloud,
    directionalSkew: {
      direction: 'lower',
      probability: '85%',
      whyItMatters: 'Stratus persists all day → near-zero solar PV',
    },
  },
  {
    id: 'chongqing-2',
    severity: 'warning',
    title: 'Extreme Load Spike',
    validTime: 'All periods',
    impact: 'Trapped cold pool in basin → heating demand +2.2 GW.',
    location: 'Chongqing',
    icon: Thermometer,
    directionalSkew: {
      direction: 'higher',
      probability: '78%',
      whyItMatters: 'Basin trapping → extreme sustained heating load',
    },
  },

  // Guangzhou
  {
    id: 'guangzhou-1',
    severity: 'watch',
    title: 'Squall Line Timing',
    validTime: '14:00 - 18:00',
    impact: 'Moist surge → squalls with 40-50 kt gusts + 8-15 mm precip.',
    location: 'Guangzhou',
    icon: Zap,
    directionalSkew: {
      direction: 'earlier',
      probability: '62%',
      whyItMatters: 'Squalls arrive 2h early → solar collapse + wind volatility',
    },
  },
  {
    id: 'guangzhou-2',
    severity: 'watch',
    title: 'Solar Variability',
    validTime: '12:00 - 19:00',
    impact: 'Cloud deck + squalls → solar output drops 60-80%.',
    location: 'Guangzhou',
    icon: Cloud,
    directionalSkew: {
      direction: 'lower',
      probability: '65%',
      whyItMatters: 'Extended cloud cover → prolonged solar suppression',
    },
  },
];

const severityConfig = {
  warning: {
    bg: 'bg-risk-high/10',
    border: 'border-risk-high',
    stripe: 'bg-risk-high',
    text: 'text-risk-high',
    label: 'High',
    dotBg: 'bg-risk-high',
  },
  watch: {
    bg: 'bg-risk-medium/10',
    border: 'border-risk-medium',
    stripe: 'bg-risk-medium',
    text: 'text-risk-medium',
    label: 'Medium',
    dotBg: 'bg-risk-medium',
  },
  low: {
    bg: 'bg-risk-low/10',
    border: 'border-risk-low',
    stripe: 'bg-risk-low',
    text: 'text-risk-low',
    label: 'Low',
    dotBg: 'bg-risk-low',
  },
};

// Reusable Probability Dot Component
interface ProbabilityDotProps {
  probability: string;
  severity: AlertSeverity;
  direction: 'higher' | 'lower' | 'earlier' | 'later' | 'neutral';
  onHover: (isHovered: boolean) => void;
}

function ProbabilityDot({ probability, severity, direction, onHover }: ProbabilityDotProps) {
  const config = severityConfig[severity];
  
  const getDirectionIcon = () => {
    if (direction === 'higher') return '↑';
    if (direction === 'lower') return '↓';
    if (direction === 'earlier') return '◄';
    if (direction === 'later') return '►';
    return '↔';
  };

  return (
    <div
      className={`relative flex items-center justify-center w-12 h-12 rounded-full ${config.dotBg} text-white shadow-md border-2 border-white hover:scale-110 hover:shadow-lg transition-all cursor-help`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold leading-none">{probability}</span>
        <span className="text-xs leading-none mt-0.5">{getDirectionIcon()}</span>
      </div>
      
      {/* Info affordance icon */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-neutral-border flex items-center justify-center">
        <Info className="w-2.5 h-2.5 text-muted-foreground" />
      </div>
    </div>
  );
}

// Reusable Alert Skew Tooltip Popover Component (Floating Overlay with Smart Positioning)
interface SkewTooltipPopoverProps {
  targetRef: React.RefObject<HTMLDivElement>;
  direction: 'higher' | 'lower' | 'earlier' | 'later' | 'neutral';
  probability: string;
  timeWindow: string;
  whyItMatters: string;
  severity: AlertSeverity;
  isVisible: boolean;
}

function SkewTooltipPopover({ targetRef, direction, probability, timeWindow, whyItMatters, severity, isVisible }: SkewTooltipPopoverProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top-right' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' });
  const config = severityConfig[severity];

  useEffect(() => {
    if (!isVisible || !targetRef.current || !tooltipRef.current) return;
    if (typeof window === 'undefined') return;

    const updatePosition = () => {
      if (!targetRef.current || !tooltipRef.current) return;
      if (typeof window === 'undefined') return;

      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const OFFSET = 12; // nudge offset
      const TOOLTIP_WIDTH = 240; // max tooltip width
      const TOOLTIP_HEIGHT = tooltipRect.height || 140; // estimated height

      let top = targetRect.top;
      let left = targetRect.left;
      let placement: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

      // Horizontal positioning (flip left/right)
      const spaceOnRight = viewportWidth - targetRect.right;
      const spaceOnLeft = targetRect.left;

      if (spaceOnRight >= TOOLTIP_WIDTH + OFFSET) {
        // Default: place to the right
        left = targetRect.right + OFFSET;
        placement = 'top-right';
      } else if (spaceOnLeft >= TOOLTIP_WIDTH + OFFSET) {
        // Flip: place to the left
        left = targetRect.left - TOOLTIP_WIDTH - OFFSET;
        placement = 'top-left';
      } else {
        // Centered fallback
        left = Math.max(OFFSET, Math.min(viewportWidth - TOOLTIP_WIDTH - OFFSET, targetRect.left - TOOLTIP_WIDTH / 2 + targetRect.width / 2));
      }

      // Vertical positioning (flip top/bottom)
      const spaceAbove = targetRect.top;
      const spaceBelow = viewportHeight - targetRect.bottom;

      if (spaceAbove >= TOOLTIP_HEIGHT + OFFSET) {
        // Default: place above
        top = targetRect.top - TOOLTIP_HEIGHT - OFFSET;
        placement = placement.startsWith('top') ? placement : placement === 'bottom-right' ? 'top-right' : 'top-left';
      } else if (spaceBelow >= TOOLTIP_HEIGHT + OFFSET) {
        // Flip: place below
        top = targetRect.bottom + OFFSET;
        placement = placement === 'top-right' ? 'bottom-right' : 'bottom-left';
      } else {
        // Align with target if insufficient space
        top = Math.max(OFFSET, Math.min(viewportHeight - TOOLTIP_HEIGHT - OFFSET, targetRect.top));
      }

      setPosition({ top, left, placement });
    };

    updatePosition();
    
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      }
    };
  }, [isVisible, targetRef]);

  if (!isVisible) return null;

  const getDirectionIcon = () => {
    if (direction === 'higher') return '↑';
    if (direction === 'lower') return '↓';
    if (direction === 'earlier') return '◄';
    if (direction === 'later') return '►';
    return '↔';
  };

  const getDirectionLabel = () => {
    if (direction === 'higher') return 'Higher than forecast';
    if (direction === 'lower') return 'Lower than forecast';
    if (direction === 'earlier') return 'Earlier than forecast';
    if (direction === 'later') return 'Later than forecast';
    return 'Neutral';
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] w-60 bg-popover border-2 border-neutral-border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Color accent bar */}
      <div className={`h-1 ${config.stripe}`}></div>
      
      {/* Compact content (3-4 lines max) */}
      <div className="p-2.5 space-y-1.5">
        {/* Header: Directional Skew + arrow */}
        <div className="flex items-center gap-1.5">
          <span className={`text-base font-bold ${config.text}`}>{getDirectionIcon()}</span>
          <span className="text-xs font-medium text-foreground">{getDirectionLabel()}</span>
        </div>

        {/* Two compact rows */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Prob:</span>
            <span className={`font-bold ${config.text}`}>{probability}</span>
          </div>
          <div className="h-3 w-px bg-neutral-border"></div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Window:</span>
            <span className="text-foreground">{timeWindow}</span>
          </div>
        </div>

        {/* Why it matters (1 line, truncated) */}
        <p className="text-[10px] text-muted-foreground leading-tight truncate" title={whyItMatters}>
          {whyItMatters}
        </p>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(tooltipContent, document.body) : null;
}

interface AlertsBannerProps {
  selectedLocation?: string;
}

export function AlertsBanner({ selectedLocation: propSelectedLocation }: AlertsBannerProps = {}) {
  const [selectedLocation, setSelectedLocation] = useState(propSelectedLocation || 'All');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [hoveredAlertId, setHoveredAlertId] = useState<string | null>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Update internal state when prop changes
  useEffect(() => {
    if (propSelectedLocation) {
      setSelectedLocation(propSelectedLocation);
    }
  }, [propSelectedLocation]);

  const locations = ['All', 'Beijing', 'Seoul', 'Osaka', 'Tokyo', 'Shanghai', 'Chongqing', 'Guangzhou'];

  const filteredAlerts = mockAlerts
    .filter(alert => {
      const locationMatch = selectedLocation === 'All' || alert.location === selectedLocation;
      const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      return locationMatch && severityMatch;
    })
    .slice(0, 4); // Hard cap: max 4 alerts visible

  return (
    <div className="bg-card border border-neutral-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium text-foreground">
            Active Alerts
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Severity Chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedSeverity === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            {(['warning', 'watch', 'low'] as AlertSeverity[]).map((severity) => (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedSeverity === severity
                    ? severityConfig[severity].stripe + ' text-white'
                    : 'bg-secondary text-muted-foreground hover:bg-muted'
                }`}
              >
                {severityConfig[severity].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Alert Cards with safe zone padding */}
      <div className="flex gap-4 overflow-x-auto pb-2 px-4 -mx-4">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = alert.icon;
          
          return (
            <div
              key={alert.id}
              className={`relative flex-shrink-0 w-80 border-l-4 ${config.border} ${config.bg} rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.stripe} bg-opacity-20`}>
                  <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className={`text-sm font-medium ${config.text} flex-1`}>
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${config.stripe} text-white`}>
                        {config.label}
                      </span>
                      
                      {/* Probability Dot with hover tooltip */}
                      <div
                        ref={(el) => { dotRefs.current[alert.id] = el; }}
                        className="relative"
                      >
                        <ProbabilityDot
                          probability={alert.directionalSkew.probability}
                          severity={alert.severity}
                          direction={alert.directionalSkew.direction}
                          onHover={(isHovered) => setHoveredAlertId(isHovered ? alert.id : null)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.location}</span>
                    <span>•</span>
                    <span>{alert.validTime}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {alert.impact}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Tooltips (rendered outside scroll container) */}
      {hoveredAlertId && filteredAlerts.find(a => a.id === hoveredAlertId) && (() => {
        const alert = filteredAlerts.find(a => a.id === hoveredAlertId)!;
        const targetRef = { current: dotRefs.current[hoveredAlertId] };
        
        return (
          <SkewTooltipPopover
            targetRef={targetRef}
            direction={alert.directionalSkew.direction}
            probability={alert.directionalSkew.probability}
            timeWindow={alert.validTime}
            whyItMatters={alert.directionalSkew.whyItMatters}
            severity={alert.severity}
            isVisible={true}
          />
        );
      })()}

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No alerts match the selected filters.
        </div>
      )}
    </div>
  );
}