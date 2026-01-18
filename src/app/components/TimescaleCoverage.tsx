import React from 'react';

interface TimescaleItem {
  label: string;
  value: string;
  active: boolean;
}

interface TimescaleCoverageProps {
  timescales: TimescaleItem[];
  className?: string;
}

export function TimescaleCoverage({ timescales, className = '' }: TimescaleCoverageProps) {
  return (
    <div className={`bg-card border border-neutral-border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium text-foreground mb-4">Timescale Coverage</h3>
      <div className="space-y-3">
        {timescales.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className={`text-sm ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
            <span className={`text-sm font-medium ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
