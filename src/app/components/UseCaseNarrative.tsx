import React from 'react';

interface UseCase {
  title: string;
  description: string;
  example?: string;
}

interface UseCaseNarrativeProps {
  useCases: UseCase[];
  className?: string;
}

export function UseCaseNarrative({ useCases, className = '' }: UseCaseNarrativeProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-foreground">Use Cases</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase, index) => (
          <div key={index} className="bg-card border border-neutral-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-3">{useCase.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
            {useCase.example && (
              <div className="pt-4 border-t border-neutral-border">
                <p className="text-xs text-muted-foreground italic">{useCase.example}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
