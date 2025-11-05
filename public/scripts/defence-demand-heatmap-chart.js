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
      { category: "Firearms", values: [293, 236, 231, 181, 176, 234, 255, 197, 138, 111, 284, 601, 136, 1] },
      { category: "Rescue_and_Safety", values: [271, 210, 352, 196, 200, 201, 196, 112, 215, 123, 357, 202] },
      { category: "Intelligence", values: [91, 58, 144, 154, 158, 55, 41, 481, 169, 127, 127, 166] },
      { category: "Armoured_Vehicles", values: [31, 71, 84, 282, 158, 223, 218, 265, 138, 198, 134, 68] },
      { category: "Support_Equipment", values: [100, 30, 98, 58, 39, 34, 48, 41, 54, 40, 70, 69] }
    ];

    const quarters = ["Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24"];

    const container = document.getElementById('heatmap-software-categories');
    if (!container) {
      console.error('Container element #heatmap-software-categories not found');
      return;
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight || 500;
    const margin = { top: 50, right: 20, bottom: 60, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
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
      .attr("class", "heatmap-tooltip")
      .style("position", "absolute")
      .style("padding", "12px")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
      .style("opacity", 0);

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
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('transition', 'all 0.3s ease')
          .on('mouseover', function(event) {
            d3.select(this)
              .attr('stroke', '#034737')
              .attr('stroke-width', 3)
              .style('filter', 'brightness(1.1)');

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
              .attr('stroke', '#fff')
              .attr('stroke-width', 2)
              .style('filter', 'none');
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
  }
})();
