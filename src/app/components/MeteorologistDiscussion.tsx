import React, { useState } from 'react';
import { User, Clock, Copy, ArrowUp, ArrowDown, ArrowRight, Info, ChevronDown, ChevronUp, Sun, Wind, Thermometer, Droplets, Zap, Cloud } from 'lucide-react';
import { SynopticSnapshot } from '@/app/components/SynopticSnapshot';
import { ExposureHedgeStrip } from '@/app/components/ExposureHedgeStrip';
import { BustForecastInteractive } from '@/app/components/BustForecastInteractive';

interface DirectionalRiskTile {
  variable: string;
  direction: 'up' | 'down' | 'neutral';
  probability: string;
  impact: string;
  tooltip: string;
}

interface FailureMode {
  rank: number;
  label: string;
  likelihood: 'low' | 'medium' | 'high';
  trigger: string;
  explanation: string;
  window?: string; // Optional time window for the scenario
}

interface TimelineForecast {
  variable: string;
  direction: 'up' | 'down' | 'neutral';
  probability: number; // percentage as number (e.g., 68)
  expectedMiss: string;
  bustRiskScore: number;
  timeWindow: string;
  uncertaintyBand: {
    p25: number;
    p50: number;
    p75: number;
  };
  worstCase: string;
}

interface DiscussionContent {
  location: string;
  executiveSummary: string;
  keyRisks: Array<{ risk: string; window: string; impact: string }>;
  alertAlignment: {
    severities: Array<{ label: string; severity: 'warning' | 'watch' | 'low' }>;
    skewSummary: string;
    window: string;
    impact: string;
  };
  confidenceScore: number;
  watchingItems: string[];
  directionalRiskSnapshot: DirectionalRiskTile[];
  weatherDiscussion: {
    currentState: string;
    currentStateDetailed: string;
    primaryDriver: string;
    primaryDriverDetailed: string;
    nextChange: string;
    nextChangeDetailed: string;
    riskWindow: string;
  };
  localClimatologyNuance: string;
  timingStrip: Array<{
    period: string;
    riskLevel: 'high' | 'medium' | 'low' | null;
    note: string;
  }>;
  timelineForecasts: Record<string, TimelineForecast>; // keyed by period
  weatherRegime: {
    regimeTag: string;
    microTags: string[];
    typicalBust: string;
    triggerToWatch: string;
  };
  lastUpdated: string;
  bustRiskScore: number;
  directionalCall: {
    variable: string;
    direction: 'up' | 'down' | 'neutral';
    timeframe: string;
    severity: 'warning' | 'watch' | 'low';
    probability: string;
    expectedMiss: string;
    confidence: 'low' | 'medium' | 'high';
    driver: string;
  };
  likelyFailureModes: FailureMode[];
  whyItMatters: string;
}

const discussionData: Record<string, DiscussionContent> = {
  'Hong Kong': {
    location: 'Hong Kong',
    executiveSummary: 'Wind ramps during evening demand peak (18:00–22:00 local). Timing uncertainty ±2h. Wind generation likely ~250 MW below forecast; load risk +0.8 GW higher due to cooler temps.',
    keyRisks: [
      { risk: 'Wind ramps', window: '18:00–22:00 local', impact: 'Wind generation uncertainty + balancing risk' },
      { risk: 'Gusts 35-45 kt', window: '20:00–00:00 local', impact: 'Curtailment risk + output volatility' },
      { risk: 'Evening demand peak', window: '18:00–21:00 local', impact: 'Coincident timing amplifies balancing challenges' },
    ],
    alertAlignment: {
      severities: [
        { label: 'High', severity: 'warning' },
        { label: 'Medium', severity: 'watch' },
      ],
      skewSummary: 'Skew earlier (≈60%)',
      window: '18:00–22:00',
      impact: 'Wind volatility + balancing risk into evening peak',
    },
    confidenceScore: 6.5,
    watchingItems: [
      'Shortwave timing — model spread ±2h',
      'CAPE buildup by 12:00 — higher values = more intense cells',
      'Confidence is moderate — timing is the main uncertainty (not magnitude)',
    ],
    directionalRiskSnapshot: [
      {
        variable: 'Wind Gen',
        direction: 'down',
        probability: 'P(lower) 75%',
        impact: '–250 MW risk',
        tooltip: 'Models overstating gradient strength; actual wind speeds likely 5-8 kt below forecast',
      },
      {
        variable: 'Load',
        direction: 'up',
        probability: 'P(higher) 62%',
        impact: '+0.8 GW risk',
        tooltip: 'Cooler than forecast temps + wind chill effect = higher heating demand',
      },
      {
        variable: 'Temperature',
        direction: 'down',
        probability: 'P(colder) 65%',
        impact: '–2°C vs fcst',
        tooltip: 'Cold advection stronger than models indicate; offshore flow colder than expected',
      },
      {
        variable: 'Ramp Timing',
        direction: 'up',
        probability: 'P(earlier) 58%',
        impact: '17:00 vs 19:00',
        tooltip: 'Pressure gradient tightening faster than guidance; ramp window advancing 2h',
      },
    ],
    weatherDiscussion: {
      currentState: 'High building over eastern China with offshore trough deepening.',
      currentStateDetailed: 'Surface high building over eastern China with low pressure trough deepening offshore. Current winds 15-20 kt NE with pressure gradient steadily tightening.',
      primaryDriver: 'Pressure gradient tightening as systems move closer.',
      primaryDriverDetailed: 'Synoptic-scale pressure gradient driven by continental high advancing SE while offshore trough deepens. Classic wintertime setup for sustained NE flow across region.',
      nextChange: 'Gradient peaks 18:00–22:00; winds ramp to 35-45 kt.',
      nextChangeDetailed: 'Gradient peaks 18:00–22:00 local as high center shifts closer and trough axis moves east. Winds ramp to 35-45 kt with gusts embedded in brief convective bands. Relaxation begins post-midnight as systems separate.',
      riskWindow: 'Primary: 18:00–22:00 (high confidence). Secondary: 00:00–06:00 (medium confidence).',
    },
    localClimatologyNuance: 'Local factor: Terrain channeling through Victoria Harbor can amplify gusts ±10 kt vs open water obs.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Steady NE 15-20 kt' },
      { period: 'Next 6h', riskLevel: 'medium', note: 'Gradient building' },
      { period: 'Next 24h', riskLevel: 'high', note: 'Peak ramp 18-22h' },
      { period: 'Days 2–3', riskLevel: 'low', note: 'Gradual relaxation' },
      { period: 'Days 4–7', riskLevel: null, note: 'Return to light flow' },
    ],
    timelineForecasts: {
      '18:00–22:00': {
        variable: 'Wind Gen',
        direction: 'down',
        probability: 68,
        expectedMiss: '–250 MW',
        bustRiskScore: 7.4,
        timeWindow: '18:00–22:00 local',
        uncertaintyBand: {
          p25: 50,
          p50: 200,
          p75: 400,
        },
        worstCase: '–400 MW',
      },
    },
    weatherRegime: {
      regimeTag: 'Tight Gradient NE Flow',
      microTags: ['Rapid ramps', 'Convective gusts', 'Marine influence'],
      typicalBust: 'Wind tends to bust lower (models overstate gradient); load tends higher (cold advection underestimated).',
      triggerToWatch: 'Watch gradient peak timing — earlier trough movement advances ramp window by 2-3h.',
    },
    lastUpdated: '14 minutes ago',
    bustRiskScore: 7.4,
    directionalCall: {
      variable: 'Wind Gen',
      direction: 'down',
      timeframe: '18:00–22:00 local',
      severity: 'warning',
      probability: 'lower 75%',
      expectedMiss: '–250 MW',
      confidence: 'high',
      driver: 'Models overstating pressure gradient strength',
    },
    likelyFailureModes: [
      {
        rank: 1,
        label: 'Ramp arrives earlier (17:00 vs 19:00)',
        likelihood: 'medium',
        trigger: 'Pressure deepening faster than forecast',
        explanation: 'If trough accelerates, gradient peaks 2h earlier. Monitor surface pressure tendency at HKO obs.',
        window: '17:00–19:00',
      },
      {
        rank: 2,
        label: 'Load spike higher than forecast',
        likelihood: 'high',
        trigger: 'Temps colder + wind chill effect',
        explanation: 'Cold advection stronger than modeled. Monitor actual temps vs forecast; each degree = ~400 MW load.',
        window: '18:00–22:00',
      },
    ],
    whyItMatters: 'Wind likely ~250 MW below forecast (Snapshot #1); top risk is earlier ramp timing (Failure Mode #1).',
  },
  'Seoul': {
    location: 'Seoul',
    executiveSummary: 'Thunderstorm development mid-afternoon (14:00–18:00 local). Solar output drops 40-60% during storm passage. Timing uncertainty ±2h. Storm likely arrives earlier than forecast.',
    keyRisks: [
      { risk: 'Thunderstorms', window: '14:00–18:00 local', impact: 'Grid stability concern + solar irradiance collapse' },
      { risk: 'Solar volatility', window: '13:00–19:00 local', impact: '40-60% output swings during convective passage' },
      { risk: 'Localized wind gusts', window: '15:00–18:00 local', impact: 'Short-term wind gen spikes + turbine stress' },
    ],
    alertAlignment: {
      severities: [
        { label: 'High', severity: 'warning' },
      ],
      skewSummary: 'Skew earlier (≈60%)',
      window: '14:00–18:00',
      impact: 'Convective risk + solar output collapse',
    },
    confidenceScore: 6.5,
    watchingItems: [
      'Shortwave timing — model spread ±2h',
      'CAPE buildup by 12:00 — higher values = more intense cells',
    ],
    directionalRiskSnapshot: [
      {
        variable: 'Solar',
        direction: 'down',
        probability: 'P(lower) 68%',
        impact: '–60% output',
        tooltip: 'Storms arriving earlier than forecast; irradiance collapse 13:00 vs 15:00',
      },
      {
        variable: 'Wind Gen',
        direction: 'up',
        probability: 'P(higher) 55%',
        impact: '+180 MW spikes',
        tooltip: 'Gust front winds stronger than models show; short-term wind gen spikes likely',
      },
      {
        variable: 'Storm Timing',
        direction: 'up',
        probability: 'P(earlier) 62%',
        impact: '13:00 vs 15:00',
        tooltip: 'Shortwave moving faster than guidance; GFS timing more accurate',
      },
      {
        variable: 'Convective',
        direction: 'up',
        probability: 'P(intense) 58%',
        impact: 'Severe risk',
        tooltip: 'CAPE building higher than forecast; stronger cells with hail/wind risk',
      },
    ],
    weatherDiscussion: {
      currentState: 'Weak trough with moisture pooling; instability building.',
      currentStateDetailed: 'Weak surface trough across Yellow Sea with moisture pooling ahead of shortwave aloft. Morning clear with heating building instability. Current CAPE ~800 J/kg, increasing through early afternoon.',
      primaryDriver: 'Mid-level shortwave providing lift for convection.',
      primaryDriverDetailed: 'Mid-level shortwave approaching from northwest providing lift. Surface heating + moisture convergence triggers convection along outflow boundaries by 14:00–15:00 local.',
      nextChange: 'Convection initiates 14:00–15:00; cells move ESE.',
      nextChangeDetailed: 'Convective initiation 14:00–15:00 as shortwave moves overhead. Cells develop rapidly, move ESE across metro area through 18:00. Brief heavy rain + gusts 40-50 kt + lightning. Solar irradiance drops 60-80% under cells. Clearing begins 18:00–19:00 as shortwave exits east.',
      riskWindow: 'Primary: 14:00–18:00 (medium-high confidence). Timing uncertainty ±2h.',
    },
    localClimatologyNuance: 'Local factor: Urban heat island can advance storm initiation ±1–2h vs rural areas.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Clear, heating' },
      { period: 'Next 6h', riskLevel: 'high', note: 'Convection 14-18h' },
      { period: 'Next 24h', riskLevel: 'low', note: 'Clearing overnight' },
      { period: 'Days 2–3', riskLevel: null, note: 'Stable ridge builds' },
      { period: 'Days 4–7', riskLevel: 'medium', note: 'Next system Day 5' },
    ],
    timelineForecasts: {
      '14:00–18:00': {
        variable: 'Solar',
        direction: 'down',
        probability: 68,
        expectedMiss: '–60% output',
        bustRiskScore: 6.8,
        timeWindow: '14:00–18:00 local',
        uncertaintyBand: {
          p25: 40,
          p50: 50,
          p75: 70,
        },
        worstCase: '–70% output',
      },
    },
    weatherRegime: {
      regimeTag: 'Shortwave Convective Setup',
      microTags: ['Storm timing risk', 'Solar volatility', 'Urban heat island'],
      typicalBust: 'Storm timing tends earlier (urban heat island); solar tends lower (irradiance collapse sooner).',
      triggerToWatch: 'Watch shortwave speed — faster movement = earlier convection (GFS vs ECMWF spread).',
    },
    lastUpdated: '8 minutes ago',
    bustRiskScore: 6.8,
    directionalCall: {
      variable: 'Solar',
      direction: 'down',
      timeframe: '14:00–18:00 local',
      severity: 'warning',
      probability: 'lower 68%',
      expectedMiss: '–60% output',
      confidence: 'medium',
      driver: 'Shortwave speed — faster movement = earlier convection',
    },
    likelyFailureModes: [
      {
        rank: 1,
        label: 'Storms arrive 2h earlier (13:00 vs 15:00)',
        likelihood: 'high',
        trigger: 'Shortwave moving faster than guidance',
        explanation: 'GFS showing earlier timing. Urban heat island advances initiation. Monitor satellite + radar 12:00 local.',
        window: '13:00–15:00',
      },
      {
        rank: 2,
        label: 'Cells more intense than forecast',
        likelihood: 'medium',
        trigger: 'CAPE building higher than expected',
        explanation: 'Watch 12:00 soundings. Higher CAPE = stronger cells with severe wind/hail risk.',
        window: '14:00–18:00',
      },
    ],
    whyItMatters: 'Solar likely ~60% below forecast (Snapshot #1); top risk is earlier storm timing (Failure Mode #1).',
  },
  'Singapore': {
    location: 'Singapore',
    executiveSummary: 'Sea breeze triggers afternoon cloud cover (12:00–16:00 local). Solar output swings 30-40% from cloud passages. LNG backup sensitivity during volatility. Timing uncertainty ±1–2h.',
    keyRisks: [
      { risk: 'Solar output swings', window: '12:00–16:00 local', impact: '30-40% swings from cloud passages' },
      { risk: 'Sea breeze timing', window: '11:00–15:00 local', impact: 'Convergence placement ±1–2h = forecast risk' },
      { risk: 'LNG backup activation', window: '13:00–15:00 local', impact: 'Grid stability during solar volatility + operational sensitivity' },
    ],
    alertAlignment: {
      severities: [
        { label: 'Medium', severity: 'watch' },
      ],
      skewSummary: 'Skew lower (≈60%)',
      window: '12:00–16:00',
      impact: 'Solar volatility + LNG backup ops sensitivity',
    },
    confidenceScore: 5.8,
    watchingItems: [
      'Sea breeze front arrival time — satellite boundary placement',
      'Upstream moisture from Sumatra — wetter airmass = persistent clouds',
      'Confidence is moderate — timing is the main uncertainty (not magnitude)',
    ],
    directionalRiskSnapshot: [
      {
        variable: 'Solar',
        direction: 'down',
        probability: 'P(lower) 60%',
        impact: '–35% output',
        tooltip: 'Sea breeze arriving earlier than forecast; cloud field 12:00 vs 14:00',
      },
      {
        variable: 'Cloud Cover',
        direction: 'up',
        probability: 'P(higher) 58%',
        impact: '+20% cloud',
        tooltip: 'Moisture feed from Sumatra stronger than models indicate; clouds persist longer',
      },
      {
        variable: 'Sea Breeze',
        direction: 'up',
        probability: 'P(earlier) 55%',
        impact: '11:00 vs 13:00',
        tooltip: 'Stronger land-sea thermal gradient = earlier convergence onset',
      },
      {
        variable: 'LNG Ops',
        direction: 'neutral',
        probability: 'Ops sensitivity',
        impact: 'Backup window',
        tooltip: 'LNG backup activation likely 13:00–15:00 during cloud passages for grid stability',
      },
    ],
    weatherDiscussion: {
      currentState: 'Light offshore flow; heating building; sea breeze advancing.',
      currentStateDetailed: 'Light offshore flow overnight transitioning to calm. Clear skies with strong heating building. Sea breeze front currently 20-30 km offshore, advancing slowly onshore.',
      primaryDriver: 'Diurnal sea breeze circulation from land-sea thermal contrast.',
      primaryDriverDetailed: 'Diurnal sea breeze circulation driven by land-sea thermal contrast. Onshore flow initiates convergence over island, lifting moisture into cumulus field by early afternoon.',
      nextChange: 'Sea breeze crosses coast 11:00–13:00; cumulus develops.',
      nextChangeDetailed: 'Sea breeze front crosses coast 11:00–13:00 local (±1h). Convergence triggers cumulus development over metro area 12:00–16:00. Intermittent clouds reduce solar irradiance 30-40% during passages. Evening clearing as flow weakens post-sunset.',
      riskWindow: 'Primary: 12:00–16:00 (medium confidence). Timing tied to sea breeze speed.',
    },
    localClimatologyNuance: 'Local factor: Sea breeze timing can shift cloud initiation ±2h depending on offshore SST.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Clear, heating' },
      { period: 'Next 6h', riskLevel: 'medium', note: 'Sea breeze clouds' },
      { period: 'Next 24h', riskLevel: 'low', note: 'Evening clearing' },
      { period: 'Days 2–3', riskLevel: 'medium', note: 'Similar pattern' },
      { period: 'Days 4–7', riskLevel: null, note: 'Monsoon shift possible' },
    ],
    timelineForecasts: {
      '12:00–16:00': {
        variable: 'Solar',
        direction: 'down',
        probability: 60,
        expectedMiss: '–35% output',
        bustRiskScore: 4.2,
        timeWindow: '12:00–16:00 local',
        uncertaintyBand: {
          p25: 20,
          p50: 30,
          p75: 50,
        },
        worstCase: '–50% output',
      },
    },
    weatherRegime: {
      regimeTag: 'Sea Breeze Convergence',
      microTags: ['Cloud variability', 'LNG ops sensitivity', 'Diurnal cycle'],
      typicalBust: 'Solar tends lower (sea breeze timing advances cloud field); LNG logistics sensitivity during solar swings.',
      triggerToWatch: 'Watch sea breeze arrival timing — satellite boundary + Sumatra moisture feed.',
    },
    lastUpdated: '11 minutes ago',
    bustRiskScore: 4.2,
    directionalCall: {
      variable: 'Solar',
      direction: 'down',
      timeframe: '12:00–16:00 local',
      severity: 'watch',
      probability: 'lower 60%',
      expectedMiss: '–35% output',
      confidence: 'medium',
      driver: 'Sea breeze timing — satellite boundary + Sumatra moisture feed',
    },
    likelyFailureModes: [
      {
        rank: 1,
        label: 'Sea breeze arrives early (11:00 vs 13:00)',
        likelihood: 'medium',
        trigger: 'Stronger land-sea thermal gradient',
        explanation: 'Monitor satellite imagery for boundary position. Earlier arrival = earlier cloud development.',
      },
      {
        rank: 2,
        label: 'Clouds persist longer than forecast',
        likelihood: 'medium',
        trigger: 'Moisture feed from Sumatra stronger',
        explanation: 'Wetter upstream airmass = more persistent cloud deck. Monitor Sumatra radar + moisture trends.',
      },
    ],
    whyItMatters: 'Solar likely ~35% below forecast (Snapshot #1); LNG backup ops sensitivity during output swings.',
  },
  'Sydney': {
    location: 'Sydney',
    executiveSummary: 'Light morning fog clearing 07:00–10:00 local. Minor solar ramp delay ~1h. Stable conditions with low forecast uncertainty. Minimal operational impact.',
    keyRisks: [
      { risk: 'Fog/mist clearing', window: '07:00–10:00 local', impact: 'Minor solar ramp delay (±1h timing uncertainty)' },
      { risk: 'Cloud timing', window: '12:00–15:00 local', impact: 'Slight afternoon cloud variability (low PV impact)' },
      { risk: 'Temperature', window: 'All periods', impact: 'Near seasonal normal (neutral load risk)' },
    ],
    alertAlignment: {
      severities: [
        { label: 'Low', severity: 'low' },
      ],
      skewSummary: 'Neutral',
      window: '07:00–10:00',
      impact: 'Stable conditions with minor fog clearing timing uncertainty',
    },
    confidenceScore: 6.8,
    watchingItems: [
      'Temperature trend by 08:00 — faster warming = quicker dissipation',
      'Wind tendency — any onshore flow delays clearing',
      'Confidence is moderate — timing is the main uncertainty (not magnitude)',
    ],
    directionalRiskSnapshot: [
      {
        variable: 'Solar',
        direction: 'neutral',
        probability: 'P(neutral) 55%',
        impact: '±5% output',
        tooltip: 'Fog clearing timing near forecast; minor delay possible but low impact',
      },
      {
        variable: 'Temperature',
        direction: 'neutral',
        probability: 'P(neutral) 60%',
        impact: '±1°C vs fcst',
        tooltip: 'Temps tracking near seasonal normal; minimal load impact',
      },
      {
        variable: 'Fog Timing',
        direction: 'down',
        probability: 'P(persists) 45%',
        impact: '09:00 vs 08:00',
        tooltip: 'Slight risk fog lingers 1h longer if heating slower than expected',
      },
      {
        variable: 'Load',
        direction: 'neutral',
        probability: 'P(neutral) 58%',
        impact: '±0.3 GW',
        tooltip: 'Demand tracking near forecast with minimal temperature-driven variance',
      },
    ],
    weatherDiscussion: {
      currentState: 'High pressure; light offshore flow; shallow fog layer.',
      currentStateDetailed: 'Weak high pressure over Tasman Sea with light offshore flow overnight. Radiational cooling under clear skies formed shallow fog/mist layer. Current visibility 1-3 miles across metro area.',
      primaryDriver: 'Radiational cooling overnight under clear skies.',
      primaryDriverDetailed: 'Radiational cooling overnight under clear skies and light winds. Shallow stable layer trapping moisture near surface. Fog/mist depth ~200-400 ft AGL.',
      nextChange: 'Fog lifts 07:00–08:00 as surface warms.',
      nextChangeDetailed: 'Sunrise heating begins 06:00 local. Fog starts lifting 07:00–08:00 as surface warms and mixing layer deepens. Gradual improvement through 10:00–11:00 with complete clearing by midday. Solar ramp-up delayed 1h vs clear-sky forecast.',
      riskWindow: 'Primary: 07:00–10:00 (medium confidence). Clearing timing ±1h.',
    },
    localClimatologyNuance: 'Local factor: Coastal vs inland clearing can differ by 1–2h.',
    timingStrip: [
      { period: 'Now', riskLevel: 'low', note: 'Light fog/mist' },
      { period: 'Next 6h', riskLevel: 'low', note: 'Gradual clearing' },
      { period: 'Next 24h', riskLevel: null, note: 'Clear afternoon' },
      { period: 'Days 2–3', riskLevel: null, note: 'Ridge holds' },
      { period: 'Days 4–7', riskLevel: null, note: 'Stable pattern' },
    ],
    timelineForecasts: {
      '07:00–10:00': {
        variable: 'Solar',
        direction: 'down',
        probability: 55,
        expectedMiss: '±5% output',
        bustRiskScore: 3.8,
        timeWindow: '07:00–10:00 local',
        uncertaintyBand: {
          p25: 0,
          p50: 5,
          p75: 10,
        },
        worstCase: '±10% output',
      },
    },
    weatherRegime: {
      regimeTag: 'Stable Ridge',
      microTags: ['Light fog', 'Minimal risk', 'Seasonal normal'],
      typicalBust: 'Neutral to slight timing shifts for fog clearing; solar/load neutral (temps near normal).',
      triggerToWatch: 'Watch surface heating rate — faster warming clears fog earlier.',
    },
    lastUpdated: '6 minutes ago',
    bustRiskScore: 3.8,
    directionalCall: {
      variable: 'Solar',
      direction: 'down',
      timeframe: '07:00–10:00 local',
      severity: 'low',
      probability: 'neutral 55%',
      expectedMiss: '±5% output',
      confidence: 'medium',
      driver: 'Surface heating rate — faster warming clears fog earlier',
    },
    likelyFailureModes: [
      {
        rank: 1,
        label: 'Fog persists 1h longer (09:00 vs 08:00)',
        likelihood: 'low',
        trigger: 'Slower surface warming than expected',
        explanation: 'Monitor 08:00 temps. If heating slower, fog lingers. Impact minor (±5% solar).',
      },
    ],
    whyItMatters: 'Stable pattern with minimal risk. Only minor fog timing uncertainty (low impact).',
  },
  'Tokyo': {
    location: 'Tokyo',
    executiveSummary: 'Stable ridge through Day 3. Clear skies and steady winds support optimal renewable generation. Minimal uncertainty. High-confidence forecast.',
    keyRisks: [
      { risk: 'Minimal operational risk', window: 'All periods', impact: 'Stable generation environment' },
      { risk: 'Slight wind decline', window: '00:00–06:00 local', impact: 'Modest gen reduction overnight (10-15%)' },
      { risk: 'Overall low-risk', window: 'Through Day 3', impact: 'High-confidence forecast supports aggressive positions' },
    ],
    alertAlignment: {
      severities: [
        { label: 'Low', severity: 'low' },
      ],
      skewSummary: 'Neutral',
      window: 'All periods',
      impact: 'Stable ridge with minimal operational concerns',
    },
    confidenceScore: 8.5,
    watchingItems: [
      'Pacific trough progression — earliest arrival Day 5',
      'Ridge axis position — any shift would weaken flow marginally',
      'Confidence is moderate — timing is the main uncertainty (not magnitude)',
    ],
    directionalRiskSnapshot: [
      {
        variable: 'Wind Gen',
        direction: 'neutral',
        probability: 'P(neutral) 70%',
        impact: '±50 MW',
        tooltip: 'Steady flow with minimal variance; overnight decline well-forecasted',
      },
      {
        variable: 'Solar',
        direction: 'neutral',
        probability: 'P(neutral) 75%',
        impact: '±2% output',
        tooltip: 'Clear skies expected; minimal cloud risk through Day 3',
      },
      {
        variable: 'Load',
        direction: 'neutral',
        probability: 'P(neutral) 68%',
        impact: '±0.5 GW',
        tooltip: 'Demand tracking seasonal normal with high confidence',
      },
      {
        variable: 'Temperature',
        direction: 'neutral',
        probability: 'P(neutral) 72%',
        impact: '±0.5°C',
        tooltip: 'Temps near seasonal avg; minimal heating/cooling demand variance',
      },
    ],
    weatherDiscussion: {
      currentState: 'Strong ridge; clear skies; light to moderate NW flow.',
      currentStateDetailed: 'Strong mid-level ridge centered over Japan with surface high pressure. Clear skies, light to moderate NW flow 10-15 kt. No significant weather systems within 1000 km.',
      primaryDriver: 'Broad upper ridge providing subsidence and stability.',
      primaryDriverDetailed: 'Broad upper-level ridge providing subsidence and stability. Downstream Pacific trough remains well east, maintaining ridge dominance through Day 4. Anticyclonic flow pattern supports steady conditions.',
      nextChange: 'Ridge holds through Day 3; minimal changes expected.',
      nextChangeDetailed: 'Ridge holds through Day 3 with minimal changes. Slight wind speed decline overnight as surface high drifts east, reducing gradient marginally. No precipitation, cloud cover, or significant wind shifts expected. Next system arrival not until Day 5-6 as Pacific trough approaches.',
      riskWindow: 'No significant risk windows. Overnight wind reduction minor and well-forecasted.',
    },
    localClimatologyNuance: 'Local factor: Wintertime ridge patterns typically very stable; model spread minimal.',
    timingStrip: [
      { period: 'Now', riskLevel: null, note: 'Stable, clear' },
      { period: 'Next 6h', riskLevel: null, note: 'Light wind decline' },
      { period: 'Next 24h', riskLevel: null, note: 'Continued stable' },
      { period: 'Days 2–3', riskLevel: null, note: 'Ridge holds' },
      { period: 'Days 4–7', riskLevel: 'low', note: 'Trough approach D5-6' },
    ],
    timelineForecasts: {
      '00:00–06:00': {
        variable: 'Wind Gen',
        direction: 'down',
        probability: 70,
        expectedMiss: '±50 MW',
        bustRiskScore: 1.8,
        timeWindow: '00:00–06:00 local',
        uncertaintyBand: {
          p25: 0,
          p50: 50,
          p75: 100,
        },
        worstCase: '±100 MW',
      },
    },
    weatherRegime: {
      regimeTag: 'Stable Ridge Dominance',
      microTags: ['Clear skies', 'Steady winds', 'Minimal spread'],
      typicalBust: 'Neutral across all variables; models aligned; only minor overnight wind decline (well-forecasted).',
      triggerToWatch: 'Watch Pacific trough progression — faster movement advances next system (currently Day 5-6).',
    },
    lastUpdated: '18 minutes ago',
    bustRiskScore: 1.8,
    directionalCall: {
      variable: 'Wind Gen',
      direction: 'down',
      timeframe: '00:00–06:00 local',
      severity: 'low',
      probability: 'neutral 70%',
      expectedMiss: '±50 MW',
      confidence: 'high',
      driver: 'Pacific trough progression — faster movement advances next system',
    },
    likelyFailureModes: [
      {
        rank: 1,
        label: 'Next system arrives earlier (Day 4 vs Day 5)',
        likelihood: 'low',
        trigger: 'Pacific trough accelerates eastward',
        explanation: 'Monitor trough progression. Faster movement = earlier system arrival, but impact minimal (Day 5-6).',
      },
    ],
    whyItMatters: 'Stable pattern with minimal risk. Models aligned; high-confidence positioning supported.',
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

const likelihoodColors = {
  high: 'text-risk-high',
  medium: 'text-risk-medium',
  low: 'text-risk-low',
};

interface MeteorologistDiscussionProps {
  selectedLocation: string;
}

export function MeteorologistDiscussion({ selectedLocation }: MeteorologistDiscussionProps) {
  const [hoveredFailureMode, setHoveredFailureMode] = useState<number | null>(null);
  const [hoveredRiskTile, setHoveredRiskTile] = useState<string | null>(null);
  const [hoveredDriverTooltip, setHoveredDriverTooltip] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [bustDetailsExpanded, setBustDetailsExpanded] = useState(false);
  const [hoveredTimelineChip, setHoveredTimelineChip] = useState<string | null>(null);
  const [pinnedFailureMode, setPinnedFailureMode] = useState<number | null>(null);
  const [hoveredDirectionZone, setHoveredDirectionZone] = useState<string | null>(null);
  const [showUncertaintyBand, setShowUncertaintyBand] = useState(false);
  
  const content = discussionData[selectedLocation] || discussionData['Hong Kong'];
  
  // Get default timeline forecast (first available)
  const defaultTimeWindow = Object.keys(content.timelineForecasts)[0];
  const activeForecast = hoveredTimelineChip && content.timelineForecasts[hoveredTimelineChip]
    ? content.timelineForecasts[hoveredTimelineChip]
    : content.timelineForecasts[defaultTimeWindow];

  const getDirectionIcon = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return <ArrowUp className="w-4 h-4 text-risk-medium" />;
    if (direction === 'down') return <ArrowDown className="w-4 h-4 text-risk-low" />;
    return <ArrowRight className="w-4 h-4 text-muted-foreground" />;
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
      <div className="grid grid-cols-5 gap-6 items-stretch">
        {/* Left Column: Fast Scan (2 cols) - Flex column with bottom spacer */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Executive Summary */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Executive Summary</h3>
            <p className="text-sm text-foreground leading-relaxed">
              {content.executiveSummary}
            </p>
          </div>

          {/* Key Directional Risks */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Directional Risks</h3>
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

          {/* Alert Alignment */}
          <div className="bg-accent rounded-lg p-3 border border-neutral-border">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">Alert Alignment</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-1.5">
                {content.alertAlignment.severities.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${severityColors[tag.severity]}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="h-3 w-px bg-neutral-border"></div>
              <span className="text-xs font-medium text-foreground">{content.alertAlignment.skewSummary}</span>
              <div className="h-3 w-px bg-neutral-border"></div>
              <span className="text-xs text-muted-foreground">Window: {content.alertAlignment.window}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Impact: {content.alertAlignment.impact}
            </p>
          </div>

          {/* Confidence + What I'm Watching */}
          <div>
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

          {/* Directional Risk Snapshot (ONLY place with probability + magnitude) */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Directional Risk Snapshot (Next 6–12h)</h3>
            <div className="grid grid-cols-2 gap-2">
              {content.directionalRiskSnapshot.map((tile, idx) => (
                <div
                  key={idx}
                  className="relative bg-accent border border-neutral-border rounded-lg p-2 hover:border-primary/50 transition-colors cursor-help"
                  onMouseEnter={() => setHoveredRiskTile(tile.variable)}
                  onMouseLeave={() => setHoveredRiskTile(null)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getDirectionIcon(tile.direction)}
                    <span className="text-xs font-medium text-foreground truncate">{tile.variable}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">{tile.probability}</div>
                  <div className="text-[10px] font-medium text-foreground truncate">{tile.impact}</div>

                  {/* Tooltip */}
                  {hoveredRiskTile === tile.variable && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-popover border border-neutral-border rounded-lg shadow-lg">
                      <p className="text-xs text-foreground leading-relaxed">
                        {tile.tooltip}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Synoptic Snapshot (Weather Charts) */}
          <SynopticSnapshot selectedLocation={selectedLocation} />

          {/* Bottom Divider */}
          <div className="pt-3">
            <div className="h-px w-full bg-neutral-border opacity-20"></div>
          </div>

          {/* Bottom Spacer - absorbs remaining space to keep columns flush */}
          <div className="flex-1 min-h-0"></div>
        </div>

        {/* Right Column: Weather Discussion Narrative (3 cols) - Flex column with bottom spacer */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Weather Discussion with expand/collapse */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Weather Discussion</h3>
              <p className="text-xs text-muted-foreground italic">{content.localClimatologyNuance}</p>
            </div>
            <div className="bg-accent rounded-lg p-4 border border-neutral-border space-y-3">
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">Current State</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {expandedSection === 'currentState' ? content.weatherDiscussion.currentStateDetailed : content.weatherDiscussion.currentState}
                </p>
                <button
                  onClick={() => toggleSection('currentState')}
                  className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                >
                  {expandedSection === 'currentState' ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Read more
                    </>
                  )}
                </button>
              </div>
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">Primary Driver</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {expandedSection === 'primaryDriver' ? content.weatherDiscussion.primaryDriverDetailed : content.weatherDiscussion.primaryDriver}
                </p>
                <button
                  onClick={() => toggleSection('primaryDriver')}
                  className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                >
                  {expandedSection === 'primaryDriver' ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Read more
                    </>
                  )}
                </button>
              </div>
              <div>
                <h4 className="text-xs font-medium text-primary mb-1">What Changes Next</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {expandedSection === 'nextChange' ? content.weatherDiscussion.nextChangeDetailed : content.weatherDiscussion.nextChange}
                </p>
                <button
                  onClick={() => toggleSection('nextChange')}
                  className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                >
                  {expandedSection === 'nextChange' ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Read more
                    </>
                  )}
                </button>
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
                  className={`rounded-lg p-2.5 border ${
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
              ))}</div>
          </div>

          {/* Weather Regime Discussion */}
          <div className="bg-accent border border-neutral-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Weather Regime Discussion (Human-in-the-Loop)</h3>
            <div className="flex gap-4">
              {/* Left: Regime Tags */}
              <div className="flex-shrink-0">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-primary mb-2">
                  Regime: {content.weatherRegime.regimeTag}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {content.weatherRegime.microTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-card border border-neutral-border text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Right: Typical Bust + Trigger ONLY (no re-explaining setup) */}
              <div className="flex-1 space-y-2">
                <p className="text-xs text-foreground leading-relaxed">
                  {content.weatherRegime.typicalBust}
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {content.weatherRegime.triggerToWatch}
                </p>
              </div>
            </div>
          </div>

          {/* Bust Forecast (Trader View) */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col">
            <h3 className="text-sm font-medium text-foreground mb-3">Bust Forecast (Trader View)</h3>
            
            <BustForecastInteractive
              selectedLocation={selectedLocation}
              timelineForecasts={content.timelineForecasts}
              likelyFailureModes={content.likelyFailureModes}
            />
            
            {/* Bottom Divider */}
            <div className="pt-3">
              <div className="h-px w-full bg-neutral-border opacity-20"></div>
            </div>

            {/* Bottom Spacer - absorbs remaining space to keep columns flush */}
            <div className="flex-1 min-h-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}