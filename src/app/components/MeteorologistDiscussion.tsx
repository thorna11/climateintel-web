import React, { useState } from 'react';
import { User, Clock, TrendingUp, TrendingDown, Minus, Copy, AlertCircle } from 'lucide-react';

interface DiscussionContent {
  location: string;
  executiveSummary: string;
  keyRisks: Array<{ risk: string; window: string; impact: string }>;
  activeAlertsContext: string;
  confidenceScore: number;
  watchingItems: string[];
  weatherDiscussion: {
    currentState: string;
    primaryDriver: string;
    nextChange: string;
    riskWindow: string;
  };
  localClimatologyNuance: string;
  timingStrip: Array<{
    period: string;
    riskLevel: 'high' | 'medium' | 'low' | null;
    note: string;
  }>;
  activeAlertTags: { label: string; severity: 'warning' | 'watch' | 'low' }[];
  lastUpdated: string;
  bustRiskScore: number;
  bustDirection: {
    warmBias: 'up' | 'down' | 'flat';
    coldBias: 'up' | 'down' | 'flat';
    windOver: 'up' | 'down' | 'flat';
    windUnder: 'up' | 'down' | 'flat';
    solarOver: 'up' | 'down' | 'flat';
    solarUnder: 'up' | 'down' | 'flat';
  };
  bustWhyItMatters: string;
}

const discussionData: Record<string, DiscussionContent> = {
  'Hong Kong': {
    location: 'Hong Kong',
    executiveSummary: 'High wind event developing late afternoon through evening as pressure gradient tightens across South China Sea. Primary risk is rapid wind ramp during evening demand peak, creating grid balancing challenges and wind generation uncertainty.',
    keyRisks: [
      { risk: 'Wind ramps', window: '18:00–22:00 local', impact: 'Wind generation uncertainty + balancing risk' },
      { risk: 'Gusts 35-45 kt', window: '20:00–00:00 local', impact: 'Curtailment risk + output volatility' },
      { risk: 'Evening demand peak', window: '18:00–21:00 local', impact: 'Coincident timing amplifies balancing challenges' },
    ],
    activeAlertsContext: 'High alert reflects convective gust fronts and sustained NE flow. Medium alert for sustained wind generation volatility through evening into overnight.',
    confidenceScore: 7.2,
    watchingItems: [
      'ECMWF/GFS divergence on timing of peak gradient (±2h uncertainty)',
      'Surface pressure tendency at HKO — faster deepening = earlier ramp',
    ],
    weatherDiscussion: {
      currentState: 'Surface high building over eastern China with low pressure trough deepening offshore. Current winds 15-20 kt NE with pressure gradient steadily tightening.',
      primaryDriver: 'Synoptic-scale pressure gradient driven by continental high advancing SE while offshore trough deepens. Classic wintertime setup for sustained NE flow across region.',
      nextChange: 'Gradient peaks 18:00–22:00 local as high center shifts closer and trough axis moves east. Winds ramp to 35-45 kt with gusts embedded in brief convective bands. Relaxation begins post-midnight as systems separate.',
      riskWindow: 'Primary risk window 18:00–22:00 local (high confidence). Secondary overnight volatility 00:00–06:00 (medium confidence).',
    },
    localClimatologyNuance: 'Local factor: Terrain channeling through Victoria Harbor can amplify gusts ±10 kt vs open water obs.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Steady NE 15-20 kt' },
      { period: 'Next 6h', riskLevel: 'medium', note: 'Gradient building' },
      { period: 'Next 24h', riskLevel: 'high', note: 'Peak ramp 18-22h' },
      { period: 'Days 2–3', riskLevel: 'low', note: 'Gradual relaxation' },
      { period: 'Days 4–7', riskLevel: null, note: 'Return to light flow' },
    ],
    activeAlertTags: [
      { label: 'High', severity: 'warning' },
      { label: 'Medium', severity: 'watch' },
    ],
    lastUpdated: '14 minutes ago',
    bustRiskScore: 7.4,
    bustDirection: {
      warmBias: 'flat',
      coldBias: 'flat',
      windOver: 'up',
      windUnder: 'down',
      solarOver: 'flat',
      solarUnder: 'flat',
    },
    bustWhyItMatters: 'High bust-risk due to ECMWF/GFS divergence on wind speeds. Risk skewed toward over-forecast; wind generation could come in below forecast.',
  },
  'Seoul': {
    location: 'Seoul',
    executiveSummary: 'Convective development expected mid-afternoon as instability builds ahead of approaching shortwave. Thunderstorm risk 60-75% across metro area with brief heavy rain, wind gusts, and sharp solar output drops. Grid stability and solar reliability concerns during primary window.',
    keyRisks: [
      { risk: 'Thunderstorms', window: '14:00–18:00 local', impact: 'Grid stability concern + solar irradiance collapse' },
      { risk: 'Solar volatility', window: '13:00–19:00 local', impact: '40-60% output swings during convective passage' },
      { risk: 'Localized wind gusts', window: '15:00–18:00 local', impact: 'Short-term wind gen spikes + turbine stress' },
    ],
    activeAlertsContext: 'High alert for convective risk peaking mid-to-late afternoon with gust fronts and rapid irradiance drops. Primary concern is solar reliability during peak demand window.',
    confidenceScore: 6.5,
    watchingItems: [
      'Shortwave timing — GFS 2h earlier than ECMWF; affects storm initiation',
      'CAPE buildup by 12:00 local — higher values = more intense cells',
    ],
    weatherDiscussion: {
      currentState: 'Weak surface trough across Yellow Sea with moisture pooling ahead of shortwave aloft. Morning clear with heating building instability. Current CAPE ~800 J/kg, increasing through early afternoon.',
      primaryDriver: 'Mid-level shortwave approaching from northwest providing lift. Surface heating + moisture convergence triggers convection along outflow boundaries by 14:00–15:00 local.',
      nextChange: 'Convective initiation 14:00–15:00 as shortwave moves overhead. Cells develop rapidly, move ESE across metro area through 18:00. Brief heavy rain + gusts 40-50 kt + lightning. Solar irradiance drops 60-80% under cells. Clearing begins 18:00–19:00 as shortwave exits east.',
      riskWindow: 'Primary risk 14:00–18:00 local (medium-high confidence). Timing uncertainty ±2h tied to shortwave speed.',
    },
    localClimatologyNuance: 'Local factor: Urban heat island can focus convergence ±1–2h vs rural areas; storm initiation often earlier in metro core.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Clear, heating' },
      { period: 'Next 6h', riskLevel: 'high', note: 'Convection 14-18h' },
      { period: 'Next 24h', riskLevel: 'low', note: 'Clearing overnight' },
      { period: 'Days 2–3', riskLevel: null, note: 'Stable ridge builds' },
      { period: 'Days 4–7', riskLevel: 'medium', note: 'Next system Day 5' },
    ],
    activeAlertTags: [
      { label: 'High', severity: 'warning' },
    ],
    lastUpdated: '8 minutes ago',
    bustRiskScore: 6.8,
    bustDirection: {
      warmBias: 'flat',
      coldBias: 'flat',
      windOver: 'flat',
      windUnder: 'up',
      solarOver: 'up',
      solarUnder: 'down',
    },
    bustWhyItMatters: 'Moderate bust-risk from convective timing uncertainty. Solar over-forecast likely if storms arrive early; wind under-forecast risk if cells intensify.',
  },
  'Singapore': {
    location: 'Singapore',
    executiveSummary: 'Sea breeze convergence driving afternoon cloud cover variability. Intermittent cumulus creating 30-40% solar output swings during midday peak. Clear morning transitions to partly cloudy by 13:00–14:00 local. Moderate tradeable impact.',
    keyRisks: [
      { risk: 'Solar output swings', window: '12:00–16:00 local', impact: '30-40% swings from cloud passages' },
      { risk: 'Sea breeze timing', window: '11:00–15:00 local', impact: 'Convergence placement ±1–2h = forecast risk' },
      { risk: 'Midday reliability', window: '12:00–14:00 local', impact: 'Reduced solar confidence during peak demand' },
    ],
    activeAlertsContext: 'Medium alert reflects sea breeze timing uncertainty. Cloud field variability is tradeable but complicates intraday positioning for solar exposure.',
    confidenceScore: 5.8,
    watchingItems: [
      'Sea breeze front arrival time — satellite-derived boundary placement',
      'Upstream moisture feed from Sumatra — wetter airmass = more persistent clouds',
    ],
    weatherDiscussion: {
      currentState: 'Light offshore flow overnight transitioning to calm. Clear skies with strong heating building. Sea breeze front currently 20-30 km offshore, advancing slowly onshore.',
      primaryDriver: 'Diurnal sea breeze circulation driven by land-sea thermal contrast. Onshore flow initiates convergence over island, lifting moisture into cumulus field by early afternoon.',
      nextChange: 'Sea breeze front crosses coast 11:00–13:00 local (±1h). Convergence triggers cumulus development over metro area 12:00–16:00. Intermittent clouds reduce solar irradiance 30-40% during passages. Evening clearing as flow weakens post-sunset.',
      riskWindow: 'Primary window 12:00–16:00 local (medium confidence). Timing tied to sea breeze speed and moisture depth.',
    },
    localClimatologyNuance: 'Local factor: Sea breeze timing can shift cloud initiation ±2h depending on offshore SST gradient and synoptic flow.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Clear, heating' },
      { period: 'Next 6h', riskLevel: 'medium', note: 'Sea breeze clouds' },
      { period: 'Next 24h', riskLevel: 'low', note: 'Evening clearing' },
      { period: 'Days 2–3', riskLevel: 'medium', note: 'Similar pattern' },
      { period: 'Days 4–7', riskLevel: null, note: 'Monsoon shift possible' },
    ],
    activeAlertTags: [
      { label: 'Medium', severity: 'watch' },
    ],
    lastUpdated: '11 minutes ago',
    bustRiskScore: 4.2,
    bustDirection: {
      warmBias: 'flat',
      coldBias: 'flat',
      windOver: 'flat',
      windUnder: 'flat',
      solarOver: 'up',
      solarUnder: 'up',
    },
    bustWhyItMatters: 'Low-to-moderate bust-risk from sea breeze timing. Both solar over and under-forecast possible depending on cloud arrival timing.',
  },
  'Sydney': {
    location: 'Sydney',
    executiveSummary: 'Overnight and early morning fog/mist reducing visibility below 3 miles. Solar forecast uncertainty elevated until fog clears. Gradual improvement expected through mid-morning as surface heating increases and mixing deepens.',
    keyRisks: [
      { risk: 'Fog/mist persistence', window: '06:00–10:00 local', impact: 'Solar forecast uncertainty + delayed ramp-up' },
      { risk: 'Clearing timing', window: '08:00–11:00 local', impact: '±1–2h uncertainty adds risk to morning session' },
      { risk: 'Solar generation delay', window: '07:00–10:00 local', impact: 'Morning contribution below forecast if fog lingers' },
    ],
    activeAlertsContext: 'Medium alert for fog clearing uncertainty. Morning trading session may see delayed solar contribution. Monitor obs and satellite for clearing trends.',
    confidenceScore: 6.0,
    watchingItems: [
      'Surface temperature trend by 08:00 — faster warming = quicker fog dissipation',
      'Low-level wind tendency — any onshore flow delays clearing',
    ],
    weatherDiscussion: {
      currentState: 'Weak high pressure over Tasman Sea with light offshore flow overnight. Radiational cooling under clear skies formed shallow fog/mist layer. Current visibility 1-3 miles across metro area.',
      primaryDriver: 'Radiational cooling overnight under clear skies and light winds. Shallow stable layer trapping moisture near surface. Fog/mist depth ~200-400 ft AGL.',
      nextChange: 'Sunrise heating begins 06:00 local. Fog starts lifting 07:00–08:00 as surface warms and mixing layer deepens. Gradual improvement through 10:00–11:00 with complete clearing by midday. Solar ramp-up delayed 1–2h vs clear-sky forecast.',
      riskWindow: 'Primary uncertainty 06:00–10:00 local (medium confidence). Clearing timing ±1–2h depending on heating rate and wind tendency.',
    },
    localClimatologyNuance: 'Local factor: Coastal vs inland clearing can differ by 1–2h; metro core typically clears earlier than western suburbs.',
    timingStrip: [
      { period: 'Now', riskLevel: 'medium', note: 'Fog/mist present' },
      { period: 'Next 6h', riskLevel: 'medium', note: 'Gradual clearing' },
      { period: 'Next 24h', riskLevel: null, note: 'Clear afternoon' },
      { period: 'Days 2–3', riskLevel: 'low', note: 'Ridge holds' },
      { period: 'Days 4–7', riskLevel: null, note: 'Stable pattern' },
    ],
    activeAlertTags: [
      { label: 'Medium', severity: 'watch' },
    ],
    lastUpdated: '6 minutes ago',
    bustRiskScore: 5.1,
    bustDirection: {
      warmBias: 'flat',
      coldBias: 'down',
      windOver: 'flat',
      windUnder: 'flat',
      solarOver: 'up',
      solarUnder: 'down',
    },
    bustWhyItMatters: 'Moderate bust-risk from fog clearing uncertainty. Solar over-forecast likely if fog persists; cold bias risk minimal but present.',
  },
  'Tokyo': {
    location: 'Tokyo',
    executiveSummary: 'Stable atmospheric conditions prevail through forecast period under strong ridge aloft. Clear skies and steady winds support optimal renewable generation. Low uncertainty environment favors confident positioning with minimal balancing risk.',
    keyRisks: [
      { risk: 'Minimal operational risk', window: 'All periods', impact: 'Stable generation environment' },
      { risk: 'Slight wind decline', window: '00:00–06:00 local', impact: 'Modest gen reduction overnight (10-15%)' },
      { risk: 'Overall low-risk', window: 'Through Day 3', impact: 'High-confidence forecast supports aggressive positions' },
    ],
    activeAlertsContext: 'Low alert reflects minimal operational concerns. Stable ridge pattern supports reliable renewable output with high forecast confidence.',
    confidenceScore: 8.5,
    watchingItems: [
      'Pacific trough progression — earliest arrival Day 5, no near-term impact',
      'Ridge axis position — any southward shift would weaken flow marginally',
    ],
    weatherDiscussion: {
      currentState: 'Strong mid-level ridge centered over Japan with surface high pressure. Clear skies, light to moderate NW flow 10-15 kt. No significant weather systems within 1000 km.',
      primaryDriver: 'Broad upper-level ridge providing subsidence and stability. Downstream Pacific trough remains well east, maintaining ridge dominance through Day 4. Anticyclonic flow pattern supports steady conditions.',
      nextChange: 'Ridge holds through Day 3 with minimal changes. Slight wind speed decline overnight as surface high drifts east, reducing gradient marginally. No precipitation, cloud cover, or significant wind shifts expected. Next system arrival not until Day 5-6 as Pacific trough approaches.',
      riskWindow: 'No significant risk windows identified. Overnight wind reduction (00:00–06:00) is minor and well-forecasted. High confidence through 72 hours.',
    },
    localClimatologyNuance: 'Local factor: Wintertime ridge patterns typically very stable; model spread minimal in this regime.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Stable, clear' },
      { period: 'Next 6h', riskLevel: null, note: 'Light wind decline' },
      { period: 'Next 24h', riskLevel: null, note: 'Continued stable' },
      { period: 'Days 2–3', riskLevel: null, note: 'Ridge holds' },
      { period: 'Days 4–7', riskLevel: 'low', note: 'Trough approach D5-6' },
    ],
    activeAlertTags: [
      { label: 'Low', severity: 'low' },
    ],
    lastUpdated: '18 minutes ago',
    bustRiskScore: 1.8,
    bustDirection: {
      warmBias: 'flat',
      coldBias: 'flat',
      windOver: 'flat',
      windUnder: 'down',
      solarOver: 'flat',
      solarUnder: 'flat',
    },
    bustWhyItMatters: 'Low bust-risk. Models aligned with minimal spread. Stable pattern supports high-confidence positioning.',
  },
};

const severityColors = {
  warning: 'bg-risk-high text-white',
  watch: 'bg-risk-medium text-white',
  low: 'bg-risk-low text-white',
};

const riskLevelColors = {
  high: 'bg-risk-high text-white',
  medium: 'bg-risk-medium text-white',
  low: 'bg-risk-low text-white',
};

interface MeteorologistDiscussionProps {
  selectedLocation: string;
}

const bustRiskTooltips = {
  warmBias: {
    title: 'Warm Bias Risk',
    description: 'Models may be too warm versus observed trend; demand could be underestimated.',
    signal: 'Typical signal: Models consistently above observations in recent runs.',
  },
  coldBias: {
    title: 'Cold Bias Risk',
    description: 'Models may be too cold versus observed trend; demand could be overestimated.',
    signal: 'Typical signal: Models consistently below observations in recent runs.',
  },
  windOver: {
    title: 'Wind Over-Forecast Risk',
    description: 'Guidance may be overstating wind speeds; wind generation could come in below forecast.',
    signal: 'Typical signal: Spread widening on wind speed forecasts, ensemble members diverging.',
  },
  windUnder: {
    title: 'Wind Under-Forecast Risk',
    description: 'Guidance may be understating wind speeds; wind generation could exceed forecast.',
    signal: 'Typical signal: Recent model bias toward lower wind speeds than observed.',
  },
  solarOver: {
    title: 'Solar Over-Forecast Risk',
    description: 'Cloud clearing risk may be overestimated; irradiance could come in below forecast.',
    signal: 'Typical signal: Cloud cover persisting longer than models indicate.',
  },
  solarUnder: {
    title: 'Solar Under-Forecast Risk',
    description: 'Cloud clearing risk; irradiance may outperform forecast midday.',
    signal: 'Typical signal: Cloud dissipation faster than model guidance suggests.',
  },
};

export function MeteorologistDiscussion({ selectedLocation }: MeteorologistDiscussionProps) {
  const [hoveredBustRisk, setHoveredBustRisk] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const content = discussionData[selectedLocation] || discussionData['Hong Kong'];

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-risk-medium" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-risk-low" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 7) return 'text-risk-high';
    if (score >= 4) return 'text-risk-medium';
    return 'text-risk-low';
  };

  const getRiskMeterWidth = (score: number) => {
    return `${(score / 10) * 100}%`;
  };

  const getRiskMeterColor = (score: number) => {
    if (score >= 7) return 'bg-risk-high';
    if (score >= 4) return 'bg-risk-medium';
    return 'bg-risk-low';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 7.5) return 'text-primary';
    if (score >= 5.5) return 'text-risk-medium';
    return 'text-risk-high';
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(content.executiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="bg-card border border-neutral-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium text-foreground">
            Meteorologist Forecast Discussion
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Copy executive summary"
          >
            <Copy className="w-3 h-3" />
            {copiedSummary ? 'Copied!' : 'Copy summary'}
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Last updated {content.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left Column: Fast Scan (2 cols) */}
        <div className="col-span-2 space-y-5">
          {/* Executive Summary */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Executive Summary</h3>
            <p className="text-sm text-foreground leading-relaxed">
              {content.executiveSummary}
            </p>
          </div>

          {/* Key Risks */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Risks</h3>
            <div className="space-y-3">
              {content.keyRisks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{risk.risk}</span>
                      <span className="text-xs text-muted-foreground">{risk.window}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{risk.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts Context */}
          <div className="bg-accent rounded-lg p-4 border border-neutral-border">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
              <h3 className="text-sm font-medium text-foreground">Active Alerts — What they mean here</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {content.activeAlertsContext}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.activeAlertTags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[tag.severity]}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence + What I'm Watching */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Confidence + What I'm Watching</h3>
            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-muted-foreground">Forecast Confidence:</span>
                <span className={`text-xl font-semibold ${getConfidenceColor(content.confidenceScore)}`}>
                  {content.confidenceScore.toFixed(1)}<span className="text-sm text-muted-foreground">/10</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(content.confidenceScore / 10) * 100}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2">
              {content.watchingItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                  <span className="text-primary mt-0.5">→</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Weather Discussion Narrative (3 cols) */}
        <div className="col-span-3 space-y-5">
          {/* Weather Discussion */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Weather Discussion</h3>
              <p className="text-xs text-muted-foreground italic">{content.localClimatologyNuance}</p>
            </div>
            <div className="bg-accent rounded-lg p-4 border border-neutral-border space-y-3">
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">Current State</h4>
                <p className="text-sm text-foreground leading-relaxed">{content.weatherDiscussion.currentState}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">Primary Driver</h4>
                <p className="text-sm text-foreground leading-relaxed">{content.weatherDiscussion.primaryDriver}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">What Changes Next</h4>
                <p className="text-sm text-foreground leading-relaxed">{content.weatherDiscussion.nextChange}</p>
              </div>
              <div className="pt-2 border-t border-neutral-border">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Risk Window</h4>
                <p className="text-sm font-medium text-foreground">{content.weatherDiscussion.riskWindow}</p>
              </div>
            </div>
          </div>

          {/* Timing Strip */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Risk Timeline</h3>
            <div className="grid grid-cols-5 gap-2">
              {content.timingStrip.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 border ${
                    item.riskLevel
                      ? riskLevelColors[item.riskLevel]
                      : 'bg-card border-neutral-border'
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${item.riskLevel ? '' : 'text-muted-foreground'}`}>
                    {item.period}
                  </p>
                  <p className={`text-xs ${item.riskLevel ? 'opacity-90' : 'text-muted-foreground'}`}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bust Forecast Module */}
          <div className="bg-accent border border-neutral-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Bust Forecast</h3>
            
            {/* Bust-Risk Score */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-muted-foreground">Bust-Risk Score</span>
                <span className={`text-2xl font-semibold ${getRiskScoreColor(content.bustRiskScore)}`}>
                  {content.bustRiskScore.toFixed(1)}<span className="text-sm text-muted-foreground">/10</span>
                </span>
              </div>
              
              {/* Risk Meter */}
              <div className="w-full h-2 bg-neutral-bg rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${getRiskMeterColor(content.bustRiskScore)} transition-all duration-500`}
                  style={{ width: getRiskMeterWidth(content.bustRiskScore) }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                0 = models aligned, low spread • 10 = high divergence, high spread, pattern instability
              </p>
            </div>

            {/* Bust Direction */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">Bust Direction</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'warmBias', label: 'Warm bias', trend: content.bustDirection.warmBias },
                  { key: 'coldBias', label: 'Cold bias', trend: content.bustDirection.coldBias },
                  { key: 'windOver', label: 'Wind over-fcst', trend: content.bustDirection.windOver },
                  { key: 'windUnder', label: 'Wind under-fcst', trend: content.bustDirection.windUnder },
                  { key: 'solarOver', label: 'Solar over-fcst', trend: content.bustDirection.solarOver },
                  { key: 'solarUnder', label: 'Solar under-fcst', trend: content.bustDirection.solarUnder },
                ].map(({ key, label, trend }) => (
                  <div
                    key={key}
                    className="relative flex items-center justify-between px-2 py-1.5 bg-card rounded border border-neutral-border hover:border-primary/50 transition-colors cursor-help"
                    onMouseEnter={() => setHoveredBustRisk(key)}
                    onMouseLeave={() => setHoveredBustRisk(null)}
                  >
                    <span className="text-xs text-foreground">{label}</span>
                    {getTrendIcon(trend)}
                    
                    {/* Tooltip */}
                    {hoveredBustRisk === key && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-72 p-3 bg-popover border border-neutral-border rounded-lg shadow-lg">
                        <p className="text-xs font-medium text-foreground mb-1">
                          {bustRiskTooltips[key as keyof typeof bustRiskTooltips].title}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {bustRiskTooltips[key as keyof typeof bustRiskTooltips].description}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {bustRiskTooltips[key as keyof typeof bustRiskTooltips].signal}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Why It Matters */}
            <div className="pt-3 border-t border-neutral-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Why It Matters</h4>
              <p className="text-xs text-foreground leading-relaxed">
                {content.bustWhyItMatters}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
