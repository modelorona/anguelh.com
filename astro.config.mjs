import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import NetlifyCMS from 'astro-netlify-cms';
import netlify from '@astrojs/netlify/functions';
import sitemap from '@astrojs/sitemap';
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";

import compressor from "astro-compressor";

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
	adapter: netlify(),
	site: 'https://anguelh.com',
	integrations: [mdx(), sitemap({
		customPages: ['https://anguelh.com', 'https://anguelh.com/blog', 'https://anguelh.com/resume', 'https://anguelh.com/projects'].concat(blogUrls),
		priority: 0.5,
		changefreq: 'monthly'
	}), NetlifyCMS({
		config: {
			backend: {
				name: 'git-gateway',
				branch: 'main'
			},
			media_folder: 'public/assets/blog',
			public_folder: '/assets/blog',
			collections: [{
				name: 'posts',
				label: 'Blog Posts',
				folder: 'src/pages/blog',
				create: true,
				delete: true,
				fields: [{
					name: 'title',
					label: 'Title',
					widget: 'string'
				}, {
					name: 'pubDate',
					label: 'Date',
					widget: 'datetime',
					format: 'DD MMM YYYY',
					date_format: 'DD MMM YYYY',
					time_format: false
				}, {
					name: 'description',
					label: 'Description',
					widget: 'string'
				}, {
					name: 'body',
					widget: 'markdown',
					label: 'Post Body'
				}]
			}]
		}
	}), robotsTxt({
		userAgent: '*',
		allow: '/',
		disallow: '/admin',
		crawlDelay: 10
	}), compress(), compressor()]
});