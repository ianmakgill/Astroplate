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
      { category: "Firearms", year2022: 28.0, year2024: 22.0 },
      { category: "Rescue and Safety Equipment", year2022: 22.0, year2024: 29.0 },
      { category: "Intelligence, Surveillance", year2022: 18.0, year2024: 19.0  },
      { category: "Armoured Military Vehicles", year2022: 22.0, year2024: 26.0 },
      { category: "Command, control, communication systems", year2022: 37.0, year2024: 82.0 },
      { category: "Individual equipment", year2022: 12.0, year2024: 34.0 },
      { category: "Parts of military vehicles", year2022: 13.0, year2024: 31.0 },
      { category: "Defence services", year2022: 17.0, year2024: 27.0 },
    ];

    data.forEach(d => {
      d.percentChange = ((d.year2024 - d.year2022) / d.year2022 * 100).toFixed(1);
    });

    const container = document.getElementById('contract-duration-slope-categories-2022-2024');
    if (!container) {
      console.error('Container element #contract-duration-slope-categories-2022-2024 not found');
      return;
    }

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

    // Add styles
    const styles = `
      .slope-group { transition: opacity 0.2s ease; }
      .slope-line { stroke-width: 1.5; }
      .slope-line.increase { stroke: #034737; }
      .slope-line.decrease { stroke: #FB8500; }
      .hover-line { stroke: transparent; stroke-width: 10; cursor: pointer; }
      .endpoint-circle.increase { fill: #034737; }
      .endpoint-circle.decrease { fill: #FB8500; }
      .vertical-guide { stroke: rgba(3, 71, 55, 0.2); stroke-width: 1; stroke-dasharray: 4,4; pointer-events: none; }
      .left-label, .right-label { font-family: inherit; font-size: 12px; fill: #034737; cursor: pointer; }
      .year-label { font-family: inherit; font-size: 14px; font-weight: bold; fill: #034737; pointer-events: none; }
      .value-change { font-family: inherit; font-size: 12px; }
      .value-change.increase { fill: #034737; }
      .value-change.decrease { fill: #FB8500; }
    `;

    if (!document.getElementById('defence-duration-slope-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-duration-slope-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

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
  }
})();
