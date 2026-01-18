import React from 'react';
import { Shield, Users, Clock, Database } from 'lucide-react';

const parameters = [
  {
    category: 'Wind',
    icon: '💨',
    fields: ['Wind Gust', 'Hub Height Wind', 'Wind Ramp Rate', 'Turbulence Index'],
  },
  {
    category: 'Solar',
    icon: '☀️',
    fields: ['GHI', 'DNI', 'Cloud Cover', 'Irradiance Variability'],
  },
  {
    category: 'Demand',
    icon: '⚡',
    fields: ['HDD/CDD Anomaly', 'Load Deviation', 'Temperature Sensitivity', 'Peak Risk'],
  },
];

export function CredibilityStrip() {
  return (
    <div className="space-y-6">
      {/* Trust Indicators */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Trusted by energy trading and operations teams worldwide
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-sm font-semibold text-foreground">2,400+</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Uptime</p>
                <p className="text-sm font-semibold text-foreground">99.9%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Data Points/Day</p>
                <p className="text-sm font-semibold text-foreground">4.2M+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos Placeholder */}
        <div className="mt-4 pt-4 border-t border-neutral-border">
          <div className="flex items-center justify-center gap-8 opacity-40">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-24 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground"
              >
                Partner {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parameters Grid */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Our Parameters</h3>
          <button className="text-xs text-primary hover:text-primary-hover font-medium">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {parameters.map((param) => (
            <div
              key={param.category}
              className="bg-accent border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{param.icon}</span>
                <h4 className="text-sm font-medium text-foreground">{param.category}</h4>
              </div>
              <ul className="space-y-1">
                {param.fields.map((field) => (
                  <li key={field} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-primary/50 rounded-full flex-shrink-0"></div>
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
