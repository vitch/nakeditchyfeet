import type { APIRoute } from 'astro';
import stays from '../data/stays.json';


/** Where we stayed each night, grouped by location. */
export const GET: APIRoute = () => {
  const locations = new Map<string, Omit<(typeof stays.locations)[number], 'id'> & { dates: string[] }>();
  for (const { id, ...location } of stays.locations) {
    locations.set(id, { ...location, dates: [] });
  }
  for (const stay of stays.stays) {
    locations.get(stay.location)?.dates.push(stay.date);
  }
  return new Response(JSON.stringify([...locations.values()]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
