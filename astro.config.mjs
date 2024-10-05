// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

import react from "@astrojs/react";

import playformInline from "@playform/inline";

// https://astro.build/config
export default defineConfig({
  site: "https://tieronerun.club",
  integrations: [mdx(), sitemap(), tailwind({
    applyBaseStyles: false,
  }), icon(), react({
      experimentalReactChildren: true,
    }), playformInline()],
});