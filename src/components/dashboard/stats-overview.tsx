"use client";

import { Cctv, Droplets, Gauge, MapPin, Thermometer, Wind } from "lucide-react";

import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import type { StatTone } from "@/components/common/stat-card";
import { useAirQuality } from "@/hooks/use-air-quality";
import { useCameras } from "@/hooks/use-cameras";
import { useLocation } from "@/hooks/use-location";
import { useWeather } from "@/hooks/use-weather";
import { usePreferencesStore } from "@/stores/preferences-store";
import { BAND_TONE } from "@/lib/constants/air-quality";
import {
  formatNumber,
  formatPercent,
  formatTemperature,
} from "@/lib/utils/format";

/**
 * The headline reading row.
 *
 * Reads all three sources, but each through its own query — so a camera
 * refresh does not re-request the weather, and one provider failing leaves the
 * other tiles populated.
 */
export function StatsOverview() {
  const { location } = useLocation();
  const aqiPreference = usePreferencesStore((state) => state.aqiPreference);
  const weather = useWeather(location);
  const airQuality = useAirQuality(location);
  const cameras = useCameras();

  const loading =
    weather.isPending || airQuality.isPending || cameras.isPending;

  if (loading) {
    return (
      <section
        aria-label="Key readings"
        className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </section>
    );
  }

  const current = weather.data?.current;
  const units = weather.data?.units;

  // Which index leads is a user preference; both are always shown in full on
  // the air quality page.
  const aqi =
    (aqiPreference === "us"
      ? airQuality.data?.usAqi
      : airQuality.data?.europeanAqi) ?? null;

  const aqiTone: StatTone = aqi
    ? BAND_TONE[aqi.band] === "success"
      ? "success"
      : BAND_TONE[aqi.band] === "warning"
        ? "warning"
        : "danger"
    : "neutral";

  return (
    <section
      aria-label="Key readings"
      className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6"
    >
      <StatCard
        label="Monitored location"
        value={location.name}
        icon={MapPin}
        caption={location.country}
      />
      <StatCard
        label="Public cameras"
        value={cameras.data ? String(cameras.data.cameras.length) : null}
        icon={Cctv}
        caption="Snapshot sources"
      />
      <StatCard
        label="Temperature"
        value={current ? formatTemperature(current.temperature) : null}
        unit={units?.temperature}
        icon={Thermometer}
        caption={current?.condition.label}
      />
      <StatCard
        label="Humidity"
        value={current ? formatPercent(current.humidity) : null}
        unit="%"
        icon={Droplets}
        caption={
          current && current.precipitationProbability !== null
            ? `${formatPercent(current.precipitationProbability)}% rain chance`
            : undefined
        }
      />
      <StatCard
        label={aqiPreference === "us" ? "Air quality (US)" : "Air quality (EU)"}
        value={aqi ? String(aqi.value) : null}
        icon={Gauge}
        tone={aqiTone}
        caption={aqi?.label}
      />
      <StatCard
        label="Wind speed"
        value={current ? formatNumber(current.windSpeed) : null}
        unit={units?.windSpeed}
        icon={Wind}
        caption="10 m above ground"
      />
    </section>
  );
}
