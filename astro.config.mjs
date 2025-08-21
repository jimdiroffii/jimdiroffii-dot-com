// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://jimdiroffii-dot-com.netlify.app/",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
  integrations: [preact()],
});
