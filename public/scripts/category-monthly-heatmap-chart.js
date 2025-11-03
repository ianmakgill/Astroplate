// Category Monthly Heatmap Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { category: "Information systems", values: [210852625, 335779449, 539559467, 191053920, 104512751, 202839440, 141389582, 143041052, 302970616, 45393714, 247917756, 99731512] },
    { category: "Document creation software", values: [179425026, 78400994, 45133323, 42002765, 25017258, 70168826, 39179358, 21604471, 26955636, 7201189, 24337504, 34416348] },
    { category: "Medical software", values: [63765404, 53374312, 85188037, 92288798, 59682753, 33523646, 70335314, 45198000, 30669589, 72911891, 399065613, 1685429] },
    { category: "Servers", values: [54285712, 135457420, 111555896, 204958050, 131398198, 156140057, 212082851, 189346479, 156842507, 26431770, 216504945, 3184040] },
    { category: "Networking software", values: [42400881, 70868264, 84355880, 168928138, 83356862, 86399394, 110636146, 149649600, 124958928, 72215909, 117207864, 122255070] },
    { category: "Time accounting software", values: [33281280, 56224800, 46712465, 50311926, 55150593, 44811928, 47650028, 32374768, 24040623, 30858581, 30898951, 1945445] },
    { category: "Drawing and imaging", values: [10788338, 23872809, 23037559, 28213408, 28863995, 29861905, 35452312, 37072035, 23988831, 21023868, 14219738, 655707] },
    { category: "Communication software", values: [9306500, 10704995, 15071750, 19987123, 10445879, 9562633, 9784671, 11422992, 19483330, 8657979, 16280343, 1591075] },
    { category: "Security software", values: [7134494, 22903123, 20514466, 47119659, 25371220, 17429500, 24742256, 31281172, 21886122, 42926779, 43022703, 321247] },
    { category: "Virus protection", values: [5422558, 7713392, 11661530, 19778368, 21076905, 10435425, 45783457, 39674297, 16609339, 4540152, 35744148, 35744148] }
  ];

  const quarters = ["Q1' 2022", "Q2' 2022", "Q3' 2022", "Q4' 2022", "Q1' 2023", "Q2' 2023", "Q3' 2023", "Q4' 2023", "Q1' 2024", "Q2' 2024", "Q3' 2024", "Q4' 2024"];

  const container = document.getElementById('d3-heatmap-container');
  if (!container) return;

  const containerWidth = container.offsetWidth;
  const width = containerWidth;
  const height = Math.min(500, containerWidth * 0.6);
  const margin = { top: 20, right: 50, bottom: 100, left: 200 };
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
    .domain(quarters)
    .range([0, innerWidth])
    .padding(0.05);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, innerHeight])
    .padding(0.05);

  const color = d3.scaleSequential(d3.interpolate)
    .domain([d3.min(data, d => d3.min(d.values)), d3.max(data, d => d3.max(d.values))])
    .interpolator(d3.interpolateRgbBasis(["#f0fff4", "#034737"]));

  g.selectAll()
    .data(data)
    .enter()
    .selectAll()
    .data(d => d.values.map((v, i) => ({ category: d.category, quarter: quarters[i], value: v })))
    .enter()
    .append("rect")
    .attr("class", "heatmap-rect")
    .attr("x", d => xScale(d.quarter))
    .attr("y", d => yScale(d.category))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", d => color(d.value))
    .on("mouseenter", function(event, d) {
      tooltip.style("opacity", 1)
        .html(`Quarter: ${d.quarter}<br>Category: ${d.category}<br>Value: ${d3.format("$,.2f")(d.value)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function() {
      tooltip.style("opacity", 0);
    });

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale));

  function handleResize() {
    const newWidth = container.offsetWidth;
    const newHeight = Math.min(500, newWidth * 0.5);

    svg.attr("width", newWidth)
       .attr("height", newHeight)
       .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);
  }

  window.addEventListener('resize', handleResize);
})();
