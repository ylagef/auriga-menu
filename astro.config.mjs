import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify/functions';

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), compress()],
  output: 'server',
  adapter: netlify()
});