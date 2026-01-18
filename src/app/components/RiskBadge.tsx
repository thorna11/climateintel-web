import React from 'react';

export type RiskLevel = 'high' | 'medium' | 'low';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  className?: string;
}

export function RiskBadge({ level, label, className = '' }: RiskBadgeProps) {
  const colors = {
    high: 'bg-risk-high text-risk-high-foreground',
    medium: 'bg-risk-medium text-risk-medium-foreground',
    low: 'bg-risk-low text-risk-low-foreground',
  };

  const displayLabel = label || level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[level]} ${className}`}
    >
      {displayLabel}
    </span>
  );
}
