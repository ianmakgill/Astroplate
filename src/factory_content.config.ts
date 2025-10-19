import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/* ----------------------------------
   Shared fields across collections
---------------------------------- */
const commonFields = {
  title: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  date: z.date().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

/* ----------------------------------
   Core site sections (existing)
---------------------------------- */

// Blog posts
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    author: z.string().default("Admin"),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
  }),
});

// Authors
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    ...commonFields,
    social: z
      .array(
        z.object({
          name: z.string().optional(),
          icon: z.string().optional(),
          link: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

// Generic pages
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
  }),
});

// About page
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    ...commonFields,
  }),
});

// Contact page
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
  }),
});

// Homepage
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    features: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        content: z.string(),
        bulletpoints: z.array(z.string()).optional(),
        button: z
          .object({
            enable: z.boolean(),
            label: z.string(),
            link: z.string(),
          })
          .optional(),
      }),
    ),
  }),
});

// CTA section
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonial section
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string().optional(),
        content: z.string(),
      }),
    ),
  }),
});

/* ----------------------------------
   New content collections
---------------------------------- */

// Product updates (changelog style)
const updatesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/updates" }),
  schema: z.object({
    ...commonFields,
    author: z.string().optional(),
    version: z.string().optional(),
  }),
});

// Country guides
const guidesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/guides" }),
  schema: z.object({
    ...commonFields,
    country: z.string().optional(),
    flag: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

// Research reports
const researchCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/research" }),
  schema: z.object({
    ...commonFields,
    author: z.string(),
    summary: z.string().optional(),
    pdf: z.string().optional(),
    tags: z.array(z.string()).optional(),
    wordcount: z.number().optional(),
  }),
});

// Product pages
const productCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/product" }),
  schema: z.object({
    ...commonFields,
    icon: z.string().optional(),
    features: z.array(z.string()).optional(),
    pricing_tier: z.string().optional(),
    cta_label: z.string().optional(),
    cta_link: z.string().optional(),
  }),
});

// Help pages
const helpCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/help" }),
  schema: z.object({
    ...commonFields,
    category: z.string().optional(),
    order: z.number().optional(),
    related_articles: z.array(z.string()).optional(),
  }),
});

// Customer testimonials (full collection)
const testimonialsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    company: z.string().optional(),
    quote: z.string(),
    image: z.string().optional(),
    role: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

// Team (team profiles)
const teamCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/team" }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    image: z.string().optional(),
    bio: z.string().optional(),
    linkedin: z.string().optional(),
    order: z.number().optional(),
  }),
});

// Insights (industry analysis)
const insightsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/insights" }),
  schema: z.object({
    ...commonFields,
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

/* ----------------------------------
   Export all collections
---------------------------------- */
export const collections = {
  // Core site
  homepage: homepageCollection,
  blog: blogCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,

  // Sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,

  // New content
  updates: updatesCollection,
  guides: guidesCollection,
  research: researchCollection,
  products: productCollection,
  help: helpCollection,
  testimonials: testimonialsCollection,
  team: teamCollection,
  insights: insightsCollection,
};