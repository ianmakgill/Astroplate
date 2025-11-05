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
      { year: "2022", barValue: 3248942699, lineValue: 69452 },
      { year: "2023", barValue: 2673408103, lineValue: 75938 },
      { year: "2024", barValue: 2588263061, lineValue: 68868 },
      { year: "2025 (half year)", barValue: 451619869, lineValue: 8542 },
    ];

    const container = document.getElementById('defence-market-value-volume-annualy-2022-2024');
    if (!container) {
      console.error('Container element #defence-market-value-volume-annualy-2022-2024 not found');
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
      .bar { fill: #034737; transition: opacity 0.2s ease; }
      .bar:hover { fill: #a9ff9b; }
      .line { fill: none; stroke: #FB8500; stroke-width: 2.5; transition: opacity 0.2s ease; pointer-events: none; }
      .line-point { fill: #FB8500; stroke: #fff; stroke-width: 2; transition: opacity 0.2s ease; }
      .hover-line { stroke: #FB8500; stroke-width: 10; stroke-opacity: 0; cursor: pointer; }
      .axis text { font-family: inherit; font-size: 12px; fill: #034737; }
      .axis line, .axis path { stroke: rgba(3, 71, 55, 0.2); }
      .y-axis-line text { fill: #034737; }
      .y-axis-line line, .y-axis-line path { stroke: rgba(255, 183, 3, 0.2); }
      .grid line { stroke: rgba(3, 71, 55, 0.1); stroke-dasharray: 2,2; }
      .grid path { stroke-width: 0; }
      .tooltip { position: absolute; padding: 8px; background: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 4px; pointer-events: none; font-family: inherit; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; }
      .axis-label { font-size: 12px; fill: #034737; }
    `;

    if (!document.getElementById('defence-bar-line-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-bar-line-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.4);

    const yScaleBar = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.barValue) * 1.1])
      .range([innerHeight, 0]);

    const yScaleLine = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.lineValue) * 1.1])
      .range([innerHeight, 0]);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScaleBar)
        .tickSize(-innerWidth)
        .tickFormat(""));

    const barGroups = g.selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", d => `translate(${xScale(d.year)},0)`);

    barGroups.append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => yScaleBar(d.barValue))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScaleBar(d.barValue));

    const lineGenerator = d3.line()
      .x(d => xScale(d.year) + xScale.bandwidth() / 2)
      .y(d => yScaleLine(d.lineValue))
      .curve(d3.curveMonotoneX);

    const lineGroup = g.append("g")
      .attr("class", "line-group");

    lineGroup.append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(data))
      .attr("fill", "none");

    lineGroup.selectAll(".line-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "line-point")
      .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr("cy", d => yScaleLine(d.lineValue))
      .attr("r", 4);

    barGroups.append("rect")
      .attr("class", "hover-area")
      .attr("x", -xScale.bandwidth() * 0.1)
      .attr("y", 0)
      .attr("width", xScale.bandwidth() * 1.2)
      .attr("height", innerHeight)
      .style("fill", "transparent")
      .style("pointer-events", "all")
      .on("mouseenter", function(event, d) {
        d3.select(this.parentNode).select(".bar")
          .style("fill", "#0D6986");

        barGroups.filter(bd => bd !== d)
          .style("opacity", 0.2);
        lineGroup.style("opacity", 0.2);

        tooltip.style("opacity", 1)
          .html(`${d.year}<br>Value: $${(d.barValue/1000000000).toFixed(2)}B<br>Volume: ${d.lineValue.toLocaleString()} opportunities`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseleave", function() {
        barGroups.style("opacity", 1)
          .selectAll(".bar")
          .style("fill", "#034737");
        lineGroup.style("opacity", 1);

        tooltip.style("opacity", 0);
      });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dx", "0")
      .attr("dy", "1em");

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScaleBar)
        .ticks(5)
        .tickFormat(d => `$${(d/1000000000).toFixed(1)}B`));

    g.append("g")
      .attr("class", "axis y-axis-line")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(d3.axisRight(yScaleLine)
        .ticks(5)
        .tickFormat(d => d.toLocaleString()));

    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left/3)
      .attr("x", -height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Value (USD)");

    svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", width - margin.right/3)
      .attr("x", -height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Number of Opportunities");
  }
})();
