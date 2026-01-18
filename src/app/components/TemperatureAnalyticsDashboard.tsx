import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Thermometer, 
  Snowflake, 
  Flame, 
  Wind, 
  Sun, 
  TrendingUp,
  TrendingDown,
  AlertTriangle 
} from 'lucide-react';
import { RiskBadge } from '@/app/components/RiskBadge';

interface TemperatureDataPoint {
  time: string;
  timestamp: number;
  actualTemp: number;
  forecastTemp: number;
  normalTemp: number;
  hdd: number;
  cdd: number;
  windGeneration: number;
  solarGeneration: number;
  totalDemand: number;
}

// Generate realistic temperature data
const generateTemperatureData = (): TemperatureDataPoint[] => {
  const data: TemperatureDataPoint[] = [];
  const baseTemp = 45;
  const normalTemp = 50;
  
  for (let i = 0; i < 48; i++) {
    const hour = i;
    const timeLabel = i < 24 ? `${i.toString().padStart(2, '0')}:00` : `+${i - 24}h`;
    
    // Temperature varies with time of day
    const dailyVariation = Math.sin((hour % 24) / 24 * Math.PI * 2 - Math.PI / 2) * 12;
    const actual = baseTemp + dailyVariation + (Math.random() - 0.5) * 4;
    const forecast = baseTemp + dailyVariation + (Math.random() - 0.5) * 2;
    const normal = normalTemp + dailyVariation * 0.7;
    
    // HDD = max(0, 65 - temp), CDD = max(0, temp - 65)
    const hdd = Math.max(0, 65 - actual);
    const cdd = Math.max(0, actual - 65);
    
    // Generation varies with temperature and time
    const windGen = 300 + Math.random() * 200 + (65 - actual) * 5; // Higher in cooler temps
    const solarGen = hour % 24 >= 6 && hour % 24 <= 18 ? 150 + Math.random() * 100 : 10;
    
    // Demand increases with extreme temps
    const demandBase = 800;
    const demandFromHeat = cdd * 8; // AC load
    const demandFromCold = hdd * 6; // Heating load
    const totalDemand = demandBase + demandFromHeat + demandFromCold + Math.random() * 100;
    
    data.push({
      time: timeLabel,
      timestamp: Date.now() - (48 - i) * 3600000,
      actualTemp: Math.round(actual * 10) / 10,
      forecastTemp: Math.round(forecast * 10) / 10,
      normalTemp: Math.round(normal * 10) / 10,
      hdd: Math.round(hdd * 10) / 10,
      cdd: Math.round(cdd * 10) / 10,
      windGeneration: Math.round(windGen),
      solarGeneration: Math.round(solarGen),
      totalDemand: Math.round(totalDemand)
    });
  }
  
  return data;
};

export function TemperatureAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState(48); // hours
  const [showForecast, setShowForecast] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ERCOT North');
  const [data] = useState<TemperatureDataPoint[]>(generateTemperatureData());
  
  // Filter data based on time range
  const filteredData = data.slice(-timeRange);
  const currentData = filteredData[filteredData.length - 1];
  const previousData = filteredData[filteredData.length - 2];
  
  // Calculate summary metrics
  const avgTemp = filteredData.reduce((sum, d) => sum + d.actualTemp, 0) / filteredData.length;
  const tempDeviation = avgTemp - currentData.normalTemp;
  const totalHDD = filteredData.reduce((sum, d) => sum + d.hdd, 0);
  const totalCDD = filteredData.reduce((sum, d) => sum + d.cdd, 0);
  const avgRenewableGen = filteredData.reduce((sum, d) => sum + d.windGeneration + d.solarGeneration, 0) / filteredData.length;
  const renewablePct = (avgRenewableGen / currentData.totalDemand) * 100;
  
  // Determine if temps are rising or falling
  const tempTrend = currentData.actualTemp > previousData.actualTemp ? 'up' : 'down';
  const demandTrend = currentData.totalDemand > previousData.totalDemand ? 'up' : 'down';
  
  // Alert conditions
  const extremeCold = currentData.actualTemp < 30;
  const extremeHeat = currentData.actualTemp > 85;
  const highDemand = currentData.totalDemand > 1000;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Time Range</label>
              <div className="flex gap-2">
                {[12, 24, 48].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setTimeRange(hours)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === hours
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 bg-input-background rounded-lg text-sm border border-neutral-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>ERCOT North</option>
                <option>ERCOT South</option>
                <option>ERCOT West</option>
                <option>ERCOT Houston</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showForecast"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-border text-primary focus:ring-primary"
            />
            <label htmlFor="showForecast" className="text-sm text-foreground cursor-pointer">
              Show Forecast
            </label>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current Temperature */}
        <div className={`bg-card border rounded-lg p-6 transition-all ${
          extremeCold ? 'border-chart-2 bg-chart-2/5' : 
          extremeHeat ? 'border-risk-medium bg-risk-medium/5' : 
          'border-neutral-border hover:border-primary/30'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Temperature</p>
              <p className="text-3xl font-semibold text-foreground">{currentData.actualTemp}°F</p>
            </div>
            <div className={`p-3 rounded-lg ${
              extremeCold ? 'bg-chart-2/20' : 
              extremeHeat ? 'bg-risk-medium/20' : 
              'bg-green-muted'
            }`}>
              <Thermometer className={`w-6 h-6 ${
                extremeCold ? 'text-chart-2' : 
                extremeHeat ? 'text-risk-medium' : 
                'text-primary'
              }`} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {tempTrend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-risk-medium" />
            ) : (
              <TrendingDown className="w-3 h-3 text-chart-2" />
            )}
            <span className="text-muted-foreground">
              {Math.abs(tempDeviation).toFixed(1)}°F {tempDeviation > 0 ? 'above' : 'below'} normal
            </span>
          </div>
        </div>

        {/* Heating Demand */}
        <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Heating Degree Days</p>
              <p className="text-3xl font-semibold text-foreground">{currentData.hdd.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-chart-2/20 rounded-lg">
              <Flame className="w-6 h-6 text-chart-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalHDD.toFixed(0)} total HDD last {timeRange}h
          </p>
        </div>

        {/* Cooling Demand */}
        <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cooling Degree Days</p>
              <p className="text-3xl font-semibold text-foreground">{currentData.cdd.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-risk-medium/20 rounded-lg">
              <Snowflake className="w-6 h-6 text-risk-medium" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalCDD.toFixed(0)} total CDD last {timeRange}h
          </p>
        </div>

        {/* Renewable Generation */}
        <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Renewable Generation</p>
              <p className="text-3xl font-semibold text-primary">{renewablePct.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-muted rounded-lg">
              <Wind className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {avgRenewableGen.toFixed(0)} MW average
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(extremeCold || extremeHeat || highDemand) && (
        <div className="bg-risk-medium/10 border border-risk-medium/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-risk-medium flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Active Conditions</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {extremeCold && <p>• Extreme cold conditions detected - increased heating demand expected</p>}
                {extremeHeat && <p>• High temperature alert - elevated cooling demand anticipated</p>}
                {highDemand && <p>• Total demand exceeding 1,000 MW - monitor grid capacity</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Temperature Chart */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-medium text-foreground mb-1">
            Temperature Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Track temperature impacts on energy supply and demand in real time
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-muted-foreground)' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-neutral-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)}°F`, '']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <ReferenceLine 
              y={65} 
              stroke="var(--color-muted-foreground)" 
              strokeDasharray="5 5"
              label={{ value: 'Base 65°F', position: 'right', fill: 'var(--color-muted-foreground)', fontSize: 11 }}
            />
            <Line 
              type="monotone" 
              dataKey="normalTemp" 
              stroke="#9ca3af" 
              strokeWidth={1.5}
              strokeDasharray="5 5"
              name="Normal Temp"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actualTemp" 
              stroke="#00a758" 
              strokeWidth={2.5}
              name="Actual Temp"
              dot={{ r: 2, fill: '#00a758' }}
            />
            {showForecast && (
              <Line 
                type="monotone" 
                dataKey="forecastTemp" 
                stroke="#0078a0" 
                strokeWidth={2}
                strokeDasharray="3 3"
                name="Forecast Temp"
                dot={{ r: 2, fill: '#0078a0' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Supply & Demand Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Supply Chart */}
        <div className="bg-card border border-neutral-border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground mb-1">Renewable Supply Forecast</h3>
            <p className="text-sm text-muted-foreground">
              Wind and solar generation over {timeRange} hours
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '11px' }}
                label={{ value: 'Generation (MW)', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-muted-foreground)', fontSize: 11 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-neutral-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} MW`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="windGeneration" 
                stackId="1"
                stroke="#00a758" 
                fill="#00a758"
                fillOpacity={0.6}
                name="Wind"
              />
              <Area 
                type="monotone" 
                dataKey="solarGeneration" 
                stackId="1"
                stroke="#d97706" 
                fill="#d97706"
                fillOpacity={0.6}
                name="Solar"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Demand Chart */}
        <div className="bg-card border border-neutral-border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground mb-1">Temperature-Driven Demand</h3>
            <p className="text-sm text-muted-foreground">
              HDD/CDD impact on total load
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '11px' }}
                label={{ value: 'Demand (MW)', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-muted-foreground)', fontSize: 11 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-neutral-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} MW`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="totalDemand" 
                stroke="#6b7280" 
                fill="#6b7280"
                fillOpacity={0.3}
                name="Total Demand"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HDD/CDD Visualization */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-foreground mb-1">Degree Day Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Heating (HDD) and Cooling (CDD) degree days relative to 65°F baseline
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '11px' }}
              label={{ value: 'Degree Days', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-muted-foreground)', fontSize: 11 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-neutral-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)} DD`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar 
              dataKey="hdd" 
              fill="#0078a0" 
              name="Heating Degree Days"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="cdd" 
              fill="#d97706" 
              name="Cooling Degree Days"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Comparison */}
      <div className="bg-card border border-neutral-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-foreground mb-1">Regional Temperature Snapshot</h3>
          <p className="text-sm text-muted-foreground">Current conditions across ERCOT zones</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { region: 'ERCOT North', temp: 42.3, deviation: -7.7, hdd: 22.7, cdd: 0 },
            { region: 'ERCOT South', temp: 58.1, deviation: -1.9, hdd: 6.9, cdd: 0 },
            { region: 'ERCOT West', temp: 39.8, deviation: -10.2, hdd: 25.2, cdd: 0 },
            { region: 'ERCOT Houston', temp: 61.5, deviation: 1.5, hdd: 3.5, cdd: 0 },
          ].map((zone) => (
            <div 
              key={zone.region}
              className={`p-4 rounded-lg border transition-all ${
                selectedRegion === zone.region
                  ? 'bg-green-muted border-primary'
                  : 'bg-secondary border-neutral-border hover:border-primary/30'
              }`}
            >
              <p className="text-sm font-medium text-foreground mb-2">{zone.region}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-semibold text-foreground">{zone.temp}°F</span>
                <span className={`text-xs ${zone.deviation < 0 ? 'text-chart-2' : 'text-risk-medium'}`}>
                  {zone.deviation > 0 ? '+' : ''}{zone.deviation.toFixed(1)}°
                </span>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                <span>HDD: {zone.hdd.toFixed(1)}</span>
                <span>CDD: {zone.cdd.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}