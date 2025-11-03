// Average Contract Values Bar Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    {category: "Information systems", europe: 413592296, namerica: 82013225},
    {category: "Servers", europe: 403730898, namerica: 17396440},
    {category: "Medical", europe: 217116345, namerica: 37596706},
    {category: "Networking", europe: 191421139, namerica: 49947043},
    {category: "Financial", europe: 186033166, namerica: 54261361},
    {category: "Time accounting", europe: 162425944, namerica: 367229718},
    {category: "Security", europe: 102066306, namerica: 28371517},
    {category: "Document creation", europe: 69774078, namerica: 59491870},
    {category: "Imaging", europe: 52148008, namerica: 5396700},
    {category: "Database systems", europe: 45201290, namerica: 23331869},
    {category: "Communication", europe: 40405392, namerica: 5252795},
    {category: "Educational", europe: 29899741, namerica: 12024883}
  ];

  const container = document.getElementById('average-contract-values-chart');
  if (!container) return;

  const width = container.offsetWidth;
  const height = 700;
  const margin = { top: 50, right: 120, bottom: 60, left: 160 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select('#average-contract-values-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('text')
    .attr('x', margin.left + innerWidth/2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('fill', '#034737')
    .text('Average Contract Values by Region and Category');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

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

    // North America bar
    group.append('rect')
      .attr('class', 'bar namerica')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', xScale(d.namerica))
      .attr('height', barHeight);

    // Europe bar
    group.append('rect')
      .attr('class', 'bar europe')
      .attr('x', 0)
      .attr('y', barHeight + 5)
      .attr('width', xScale(d.europe))
      .attr('height', barHeight);

    // Value labels
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

  // Legend
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
})();
