import React, { useState } from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

interface GlobalLocationViewerProps {
  selectedLocation: string;
  favorites: string[];
  onLocationChange: (location: string) => void;
  activeTab: 'locations' | 'find-location';
  onTabChange: (tab: 'locations' | 'find-location') => void;
}

export function GlobalLocationViewer({
  selectedLocation,
  favorites,
  onLocationChange,
  activeTab,
  onTabChange,
}: GlobalLocationViewerProps) {
  const allLocations = ['Hong Kong', 'Seoul', 'Singapore', 'Sydney', 'Tokyo', 'Shanghai', 'Mumbai', 'Jakarta'];

  return (
    <div className="bg-card border border-neutral-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-6">
        {/* Left: Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => onTabChange('locations')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                activeTab === 'locations'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Locations
            </button>
            <button
              onClick={() => onTabChange('find-location')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                activeTab === 'find-location'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Find Location
            </button>
          </div>
        </div>

        {/* Center: Favorites Chips */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium mr-2">Favorites:</span>
          {favorites.map((location) => (
            <button
              key={location}
              onClick={() => onLocationChange(location)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                selectedLocation === location
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-foreground border-neutral-border hover:border-primary hover:bg-accent'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium">{location}</span>
            </button>
          ))}
        </div>

        {/* Right: Current Selection + All Locations */}
        <div className="flex items-center gap-4">
          {/* Current Selection */}
          <div className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg border border-primary/20">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Current Selection</p>
              <p className="text-sm font-medium text-foreground">{selectedLocation}</p>
            </div>
          </div>

          {/* All Locations Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-3 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <optgroup label="Favorites">
              {favorites.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
            <optgroup label="All Locations">
              {allLocations.filter(loc => !favorites.includes(loc)).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </optgroup>
          </select>

          {/* Last Updated */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Updated 4 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
