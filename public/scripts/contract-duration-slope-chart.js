// Contract Duration Slope Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { category: "Information Systems", year2022: 42.0, year2024: 47.0 },
    { category: "Document creation software", year2022: 38.0, year2024: 32.0 },
    { category: "Medical software", year2022: 31.0, year2024: 27.0  },
    { category: "Time accounting software", year2022: 37.0, year2024: 34.0 },
    { category: "Drawing and imaging", year2022: 19.0, year2024: 20.0 },
    { category: "Communication software", year2022: 22.0, year2024: 28.0 },
    { category: "Security software", year2022: 21.0, year2024: 26.0 },
    { category: "Virus protection", year2022: 24.0, year2024: 27.0 }
  ];

  data.forEach(d => {
    d.percentChange = ((d.year2024 - d.year2022) / d.year2022 * 100).toFixed(1);
  });

  const container = document.getElementById('contract-duration-slope-categories-2022-2024');
  if (!container) return;

  const width = container.offsetWidth;
  const height = container.offsetHeight || 500;
  const margin = { top: 50, right: 100, bottom: 60, left: 100 };
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

  const yScale = d3.scaleLinear()
    .domain([0, Math.max(d3.max(data, d => d.year2022), d3.max(data, d => d.year2024))])
    .range([innerHeight, 0])
    .nice();

  g.append("line")
    .attr("class", "vertical-guide")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", innerHeight);

  g.append("line")
    .attr("class", "vertical-guide")
    .attr("x1", innerWidth)
    .attr("x2", innerWidth)
    .attr("y1", 0)
    .attr("y2", innerHeight);

  g.append("text")
    .attr("class", "year-label")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("2022");

  g.append("text")
    .attr("class", "year-label")
    .attr("x", innerWidth)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("2024");

  const categoryGroups = g.selectAll(".slope-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "slope-group");

  categoryGroups.append("line")
    .attr("class", d => `slope-line ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", d => yScale(d.year2022))
    .attr("y2", d => yScale(d.year2024));

  categoryGroups.append("circle")
    .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
    .attr("cx", 0)
    .attr("cy", d => yScale(d.year2022))
    .attr("r", 4);

  categoryGroups.append("circle")
    .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
    .attr("cx", innerWidth)
    .attr("cy", d => yScale(d.year2024))
    .attr("r", 4);

  function getLabelY(value, index, array) {
    const baseY = yScale(value);
    const minSpacing = 25;
    let shift = 0;

    array.slice(0, index).forEach((otherValue, i) => {
      const otherY = yScale(otherValue);
      const diff = Math.abs(baseY - otherY);
      if (diff < minSpacing) {
        shift = (minSpacing - diff) * (baseY > otherY ? 1 : -1);
      }
    });

    return baseY + shift;
  }

  data.forEach((d, i) => {
    const labelY = getLabelY(d.year2022, i, data.map(d => d.year2022));
    categoryGroups.filter(dd => dd === d)
      .append("text")
      .attr("class", "left-label")
      .attr("x", -10)
      .attr("y", labelY)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .text(`${d.category} (${d.year2022})`);
  });

  data.forEach((d, i) => {
    const labelY = getLabelY(d.year2024, i, data.map(d => d.year2024));
    categoryGroups.filter(dd => dd === d)
      .append("text")
      .attr("class", "right-label")
      .attr("x", innerWidth + 10)
      .attr("y", labelY)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .text(`${d.year2024} months`);

    categoryGroups.filter(dd => dd === d)
      .append("text")
      .attr("class", d => `value-change ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
      .attr("x", innerWidth + 90)
      .attr("y", labelY)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .text(d => `${d.percentChange > 0 ? '+' : ''}${d.percentChange}%`);
  });

  categoryGroups
    .on("mouseenter", function(event, d) {
      const selectedCategory = d.category;
      categoryGroups.style("opacity", g => g.category === selectedCategory ? 1 : 0.2);
    })
    .on("mouseleave", function() {
      categoryGroups.style("opacity", 1);
    });

  function handleResize() {
    const newWidth = Math.max(container.offsetWidth, 800);
    svg.attr("width", newWidth);
  }

  window.addEventListener('resize', handleResize);
})();
