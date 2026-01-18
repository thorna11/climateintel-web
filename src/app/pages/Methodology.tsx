import React from 'react';
import { PageContainer } from '@/app/components/PageContainer';
import { Database, Brain, Target, RefreshCw } from 'lucide-react';

export function Methodology() {
  return (
    <PageContainer>
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-foreground mb-6">
            Our Methodology
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            ClimateIntel combines advanced numerical weather prediction models, machine learning, 
            and domain expertise to deliver industry-leading forecast accuracy.
          </p>

          {/* Process Steps */}
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-green-dark mb-3">Data Ingestion</h2>
                <p className="text-muted-foreground mb-4">
                  We aggregate data from multiple sources including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-1">•</span>
                    <span>NOAA HRRR, NAM, and GFS numerical weather models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-1">•</span>
                    <span>European ECMWF ensemble forecasts for extended range</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-1">•</span>
                    <span>Satellite imagery for cloud tracking and nowcasting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-1">•</span>
                    <span>Ground station observations for model validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-1">•</span>
                    <span>Customer-provided SCADA data for site calibration</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-green-dark mb-3">Model Ensemble</h2>
                <p className="text-muted-foreground mb-4">
                  Our proprietary ensemble approach combines:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-card border border-neutral-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Physical Models</h3>
                    <p className="text-sm text-muted-foreground">
                      Physics-based numerical weather prediction for long-range accuracy
                    </p>
                  </div>
                  <div className="bg-card border border-neutral-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Machine Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Neural networks trained on historical performance for bias correction
                    </p>
                  </div>
                  <div className="bg-card border border-neutral-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Statistical Post-Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Site-specific calibration using quantile mapping and MOS techniques
                    </p>
                  </div>
                  <div className="bg-card border border-neutral-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Uncertainty Quantification</h3>
                    <p className="text-sm text-muted-foreground">
                      Probabilistic forecasts with confidence intervals for risk assessment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-chart-4/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-foreground mb-3">Validation & Verification</h2>
                <p className="text-muted-foreground mb-4">
                  Continuous performance monitoring ensures forecast quality:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>Real-time comparison of forecasts vs. actuals at customer sites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>Monthly accuracy reports with RMSE, MAE, and bias metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>Independent third-party audits of forecast performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>Continuous improvement through feedback loops and retraining</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-green-dark mb-3">Operational Delivery</h2>
                <p className="text-muted-foreground mb-4">
                  Forecasts are delivered through multiple channels:
                </p>
                <div className="bg-card border border-neutral-border rounded-lg p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">API Access</h4>
                      <p className="text-sm text-muted-foreground">RESTful and WebSocket APIs with JSON/CSV formats</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Web Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Interactive visualizations and custom alerts</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Email/SMS Alerts</h4>
                      <p className="text-sm text-muted-foreground">Threshold-based notifications for critical events</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">SFTP/S3 Delivery</h4>
                      <p className="text-sm text-muted-foreground">Automated file drops for system integration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy Standards */}
          <div className="mt-16 bg-card border border-neutral-border rounded-lg p-8">
            <h2 className="text-2xl font-medium text-foreground mb-4">Performance Standards</h2>
            <p className="text-muted-foreground mb-6">
              We maintain industry-leading accuracy benchmarks across all forecast horizons:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-border">
                    <th className="text-left py-3 text-foreground font-medium">Forecast Type</th>
                    <th className="text-left py-3 text-foreground font-medium">Horizon</th>
                    <th className="text-left py-3 text-foreground font-medium">Target RMSE</th>
                    <th className="text-left py-3 text-foreground font-medium">Achieved</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-neutral-border/50">
                    <td className="py-3">Wind Power</td>
                    <td className="py-3">Day-ahead</td>
                    <td className="py-3">&lt; 6%</td>
                    <td className="py-3 text-primary font-medium">4.8%</td>
                  </tr>
                  <tr className="border-b border-neutral-border/50">
                    <td className="py-3">Solar Irradiance</td>
                    <td className="py-3">Intraday</td>
                    <td className="py-3">&lt; 8%</td>
                    <td className="py-3 text-primary font-medium">6.2%</td>
                  </tr>
                  <tr className="border-b border-neutral-border/50">
                    <td className="py-3">Temperature</td>
                    <td className="py-3">Week-ahead</td>
                    <td className="py-3">&lt; 3°F</td>
                    <td className="py-3 text-primary font-medium">2.1°F</td>
                  </tr>
                  <tr>
                    <td className="py-3">Precipitation</td>
                    <td className="py-3">48-hour</td>
                    <td className="py-3">&gt; 85%</td>
                    <td className="py-3 text-primary font-medium">91.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}