// Category Patterns Bar Chart
(function() {
  if (typeof d3 === 'undefined') {
    console.error('D3.js not loaded');
    return;
  }

  const data = [
    {
      category: "Information",
      metrics: [
        {name: "Opportunities", change: ((1877-2177)/2177*100).toFixed(1)},
        {name: "Value", change: ((695073363-1277035795)/1277035795*100).toFixed(1)},
        {name: "Duration", change: ((47-42)/42*100).toFixed(1)}
      ]
    },
    {
      category: "Document creation",
      metrics: [
        {name: "Opportunities", change: ((716-1156)/1156*100).toFixed(1)},
        {name: "Value", change: ((92910677-1560515424)/15605154244*100).toFixed(1)},
        {name: "Duration", change: ((32-38)/38*100).toFixed(1)}
      ]
    },
    {
      category: "Medical",
      metrics: [
        {name: "Opportunities", change: ((1351-1865)/1865*100).toFixed(1)},
        {name: "Value", change: ((541403002-294616551)/294616551*100).toFixed(1)},
        {name: "Duration", change: ((27-31)/31*100).toFixed(1)}
      ]
    },
    {
      category: "Servers",
      metrics: [
        {name: "Opportunities", change: ((4086-5244)/5244*100).toFixed(1)},
        {name: "Value", change: ((500903945-505307078)/505307078*100).toFixed(1)},
        {name: "Duration", change: ((27-22)/22*100).toFixed(1)}
      ]
    },
    {
      category: "Networking",
      metrics: [
        {name: "Opportunities", change: ((6271-7791)/7791*100).toFixed(1)},
        {name: "Value", change: ((246236562-366536163)/366536163*100).toFixed(1)},
        {name: "Duration", change: ((24-21)/21*100).toFixed(1)}
      ]
    },
    {
      category: "Time accounting",
      metrics: [
        {name: "Opportunities", change: ((986-1163)/1163*100).toFixed(1)},
        {name: "Value", change: ((297099524-186530471)/186530471*100).toFixed(1)},
        {name: "Duration", change: ((34-37)/37*100).toFixed(1)}
      ]
    },
    {
      category: "Imaging",
      metrics: [
        {name: "Opportunities", change: ((1348-1785)/1785*100).toFixed(1)},
        {name: "Value", change: ((118528149-138312204)/138312204*100).toFixed(1)},
        {name: "Duration", change: ((20-19)/19*100).toFixed(1)}
      ]
    },
    {
      category: "Communication",
      metrics: [
        {name: "Opportunities", change: ((857-1411)/1411*100).toFixed(1)},
        {name: "Value", change: ((44591933-95070368)/95070368*100).toFixed(1)},
        {name: "Duration", change: ((28-22)/22*100).toFixed(1)}
      ]
    },
    {
      category: "Security",
      metrics: [
        {name: "Opportunities", change: ((1079-1187)/1187*100).toFixed(1)},
        {name: "Value", change: ((116430770-97671742)/97671742*100).toFixed(1)},
        {name: "Duration", change: ((26-21)/21*100).toFixed(1)}
      ]
    },
    {
      category: "Virus protection",
      metrics: [
        {name: "Opportunities", change: ((724-739)/739*100).toFixed(1)},
        {name: "Value", change: ((64201579-44275848)/44275848*100).toFixed(1)},
        {name: "Duration", change: ((27-24)/24*100).toFixed(1)}
      ]
    }
  ];

  const margin = {top: 50, right: 50, bottom: 100, left: 150};
  const container = document.getElementById('horizontal-grouped-bar-chart');
  if (!container) return;

  let width = container.offsetWidth - margin.left - margin.right;
  let height = Math.min(500, data.length * 100);

  const svg = d3.select("#horizontal-grouped-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const categories = data.map(d => d.category);
  const groupScale = d3.scaleBand()
    .domain(categories)
    .range([0, height])
    .padding(0.4);

  const metricScale = d3.scaleBand()
    .domain(["Opportunities", "Value", "Duration"])
    .range([0, groupScale.bandwidth()])
    .padding(0.2);

  const xScale = d3.scaleLinear()
    .domain([-100, 100])
    .range([0, width]);

  const colorScale = d3.scaleOrdinal()
    .domain(["Opportunities", "Value", "Duration"])
    .range(["#034737", "#82c091", "#FB8500"]);

  svg.append("g")
    .call(d3.axisLeft(groupScale))
    .selectAll("text")
    .attr("class", "category-label")
    .style("text-anchor", "end");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
      .tickFormat(d => d + "%")
      .ticks(10))
    .selectAll("text")
    .attr("class", "axis-label");

  const bars = svg.selectAll(".bar-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(0,${groupScale(d.category)})`);

  bars.selectAll("rect")
    .data(d => d.metrics)
    .enter()
    .append("rect")
    .attr("y", d => metricScale(d.name))
    .attr("x", d => xScale(Math.min(0, d.change)))
    .attr("height", metricScale.bandwidth())
    .attr("width", d => Math.abs(xScale(d.change) - xScale(0)))
    .attr("fill", d => colorScale(d.name));

  bars.selectAll("text")
    .data(d => d.metrics)
    .enter()
    .append("text")
    .attr("class", "value-label")
    .attr("x", d => d.change >= 0 ? xScale(d.change) + 5 : xScale(d.change) - 5)
    .attr("y", d => metricScale(d.name) + metricScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.change >= 0 ? "start" : "end")
    .text(d => `${d.change}%`);

  svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .text("Software Categories: Changes 2022-2024 by Category and Metric");

  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0,${height + 40})`);

  const legendItems = legend.selectAll(".legend-item")
    .data(["Opportunities", "Value", "Duration"])
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(${i * 150}, 0)`);

  legendItems.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", d => colorScale(d));

  legendItems.append("text")
    .attr("x", 20)
    .attr("y", 12)
    .text(d => d);

  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 80)
    .text("Percent Change");

  function handleResize() {
    const newWidth = container.offsetWidth - margin.left - margin.right;
    const newHeight = Math.min(800, data.length * 50);

    svg.attr("width", newWidth + margin.left + margin.right)
       .attr("height", newHeight + margin.top + margin.bottom);

    groupScale.range([0, newHeight]);
    xScale.range([0, newWidth]);

    bars.attr("transform", d => `translate(0,${groupScale(d.category)})`)
      .selectAll("rect")
      .attr("y", d => metricScale(d.name))
      .attr("x", d => xScale(Math.min(0, d.change)))
      .attr("width", d => Math.abs(xScale(d.change) - xScale(0)));

    bars.selectAll("text")
      .attr("x", d => d.change >= 0 ? xScale(d.change) + 5 : xScale(d.change) - 5)
      .attr("y", d => metricScale(d.name) + metricScale.bandwidth() / 2);

    svg.select(".axis.x")
      .attr("transform", `translate(0,${newHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d + "%"));

    svg.select(".axis.y")
      .call(d3.axisLeft(groupScale));

    legend.attr("transform", `translate(0,${newHeight + 40})`);

    svg.select(".title")
      .attr("x", newWidth / 2);

    svg.select(".axis-label")
      .attr("x", newWidth / 2)
      .attr("y", newHeight + 80);
  }

  window.addEventListener("resize", handleResize);
})();
