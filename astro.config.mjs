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
  output: "server",
  prefetch: true,

  integrations: [
    mdx(),
    sitemap(),
    icon(),
    react(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});