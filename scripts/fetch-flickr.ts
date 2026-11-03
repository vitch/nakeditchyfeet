/**
 * Downloads the photoset data for the site from Flickr into src/data/photos/.
 *
 * - src/data/photos/photosets.json is always refreshed with the sets in the collection.
 * - src/data/photos/<id>.json is only downloaded for sets which don't have a file yet
 *   (delete a file to re-download it).
 *
 * Run with `bun run flickr`. Set FLICKR_API_KEY to use your own API key.
 */
import fs from 'node:fs';
import path from 'node:path';

const USER_ID = '51035610516@N01';
const COLLECTION_ID = '46131-72157633392960182';
// Please use your own API Key if you are using this as a template for your own site
const API_KEY = process.env.FLICKR_API_KEY ?? '6f3e186ef51005004ece29d2d2ec8583';

const EXTRAS =
  'description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o';

const outDir = path.resolve(import.meta.dirname, '../src/data/photos');

async function flickr<T>(method: string, params: Record<string, string>): Promise<T> {
  const url = new URL('https://api.flickr.com/services/rest/');
  url.search = new URLSearchParams({ method, api_key: API_KEY, format: 'json', nojsoncallback: '1', ...params }).toString();
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.stat !== 'ok') {
    throw new Error(`${method} failed: ${json.message ?? res.statusText}`);
  }
  return json as T;
}

interface FlickrSet {
  id: string;
  title: string;
  description: string;
}

const tree = await flickr<{ collections: { collection: { set: FlickrSet[] }[] } }>('flickr.collections.getTree', {
  user_id: USER_ID,
  collection_id: COLLECTION_ID,
});
const sets = tree.collections.collection[0].set;
fs.writeFileSync(path.join(outDir, 'photosets.json'), JSON.stringify(sets, null, 2));
console.log(`Found ${sets.length} photosets`);

for (const set of sets) {
  const file = path.join(outDir, `${set.id}.json`);
  if (fs.existsSync(file)) continue;

  console.log(`Downloading info for set ${set.id} ("${set.title}")...`);
  const photos: unknown[] = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const res = await flickr<{ photoset: { photo: unknown[]; pages: number } }>('flickr.photosets.getPhotos', {
      photoset_id: set.id,
      extras: EXTRAS,
      page: String(page),
    });
    photos.push(...res.photoset.photo);
    pages = res.photoset.pages;
  }
  fs.writeFileSync(file, JSON.stringify({ id: set.id, title: set.title, description: set.description, photos }, null, 2));
}
