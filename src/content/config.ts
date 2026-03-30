import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    // Type-check frontmatter using a schema
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
