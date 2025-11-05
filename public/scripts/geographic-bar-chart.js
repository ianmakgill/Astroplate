// Geographic Bar Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { continent: "Europe", total: 49409, subset: 18474 },
    { continent: "South America", total: 4335, subset: 2554 },
    { continent: "Asia", total: 3034, subset: 1618 },
    { continent: "North America", total: 3187, subset: 1975 },
    { continent: "Africa", total: 342, subset: 248 },
    { continent: "Central America", total: 112, subset: 7 },
    { continent: "Oceania", total: 1326, subset: 57 }
  ];

  data.sort((a, b) => b.total - a.total);

  const container = document.getElementById('d3-horizontal-bars-container');
  if (!container) return;

  const containerWidth = container.offsetWidth;

  const width = containerWidth;
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

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.total) * 1.1])
    .range([0, innerWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.continent))
    .range([0, innerHeight])
    .padding(0.3);

  g.append("g")
    .attr("class", "grid")
    .call(d3.axisTop(xScale)
      .tickSize(-innerHeight)
      .tickFormat(""));

  const barGroups = g.selectAll(".bar-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(0,${yScale(d.continent)})`);

  barGroups.append("rect")
    .attr("class", "bar-total")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => xScale(d.total))
    .attr("height", yScale.bandwidth());

  barGroups.append("rect")
    .attr("class", "bar-subset")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => xScale(d.subset))
    .attr("height", yScale.bandwidth());

  barGroups.append("rect")
    .attr("class", "hover-area")
    .attr("x", 0)
    .attr("y", -yScale.bandwidth() * 0.1)
    .attr("width", innerWidth)
    .attr("height", yScale.bandwidth() * 1.2)
    .on("mouseenter", function(event, d) {
      const group = d3.select(this.parentNode);

      group.select(".bar-total")
        .style("opacity", 0.8);
      group.select(".bar-subset")
        .style("opacity", 1);

      barGroups.filter(bd => bd !== d)
        .style("opacity", 0.3);

      tooltip.style("opacity", 1)
        .html(`${d.continent}<br>2024: ${d.subset.toLocaleString()}<br>Previous: ${(d.total - d.subset).toLocaleString()}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function() {
      barGroups.style("opacity", 1)
        .selectAll(".bar-total, .bar-subset")
        .style("opacity", 1);

      tooltip.style("opacity", 0);
    });

  barGroups.append("text")
    .attr("class", "value-label")
    .attr("x", d => {
      const minSpace = 60;
      const subsetEnd = xScale(d.subset);
      const totalEnd = xScale(d.total);
      const defaultPosition = totalEnd + 5;

      if ((totalEnd - subsetEnd) < minSpace) {
        return Math.max(subsetEnd + minSpace, defaultPosition);
      }
      return defaultPosition;
    })
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .style("fill", "#666666")
    .text(d => (d.total - d.subset).toLocaleString());

  barGroups.append("text")
    .attr("class", "subset-label")
    .attr("x", d => xScale(d.subset) + 5)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .style("fill", "#034737")
    .text(d => d.subset.toLocaleString());

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("text-anchor", "end");

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d.toLocaleString()));

  function handleResize() {
    const newWidth = container.offsetWidth;
    const newHeight = Math.min(400, newWidth * 0.5);

    svg.attr("width", newWidth)
       .attr("height", newHeight)
       .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
  }

  window.addEventListener('resize', handleResize);
})();
