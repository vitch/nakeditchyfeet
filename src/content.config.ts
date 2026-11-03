import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * All of the markdown content on the site (blog posts, travel tips, about us, ...).
 *
 * Each page lives at `src/content/pages/<url>/index.md` and is published at `/<url>/`.
 * Images and other files for a page live in `public/<url>/`.
 */
const pages = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\/?index\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    /** `YYYY-MM-DD` with an optional ` HH:MM[:SS]` time. */
    date: z.string().optional(),
    publishedDate: z.string().optional(),
    metaDescription: z.string().optional(),
    /** Filename of an image in this page's `public/` folder, shown in lists and at the top of the post. */
    headerImage: z.string().optional(),
    /** Optional larger version of `headerImage` to use at the top of the post. */
    headerImageLarge: z.string().optional(),
    /** HTML caption displayed under the header image. */
    headerImageCaption: z.string().optional(),
    hideHeaderInPost: z.boolean().default(false),
    hideComments: z.boolean().default(false),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    /** IDs of Flickr photosets (see `src/data/photos/`) to show at the bottom of the post. */
    photosets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    /** Drafts are visible when running `bun run dev` but are left out of production builds. */
    draft: z.boolean().default(false),
    layout: z.enum(['blog-post', 'follow-us']).default('blog-post'),
  }),
});

export const collections = { pages };
