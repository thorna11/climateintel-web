import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/app/components/PageContainer';
import { Wind, Sun, Thermometer, CloudRain } from 'lucide-react';

const products = [
  {
    id: 'wind-forecasting',
    name: 'Wind Power Forecasting',
    icon: Wind,
    description: 'High-resolution wind speed and power generation forecasts for trading and operations.',
    timescales: '15-min to 14-day',
    accuracy: '95%+ at day-ahead',
    color: 'text-primary'
  },
  {
    id: 'solar-forecasting',
    name: 'Solar Irradiance Forecasting',
    icon: Sun,
    description: 'GHI, DNI, and PV power output predictions with cloud movement tracking.',
    timescales: '15-min to 7-day',
    accuracy: '94%+ intraday',
    color: 'text-risk-medium'
  },
  {
    id: 'temperature-analytics',
    name: 'Temperature Analytics',
    icon: Thermometer,
    description: 'Heating and cooling degree day forecasts for demand modeling and risk management.',
    timescales: 'Hourly to seasonal',
    accuracy: '97%+ at week-ahead',
    color: 'text-chart-2'
  },
  {
    id: 'precipitation-risk',
    name: 'Precipitation & Extreme Weather',
    icon: CloudRain,
    description: 'Rainfall, snowfall, and severe weather alerts for infrastructure protection.',
    timescales: 'Nowcast to 10-day',
    accuracy: '92%+ detection rate',
    color: 'text-green-dark'
  }
];

export function Products() {
  return (
    <PageContainer>
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade forecasting solutions tailored for energy trading and operations teams.
            Each product delivers actionable intelligence with validated accuracy.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div key={product.id} className="bg-card border border-neutral-border rounded-lg p-8 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center ${product.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-medium text-foreground mb-2">
                      {product.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Timescales</p>
                    <p className="text-sm font-medium text-foreground">{product.timescales}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-sm font-medium text-primary">{product.accuracy}</p>
                  </div>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="mt-6 inline-block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-green-muted transition-colors"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-card border border-neutral-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">All Products Include</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              'API Access',
              'Custom Alerts',
              'Historical Data',
              'Confidence Intervals',
              'Location-Specific',
              'Ensemble Modeling',
              'Dashboard Access',
              'Expert Support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}