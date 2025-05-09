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

export const collections = { blog, privacy_policies };
