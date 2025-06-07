// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://tieronerun.club",
  prefetch: true,

  integrations: [
    mdx(),
    sitemap(),
    icon(),
    react({
      experimentalReactChildren: true,
    }),    
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});