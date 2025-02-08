import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
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

const tools = blog

export const collections = { blog, tools };
