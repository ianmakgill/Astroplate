// Stream Header Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    {"date":"2022-01-01", "Infrastructure": 1082, "Communication": 1855, "Analytics": 1535, "Security": 350, "Productivity": 1604},
    {"date":"2022-04-01", "Infrastructure": 1239, "Communication": 1690, "Analytics": 1287, "Security": 411, "Productivity": 1234},
    {"date":"2022-07-01", "Infrastructure": 2945, "Communication": 3892, "Analytics": 1950, "Security": 799, "Productivity": 2606},
    {"date":"2022-10-01", "Infrastructure": 1573, "Communication": 2427, "Analytics": 1009, "Security": 685, "Productivity": 1556},
    {"date":"2023-01-01", "Infrastructure": 1188, "Communication": 1920, "Analytics": 1246, "Security": 459, "Productivity": 1204},
    {"date":"2023-04-01", "Infrastructure": 1524, "Communication": 2342, "Analytics": 1445, "Security": 541, "Productivity": 1296},
    {"date":"2023-07-01", "Infrastructure": 1514, "Communication": 2351, "Analytics": 1323, "Security": 535, "Productivity": 1149},
    {"date":"2023-10-01", "Infrastructure": 1337, "Communication": 2085, "Analytics": 1122, "Security": 791, "Productivity": 960},
    {"date":"2024-01-01", "Infrastructure": 1316, "Communication": 1797, "Analytics": 1356, "Security": 524, "Productivity": 1124}
  ].map(d => ({...d, date: new Date(d.date)}));

  const container = document.getElementById('chart-container');
  if (!container) return;

  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const margin = { top: 50, right: 50, bottom: 70, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select('#chart-container')
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, innerWidth]);

  const quarters = data.map(d => d.date);

  g.selectAll(".quarter-line")
    .data(quarters)
    .enter()
    .append("line")
    .attr("class", "quarter-line")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0)
    .attr("y2", innerHeight);

  g.selectAll(".quarter-label")
    .data(quarters)
    .enter()
    .append("text")
    .attr("class", "quarter-label")
    .attr("x", d => xScale(d))
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text(d => `Q${Math.floor(d.getMonth()/3) + 1} ${d.getFullYear()}`);

  const keys = Object.keys(data[0]).filter(key => key !== 'date');
  const stack = d3.stack()
    .offset(d3.stackOffsetWiggle)
    .keys(keys);

  const layers = stack(data);
  const yScale = d3.scaleLinear()
    .domain([
      d3.min(layers, layer => d3.min(layer, d => d[0])),
      d3.max(layers, layer => d3.max(layer, d => d[1]))
    ])
    .range([innerHeight, 0]);

  const area = d3.area()
    .x(d => xScale(d.data.date))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveBasis);

  const colors = ['#034737', '#0D6986', '#219EBC', '#FFB703', '#FB8500'];

  g.selectAll("path")
    .data(layers)
    .enter()
    .append("path")
    .attr("class", "stream-layer")
    .attr("d", area)
    .style("fill", (d, i) => colors[i])
    .on("mouseover", function(event, d) {
      d3.select(this).style("opacity", 1);
      tooltip.style("opacity", 1);
    })
    .on("mousemove", function(event, d) {
      const [mouseX] = d3.pointer(event, this);
      const date = xScale.invert(mouseX);
      const bisect = d3.bisector(d => d.date).left;
      const index = bisect(data, date);
      const currentData = data[index];

      if (currentData) {
        tooltip
          .html(`
            <strong>${d.key}</strong><br>
            ${d3.timeFormat("%B %Y")(currentData.date)}<br>
            Volume: ${currentData[d.key]}
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      }
    })
    .on("mouseout", function() {
      d3.select(this).style("opacity", 0.8);
      tooltip.style("opacity", 0);
    });

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(3))
      .tickFormat(d3.timeFormat("%b %Y")));

  const legend = svg.append("g")
    .attr("transform", `translate(${margin.left},${height - 30})`);

  legend.selectAll("g")
    .data(keys)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${i * (innerWidth/keys.length)}, 0)`)
    .call(g => {
      g.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", (d, i) => colors[i]);
      g.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d)
        .style("font-size", "12px");
    });
})();
