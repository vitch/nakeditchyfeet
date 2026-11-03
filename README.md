# Naked Itchy Feet

This repository contains the source code for [our travel blog](https://nakeditchyfeet.com).

The blog is a static site built with [Astro](https://astro.build/). It was originally built with
[HaggerstonJS](https://github.com/haggerstonjs/grunt-haggerston/) and Grunt, and was ported to Astro
keeping the same URLs, markup, styles and client-side behaviour.

## Getting started

You need [Bun](https://bun.sh/) (1.4.4 - see `packageManager` in `package.json`) and
[Node.js](https://nodejs.org/) 22.23.4 or newer (see `.node-version`), which Astro runs on. Then:

```bash
git clone https://github.com/vitch/nakeditchyfeet.git
cd nakeditchyfeet
bun install
bun run dev
```

And point your browser at [http://localhost:4321](http://localhost:4321).

| Command           | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `bun run dev`     | Starts the dev server. Draft posts are visible.                      |
| `bun run build`   | Builds the production site into `dist/`. Drafts are left out.        |
| `bun run preview` | Serves the contents of `dist/` locally.                              |
| `bun run check`   | Type checks the project.                                             |
| `bun run icons`   | Rebuilds the icon font (runs automatically before `dev` and `build`). |
| `bun run flickr`  | Downloads any new photosets from Flickr into `src/data/photos/`.     |

If the dev server serves old versions of packages after `bun install` (e.g. after switching branches),
clear Vite's dependency cache and restart it:

```bash
bun astro dev stop
rm -rf node_modules/.vite
bun run dev
```

## How it fits together

```
public/                   Static files, copied as-is. Images for each post live in a folder
                          matching the post's URL, e.g. public/blog/hawaii/header.jpg
src/content/pages/        Markdown content. src/content/pages/blog/hawaii/index.md is
                          published at /blog/hawaii/. Frontmatter is defined in
                          src/content.config.ts
src/data/                 Flickr photoset data, flights & events, airports and stays
src/pages/                Astro routes: the home page, content pages, photosets and photos,
                          tag pages, the map, and the RSS feed / sitemap / JSON data
src/lib/site.ts           Builds the lists of posts, tips, photosets and events
src/layouts, components/  The page templates
src/scripts/              Client side TypeScript (Leaflet maps, tooltips, photo layout).
                          main.ts works out which page it's on and sets it up
src/styles/styles.less    Styles (built on Bootstrap 3's LESS)
src/icons/                SVGs which are turned into the "nif-icon" icon font
scripts/                  Build-time helper scripts (icon font, Flickr download)
```

### Writing a post

Create `src/content/pages/blog/<country>/<slug>/index.md` with frontmatter like:

```yaml
---
title: "A stolen glance at Fiji"
author: "Priscila Santos"
date: "2013-12-12"
headerImage: "heading_2.jpg"
latitude: -17.808678
longitude: 178.711724
photosets: ["72157638603575254"]
tags: ["fiji", "south pacific", "islands", "tropical"]
draft: true
---
```

Put the images in `public/blog/<country>/<slug>/`. Reference them from the markdown with an absolute
path (e.g. `![Beach](/blog/fiji/a-stolen-glance-at-fiji/beach.jpg)`); `headerImage` is just the
filename. Remove `draft: true` when it's ready to go live.

Tags only appear (and get a tag page) once at least two posts/photosets share them.

## Deploying to Cloudflare Pages

The site is fully static, so no Cloudflare adapter is needed. Create a Pages project connected to
this repository with:

- **Framework preset:** Astro
- **Build command:** `bun run build`
- **Build output directory:** `dist`
- **Environment variable:** `BUN_VERSION` = `1.4.4`

The Node.js version is picked up from `.node-version`.

`public/_headers` sets the content type for the RSS feed.

### Analytics

The site doesn't include any analytics code. To get basic visitor stats, turn on Cloudflare Web
Analytics for the Pages project (in the Cloudflare dashboard: Workers & Pages → the project →
Metrics → Web Analytics → Enable). Cloudflare then adds its beacon to every page when it deploys.
It's free, doesn't use cookies and doesn't track individual visitors, so no cookie banner is needed.

Note that Cloudflare Pages serves `foo.html` files at `/foo` and redirects `/foo.html` there, so
photo and tag pages (e.g. `/tags/fiji.html`) will redirect to their extension-less URLs. Existing
links keep working.

## License

See `LICENSE-MIT`.
