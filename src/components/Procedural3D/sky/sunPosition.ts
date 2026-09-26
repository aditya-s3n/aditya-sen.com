import type * as THREE from 'three';
import { getMoonPosition, getPosition } from 'suncalc';
import { SF_LOCATION, SF_TIMEZONE } from '../config';

const DEG = Math.PI / 180;

/**
 * suncalc v2 angles are DEGREES, azimuth clockwise from NORTH
 * (0 = N, 90 = E, 180 = S, 270 = W). With world axes +X = east,
 * +Y = up, -Z = north (see config.ts):
 *   x =  sin(az) * cos(alt)
 *   y =  sin(alt)
 *   z = -cos(az) * cos(alt)
 */
function toDirection(azimuthDeg: number, altitudeDeg: number, target: THREE.Vector3) {
  const az = azimuthDeg * DEG;
  const alt = altitudeDeg * DEG;
  return target.set(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt));
}

/**
 * Real-time sun direction over San Francisco. A Date is an absolute
 * instant, so this is right for SF no matter the visitor's time zone.
 */
export function getSunDirection(date: Date, target: THREE.Vector3): THREE.Vector3 {
  const { azimuth, altitude } = getPosition(date, SF_LOCATION.lat, SF_LOCATION.lng);
  return toDirection(azimuth, altitude, target);
}

export function getMoonDirection(date: Date, target: THREE.Vector3): THREE.Vector3 {
  const { azimuth, altitude } = getMoonPosition(date, SF_LOCATION.lat, SF_LOCATION.lng);
  return toDirection(azimuth, altitude, target);
}

/** Sun altitude in degrees; negative below the horizon. */
export function getSunAltitude(date: Date): number {
  return getPosition(date, SF_LOCATION.lat, SF_LOCATION.lng).altitude;
}

const sfTimeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: SF_TIMEZONE,
  hour: 'numeric',
  minute: '2-digit',
});

/** SF wall-clock time for UI, e.g. "4:52 PM". */
export function formatSFTime(date: Date): string {
  return sfTimeFormat.format(date);
}
