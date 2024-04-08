import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import million from 'million/compiler';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import metaTags from "astro-meta-tags";

import pageInsight from "astro-page-insight";

// https://astro.build/config
export default defineConfig({
  plugins: [],
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap(), db(), mdx(), UnoCSS({
    injectReset: false
  }), preact({
    compat: true
  }), sentry(), spotlightjs(), metaTags(), pageInsight()],
  vite: {
    plugins: [million.vite({
      mode: 'preact',
      server: true,
      auto: true
    })],
    optimizeDeps: {
			exclude: ["oslo", "astro:db"]
		}
  }
});