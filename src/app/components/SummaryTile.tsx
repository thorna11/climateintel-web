import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryTileProps {
  icon?: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function SummaryTile({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend,
  className = '' 
}: SummaryTileProps) {
  return (
    <div className={`bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/20 transition-colors ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-semibold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-3 bg-green-muted rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-neutral-border">
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-success' : 
            trend === 'down' ? 'text-risk-high' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} Trend
          </span>
        </div>
      )}
    </div>
  );
}