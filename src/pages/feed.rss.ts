import type { APIRoute } from 'astro';
import { SITE_URL, escapeHtml, formatRfc2822, getListItems, itemIntro, newestFirst } from '../lib/site';

export const GET: APIRoute = async () => {
  const items = newestFirst(await getListItems());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
    <channel>
        <title>Naked Itchy Feet</title>
        <atom:link href="${SITE_URL}/feed.rss" rel="self" type="application/rss+xml" />
        <link>${SITE_URL}</link>
        <description>Around the world with Kelvin &amp; Priscila - mischief afoot</description>
        <lastBuildDate>${formatRfc2822(items[0].date)}</lastBuildDate>
        <language>en</language>
        <sy:updatePeriod>daily</sy:updatePeriod>
        <sy:updateFrequency>1</sy:updateFrequency>
        <generator>Astro</generator>
${items
  .map(
    (item) => `        <item>
            <title>${escapeHtml((item.type === 'photo' ? 'Photo album: ' : '') + (item.title ?? ''))}</title>
            <link>${SITE_URL}${item.url}</link>
            <pubDate>${formatRfc2822(item.date)}</pubDate>
            <dc:creator>${escapeHtml(item.author ?? '')}</dc:creator>
            <category>${item.type}</category>
            <guid isPermaLink="true">${SITE_URL}${item.url}</guid>
            <description>${escapeHtml(itemIntro(item) ?? '')}</description>
        </item>`,
  )
  .join('\n')}
    </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
