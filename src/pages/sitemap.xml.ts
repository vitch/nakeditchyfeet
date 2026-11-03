import type { APIRoute } from 'astro';
import { SITE_URL, getContentPages, getPhotosets, getTagCounts, parseDate, tagUrl } from '../lib/site';

export const GET: APIRoute = async () => {
  const urls: { loc: string; date?: string }[] = [{ loc: '/' }, { loc: '/map/' }];

  for (const page of await getContentPages()) {
    urls.push({ loc: page.url, date: page.data.date });
  }
  for (const [tag, count] of await getTagCounts()) {
    if (count > 1) urls.push({ loc: tagUrl(tag) });
  }
  for (const photoset of getPhotosets()) {
    urls.push({ loc: photoset.url, date: photoset.date });
    for (const photo of photoset.photos) {
      urls.push({ loc: `${photoset.url}${photo.id}.html` });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, date }) => `    <url>
        <loc>${SITE_URL}${loc}</loc>
        ${date ? `<lastmod>${parseDate(date).toISOString()}</lastmod>` : '<changefreq>weekly</changefreq>'}
    </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
