# ClimateIntel Design System

A modern, professional design system for a weather & climate intelligence platform used by energy trading and operations teams.

## Design Principles

### Visual Style

- **Clean & Enterprise**: Neutral backgrounds with subtle grid patterns
- **Data-Driven**: Emphasis on clarity and readability over decoration
- **Professional**: Consistent spacing, typography, and color usage
- **Responsive**: Mobile-first design that scales to desktop

### Color System

#### Risk Colors (Stoplight System)

- **High Risk (Red)**: `#dc2626` - Critical alerts, high-risk conditions
- **Medium Risk (Amber)**: `#f59e0b` - Warning states, moderate risk
- **Low Risk (Green)**: `#10b981` - Safe conditions, positive indicators

#### Neutral Colors

- **Background**: `#f8f9fa` - Subtle neutral for page backgrounds
- **Border**: `#e5e7eb` - Consistent border treatment
- **Grid**: `rgba(0, 0, 0, 0.03)` - Subtle background grid pattern

## Design Tokens

### Spacing Scale

```css
--spacing-xs: 0.5rem /* 8px */ --spacing-sm: 1rem /* 16px */
  --spacing-md: 1.5rem /* 24px */ --spacing-lg: 2rem /* 32px */
  --spacing-xl: 3rem /* 48px */ --spacing-2xl: 4rem /* 64px */
  --spacing-3xl: 6rem /* 96px */;
```

### Typography Scale

```css
--text-xs: 0.75rem /* 12px */ --text-sm: 0.875rem /* 14px */
  --text-base: 1rem /* 16px */ --text-lg: 1.125rem /* 18px */
  --text-xl: 1.25rem /* 20px */ --text-2xl: 1.5rem /* 24px */
  --text-3xl: 1.875rem /* 30px */ --text-4xl: 2.25rem /* 36px */
  --text-5xl: 3rem /* 48px */;
```

## Component Library

### Layout Components

#### PageContainer

Wrapper component with background grid and proper content spacing.

```tsx
<PageContainer>{/* Page content */}</PageContainer>
```

#### Header

Sticky navigation header with logo and main navigation links.

Features:

- Active route highlighting
- Responsive navigation
- Call-to-action button

### Data Display Components

#### SummaryTile

Executive summary cards showing key metrics with optional icons and trends.

Props:

- `icon`: Optional Lucide icon component
- `title`: Metric label
- `value`: Primary value display
- `subtitle`: Additional context
- `trend`: 'up' | 'down' | 'neutral'

```tsx
<SummaryTile
  icon={Target}
  title="Accuracy"
  value="95.2%"
  subtitle="Day-ahead RMSE"
  trend="up"
/>
```

#### RiskBadge

Stoplight color-coded badges for risk indication.

Levels: `'high'` | `'medium'` | `'low'`

```tsx
<RiskBadge level="medium" label="Warning" />
```

#### InteractiveChart

Responsive charts built with Recharts library.

Types: `'line'` | `'area'` | `'bar'`

```tsx
<InteractiveChart
  type="line"
  data={chartData}
  dataKeys={[
    { key: "forecast", color: "#3b82f6", name: "Forecast" },
    { key: "actual", color: "#10b981", name: "Actual" },
  ]}
  title="24-Hour Forecast"
  subtitle="Updated 5 minutes ago"
/>
```

### Product Page Components

#### ParametersSection

Expandable section showing technical parameters with descriptions.

```tsx
<ParametersSection
  parameters={[
    {
      name: "Wind Speed",
      description: "Hub-height wind velocity",
      unit: "m/s",
    },
  ]}
/>
```

#### TimescaleCoverage

Display of forecast timescales and coverage.

```tsx
<TimescaleCoverage
  timescales={[
    { label: "Nowcast", value: "0-6 hours", active: true },
    { label: "Day-ahead", value: "6-48 hours", active: true },
  ]}
/>
```

#### UseCaseNarrative

Grid of use case cards with descriptions and examples.

```tsx
<UseCaseNarrative
  useCases={[
    {
      title: "Day-Ahead Trading",
      description: "Optimize bid strategies...",
      example: "A 500MW wind farm improved...",
    },
  ]}
/>
```

## Page Templates

### Home Page

- Hero section with value proposition
- Feature cards
- Key statistics
- Call-to-action sections

### Products Overview

- Product grid with cards
- Feature comparison table
- Navigation to detail pages

### Product Detail

Required sections:

1. **Executive Summary Tiles**: Key metrics in SummaryTile components
2. **Primary Interactive Chart**: Main visualization
3. **Parameters Section**: Expandable technical details
4. **Timescale Coverage**: Forecast horizons
5. **Use-Case Narrative**: Real-world applications

### Demo Dashboard

- Live metrics grid
- Interactive charts
- Risk alerts
- Real-time status indicators

### Methodology

- Process flow with icons
- Technical explanations
- Performance tables
- Validation metrics

### About

- Mission statement
- Values grid
- Team overview
- Contact information

## Usage Guidelines

### Component Composition

Build pages by combining reusable components:

```tsx
<PageContainer>
  <section className="container mx-auto px-6 py-16">
    <div className="grid gap-6 md:grid-cols-3">
      <SummaryTile {...tileProps} />
      {/* More tiles */}
    </div>

    <InteractiveChart {...chartProps} />

    <ParametersSection {...paramProps} />
  </section>
</PageContainer>
```

### Spacing Consistency

Use defined spacing tokens for consistent layouts:

- Section padding: `py-16` (--spacing-2xl)
- Component gaps: `gap-6` (--spacing-md)
- Card padding: `p-6` (--spacing-md)

### Color Application

- Use risk colors only for status indicators
- Maintain neutral backgrounds for readability
- Apply subtle borders for component separation

### Typography Hierarchy

- Page titles: `text-4xl font-semibold`
- Section headers: `text-2xl font-medium`
- Card titles: `text-lg font-medium`
- Body text: `text-base`
- Metadata: `text-sm text-muted-foreground`

## Accessibility

- Semantic HTML structure
- Color contrast ratios meet WCAG AA standards
- Interactive elements have proper focus states
- Icons include accessible labels where needed

## Responsive Behavior

All components are mobile-first with responsive breakpoints:

- Mobile: Base styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

Grid layouts automatically collapse on smaller screens.

## Future Enhancements

Consider adding:

- Dark mode toggle
- Data export functionality
- Custom alert configuration
- Advanced filtering
- Real-time WebSocket integration