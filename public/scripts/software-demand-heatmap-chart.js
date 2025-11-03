// Software Demand Heatmap Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    { category: "Infrastructure", values: [1082, 1239, 2945, 1573, 1188, 1524, 1514, 1337, 1184, 741, 1896, 1295] },
    { category: "Communication", values: [1855, 1690, 3892, 2427, 1920, 2342, 2351, 2085, 1797, 1534, 2199, 1945] },
    { category: "Analytics", values: [1535, 1298, 2404, 1239, 1247, 1527, 1418, 1135, 1401, 879, 1784, 1019] },
    { category: "Security", values: [350, 424, 799, 1598, 459, 541, 534, 795, 524, 399, 656, 481] },
    { category: "Productivity", values: [1604, 1290, 2763, 1627, 1389, 1468, 1356, 1243, 1218, 1082, 1633, 1385] }
  ];

  const quarters = ["Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24"];
  const container = document.getElementById('heatmap-software-categories');
  if (!container) return;

  const width = container.offsetWidth;
  const height = Math.min(600, width * 0.6);
  const margin = { top: 40, right: 40, bottom: 100, left: 160 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(quarters)
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, innerHeight])
    .padding(0.1);

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "heatmap-tooltip");

  const allValues = data.flatMap(d => d.values);
  const valueExtent = d3.extent(allValues);

  const colorScale = d3.scaleLog()
    .domain([Math.max(1, valueExtent[0]), valueExtent[1]])
    .range([0, 1]);

  const colorInterpolator = d3.interpolateRgbBasis(['#f0fff4', '#95d5b2', '#40916c', '#1b4332']);

  data.forEach(row => {
    row.values.forEach((value, i) => {
      const normalizedValue = colorScale(Math.max(1, value));

      svg.append('rect')
        .attr('class', 'heatmap-rect')
        .attr('x', xScale(quarters[i]))
        .attr('y', yScale(row.category))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('fill', colorInterpolator(normalizedValue))
        .on('mouseover', function(event) {
          d3.select(this)
            .attr('stroke-width', 3);

          tooltip.style('opacity', 1)
            .html(`
              <strong>${quarters[i]}</strong><br>
              ${row.category}<br>
              Volume: ${value.toLocaleString()}
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('stroke-width', 2);
          tooltip.style('opacity', 0);
        });
    });
  });

  svg.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  svg.append('g')
    .call(d3.axisLeft(yScale));

  svg.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', -margin.top / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Software Category Demand Patterns (2022-2024)');
})();
