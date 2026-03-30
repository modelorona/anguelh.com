import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z
            .string()
            .or(z.date())
            .transform(val => new Date(val)),
        updatedDate: z
            .string()
            .optional()
            .transform(str => (str ? new Date(str) : undefined)),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

const privacy_policies = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/privacy_policies" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        lastUpdatedDate: z
            .date()
            .optional()
            .transform(str => (str ? str : undefined)),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        year: z.number(),
        type: z.string(),
        links: z.array(z.object({
            label: z.string(),
            url: z.string(),
            icon: z.string(),
        })).default([]),
        tech: z.array(z.object({
            name: z.string(),
            url: z.string(),
        })).default([]),
        extraTags: z.array(z.object({
            label: z.string(),
            tags: z.array(z.object({
                name: z.string(),
                url: z.string().optional(),
            })),
        })).default([]),
        order: z.number(),
    }),
});

export const collections = { blog, privacy_policies, projects };
