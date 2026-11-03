// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://nakeditchyfeet.com',
  build: {
    // Keep the URL structure of the original site: content pages are written to
    // `foo/index.html` (served as `/foo/`) while photos and tag pages are `bar.html`.
    format: 'preserve',
  },
  markdown: {
    processor: satteri({
      // The original site was rendered with `marked`, which left quotes and dashes alone.
      features: { smartPunctuation: false },
    }),
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          // Bootstrap 3's LESS predates LESS 4's default of only doing maths inside parens.
          math: 'always',
        },
      },
      lightningcss: {
        // Leaflet & Bootstrap 3 contain old IE hacks (e.g. `*zoom: 1`) - drop them rather than failing.
        errorRecovery: true,
      },
    },
  },
});
