import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import million from 'million/compiler';

// https://astro.build/config
export default defineConfig({
  plugins: [],
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    sitemap(),
    db(),
    mdx(),
    UnoCSS({ injectReset: false}),
    preact({ compat: true }),
  ],
  vite: {
    plugins: [million.vite({ mode: 'preact', server: true, auto: true })],
  },
});
