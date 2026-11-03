/**
 * Data helpers used to build the site. These replace the HaggerstonJS middleware and swig
 * filters that the old Grunt build used (photosets, trim-tags, listPageIconify, etc).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';

import events from '../data/events.json';
import photosetsIndex from '../data/photos/photosets.json';

export const SITE_URL = 'https://nakeditchyfeet.com';

const dataDir = path.resolve('src/data');

// ---------------------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------------------

/** Parses the date formats used in the content ("2013-04-05", "2013-06-20 20:00") as UTC. */
export function parseDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }
  const m = value.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(:\d{2})?)$/);
  if (m) {
    return new Date(`${m[1]}T${m[2]}${m[3] ? '' : ':00'}Z`);
  }
  return new Date(value);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return n + (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "5th April 2013" */
export const formatLongDate = (d: Date) => `${ordinal(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

/** "5th Apr 2013" */
export const formatShortDate = (d: Date) => `${ordinal(d.getUTCDate())} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;

/** "2013-04-05" */
export const formatIsoDate = (d: Date) => d.toISOString().slice(0, 10);

/** RFC 2822 date as used in RSS: "Fri, 05 Apr 2013 00:00:00 +0000" */
export const formatRfc2822 = (d: Date) =>
  `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()} ` +
  `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} +0000`;

// ---------------------------------------------------------------------------------------
// Content pages (markdown in src/content/pages)
// ---------------------------------------------------------------------------------------

export type ContentPage = CollectionEntry<'pages'> & { url: string };

/** URL of a content entry, e.g. `/blog/hawaii/`. */
export const pageUrl = (entry: CollectionEntry<'pages'>) => `/${entry.id}/`;

/** All content pages. Drafts are only included in dev. */
export async function getContentPages(): Promise<ContentPage[]> {
  const entries = await getCollection('pages', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries
    .map((entry) => ({ ...entry, url: pageUrl(entry) }))
    .sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
}

/** Which icon to show in the header of a content page, based on its section of the site. */
export function headerIcon(url: string): string | undefined {
  const section = url.match(/^\/([^/]+)\//)?.[1] ?? '';
  return ({ blog: 'book', 'travel-tips': 'info-circle', 'follow-us': 'twitter', 'about-us': 'foot' } as Record<string, string>)[section];
}

// ---------------------------------------------------------------------------------------
// Photosets (Flickr data in src/data/photos - updated with `bun run flickr`)
// ---------------------------------------------------------------------------------------

export interface FlickrPhoto {
  id: string;
  title: string;
  datetaken: string;
  machine_tags: string;
  geo_is_public?: number;
  latitude: number | string;
  longitude: number | string;
  [key: string]: unknown;
}

export interface Photo extends FlickrPhoto {
  geo: string;
  listPageUrl: string;
  listPageHeight: number;
  listPageWidth: number;
}

export interface Photoset {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
  author: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
  photos: Photo[];
}

/** Flickr image URLs in the data are plain http - serve them over https. */
export const https = (url: unknown) => String(url ?? '').replace(/^http:\/\//, 'https://');

let photosetsCache: Photoset[] | undefined;

export function getPhotosets(): Photoset[] {
  if (photosetsCache) return photosetsCache;

  photosetsCache = photosetsIndex.map(({ id, title }) => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'photos', `${id}.json`), 'utf8')) as {
      description: string;
      photos: FlickrPhoto[];
    };
    const photos = data.photos;

    // TODO: Don't presume the last in the set is the oldest?
    const date = photos[photos.length - 1].datetaken.slice(0, 10);

    const located = photos.filter((p) => p.geo_is_public);
    const latitude = located.length ? located.reduce((sum, p) => sum + +p.latitude, 0) / located.length : undefined;
    const longitude = located.length ? located.reduce((sum, p) => sum + +p.longitude, 0) / located.length : undefined;

    return {
      id,
      title,
      description: data.description,
      url: `/photos/${id}/`,
      date,
      author: 'Kelvin Luck',
      tags: ['photo'],
      latitude,
      longitude,
      photos: photos.map((photo) => {
        // Pick the smallest size which is tall enough for the photoset page.
        const size = ['s', 'n', 'm', 'z', 'c'].find((s) => Number(photo[`height_${s}`]) > 130) ?? 'l';
        return {
          ...photo,
          // Default to the photoset's position if there is no position for the photo.
          geo: photo.geo_is_public ? `${photo.latitude},${photo.longitude}` : `${latitude},${longitude}`,
          listPageUrl: https(photo[`url_${size}`]),
          listPageHeight: Number(photo[`height_${size}`]),
          listPageWidth: Number(photo[`width_${size}`]),
        };
      }),
    };
  });
  return photosetsCache;
}

export interface PhotosetPreviewData {
  big: Photo;
  small: Photo[];
  side: number;
}

// ---------------------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------------------

/** Tags are only shown (and tag pages generated) when at least two pages share them. */
export async function getTagCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const all = [...(await getContentPages()).map((p) => p.data.tags), ...getPhotosets().map((p) => p.tags)];
  for (const tags of all) {
    for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return counts;
}

export async function visibleTags(tags: string[]): Promise<string[]> {
  const counts = await getTagCounts();
  return tags.filter((t) => (counts.get(t) ?? 0) > 1).sort();
}

/** Tag pages are at /tags/<tag>.html with the (first) space replaced by a dash. */
export const tagSlug = (tag: string) => tag.replace(' ', '-');
export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}.html`;

// ---------------------------------------------------------------------------------------
// List items (home page, tag pages, feed, map)
// ---------------------------------------------------------------------------------------

export interface ListItem {
  type: 'post' | 'tip' | 'photo' | 'flight' | string;
  icon: string;
  date: Date;
  /** HTML */
  label: string;
  hasLink: boolean;
  url?: string;
  title?: string;
  author?: string;
  isDraft?: boolean;
  image?: string;
  geo?: string;
  latitude?: number;
  longitude?: number;
  photosetData?: PhotosetPreviewData;
  description?: string;
  page?: ContentPage;
  externalLink?: string;
  airports?: string;
  tags: string[];
}

function photosetPreview(photoset: Photoset, i: number): ListItem {
  // Photos with a `nif:list_page=1` (or `nif:listpage=1`) machine tag are shown first.
  const isListPagePhoto = (p: Photo) => /nif:list_?page=1/.test(p.machine_tags);
  const listPagePhotos = [...photoset.photos]
    .sort((a, b) => (isListPagePhoto(a) ? -1 : isListPagePhoto(b) ? 1 : 0))
    .slice(0, 5);

  return {
    type: 'photo',
    icon: 'camera-retro',
    url: photoset.url,
    title: photoset.title,
    author: photoset.author,
    date: parseDate(photoset.date),
    label: `Photo album: ${escapeHtml(photoset.title)}`,
    photosetData: {
      big: listPagePhotos[0],
      small: listPagePhotos.slice(1, 5),
      side: i % 2,
    },
    geo: `${photoset.latitude},${photoset.longitude}`,
    latitude: photoset.latitude,
    longitude: photoset.longitude,
    description: photoset.description,
    hasLink: true,
    tags: photoset.tags,
  };
}

function contentPageItem(page: ContentPage, type: 'post' | 'tip', icon: string): ListItem {
  const { data } = page;
  return {
    type,
    icon,
    url: page.url,
    title: data.title,
    author: data.author,
    isDraft: data.draft,
    date: parseDate(data.date ?? ''),
    label: escapeHtml(data.title),
    image: type === 'post' ? data.headerImage : undefined,
    geo: `${data.latitude},${data.longitude}`,
    latitude: data.latitude,
    longitude: data.longitude,
    page,
    hasLink: true,
    tags: data.tags,
  };
}

/** Blog posts, travel tips and photosets, in no particular order (the old `listPageIconify` filter). */
export async function getListItems(): Promise<ListItem[]> {
  const pages = await getContentPages();
  const blogs = pages.filter((p) => p.url.startsWith('/blog/')).map((p) => contentPageItem(p, 'post', 'book'));
  const tips = pages.filter((p) => /^\/travel-tips\/.+/.test(p.url)).map((p) => contentPageItem(p, 'tip', 'info-circle'));
  const photos = getPhotosets().map(photosetPreview);
  return [...blogs, ...tips, ...photos];
}

/** The photoset previews to show at the bottom of a blog post. */
export function getPhotosetPreviews(ids: string[]): ListItem[] {
  return getPhotosets()
    .filter((p) => ids.includes(p.id))
    .map(photosetPreview);
}

/** Sorts newest first (stable, matching the old `sortByKey('date')|reverse`). */
export function newestFirst<T extends { date: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();
}

// ---------------------------------------------------------------------------------------
// Events (flights etc from src/data/events.json)
// ---------------------------------------------------------------------------------------

interface Airport {
  lat: string;
  lng: string;
  name: string;
}

let airportsCache: Record<string, Airport> | undefined;

function getAirports(): Record<string, Airport> {
  if (airportsCache) return airportsCache;
  airportsCache = {};
  for (const line of fs.readFileSync(path.join(dataDir, 'airports.csv'), 'utf8').split('\n')) {
    const parts = line.split(',');
    if (parts.length < 7) continue;
    const code = parts[4].replace(/"/g, '');
    if (code) {
      airportsCache[code] = { lat: parts[6], lng: parts[7], name: parts[1].replace(/"/g, '') };
    }
  }
  return airportsCache;
}

interface RawEvent {
  date: string;
  icon: string;
  label: string;
  airports?: string;
  geo?: number[];
  externalLink?: string;
  [key: string]: unknown;
}

export function getEvents(): ListItem[] {
  const airports = getAirports();
  return (events as RawEvent[]).map((event) => {
    const item: ListItem = {
      type: event.icon,
      icon: event.icon,
      date: parseDate(event.date),
      label: event.label,
      geo: event.geo?.join(','),
      externalLink: event.externalLink,
      hasLink: !!event.externalLink,
      tags: [],
    };
    if (event.icon === 'plane' && event.airports) {
      const codes = event.airports.split(',');
      const [from, to] = event.label.split('-');
      item.type = 'flight';
      item.label =
        `<span class="airport-code">${codes[0]}</span> ${from} - ` +
        `<span class="airport-code">${codes[codes.length - 1]}</span>${to}`;
      item.airports = codes.map((code) => `${code}|${airports[code].lat},${airports[code].lng}|${airports[code].name}`).join('||');
    }
    return item;
  });
}

// ---------------------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------------------

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** The intro text for a list item, used in the RSS feed. */
export function itemIntro(item: ListItem): string | undefined {
  switch (item.type) {
    case 'photo':
      return item.description || item.label;
    case 'post':
    case 'tip': {
      const html = item.page?.rendered?.html ?? '';
      return cheerio.load(html, null, false).root().children('p').first().html() ?? undefined;
    }
  }
}
