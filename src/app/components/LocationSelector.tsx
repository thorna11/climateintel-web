import React, { useState } from 'react';
import { MapPin, Star, Search } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  coords: { x: number; y: number };
  isFavorite: boolean;
}

const locations: Location[] = [
  { id: 'hk', name: 'Hong Kong', coords: { x: 70, y: 45 }, isFavorite: true },
  { id: 'seoul', name: 'Seoul', coords: { x: 75, y: 30 }, isFavorite: true },
  { id: 'singapore', name: 'Singapore', coords: { x: 65, y: 70 }, isFavorite: true },
  { id: 'sydney', name: 'Sydney', coords: { x: 85, y: 85 }, isFavorite: true },
  { id: 'tokyo', name: 'Tokyo', coords: { x: 85, y: 28 }, isFavorite: true },
];

interface LocationSelectorProps {
  onLocationChange?: (location: string) => void;
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState('Hong Kong');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationSelect = (name: string) => {
    setSelectedLocation(name);
    onLocationChange?.(name);
  };

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card border border-neutral-border rounded-lg p-6">
      <h2 className="text-lg font-medium text-foreground mb-4">Location Selection</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Map Widget */}
        <div className="relative bg-gradient-to-br from-primary/5 to-green-vivid/5 rounded-lg p-6 border border-neutral-border h-64">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Simplified map outline */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path
                d="M20,30 Q35,25 50,35 T80,40 Q85,50 80,60 Q70,70 60,75 T40,80 Q30,75 25,65 T20,45 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
              <path
                d="M30,20 Q40,15 55,25 T85,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
              />
            </svg>
          </div>

          {/* Location Pins */}
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationSelect(loc.name)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
              title={loc.name}
            >
              <div
                className={`relative transition-all ${
                  selectedLocation === loc.name
                    ? 'scale-125'
                    : 'scale-100 hover:scale-110'
                }`}
              >
                <MapPin
                  className={`w-6 h-6 transition-colors ${
                    selectedLocation === loc.name
                      ? 'text-primary fill-primary'
                      : 'text-primary/60 fill-primary/20 group-hover:text-primary group-hover:fill-primary/40'
                  }`}
                />
                {selectedLocation === loc.name && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-popover border border-neutral-border rounded px-2 py-1 text-xs text-foreground shadow-lg">
                    {loc.name}
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm border border-neutral-border rounded px-2 py-1">
            <p className="text-[10px] text-muted-foreground">Click pin to select</p>
          </div>
        </div>

        {/* Search & Favorites */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationSelect(e.target.value)}
            className="w-full px-3 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {filteredLocations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* Favorites */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Favorites</p>
            <div className="flex flex-wrap gap-2">
              {locations
                .filter((loc) => loc.isFavorite)
                .map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationSelect(loc.name)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedLocation === loc.name
                        ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                        : 'bg-secondary text-foreground hover:bg-muted'
                    }`}
                  >
                    <Star
                      className={`w-3 h-3 ${
                        selectedLocation === loc.name
                          ? 'fill-current'
                          : 'fill-risk-medium text-risk-medium'
                      }`}
                    />
                    {loc.name}
                  </button>
                ))}
            </div>
          </div>

          {/* Current Selection */}
          <div className="pt-2 border-t border-neutral-border">
            <p className="text-xs text-muted-foreground mb-1">Current Selection</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{selectedLocation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
