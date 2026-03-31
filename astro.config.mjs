import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "./dist",
  site: "https://anguelh.com",
  integrations: [
    sitemap({
      priority: 0.5,
      changefreq: "monthly",
    }),
    robotsTxt({
      userAgent: "*",
      allow: "/",
      crawlDelay: 10,
    }),
  ],
});
