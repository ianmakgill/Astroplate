# Shortcodes Usage Guide

## FeatureGrid (Three Columns)

Perfect for listing 3+ items in a grid layout.

```mdx
---
title: "My Page"
---

import FeatureGrid from "@/layouts/shortcodes/FeatureGrid";

# When Open Opportunities isn't right

<FeatureGrid
  heading="When the fit isn't right"
  items={[
    {
      title: "You're not into government",
      content: "If you don't want to sell to the $13tn public sector market, you might not get what you need. We do have some private sector data but the vast majority of our data is for government contracting opportunities."
    },
    {
      title: "You sell to a small market",
      content: "If you only sell into a really small, specific market then you can monitor a small number of contract opportunities sources on a regular basis without needing to buy a service like Open Opportunities."
    },
    {
      title: "Missing opportunities is ok",
      content: "If you only sell when if you're invited to bid in, or you're entirely opportunistic about selling to government, then missing opportunities is ok."
    }
  ]}
/>

## How to do it yourself

<FeatureGrid
  items={[
    {
      title: "Government sites",
      content: "Sign up to a handful of different sites that publish opportunities. In the UK it's Find A Tender, in Europe it's TED and in the USA it's SAM."
    },
    {
      title: "DIY market research",
      content: "Use AI tools like Perplexity to do some market research. It won't be able to tell you things like 'how many tenders were there for CRMs in market X last year'."
    },
    {
      title: "Google searches",
      content: "Do daily advanced searches on google for your products and your rivals. Eg. Searching on google using 'site:gov.uk' or 'site:www.coventry.gov.uk'."
    }
  ]}
/>
```

## FeaturePanel (Two Panel)

Perfect for image + content side-by-side layouts (like your homepage).

**Note:** FeaturePanel requires manual import (it's an `.astro` file, not auto-imported).

```mdx
---
title: "My Page"
---

import FeaturePanel from "@/layouts/shortcodes/FeaturePanel.astro";

<FeaturePanel
  title="Finding the perfect opportunities"
  content="Open Opportunities helps you find exactly what you're looking for in the global government contracting market."
  image="/images/feature-image.png"
  imageSide="right"
  bulletpoints={[
    "Access to opportunities from 100+ countries",
    "AI-powered search that understands intent",
    "Daily alerts customized to your business"
  ]}
  buttonLabel="Try for free"
  buttonLink="https://app.openopps.com"
/>

<FeaturePanel
  title="Market intelligence"
  content="Get insights into procurement trends and spending patterns."
  image="/images/analytics.png"
  imageSide="left"
/>
```

## Tips

- **FeatureGrid**: Great for 3-6 items, automatically responsive
- **FeaturePanel**: Alternating `imageSide` creates a nice rhythm
- **In Sitepin**: You'll edit these as text, but with autocomplete
- **Reusable**: Use them across product, landing pages, guides, etc.
