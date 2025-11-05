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
      {
        category: "Firearms",
        metrics: [
          {name: "Opportunities", change: ((1134-941)/941*100).toFixed(1)},
          {name: "Value", change: ((208012952-110939558)/110939558*100).toFixed(1)},
          {name: "Duration", change: ((22-28)/28*100).toFixed(1)}
        ]
      },
      {
        category: "Rescue and Safety",
        metrics: [
          {name: "Opportunities", change: ((897-1029)/1029*100).toFixed(1)},
          {name: "Value", change: ((895682638-1840742416)/1840742416*100).toFixed(1)},
          {name: "Duration", change: ((29-22)/22*100).toFixed(1)}
        ]
      },
      {
        category: "Intelligence",
        metrics: [
          {name: "Opportunities", change: ((589-447)/447*100).toFixed(1)},
          {name: "Value", change: ((38281755-113873259)/113873259*100).toFixed(1)},
          {name: "Duration", change: ((19-18)/18*100).toFixed(1)}
        ]
      },
      {
        category: "Armoured Vehicles",
        metrics: [
          {name: "Opportunities", change: ((538-468)/468*100).toFixed(1)},
          {name: "Value", change: ((29958119-121350684)/121350684*100).toFixed(1)},
          {name: "Duration", change: ((26-22)/22*100).toFixed(1)}
        ]
      },
      {
        category: "Support Equipment",
        metrics: [
          {name: "Opportunities", change: ((233-286)/286*100).toFixed(1)},
          {name: "Value", change: ((8585409-682501)/682501*100).toFixed(1)},
          {name: "Duration", change: ((6-2)/2*100).toFixed(1)}
        ]
      },
      {
        category: "Command Control",
        metrics: [
          {name: "Opportunities", change: ((2-207)/207*100).toFixed(1)},
          {name: "Value", change: ((305228492-15938431)/15938431*100).toFixed(1)},
          {name: "Duration", change: ((82-37)/37*100).toFixed(1)}
        ]
      },
      {
        category: "Military Aircraft",
        metrics: [
          {name: "Opportunities", change: ((17-3)/3*100).toFixed(1)},
          {name: "Value", change: ((259476482-235877400)/235877400*100).toFixed(1)},
          {name: "Duration", change: ((9-22)/22*100).toFixed(1)}
        ]
      },
      {
        category: "Ammunition",
        metrics: [
          {name: "Opportunities", change: ((48-0)/1*100).toFixed(1)},
          {name: "Value", change: ((292747555-491992816)/491992816*100).toFixed(1)},
          {name: "Duration", change: ((23-20)/20*100).toFixed(1)}
        ]
      }
    ];

    const container = document.getElementById('horizontal-grouped-bar-chart');
    if (!container) {
      console.error('Container element #horizontal-grouped-bar-chart not found');
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
      .axis-label { font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
      .legend { font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
      .category-label { font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; fill: #333; }
      .value-label { font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; fill: #333; }
    `;

    if (!document.getElementById('defence-patterns-bar-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-patterns-bar-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    const categories = data.map(d => d.category);
    const groupScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerHeight])
      .padding(0.4);

    const metricScale = d3.scaleBand()
      .domain(["Opportunities", "Value", "Duration"])
      .range([0, groupScale.bandwidth()])
      .padding(0.2);

    const xScale = d3.scaleLinear()
      .domain([-100, 100])
      .range([0, innerWidth]);

    const colorScale = d3.scaleOrdinal()
      .domain(["Opportunities", "Value", "Duration"])
      .range(["#034737", "#82c091", "#FB8500"]);

    g.append("g")
      .call(d3.axisLeft(groupScale))
      .selectAll("text")
      .attr("class", "category-label")
      .style("text-anchor", "end");

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => d + "%")
        .ticks(10))
      .selectAll("text")
      .attr("class", "axis-label");

    const bars = g.selectAll(".bar-group")
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

    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0,${innerHeight + 40})`);

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

    g.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 80)
      .text("Percent Change");
  }
})();
