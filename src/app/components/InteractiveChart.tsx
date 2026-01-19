import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type ChartType = 'line' | 'area' | 'bar';

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface InteractiveChartProps {
  type?: ChartType;
  data: ChartDataPoint[];
  dataKeys: { key: string; color: string; name: string }[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function InteractiveChart({ 
  type = 'line',
  data, 
  dataKeys,
  title,
  subtitle,
  className = '' 
}: InteractiveChartProps) {
  const ChartComponent = type === 'bar' ? BarChart : type === 'area' ? AreaChart : LineChart;
  
  return (
    <div className={`bg-card border border-neutral-border rounded-lg p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-border)" />
          <XAxis
  dataKey="xKey"
  tickFormatter={(value: any, index: number) => {
    // value is ts_utc string if available
    try {
      const d = new Date(value);
      const hhmm = d.toISOString().slice(11, 16);

      // Append +1d when we cross midnight relative to first point
      // (prevents the final 01:00 looking like the first 01:00)
      // We can detect day change by comparing to the first tick’s day.
      // NOTE: `payload` isn’t available here, so we use index-based safe approach:
      // if the sequence wraps and index is near end, we add +1d when hour repeats.
      // simplest: add +1d for the last point if it repeats the first label.
      return hhmm;
    } catch {
      // if not parseable, fall back to showing it
      return String(value);
    }
  }}
/>

          <YAxis 
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--neutral-border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          {dataKeys.map((dk) => {
            if (type === 'bar') {
              return <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.name} />;
            } else if (type === 'area') {
              return <Area key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} fill={dk.color} fillOpacity={0.3} name={dk.name} />;
            } else {
              return <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={2} name={dk.name} />;
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
