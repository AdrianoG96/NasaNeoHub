/**
 * Orbital mechanics calculations for 3D asteroid visualization.
 * Converts orbital elements into 3D positions in scene space.
 */

export interface OrbitalParams {
  eccentricity: number
  semiMajorAxis: number // in AU
  inclination: number // in degrees
  ascendingNode: number // longitude of ascending node in degrees
  perihelionArg: number // argument of perihelion in degrees
  meanAnomaly: number // mean anomaly in degrees
}

export interface Position3D {
  x: number
  y: number
  z: number
}

/**
 * Converts orbital elements to 3D position.
 * Uses Keplerian orbital mechanics to compute the true anomaly
 * and transform from orbital plane to ecliptic coordinates.
 */
export function calculateOrbitalPosition(params: OrbitalParams): Position3D {
  const { eccentricity, semiMajorAxis, inclination, ascendingNode, perihelionArg, meanAnomaly } =
    params

  // Convert degrees to radians
  const incRad = (inclination * Math.PI) / 180
  const nodeRad = (ascendingNode * Math.PI) / 180
  const argRad = (perihelionArg * Math.PI) / 180
  const meanRad = (meanAnomaly * Math.PI) / 180

  // Solve Kepler's equation for eccentric anomaly (E) using Newton's method
  // M = E - e * sin(E)
  let E = meanRad
  for (let i = 0; i < 20; i++) {
    const dE = (meanRad - (E - eccentricity * Math.sin(E))) / (1 - eccentricity * Math.cos(E))
    E += dE
    if (Math.abs(dE) < 1e-8) break
  }

  // True anomaly (v)
  const sinV = (Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E)) / (1 - eccentricity * Math.cos(E))
  const cosV = (Math.cos(E) - eccentricity) / (1 - eccentricity * Math.cos(E))
  const trueAnomaly = Math.atan2(sinV, cosV)

  // Distance from focus (r) in AU
  const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly))

  // Position in orbital plane (perifocal coordinates)
  const xOrbital = r * Math.cos(trueAnomaly + argRad)
  const yOrbital = r * Math.sin(trueAnomaly + argRad)

  // Transform to ecliptic coordinates (rotate by inclination and ascending node)
  const cosNode = Math.cos(nodeRad)
  const sinNode = Math.sin(nodeRad)
  const cosInc = Math.cos(incRad)
  const sinInc = Math.sin(incRad)

  const x = xOrbital * cosNode - yOrbital * sinNode * cosInc
  const y = xOrbital * sinNode + yOrbital * cosNode * cosInc
  const z = yOrbital * sinInc

  return { x, y, z }
}

/**
 * Generates points along an elliptical orbit for drawing orbit lines.
 * Returns an array of 3D points that trace the full ellipse.
 */
export function generateOrbitPoints(
  params: OrbitalParams,
  segments = 128
): [number, number, number][] {
  const { eccentricity, semiMajorAxis, inclination, ascendingNode, perihelionArg } = params

  const incRad = (inclination * Math.PI) / 180
  const nodeRad = (ascendingNode * Math.PI) / 180
  const argRad = (perihelionArg * Math.PI) / 180

  const points: [number, number, number][] = []

  for (let i = 0; i <= segments; i++) {
    const trueAnomaly = (i / segments) * 2 * Math.PI

    // Distance from focus
    const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly))

    // Position in orbital plane
    const xOrbital = r * Math.cos(trueAnomaly + argRad)
    const yOrbital = r * Math.sin(trueAnomaly + argRad)

    // Transform to ecliptic
    const cosNode = Math.cos(nodeRad)
    const sinNode = Math.sin(nodeRad)
    const cosInc = Math.cos(incRad)
    const sinInc = Math.sin(incRad)

    const x = xOrbital * cosNode - yOrbital * sinNode * cosInc
    const y = xOrbital * sinNode + yOrbital * cosNode * cosInc
    const z = yOrbital * sinInc

    points.push([x, y, z])
  }

  return points
}

/**
 * Scales an AU-based position to scene units.
 * Earth's orbit (1 AU) maps to ~4 scene units.
 */
export function auToSceneUnits(au: number): number {
  return au * 4
}

/**
 * Scales a position from AU to scene units.
 */
export function scalePosition(pos: Position3D): Position3D {
  return {
    x: auToSceneUnits(pos.x),
    y: auToSceneUnits(pos.y),
    z: auToSceneUnits(pos.z),
  }
}

/**
 * Scales orbit points from AU to scene units.
 */
export function scaleOrbitPoints(points: [number, number, number][]): [number, number, number][] {
  return points.map(([x, y, z]) => [auToSceneUnits(x), auToSceneUnits(y), auToSceneUnits(z)])
}

/**
 * Fallback position calculation when orbital data is not available.
 * Uses miss_distance_km to place asteroids on a sphere around Earth's orbit.
 */
export function fallbackPosition(
  missDistanceKm: number,
  seed: number
): Position3D {
  const distance = Math.min(missDistanceKm / 100000, 8)
  const angle = (seed * 137.508) % 360 // Golden angle for even distribution
  const elevation = ((seed * 47.3) % 180) - 90

  const rad = (angle * Math.PI) / 180
  const elevRad = (elevation * Math.PI) / 180

  return {
    x: Math.cos(rad) * distance * Math.cos(elevRad),
    y: Math.sin(elevRad) * distance * 0.3,
    z: Math.sin(rad) * distance * Math.cos(elevRad),
  }
}

/**
 * Determines asteroid size in scene units based on real diameter.
 */
export function asteroidSceneSize(diameterMaxKm: number): number {
  return Math.max(0.04, Math.min(diameterMaxKm * 1.5, 0.35))
}

/**
 * Creates a simple hash from a string for deterministic pseudo-random values.
 */
export function hashSeed(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}
