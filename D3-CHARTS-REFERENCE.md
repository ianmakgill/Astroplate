# D3 Charts Reference Guide

All charts converted and ready to use! Add this import at the top of your MDX file:

```mdx
import D3Chart from "@/layouts/shortcodes/D3Chart.astro";
```

## Chart Usage Reference

### 1. Software Demand Heatmap
```mdx
<D3Chart
  id="heatmap-software-categories"
  height={500}
  caption="Software Category Demand Patterns (2022-2024)"
/>

<script src="/scripts/software-demand-heatmap-chart.js"></script>
```

### 2. Stream Header Chart
```mdx
<D3Chart
  id="chart-container"
  height={500}
  caption="Category Volume Trends"
/>

<script src="/scripts/stream-header-chart.js"></script>
```

### 3. Category Slope Chart
```mdx
<D3Chart
  id="slope-chart-category-volumes-2022-2024"
  height={500}
  caption="Category Performance: 2022 to 2024 changes"
/>

<script src="/scripts/category-slope-chart.js"></script>
```

### 4. Quarterly Value & Volume Bar Chart
```mdx
<D3Chart
  id="healthcare-market-value-volume-quarterly-2022-2024"
  height={600}
  caption="Quarterly Market Dynamics 2022-2024"
/>

<script src="/scripts/qtr-value-volume-bar-chart.js"></script>
```

### 5. Emerging Category Slope Chart
```mdx
<D3Chart
  id="healthcare-category-values-slope-2022-2024"
  height={500}
  caption="Enterprise Technology Evolution 2022-2024"
/>

<script src="/scripts/emerging-category-slope-chart.js"></script>
```

### 6. Category Monthly Heatmap
```mdx
<D3Chart
  id="d3-heatmap-container"
  height={600}
  caption="Monthly Variations in Software Spending"
/>

<script src="/scripts/category-monthly-heatmap-chart.js"></script>
```

### 7. Contract Duration Bars
```mdx
<D3Chart
  id="d3-duration-bars-container"
  height={500}
  caption="Contract Durations by Software Category"
/>

<script src="/scripts/contract-duration-bars-chart.js"></script>
```

### 8. Contract Duration Slope Chart
```mdx
<D3Chart
  id="contract-duration-slope-categories-2022-2024"
  height={500}
  caption="Contract Duration Changes: 2022 to 2024"
/>

<script src="/scripts/contract-duration-slope-chart.js"></script>
```

### 9. Category Patterns Bar Chart
```mdx
<D3Chart
  id="horizontal-grouped-bar-chart"
  height={600}
  caption="Software Categories: Changes 2022-2024 by Category and Metric"
/>

<script src="/scripts/category-patterns-bar-chart.js"></script>
```

### 10. Geographic Bar Chart
```mdx
<D3Chart
  id="d3-horizontal-bars-container"
  height={600}
  caption="Global distribution of software procurement opportunities by region"
/>

<script src="/scripts/geographic-bar-chart.js"></script>
```

### 11. Average Values Bar Chart
```mdx
<D3Chart
  id="average-contract-values-chart"
  height={500}
  caption="Average Contract Values by Region and Category"
/>

<script src="/scripts/average-values-bar-chart.js"></script>
```

### 12. Three Year Outlook Chart
```mdx
<D3Chart
  id="d3-line-chart-container"
  height={600}
  caption="Software Procurement Three-Year Outlook"
/>

<script src="/scripts/three-year-outlook-chart.js"></script>
```

## Notes

- All charts are now in `/public/scripts/` as standalone JavaScript files
- All styles are in `/src/layouts/shortcodes/D3Chart.astro`
- D3.js is loaded automatically
- Charts are interactive with tooltips and hover effects
- All charts are responsive

## Current Implementation

You've already implemented:
- Chart #2 (Stream Header) as the "demand patterns" chart in Section 3
