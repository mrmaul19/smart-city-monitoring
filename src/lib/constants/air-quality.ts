import type {
  AirQualityBand,
  AirQualityIndex,
  PollutantReading,
} from "@/types/air-quality";

/** Maps a band to a theme status token, used by badges and meters. */
export const BAND_TONE: Readonly<
  Record<AirQualityBand, "success" | "warning" | "danger">
> = {
  good: "success",
  fair: "success",
  moderate: "warning",
  poor: "danger",
  "very-poor": "danger",
  "extremely-poor": "danger",
};

interface BandDefinition {
  /** Inclusive upper bound of the band. */
  max: number;
  band: AirQualityBand;
  label: string;
  advice: string;
}

/**
 * European AQI bands, per the European Environment Agency index used by
 * Open-Meteo. The index is open-ended above 100.
 */
const EUROPEAN_BANDS: readonly BandDefinition[] = [
  {
    max: 20,
    band: "good",
    label: "Good",
    advice: "Air quality is good. No precautions needed.",
  },
  {
    max: 40,
    band: "fair",
    label: "Fair",
    advice: "Air quality is acceptable for most people.",
  },
  {
    max: 60,
    band: "moderate",
    label: "Moderate",
    advice: "Sensitive groups may want to limit prolonged outdoor exertion.",
  },
  {
    max: 80,
    band: "poor",
    label: "Poor",
    advice: "Sensitive groups should reduce outdoor activity.",
  },
  {
    max: 100,
    band: "very-poor",
    label: "Very poor",
    advice: "Everyone should reduce prolonged outdoor exertion.",
  },
  {
    max: Number.POSITIVE_INFINITY,
    band: "extremely-poor",
    label: "Extremely poor",
    advice: "Avoid outdoor exertion. Keep windows closed where possible.",
  },
];

/** US EPA AQI bands, as published by AirNow. */
const US_BANDS: readonly BandDefinition[] = [
  {
    max: 50,
    band: "good",
    label: "Good",
    advice: "Air quality is satisfactory and poses little or no risk.",
  },
  {
    max: 100,
    band: "fair",
    label: "Moderate",
    advice: "Unusually sensitive people should consider reducing exertion.",
  },
  {
    max: 150,
    band: "moderate",
    label: "Unhealthy for sensitive groups",
    advice: "Sensitive groups should reduce prolonged outdoor exertion.",
  },
  {
    max: 200,
    band: "poor",
    label: "Unhealthy",
    advice: "Everyone may begin to experience effects; limit exertion.",
  },
  {
    max: 300,
    band: "very-poor",
    label: "Very unhealthy",
    advice: "Avoid outdoor exertion. Sensitive groups should stay indoors.",
  },
  {
    max: Number.POSITIVE_INFINITY,
    band: "extremely-poor",
    label: "Hazardous",
    advice: "Everyone should avoid outdoor activity.",
  },
];

function classify(
  value: number | null | undefined,
  bands: readonly BandDefinition[],
): AirQualityIndex | null {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  // The last band is open-ended, so a match is guaranteed for finite input.
  const match = bands.find((band) => value <= band.max) ?? bands.at(-1);
  if (!match) return null;

  return {
    value: Math.round(value),
    band: match.band,
    label: match.label,
    advice: match.advice,
  };
}

export function classifyEuropeanAqi(
  value: number | null | undefined,
): AirQualityIndex | null {
  return classify(value, EUROPEAN_BANDS);
}

export function classifyUsAqi(
  value: number | null | undefined,
): AirQualityIndex | null {
  return classify(value, US_BANDS);
}

/** Display metadata for each pollutant, in the order the UI shows them. */
export const POLLUTANT_META: readonly Omit<PollutantReading, "value">[] = [
  { key: "pm2_5", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "nitrogen_dioxide", label: "NO₂", unit: "µg/m³" },
  { key: "ozone", label: "O₃", unit: "µg/m³" },
  { key: "sulphur_dioxide", label: "SO₂", unit: "µg/m³" },
  { key: "carbon_monoxide", label: "CO", unit: "µg/m³" },
];
