import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Parameter {
  name: string;
  description: string;
  unit?: string;
}

interface ParametersSectionProps {
  parameters: Parameter[];
  className?: string;
}

export function ParametersSection({ parameters, className = '' }: ParametersSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border border-neutral-border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-card hover:bg-accent transition-colors flex items-center justify-between"
      >
        <span className="font-medium text-foreground">See our parameters</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-6 py-4 bg-neutral-bg border-t border-neutral-border">
          <div className="grid gap-4">
            {parameters.map((param, index) => (
              <div key={index} className="pb-4 border-b border-neutral-border last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-medium text-foreground">{param.name}</h4>
                  {param.unit && (
                    <span className="text-sm text-muted-foreground">{param.unit}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{param.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
