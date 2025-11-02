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

## Center-aligned version

<FeatureGrid
  textAlign="center"
  items={[...]}
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

**Props:**
- `heading` (optional): Section heading centered above the grid
- `items` (required): Array of objects with `title` and `content`
- `textAlign` (optional): `"left"` (default) or `"center"`

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

## StatsGrid

Display key statistics in a responsive grid with solid or outline styles.

```mdx
---
title: "My Page"
---

<StatsGrid
  items={[
    { label: "Documents analysed", value: "6M" },
    { label: "Sources used", value: "820" },
    { label: "Countries", value: "135" },
    { label: "Value of opportunities", value: "$0 Bn" }
  ]}
/>

<StatsGrid
  style="outline"
  items={[
    { label: "Documents analysed", value: "6M" },
    { label: "Sources used", value: "820" },
    { label: "Countries", value: "135" }
  ]}
/>
```

**Props:**
- `items` (required): Array of objects with `label` and `value` properties
- `style` (optional): Use `"outline"` for bordered style, omit for solid green background

**Notes:**
- Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop
- Solid style has green background with white text
- Outline style has green border with colored text
- Perfect for displaying key metrics at the top of research pages

---

## Spacer

Add vertical spacing between sections with precise control.

```mdx
---
title: "My Page"
---

<FeatureGrid items={[...]} />

<Spacer size="lg" />

<FeatureGrid items={[...]} />
```

**Props:**
- `size` (optional): `"xs"` (16px), `"sm"` (32px), `"md"` (48px, default), `"lg"` (64px), `"xl"` (96px), or `"2xl"` (128px)

**Notes:**
- Use between sections when you need more or less space than the default
- Useful for fine-tuning vertical rhythm in your layouts
- FeatureGrid now uses reduced vertical padding by default (py-12 / 48px)

---

## Button

Call-to-action buttons with solid or outline styles.

```mdx
---
title: "My Page"
---

<Button label="Try for free" link="https://app.openopps.com" />

<Button label="Book a demo" link="https://www.openopps.com/contact" style="outline" />

<Button label="Internal link" link="/about" rel="follow" />
```

**Props:**
- `label` (required): Button text
- `link` (required): URL to link to
- `style` (optional): Use `"outline"` for outlined style, omit for solid button
- `rel` (optional): Use `"follow"` for internal links

**Notes:** External links (starting with `http`) automatically open in new tab.

---

## Accordion

Collapsible FAQ sections - perfect for questions and answers.

```mdx
---
title: "My Page"
---

## Frequently Asked Questions

<Accordion client:load title="Are there opportunities for my business?">

Yes! We've been collecting this data for over ten years, we know that there's opportunities for every business in our database.

</Accordion>

<Accordion client:load title="What data is included in the service?">

Our coverage extends across all available federal sources worldwide and large numbers of local sources.

</Accordion>
```

**Props:**
- `title` (required): The accordion header/question
- `children` (required): The content inside (supports markdown)
- `client:load` (required): Makes the accordion interactive

**Important:**
- Must include `client:load` for expand/collapse to work
- Add blank lines after opening tag and before closing tag
- Content is left-aligned

---

## Notice

Alert boxes with different styles for notes, tips, info, and warnings.

```mdx
---
title: "My Page"
---

<Notice type="note">This is a simple note.</Notice>

<Notice type="tip">This is a helpful tip!</Notice>

<Notice type="info">This is important information.</Notice>

<Notice type="warning">This is a warning message.</Notice>
```

**Props:**
- `type` (required): `"note"`, `"tip"`, `"info"`, or `"warning"`
- `children` (required): The notice content

---

## Tabs

Tabbed content sections for organizing related information.

```mdx
---
title: "My Page"
---

<Tabs client:load>

<Tab name="Tab 1">

#### Did you come here for something in particular?

Content for the first tab goes here.

</Tab>

<Tab name="Tab 2">

#### Another section

Content for the second tab.

</Tab>

<Tab name="Tab 3">

#### Third section

Content for the third tab.

</Tab>

</Tabs>
```

**Props:**
- `client:load` (required on Tabs): Makes tabs interactive
- `name` (required on Tab): Tab label shown in navigation

**Important:** Add blank lines inside each `<Tab>` component.

---

## Video

Embed custom video files.

```mdx
---
title: "My Page"
---

<Video width="100%" src="https://www.w3schools.com/html/mov_bbb.mp4" />
```

**Props:**
- `src` (required): URL to video file
- `width` (optional): Video player width (default: "100%")

---

## Youtube

Embed YouTube videos.

```mdx
---
title: "My Page"
---

<Youtube client:load id="C0DPdy98e4c" title="Play:Youtube" />
```

**Props:**
- `id` (required): YouTube video ID (from the URL)
- `title` (optional): Video title for accessibility
- `client:load` (required): Makes player interactive

---

## Chart

Display SVG charts with automatic mobile/desktop handling.

```mdx
---
title: "My Research"
---

## Contract Volume Trends

<Chart
  src="/images/charts/defence-streamgraph.svg"
  alt="Streamgraph showing contract volumes by category"
  caption="Figure 1: Contract volumes by category, 2022-2025"
/>

<Chart
  src="/images/charts/bar-chart.svg"
  alt="Bar chart"
  minWidth={600}
/>
```

**Props:**
- `src` (required): Path to SVG file in `/public/images/charts/`
- `alt` (required): Accessibility text description
- `caption` (optional): Figure caption shown below chart
- `minWidth` (optional): Minimum width in pixels for mobile scroll (default: 800)

**Features:**
- **Mobile**: Horizontal scroll with "swipe to view" hint
- **Desktop**: Full width display
- **Responsive**: Negative margins on mobile for edge-to-edge scroll
- **Accessible**: Proper semantic HTML with figure/figcaption

**To extract SVGs from your live site:**
1. Open browser DevTools (F12)
2. Inspect the chart and find the `<svg>` element
3. Right-click → Copy → Copy element
4. Save to `/public/images/charts/your-chart-name.svg`
5. Use Chart component to embed it

---

## Tips

- **Auto-imported**: All components except FeaturePanel are automatically available in .mdx files
- **FeaturePanel**: Requires manual import (it's an `.astro` file)
- **Interactive components**: Accordion, Tabs, and Youtube need `client:load`
- **StatsGrid**: Perfect for research pages - displays 1-4 stats in responsive grid
- **FeatureGrid**: Great for 3-6 items, automatically responsive, now uses reduced vertical spacing
- **FeaturePanel**: Alternating `imageSide` creates a nice rhythm
- **Chart**: Handles mobile horizontal scroll automatically - great for D3.js SVGs
- **Spacer**: Fine-tune vertical spacing between sections (6 size options from xs to 2xl)
- **Button & StatsGrid**: Both have solid and outline style options
- **In Sitepin**: Non-technical team members can edit collection items (blog, team, etc.)
- **Direct editing**: Developers should edit .mdx page files directly in VS Code
- **Reusable**: Use them across product, landing pages, guides, etc.
