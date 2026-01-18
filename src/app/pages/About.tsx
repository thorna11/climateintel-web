import React from 'react';
import { PageContainer } from '@/app/components/PageContainer';
import { Users, Award, Globe, HeartHandshake, Target } from 'lucide-react';

export function About() {
  return (
    <PageContainer>
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-foreground mb-6">
            About ClimateIntel
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            We're building the future of weather intelligence for the energy industry, 
            combining atmospheric science expertise with cutting-edge technology.
          </p>

          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-2xl font-medium text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To empower energy companies with the most accurate, actionable weather and climate intelligence, 
              enabling confident decision-making in an increasingly renewable-powered grid. We believe that 
              better forecasts lead to more efficient markets, reduced carbon emissions, and a more reliable 
              energy system for everyone.
            </p>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-medium text-foreground mb-6">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Accuracy First</h3>
                <p className="text-sm text-muted-foreground">
                  We measure ourselves by the precision of our forecasts, not marketing claims. 
                  Every model update is validated against real-world outcomes.
                </p>
              </div>

              <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
                  <HeartHandshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Customer Partnership</h3>
                <p className="text-sm text-muted-foreground">
                  Your success is our success. We work closely with trading and operations teams 
                  to ensure our products solve real problems.
                </p>
              </div>

              <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  By improving renewable energy forecasting, we're helping accelerate the 
                  transition to clean energy and combat climate change.
                </p>
              </div>

              <div className="bg-card border border-neutral-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-green-muted rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Scientific Rigor</h3>
                <p className="text-sm text-muted-foreground">
                  Our team includes PhD meteorologists, data scientists, and energy market experts 
                  who maintain the highest standards of scientific integrity.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-medium text-foreground mb-4">Our Team</h2>
            <p className="text-muted-foreground mb-6">
              ClimateIntel was founded by veterans of the weather forecasting and energy trading industries. 
              Our team combines decades of experience in:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                'Operational weather forecasting',
                'Energy market analytics',
                'Machine learning & AI',
                'Renewable energy development',
                'Power trading & risk management',
                'Atmospheric science research',
              ].map((area, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-neutral-border rounded-lg p-8">
            <h2 className="text-2xl font-medium text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Ready to improve your energy forecasting? We'd love to discuss how ClimateIntel can 
              support your operations.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sales Inquiries</p>
                <a href="mailto:sales@climateintel.com" className="text-primary hover:underline">
                  sales@climateintel.com
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Technical Support</p>
                <a href="mailto:support@climateintel.com" className="text-primary hover:underline">
                  support@climateintel.com
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <a href="tel:+1-555-0123" className="text-primary hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-foreground">Boulder, Colorado, USA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}