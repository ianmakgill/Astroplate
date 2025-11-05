(function() {
  // Check if D3 is available
  if (typeof d3 === 'undefined') {
    console.error('D3.js is required but not loaded');
    return;
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChart);
  } else {
    initializeChart();
  }

  function initializeChart() {
    const data = [
      {
        name: "Rescue and safety equipment",
        color: "#034737",
        values: [
          { quarter: "Q1 2022", value: 852 },
          { quarter: "Q2 2022", value: 923 },
          { quarter: "Q3 2022", value: 978 },
          { quarter: "Q4 2022", value: 891 },
          { quarter: "Q1 2023", value: 934 },
          { quarter: "Q2 2023", value: 967 },
          { quarter: "Q3 2023", value: 1514 },
          { quarter: "Q4 2023", value: 1337 },
          { quarter: "Q1 2024", value: 1316 },
          { quarter: "Q2 2024", value: 762 },
          { quarter: "Q3 2024", value: 1896 },
          { quarter: "Q4 2024", value: 1475 }
        ]
      },
      {
        name: "Communication",
        color: "#0D6986",
        values: [
          { quarter: "Q1 2022", value: 1855 },
          { quarter: "Q2 2022", value: 1690 },
          { quarter: "Q3 2022", value: 3892 },
          { quarter: "Q4 2022", value: 2427 },
          { quarter: "Q1 2023", value: 1920 },
          { quarter: "Q2 2023", value: 2342 },
          { quarter: "Q3 2023", value: 2351 },
          { quarter: "Q4 2023", value: 2085 },
          { quarter: "Q1 2024", value: 1797 },
          { quarter: "Q2 2024", value: 1534 },
          { quarter: "Q3 2024", value: 2199 },
          { quarter: "Q4 2024", value: 1945 }
        ]
      },
      {
        name: "Analytics",
        color: "#219EBC",
        values: [
          { quarter: "Q1 2022", value: 1509 },
          { quarter: "Q2 2022", value: 1291 },
          { quarter: "Q3 2022", value: 2368 },
          { quarter: "Q4 2022", value: 1416 },
          { quarter: "Q1 2023", value: 1236 },
          { quarter: "Q2 2023", value: 1451 },
          { quarter: "Q3 2023", value: 1208 },
          { quarter: "Q4 2023", value: 1122 },
          { quarter: "Q1 2024", value: 1387 },
          { quarter: "Q2 2024", value: 870 },
          { quarter: "Q3 2024", value: 1734 },
          { quarter: "Q4 2024", value: 1407 }
        ]
      },
      {
        name: "Security",
        color: "#FFB703",
        values: [
          { quarter: "Q1 2022", value: 332 },
          { quarter: "Q2 2022", value: 393 },
          { quarter: "Q3 2022", value: 734 },
          { quarter: "Q4 2022", value: 670 },
          { quarter: "Q1 2023", value: 444 },
          { quarter: "Q2 2023", value: 522 },
          { quarter: "Q3 2023", value: 514 },
          { quarter: "Q4 2023", value: 771 },
          { quarter: "Q1 2024", value: 499 },
          { quarter: "Q2 2024", value: 385 },
          { quarter: "Q3 2024", value: 632 },
          { quarter: "Q4 2024", value: 473 }
        ]
      },
      {
        name: "Productivity",
        color: "#FB8500",
        values: [
          { quarter: "Q1 2022", value: 1485 },
          { quarter: "Q2 2022", value: 1234 },
          { quarter: "Q3 2022", value: 2608 },
          { quarter: "Q4 2022", value: 1556 },
          { quarter: "Q1 2023", value: 1204 },
          { quarter: "Q2 2023", value: 1396 },
          { quarter: "Q3 2023", value: 1295 },
          { quarter: "Q4 2023", value: 1169 },
          { quarter: "Q1 2024", value: 1118 },
          { quarter: "Q2 2024", value: 1022 },
          { quarter: "Q3 2024", value: 1530 },
          { quarter: "Q4 2024", value: 1221 }
        ]
      }
    ];

    const quarters = data[0].values.map(d => d.quarter);

    const container = document.getElementById('d3-line-chart-container');
    if (!container) {
      console.error('Container element #d3-line-chart-container not found');
      return;
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    const margin = { top: 50, right: 20, bottom: 60, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(container).selectAll("svg").remove();

    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add styles
    const styles = `
      .data-point { stroke: #fff; stroke-width: 2; cursor: pointer; transition: opacity 0.3s ease; }
      .faded { opacity: 0.2; }
      .axis text { font-family: inherit; font-size: 12px; fill: #034737; }
      .axis line, .axis path { stroke: rgba(3, 71, 55, 0.2); }
      .grid line { stroke: rgba(3, 71, 55, 0.1); stroke-dasharray: 2,2; }
      .grid path { stroke-width: 0; }
      .value-label { font-family: inherit; font-size: 12px; fill: #034737; transition: opacity 0.3s ease; }
      .tooltip { position: absolute; padding: 8px; background: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 4px; pointer-events: none; font-family: inherit; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; }
      .legend-item { font-family: inherit; font-size: 12px; cursor: pointer; }
      .legend-item:hover { opacity: 0.8; }
      .trendline { stroke-dasharray: 5,5; stroke-width: 2; opacity: 0.7; }
    `;

    if (!document.getElementById('defence-line-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-line-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    const xScale = d3.scaleBand()
      .domain(quarters)
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, series => d3.max(series.values, d => d.value)) * 1.1])
      .range([innerHeight, 0]);

    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(""));

    const lineGenerator = d3.line()
      .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

    function linearRegression(data) {
      const n = data.length;
      const sumX = data.reduce((sum, d, i) => sum + i, 0);
      const sumY = data.reduce((sum, d) => sum + d.value, 0);
      const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
      const sumX2 = data.reduce((sum, d, i) => sum + i * i, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      return { slope, intercept };
    }

    data.forEach(series => {
      const group = g.append("g")
        .attr("class", `series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`);

      group.append("path")
        .datum(series.values)
        .attr("class", "data-series")
        .attr("fill", "none")
        .attr("stroke", series.color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      const points = group.selectAll(".data-point")
        .data(series.values)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.quarter) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("fill", series.color);

      points.on("mouseenter", function(event, d) {
        d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
          .style("opacity", 1);

        data.forEach(otherSeries => {
          if (otherSeries.name !== series.name) {
            d3.selectAll(`.series-group-${otherSeries.name.replace(/\s+/g, '-').toLowerCase()}`)
              .style("opacity", 0.2);
          }
        });

        tooltip.style("opacity", 1)
          .html(`${series.name}<br>${d.quarter}<br>Volume: ${d.value.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseleave", function() {
        data.forEach(series => {
          d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
            .style("opacity", 1);
        });

        tooltip.style("opacity", 0);
      });

      const regression = linearRegression(series.values);
      const trendlineData = series.values.map((d, i) => ({
        quarter: d.quarter,
        value: regression.intercept + regression.slope * i
      }));

      const futureQuarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
      const extendedTrendlineData = [
        ...trendlineData,
        ...futureQuarters.map((quarter, i) => ({
          quarter,
          value: regression.intercept + regression.slope * (series.values.length + i)
        }))
      ];

      group.append("path")
        .datum(extendedTrendlineData)
        .attr("class", "trendline")
        .attr("fill", "none")
        .attr("stroke", series.color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle");

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => d.toLocaleString()));

    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left},${height - margin.bottom + 20})`);

    const legendItems = legend.selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${(i % 3) * 200},${Math.floor(i / 3) * 25})`);

    legendItems.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", d => d.color);

    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 12)
      .text(d => d.name);

    legendItems
      .on("mouseenter", function(event, d) {
        d3.selectAll(`.series-group-${d.name.replace(/\s+/g, '-').toLowerCase()}`)
          .style("opacity", 1);

        data.forEach(series => {
          if (series.name !== d.name) {
            d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
              .style("opacity", 0.2);
          }
        });
      })
      .on("mouseleave", function() {
        data.forEach(series => {
          d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
            .style("opacity", 1);
        });
      });
  }
})();
