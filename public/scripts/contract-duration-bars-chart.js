// Contract Duration Bars Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { category: "Information Systems", duration: 47.0 },
    { category: "Document creation software", duration: 32.0 },
    { category: "Medical software", duration: 27.0  },
    { category: "Servers", duration: 27.0  },
    { category: "Networking software", duration: 24.0 },
    { category: "Time accounting software", duration: 34.0 },
    { category: "Drawing and imaging", duration: 20.0  },
    { category: "Communication software", duration: 28.0 },
    { category: "Security software", duration: 26.0 }
  ];

  data.sort((a, b) => b.duration - a.duration);

  const container = document.getElementById('d3-duration-bars-container');
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
    .domain([0, d3.max(data, d => d.duration) * 1.1])
    .range([0, innerWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.category))
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
    .attr("transform", d => `translate(0,${yScale(d.category)})`);

  barGroups.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", d => xScale(d.duration))
    .attr("height", yScale.bandwidth());

  barGroups.append("text")
    .attr("class", "value-label")
    .attr("x", d => xScale(d.duration) + 5)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => `${d.duration} months`);

  barGroups.append("rect")
    .attr("class", "hover-area")
    .attr("x", 0)
    .attr("y", -yScale.bandwidth() * 0.1)
    .attr("width", innerWidth)
    .attr("height", yScale.bandwidth() * 1.2)
    .on("mouseenter", function(event, d) {
      const group = d3.select(this.parentNode);

      group.select(".bar")
        .style("fill", "#0D6986");

      barGroups.filter(bd => bd !== d)
        .style("opacity", 0.3);

      tooltip.style("opacity", 1)
        .html(`${d.category}<br>Average Duration: ${d.duration} months`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function() {
      barGroups.style("opacity", 1)
        .selectAll(".bar")
        .style("fill", "#034737");

      tooltip.style("opacity", 0);
    });

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale))
    .select(".domain").remove();

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => `${d} months`));

  function handleResize() {
    const newWidth = container.offsetWidth;
    const newHeight = Math.min(600, newWidth * 0.6);

    svg.attr("width", newWidth)
       .attr("height", newHeight)
       .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
  }

  window.addEventListener('resize', handleResize);
})();
