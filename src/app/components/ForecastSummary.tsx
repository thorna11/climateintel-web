import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ForecastSummary() {
  const confidenceScore = 8.2;
  const bustRisks = [
    { type: 'Cold bias risk', level: 'low' },
    { type: 'Wind over-forecast', level: 'medium' },
  ];

  return (
    <div className="bg-gradient-to-br from-accent to-card border border-primary/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Meteorologist Summary
          </h2>
          <p className="text-xs text-muted-foreground">Human-in-the-Loop</p>
        </div>
      </div>

      {/* Summary Text */}
      <div className="mb-4 p-4 bg-card rounded-lg border border-neutral-border">
        <p className="text-sm text-foreground leading-relaxed mb-3">
          Models show good agreement on a developing low-pressure system approaching from the west, 
          bringing increased wind potential across Hong Kong and southern regions. Solar output remains 
          favorable through midday before cloud cover increases in the evening.
        </p>

        {/* What I'm Watching */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">What I'm watching:</p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-foreground">
              <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Wind ramp timing — ECMWF suggests 18:00, GFS indicates 20:00 onset</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-foreground">
              <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Cloud deck development — could reduce solar 2-3 hours earlier than forecast</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-foreground">
              <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Temperature sensitivity — HDD/CDD impacts on evening demand profile</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row: Confidence + Bust Risk + Market Impact */}
      <div className="grid grid-cols-3 gap-4">
        {/* Confidence Score */}
        <div className="bg-card border border-neutral-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Confidence</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-foreground">{confidenceScore}</span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
          <div className="mt-2 w-full bg-secondary rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${(confidenceScore / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Bust Risk */}
        <div className="bg-card border border-neutral-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            <p className="text-xs font-medium text-muted-foreground">Bust Risk Direction</p>
          </div>
          <div className="space-y-1.5">
            {bustRisks.map((risk, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-foreground">{risk.type}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    risk.level === 'low'
                      ? 'bg-risk-low/20 text-risk-low'
                      : risk.level === 'medium'
                      ? 'bg-risk-medium/20 text-risk-medium'
                      : 'bg-risk-high/20 text-risk-high'
                  }`}
                >
                  {risk.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Impact */}
        <div className="bg-gradient-to-br from-primary/5 to-green-vivid/5 border-2 border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-primary">Market Impact</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Estimated load risk:</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-semibold text-primary">+2.1</span>
            <span className="text-xs text-muted-foreground">GW</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">(upside scenario)</p>
        </div>
      </div>
    </div>
  );
}
