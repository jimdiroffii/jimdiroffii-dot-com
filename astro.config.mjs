// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import netlify from '@astrojs/netlify';

import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://www.jimdiroffii.com/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), svelte()],
  adapter: netlify()
});