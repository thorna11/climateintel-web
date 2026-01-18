import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/app/components/PageContainer';
import { Cloud, Zap, TrendingUp, Shield } from 'lucide-react';

export function Home() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-semibold text-foreground mb-6">
            Weather & Climate Intelligence for Energy Trading
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Make confident decisions with enterprise-grade forecasting and risk analysis 
            for renewable energy operations and trading teams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Products
            </Link>
            <Link 
              to="/demo" 
              className="px-6 py-3 border border-neutral-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Precision Forecasting</h3>
            <p className="text-sm text-muted-foreground">
              Hour-ahead to seasonal forecasts with validated accuracy for wind, solar, and temperature.
            </p>
          </div>

          <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Real-Time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Continuous model updates ensure you're always working with the latest intelligence.
            </p>
          </div>

          <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Risk Quantification</h3>
            <p className="text-sm text-muted-foreground">
              Stoplight indicators and confidence intervals help you manage exposure effectively.
            </p>
          </div>

          <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Enterprise Ready</h3>
            <p className="text-sm text-muted-foreground">
              API access, custom integrations, and dedicated support for mission-critical operations.
            </p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-card border border-neutral-border rounded-lg p-12">
          <div className="grid gap-12 md:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-semibold text-foreground mb-2">15-min</p>
              <p className="text-sm text-muted-foreground">Update Frequency</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-foreground mb-2">95%+</p>
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-foreground mb-2">24/7</p>
              <p className="text-sm text-muted-foreground">Operational Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Ready to optimize your energy operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading energy firms using ClimateIntel for data-driven decision making.
          </p>
          <Link 
            to="/about" 
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}