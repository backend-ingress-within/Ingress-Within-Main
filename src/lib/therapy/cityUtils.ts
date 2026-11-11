const CITY_ALIASES: Record<string, string> = {
  bangalore: 'bengaluru',
  bengaluru: 'bengaluru',
  bombay: 'mumbai',
  mumbai: 'mumbai',
  navi_mumbai: 'mumbai',
  'navi mumbai': 'mumbai',
  gurgaon: 'gurugram',
  gurugram: 'gurugram',
  'new delhi': 'delhi',
  delhi: 'delhi',
  'delhi ncr': 'delhi',
  ncr: 'delhi',
  calcutta: 'kolkata',
  kolkata: 'kolkata',
  madras: 'chennai',
  chennai: 'chennai',
  poona: 'pune',
  pune: 'pune',
  cochin: 'kochi',
  kochi: 'kochi',
  trivandrum: 'thiruvananthapuram',
  thiruvananthapuram: 'thiruvananthapuram',
  baroda: 'vadodara',
  vadodara: 'vadodara',
  mysore: 'mysuru',
  mysuru: 'mysuru',
  mangalore: 'mangaluru',
  mangaluru: 'mangaluru',
  allahabad: 'prayagraj',
  prayagraj: 'prayagraj',
  banaras: 'varanasi',
  benares: 'varanasi',
  varanasi: 'varanasi',
  pondicherry: 'puducherry',
  puducherry: 'puducherry',
};

/**
 * Normalizes a city string by stripping state/country suffixes and parentheses
 * and mapping common Indian city aliases (e.g. Bangalore <-> Bengaluru).
 */
export function normalizeCity(value?: string | null): string {
  const raw = String(value || '')
    .split(',')[0]
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  if (!raw) return '';
  return CITY_ALIASES[raw] || raw;
}

/**
 * Returns true if two non-empty city strings resolve to the same canonical city.
 */
export function citiesMatch(a?: string | null, b?: string | null): boolean {
  const na = normalizeCity(a);
  const nb = normalizeCity(b);
  if (!na || !nb) return false;
  return na === nb;
}
