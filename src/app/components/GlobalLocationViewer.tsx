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
  // Alphabetize favorites: Beijing, Chongqing, Guangzhou, Osaka, Seoul, Shanghai, Tokyo
  const sortedFavorites = [...favorites].sort((a, b) => a.localeCompare(b));
  
  const allLocations = ['Beijing', 'Chongqing', 'Guangzhou', 'Osaka', 'Seoul', 'Shanghai', 'Tokyo', 'Hong Kong', 'Singapore', 'Sydney', 'Mumbai', 'Jakarta'];

  return (
    <div className="bg-card border border-neutral-border rounded-lg px-4 py-2.5">
      {/* Compact two-column layout: Left (flexible wrap area) + Right (fixed controls) */}
      <div className="flex items-start justify-between gap-8">
        {/* Left Group: Tab Switcher + Inline Favorites (wrapping) */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => onTabChange('locations')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeTab === 'locations'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Locations
              </button>
              <button
                onClick={() => onTabChange('find-location')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  activeTab === 'find-location'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Find Location
              </button>
            </div>
          </div>

          {/* Favorites: Inline Label + Wrapping Chips (compact grid) */}
          <div className="flex items-start gap-2 min-w-0">
            <span className="text-xs text-muted-foreground font-medium flex-shrink-0 leading-[30px]">Favorites:</span>
            <div className="flex flex-wrap gap-x-2 gap-y-1.5 max-w-[620px]">
              {sortedFavorites.map((location) => (
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
                  <span className="text-xs font-medium whitespace-nowrap">{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Group: Fixed Controls (no shrink, top-aligned) */}
        <div className="flex items-start gap-3 flex-shrink-0">
          {/* Current Selection */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg border border-primary/20">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-tight">Current Selection</p>
              <p className="text-xs font-medium text-foreground whitespace-nowrap leading-tight">{selectedLocation}</p>
            </div>
          </div>

          {/* All Locations Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-neutral-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <optgroup label="Favorites">
              {sortedFavorites.map((loc) => (
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
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            <Clock className="w-3 h-3" />
            <span>Updated 4 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}