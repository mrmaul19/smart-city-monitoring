export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MonitoredLocation extends Coordinates {
  /** Stable identifier; for geocoded places this is the GeoNames id. */
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  /** IANA timezone reported by the upstream provider. */
  timezone?: string;
}
