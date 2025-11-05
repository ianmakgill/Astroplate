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
      {category: "Firearms", europe: 417940, namerica: 7237733},
      {category: "Armoured military vehicles", europe: 952980, namerica: 20027},
      {category: "Warships", europe: 403406, namerica: 494763},
      {category: "Intelligence, surveillance", europe: 434251, namerica: 176207},
      {category: "Parts for warships", europe: 511930, namerica: 56954},
      {category: "Military aircrafts", europe: 172882, namerica: 301086},
      {category: "Parts of military vehicles", europe: 327664, namerica: 80565},
    ];

    const container = document.getElementById('average-contract-values-chart');
    if (!container) {
      console.error('Container element #average-contract-values-chart not found');
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
      .bar { transition: opacity 0.2s; }
      .bar.europe { fill: #034737; }
      .bar.namerica { fill: #a9ff9b; }
      .axis text { font-size: 12px; fill: #034737; }
      .tooltip { padding: 8px; background: white; border: 1px solid #ccc; border-radius: 4px; box-shadow: 2px 2px 6px rgba(0,0,0,0.1); }
    `;

    if (!document.getElementById('defence-regional-values-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-regional-values-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerHeight])
      .padding(0.3);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.europe, d.namerica))])
      .range([0, innerWidth]);

    const barHeight = yScale.bandwidth() / 2.5;

    data.forEach(d => {
      const group = g.append('g')
        .attr('transform', `translate(0,${yScale(d.category)})`);

      group.append('rect')
        .attr('class', 'bar namerica')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xScale(d.namerica))
        .attr('height', barHeight);

      group.append('rect')
        .attr('class', 'bar europe')
        .attr('x', 0)
        .attr('y', barHeight + 5)
        .attr('width', xScale(d.europe))
        .attr('height', barHeight);

      group.append('text')
        .attr('x', xScale(d.namerica) + 5)
        .attr('y', barHeight/2)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .text(`$${d3.format('.2s')(d.namerica)}`);

      group.append('text')
        .attr('x', xScale(d.europe) + 5)
        .attr('y', barHeight*1.8)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .text(`$${d3.format('.2s')(d.europe)}`);
    });

    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale));

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d => `$${d3.format('.2s')(d)}`));

    const legend = g.append('g')
      .attr('transform', `translate(0,${innerHeight + 40})`);

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#034737');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 12)
      .text('Europe');

    legend.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', '#a9ff9b')
      .attr('transform', 'translate(100,0)');

    legend.append('text')
      .attr('x', 125)
      .attr('y', 12)
      .text('North America');
  }
})();
