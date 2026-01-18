import React, { useState } from 'react';
import { AlertTriangle, Wind, Cloud, Snowflake, Zap, Eye, MapPin } from 'lucide-react';

type AlertSeverity = 'warning' | 'watch' | 'low';

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  validTime: string;
  impact: string;
  location: string;
  icon: typeof Wind;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    severity: 'warning',
    title: 'High Wind Event',
    validTime: '18:00 - 22:00',
    impact: 'Wind gusts 35–45 kt → wind gen uncertainty + balancing risk.',
    location: 'Hong Kong',
    icon: Wind,
  },
  {
    id: '2',
    severity: 'watch',
    title: 'Solar Variability',
    validTime: '12:00 - 16:00',
    impact: 'Intermittent clouds → 30-40% solar output swings.',
    location: 'Singapore',
    icon: Cloud,
  },
  {
    id: '3',
    severity: 'low',
    title: 'Stable Conditions',
    validTime: '00:00 - 06:00',
    impact: 'Clear skies, steady winds → optimal renewable generation.',
    location: 'Tokyo',
    icon: Cloud,
  },
  {
    id: '4',
    severity: 'warning',
    title: 'Convective Activity',
    validTime: '14:00 - 18:00',
    impact: 'Thunderstorm probability 60-75% → grid stability concern.',
    location: 'Seoul',
    icon: Zap,
  },
  {
    id: '5',
    severity: 'watch',
    title: 'Visibility Reduction',
    validTime: '06:00 - 10:00',
    impact: 'Fog/mist reducing visibility <3 mi → solar forecast uncertainty.',
    location: 'Sydney',
    icon: Eye,
  },
];

const severityConfig = {
  warning: {
    bg: 'bg-risk-high/10',
    border: 'border-risk-high',
    stripe: 'bg-risk-high',
    text: 'text-risk-high',
    label: 'High',
  },
  watch: {
    bg: 'bg-risk-medium/10',
    border: 'border-risk-medium',
    stripe: 'bg-risk-medium',
    text: 'text-risk-medium',
    label: 'Medium',
  },
  low: {
    bg: 'bg-risk-low/10',
    border: 'border-risk-low',
    stripe: 'bg-risk-low',
    text: 'text-risk-low',
    label: 'Low',
  },
};

export function AlertsBanner() {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');

  const locations = ['All', 'Hong Kong', 'Seoul', 'Singapore', 'Sydney', 'Tokyo'];

  const filteredAlerts = mockAlerts.filter(alert => {
    const locationMatch = selectedLocation === 'All' || alert.location === selectedLocation;
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return locationMatch && severityMatch;
  });

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

      {/* Scrollable Alert Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = alert.icon;
          
          return (
            <div
              key={alert.id}
              className={`flex-shrink-0 w-80 border-l-4 ${config.border} ${config.bg} rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.stripe} bg-opacity-20`}>
                  <Icon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-medium ${config.text}`}>
                      {alert.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${config.stripe} text-white flex-shrink-0`}>
                      {config.label}
                    </span>
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

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No alerts match the selected filters.
        </div>
      )}
    </div>
  );
}