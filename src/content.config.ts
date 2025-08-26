/***
 * Content Schema (Markdown blog posts under: src/blog/*.md)
 *
 * This schema defines and validates frontmatter used across the site.
 * Invalid values fail during dev and build where noted below.
 *
 * Fields:
 *
 * title: string (required)
 *   Human-readable post title. Rendered as the page heading.
 *
 * description: string (required)
 *   Short summary used for metadata (SEO/OG/Twitter) and listings.
 *
 * pubDate: Date (required)
 *   Publication date. Must be a valid date. Used for deterministic sorting
 *   (newest first) across listings, routes, and RSS.
 *
 * updatedDate: Date (optional)
 *   Last updated timestamp (if present). Displayed alongside pubDate.
 *
 * author: string (required)
 *   Author credit displayed on the post page.
 *
 * image: ImageMetadata | URL string (optional)
 *   Hero image for the post.
 *   - If using Astro’s assets pipeline, provide a local image so it resolves
 *     to ImageMetadata (preferred for responsive output).
 *   - If using an external image, supply a fully-qualified URL string.
 *
 * imageAlt: string (optional, defaults to "")
 *   Alternative text for the hero image. Provide meaningful text for a11y;
 *   leave empty only when the image is purely decorative.
 *
 * tags: string[] (optional, defaults to [])
 *   Free-form tags for navigation/grouping. Displayed as a tag list.
 *
 * draft: boolean (optional, defaults to false)
 *   Marks a post as unpublished. Draft posts are:
 *   - EXCLUDED from route generation (direct URL returns 404),
 *   - EXCLUDED from blog listings,
 *   - EXCLUDED from RSS.
 *
 * featuredRank: 1 | 2 | 3 (optional)
 *   Enables ranked "Featured" posts on the blog index.
 *   Validation rules (enforced during dev/build):
 *   - Allowed values: 1, 2, or 3 only. Any other number fails.
 *   - Ranks must be unique (no duplicates). Duplicates fail.
 *   - Maximum of 3 featured posts total. Exceeding this fails.
 *   - Having 0 featured posts is allowed.
 *   Featured posts render in rank order (1 → 3) and are removed from the
 *   general "All posts" list to avoid duplication.
 *
 */

import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      updatedDate: z.date().optional(),
      author: z.string(),
      image: z.union([image(), z.string().url().optional()]),
      imageAlt: z.string().default(""),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featuredRank: z
        .union([z.literal(1), z.literal(2), z.literal(3)])
        .optional(),
    }),
});

export const collections = { blog };
