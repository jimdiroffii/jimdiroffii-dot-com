// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

import preact from "@astrojs/preact";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://jimdiroffii-dot-com.netlify.app/",
  adapter: netlify(),
  integrations: [preact()],

  vite: {
    plugins: [tailwindcss()],
  },
});
