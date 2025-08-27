// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import netlify from '@astrojs/netlify';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  // TODO: Update Domain
  site: 'https://jimdiroffii-dot-com.netlify.app/',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), svelte()],
  adapter: netlify()
});