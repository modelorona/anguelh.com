import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import NetlifyCMS from 'astro-netlify-cms';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://anguelh.com',
	integrations: [mdx(), sitemap(),
	NetlifyCMS({
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
				fields: [
					{ name: 'title', label: 'Title', widget: 'string' },
					{
						name: 'pubDate', label: 'Date', widget: 'datetime', format: 'DD MMM YYYY',
						date_format: 'DD MMM YYYY',
						time_format: false,
					},
					{ name: 'description', label: 'Description', widget: 'string' },
					{ name: 'body', widget: 'markdown', label: 'Post Body' },
				]
			}],
		}
	})],
});
