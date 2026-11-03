import type { APIRoute } from 'astro';
import { formatShortDate, getEvents, getListItems } from '../lib/site';

/** Data for the markers on the /map/ page (loaded by src/scripts/pages/map.ts). */
export const GET: APIRoute = async () => {
  const markers = (await getListItems())
    .filter((item) => item.latitude !== undefined && item.longitude !== undefined)
    .map((item) => ({
      // Relative to the site root - the map prepends the `/`.
      link: item.url!.replace(/^\//, ''),
      title: item.title,
      date: formatShortDate(item.date),
      latitude: item.latitude,
      longitude: item.longitude,
      type: item.type,
      icon: item.icon,
    }));

  const flights = getEvents()
    .filter((event) => event.type === 'flight')
    .map((event) => ({ airports: event.airports, type: 'flight' }));

  return new Response(JSON.stringify([...markers, ...flights]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
