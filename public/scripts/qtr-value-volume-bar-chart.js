// Quarterly Value Volume Bar Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { quarter: "Q1 2022", barValue: 418565329, lineValue: 6426 },
    { quarter: "Q2 2022", barValue: 778965086, lineValue: 5174 },
    { quarter: "Q3 2022", barValue: 610897680, lineValue: 15803 },
    { quarter: "Q4 2022", barValue: 1124701200, lineValue: 7034 },
    { quarter: "Q1 2023", barValue: 790835097, lineValue: 6135 },
    { quarter: "Q2 2023", barValue: 701701317, lineValue: 7159 },
    { quarter: "Q3 2023", barValue: 788466501, lineValue: 7073 },
    { quarter: "Q4 2023", barValue: 966883465, lineValue: 6595 },
    { quarter: "Q1 2024", barValue: 889650361, lineValue: 6124 }
  ];

  const container = document.getElementById('healthcare-market-value-volume-quarterly-2022-2024');
  if (!container) return;

  const containerWidth = container.offsetWidth;

  const margin = { top: 20, right: 100, bottom: 50, left: 100 };
  const width = containerWidth;
  const height = Math.min(500, containerWidth * 0.5);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.select(container).selectAll("svg").remove();

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.quarter))
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
    .attr("transform", d => `translate(${xScale(d.quarter)},0)`);

  barGroups.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => yScaleBar(d.barValue))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScaleBar(d.barValue));

  const lineGenerator = d3.line()
    .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
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
    .attr("cx", d => xScale(d.quarter) + xScale.bandwidth() / 2)
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
        .html(`${d.quarter}<br>Value: $${(d.barValue/1000000000).toFixed(2)}B<br>Volume: ${d.lineValue.toLocaleString()} opportunities`)
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

  function handleResize() {
    const newWidth = container.offsetWidth;
    const newHeight = Math.min(500, newWidth * 0.5);

    svg.attr("width", newWidth)
       .attr("height", newHeight)
       .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
  }

  window.addEventListener('resize', handleResize);
})();
