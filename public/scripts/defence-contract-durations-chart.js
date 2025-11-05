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
      { category: "Firearms", duration: 22.0 },
      { category: "Rescue and Safety Equipment", duration: 29.0 },
      { category: "Intelligence, Surveillance,", duration: 19.0  },
      { category: "Armoured Military Vehicles", duration: 26.0  },
      { category: "Support Equipment", duration: 4.0 },
      { category: "Command, control systems", duration: 82.0 },
      { category: "Individual equipment", duration: 34.0  },
      { category: "Parts of military vehicles", duration: 31.0 },
      { category: "Defence services", duration: 27.0 },
    ];

    data.sort((a, b) => b.duration - a.duration);

    const container = document.getElementById('d3-duration-bars-container');
    if (!container) {
      console.error('Container element #d3-duration-bars-container not found');
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
      .bar { fill: #034737; transition: opacity 0.2s ease; }
      .bar:hover { fill: #FB8500; }
      .hover-area { fill: transparent; pointer-events: all; cursor: pointer; }
      .value-label { font-family: inherit; font-size: 12px; fill: #034737; transition: opacity 0.2s ease; }
      .axis text { font-family: inherit; font-size: 12px; fill: #034737; }
      .axis line, .axis path { stroke: rgba(3, 71, 55, 0.2); }
      .grid line { stroke: rgba(3, 71, 55, 0.1); stroke-dasharray: 2,2; }
      .grid path { stroke-width: 0; }
      .tooltip { position: absolute; padding: 8px; background: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 4px; pointer-events: none; font-family: inherit; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; }
    `;

    if (!document.getElementById('defence-duration-bar-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-duration-bar-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

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
  }
})();
