import React, { useState } from 'react';
import { MapPin, Star, Search, Plus, Check } from 'lucide-react';

interface AssetLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: string;
  hub: string;
  type: 'solar' | 'wind' | 'hybrid';
}

const mockAssetLocations: AssetLocation[] = [
  { id: '1', name: 'PJM West Solar Farm', lat: 39.8, lon: -77.2, region: 'PJM', hub: 'Western Hub', type: 'solar' },
  { id: '2', name: 'ERCOT South Wind Park', lat: 28.5, lon: -99.3, region: 'ERCOT', hub: 'South Hub', type: 'wind' },
  { id: '3', name: 'CAISO Desert Solar', lat: 34.2, lon: -116.4, region: 'CAISO', hub: 'SP15', type: 'solar' },
  { id: '4', name: 'MISO Central Wind', lat: 41.5, lon: -93.2, region: 'MISO', hub: 'Iowa Hub', type: 'wind' },
  { id: '5', name: 'NYISO Upstate Wind', lat: 43.1, lon: -76.2, region: 'NYISO', hub: 'Zone A', type: 'wind' },
  { id: '6', name: 'SPP Oklahoma Solar', lat: 35.5, lon: -97.5, region: 'SPP', hub: 'North Hub', type: 'solar' },
  { id: '7', name: 'ISO-NE Maine Wind', lat: 45.2, lon: -68.8, region: 'ISO-NE', hub: 'Maine Hub', type: 'wind' },
];

interface FindLocationProps {
  selectedLocation: string;
  favorites: string[];
  onAddFavorite: (location: string) => void;
  onLocationChange: (location: string) => void;
}

export function FindLocation({ selectedLocation, favorites, onAddFavorite, onLocationChange }: FindLocationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<AssetLocation | null>(null);
  const [customName, setCustomName] = useState('');
  const [pinnedLocation, setPinnedLocation] = useState<{ x: number; y: number; asset: AssetLocation } | null>(null);

  const filteredAssets = mockAssetLocations.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Mock asset at clicked location
    const mockAsset: AssetLocation = {
      id: 'custom',
      name: customName || 'Custom Location',
      lat: 35.0 + (y / rect.height) * 20,
      lon: -120.0 + (x / rect.width) * 40,
      region: 'Custom',
      hub: 'Custom Hub',
      type: 'solar',
    };

    setPinnedLocation({ x, y, asset: mockAsset });
    setSelectedAsset(mockAsset);
  };

  const handleAddFavorite = () => {
    if (selectedAsset) {
      const locationName = customName || selectedAsset.name;
      onAddFavorite(locationName);
      setCustomName('');
    }
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return (
    <div className="bg-card border border-neutral-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-accent border-b border-neutral-border px-6 py-4">
        <h2 className="text-lg font-medium text-foreground mb-1">Find Location</h2>
        <p className="text-sm text-muted-foreground">
          Search for asset locations or click the map to add a custom location to favorites
        </p>
      </div>

      {/* Current Selection Bar */}
      <div className="bg-green-muted border-b border-primary/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Current Selection: <span className="text-primary">{selectedLocation}</span>
          </span>
        </div>
        {favorites.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
          </div>
        )}
      </div>

      {/* Main Content: Map + Search */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left: Interactive Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Interactive Map</h3>
            <span className="text-xs text-muted-foreground">Click to drop pin</span>
          </div>

          {/* Map Area */}
          <div
            onClick={handleMapClick}
            className="relative w-full h-96 bg-accent border-2 border-neutral-border rounded-lg overflow-hidden cursor-crosshair hover:border-primary/50 transition-colors"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, #e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50"></div>

            {/* Demo Markers for Mock Assets */}
            {mockAssetLocations.slice(0, 5).map((asset, idx) => (
              <div
                key={asset.id}
                className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-150 transition-transform"
                style={{
                  left: `${(idx * 18 + 15)}%`,
                  top: `${(idx * 15 + 10)}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAsset(asset);
                }}
              >
                <div className="absolute left-4 top-0 bg-popover border border-neutral-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  {asset.name}
                </div>
              </div>
            ))}

            {/* Pinned Location */}
            {pinnedLocation && (
              <div
                className="absolute w-4 h-4"
                style={{
                  left: pinnedLocation.x - 8,
                  top: pinnedLocation.y - 8,
                }}
              >
                <MapPin className="w-4 h-4 text-risk-high fill-current animate-bounce" />
              </div>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 border border-neutral-border rounded-lg p-3 text-xs">
              <p className="font-medium text-foreground mb-2">Legend</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Asset Locations</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-risk-high" />
                  <span className="text-muted-foreground">Custom Pin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Pin Info */}
          {selectedAsset && (
            <div className="bg-accent border border-neutral-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Selected Location</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Name:</span> {selectedAsset.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Coordinates:</span> {selectedAsset.lat.toFixed(2)}°N,{' '}
                  {Math.abs(selectedAsset.lon).toFixed(2)}°W
                </p>
                <p>
                  <span className="font-medium text-foreground">Region:</span> {selectedAsset.region}
                </p>
                <p>
                  <span className="font-medium text-foreground">Hub:</span> {selectedAsset.hub}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Search + Results */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Search Asset Locations</h3>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search asset location..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Results ({filteredAssets.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedAsset?.id === asset.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-neutral-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{asset.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {asset.region} • {asset.hub} • {asset.type}
                      </p>
                    </div>
                    {isFavorite(asset.name) && (
                      <Star className="w-4 h-4 text-primary fill-current flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Favorites */}
          {selectedAsset && (
            <div className="bg-accent border border-neutral-border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Add to Favorites</h4>

              {/* Custom Name Input */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Custom Name (optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={selectedAsset.name}
                  className="w-full px-3 py-2 bg-input-background border border-neutral-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddFavorite}
                disabled={isFavorite(customName || selectedAsset.name)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isFavorite(customName || selectedAsset.name)
                    ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                }`}
              >
                {isFavorite(customName || selectedAsset.name) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Already in Favorites
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Favorites
                  </>
                )}
              </button>
            </div>
          )}

          {/* Saved Favorites */}
          {favorites.length > 0 && (
            <div className="bg-green-muted border border-primary/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-current" />
                Saved Favorites
              </h4>
              <div className="flex flex-wrap gap-2">
                {favorites.map((fav) => (
                  <button
                    key={fav}
                    onClick={() => onLocationChange(fav)}
                    className="px-2.5 py-1 bg-card border border-neutral-border rounded text-xs font-medium text-foreground hover:border-primary hover:bg-accent transition-all"
                  >
                    {fav}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
