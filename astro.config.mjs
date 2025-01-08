import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, 'src', 'content', 'blog');
const files = fs.readdirSync(directoryPath);
const blogUrls = files.map((file) => {
	const fileName = file.split('.')[0];
	return `https://anguelh.com/blog/${fileName}`;
});


// https://astro.build/config
export default defineConfig({
	output: 'server',
	outDir: './dist',
	adapter: netlify(),
	site: 'https://anguelh.com',
	integrations: [mdx(), sitemap({
		customPages: ['https://anguelh.com', 'https://anguelh.com/blog', 'https://anguelh.com/resume', 'https://anguelh.com/projects'].concat(blogUrls),
		priority: 0.5,
		changefreq: 'monthly'
	}), robotsTxt({
		userAgent: '*',
		allow: '/',
		disallow: '/admin',
		crawlDelay: 10
	})]
});
