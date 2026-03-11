import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image(),
      includeComments: z.boolean().optional(),
      comments: z
        .object({
          name: z.string(),
          date: z.string(),
          comment: z.string(),
        })
        .array()
        .optional(),
    }),
});

const tools = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tools" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image(),
      includeComments: z.boolean().optional(),
      comments: z
        .object({
          name: z.string(),
          date: z.string(),
          comment: z.string(),
        })
        .array()
        .optional(),
    }),
});

export const collections = { blog, tools };
