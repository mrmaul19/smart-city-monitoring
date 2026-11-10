import type { MonitoredLocation } from "@/types/location";

/**
 * Default monitoring location.
 *
 * Singapore, because the only public camera source wired in publishes
 * Singapore snapshots — so the map, cameras and weather all refer to the same
 * city out of the box. Weather and air quality work for any coordinate.
 */
export const DEFAULT_LOCATION: MonitoredLocation = {
  id: "1880252",
  name: "Singapore",
  country: "Singapore",
  latitude: 1.3521,
  longitude: 103.8198,
  timezone: "Asia/Singapore",
};

/**
 * Quick-pick locations offered before the user searches for their own.
 *
 * Every id, coordinate and timezone below was read from a live Open-Meteo
 * geocoding response rather than written from memory, so they match exactly
 * what a search for the same city returns — picking a preset and searching for
 * it give the same place, not two near-duplicates.
 */
export const PRESET_LOCATIONS: readonly MonitoredLocation[] = [
  DEFAULT_LOCATION,
  {
    id: "1642911",
    name: "Jakarta",
    country: "Indonesia",
    admin1: "Jakarta Special Capital Region",
    latitude: -6.21462,
    longitude: 106.84513,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1650357",
    name: "Bandung",
    country: "Indonesia",
    admin1: "West Java",
    latitude: -6.92222,
    longitude: 107.60694,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1625822",
    name: "Surabaya",
    country: "Indonesia",
    admin1: "East Java",
    latitude: -7.24917,
    longitude: 112.75083,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1627896",
    name: "Semarang",
    country: "Indonesia",
    admin1: "Central Java",
    latitude: -6.99306,
    longitude: 110.42083,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1621177",
    name: "Yogyakarta",
    country: "Indonesia",
    admin1: "Special Region of Yogyakarta",
    latitude: -7.80139,
    longitude: 110.36472,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1214520",
    name: "Medan",
    country: "Indonesia",
    admin1: "North Sumatra",
    latitude: 3.58333,
    longitude: 98.66667,
    timezone: "Asia/Jakarta",
  },
  {
    id: "1645528",
    name: "Denpasar",
    country: "Indonesia",
    admin1: "Bali",
    latitude: -8.65,
    longitude: 115.21667,
    // Bali is UTC+8, an hour ahead of Jakarta — worth noting because every
    // timestamp is rendered in the monitored city's own timezone.
    timezone: "Asia/Makassar",
  },
  {
    id: "1622786",
    name: "Makassar",
    country: "Indonesia",
    admin1: "South Sulawesi",
    latitude: -5.14861,
    longitude: 119.43194,
    timezone: "Asia/Makassar",
  },
  {
    id: "1735161",
    name: "Kuala Lumpur",
    country: "Malaysia",
    latitude: 3.1412,
    longitude: 101.6865,
    timezone: "Asia/Kuala_Lumpur",
  },
];

/**
 * Cameras are only published for Singapore, so a reading that depends on the
 * camera source has to say which location it actually refers to. This is the
 * check the camera widgets use to show that notice.
 */
export function isCameraCoverage(location: MonitoredLocation): boolean {
  return (
    location.latitude >= 1.15 &&
    location.latitude <= 1.48 &&
    location.longitude >= 103.6 &&
    location.longitude <= 104.1
  );
}
