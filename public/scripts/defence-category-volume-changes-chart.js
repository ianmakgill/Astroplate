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
      { category: "Firearms", year2022: 941, year2024: 1134 },
      { category: "Rescue and Safety", year2022: 1029, year2024: 897 },
      { category: "Intelligence", year2022: 447, year2024: 589 },
      { category: "Armoured Vehicles", year2022: 468, year2024: 538 },
      { category: "Support Equipment", year2022: 286, year2024: 233 }
    ].map(d => ({
      ...d,
      percentChange: ((d.year2024 - d.year2022) / d.year2022 * 100).toFixed(1)
    }));

    const formatNumber = num => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num;
    };

    const container = document.getElementById('slope-chart-category-volumes-2022-2024');
    if (!container) {
      console.error('Container element #slope-chart-category-volumes-2022-2024 not found');
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

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.year2022, d.year2024))])
      .range([innerHeight, 0])
      .nice();

    data.sort((a, b) => b.year2022 - a.year2022);

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
      .city-label { font-family: inherit; font-size: 12px; fill: #034737; cursor: pointer; transition: opacity 0.2s ease; }
      .value-label { font-family: inherit; font-size: 12px; fill: #034737; transition: opacity 0.2s ease; }
      .percent-label { font-family: inherit; font-size: 12px; transition: opacity 0.2s ease; }
      .percent-label.increase { fill: #034737; }
      .percent-label.decrease { fill: #FB8500; }
      .year-label { font-family: inherit; font-size: 14px; font-weight: bold; fill: #034737; pointer-events: none; }
      .label-line { stroke: rgba(3, 71, 55, 0.4); stroke-width: 1; stroke-dasharray: 2,2; pointer-events: none; transition: opacity 0.2s ease; fill: none; }
    `;

    if (!document.getElementById('defence-slope-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'defence-slope-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    g.append("line")
      .attr("class", "vertical-guide")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -10)
      .attr("y2", innerHeight);

    g.append("line")
      .attr("class", "vertical-guide")
      .attr("x1", innerWidth)
      .attr("x2", innerWidth)
      .attr("y1", -10)
      .attr("y2", innerHeight);

    const categoryGroups = g.selectAll(".slope-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "slope-group")
      .attr("data-category", d => d.category);

    categoryGroups.append("line")
      .attr("class", d => `slope-line ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => yScale(d.year2022))
      .attr("y2", d => yScale(d.year2024));

    categoryGroups.append("line")
      .attr("class", "hover-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", d => yScale(d.year2022))
      .attr("y2", d => yScale(d.year2024));

    categoryGroups.append("circle")
      .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
      .attr("cx", 0)
      .attr("cy", d => yScale(d.year2022))
      .attr("r", 3);

    categoryGroups.append("circle")
      .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
      .attr("cx", innerWidth)
      .attr("cy", d => yScale(d.year2024))
      .attr("r", 3);

    const leftLabels = data.map(d => ({
      x: -10,
      y: yScale(d.year2022),
      text: `${d.category} - ${formatNumber(d.year2022)}`,
      originalY: yScale(d.year2022),
      category: d.category
    }));

    const rightLabels = data.map(d => ({
      x: innerWidth + 10,
      y: yScale(d.year2024),
      text: formatNumber(d.year2024),
      originalY: yScale(d.year2024),
      category: d.category,
      percentChange: d.percentChange
    }));

    const leftSimulation = d3.forceSimulation(leftLabels)
      .force("y", d3.forceY(d => d.originalY).strength(0.1))
      .force("collide", d3.forceCollide(15))
      .stop();

    const rightSimulation = d3.forceSimulation(rightLabels)
      .force("y", d3.forceY(d => d.originalY).strength(0.1))
      .force("collide", d3.forceCollide(15))
      .stop();

    for (let i = 0; i < 300; i++) {
      leftSimulation.tick();
      rightSimulation.tick();
    }

    categoryGroups.each(function(d) {
      const group = d3.select(this);
      const leftLabel = leftLabels.find(l => l.category === d.category);
      const rightLabel = rightLabels.find(l => l.category === d.category);

      if (Math.abs(leftLabel.y - yScale(d.year2022)) > 1) {
        group.append("path")
          .attr("class", "label-line")
          .attr("d", `
            M 0 ${yScale(d.year2022)}
            L ${-10} ${leftLabel.y}
          `);
      }

      if (Math.abs(rightLabel.y - yScale(d.year2024)) > 1) {
        group.append("path")
          .attr("class", "label-line")
          .attr("d", `
            M ${innerWidth} ${yScale(d.year2024)}
            L ${innerWidth + 10} ${rightLabel.y}
          `);
      }
    });

    categoryGroups.append("text")
      .attr("class", "city-label")
      .attr("x", d => {
        const label = leftLabels.find(l => l.category === d.category);
        return label.x;
      })
      .attr("y", d => {
        const label = leftLabels.find(l => l.category === d.category);
        return label.y;
      })
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .text(d => `${d.category} - ${formatNumber(d.year2022)}`);

    categoryGroups.append("text")
      .attr("class", "value-label")
      .attr("x", d => {
        const label = rightLabels.find(l => l.category === d.category);
        return label.x;
      })
      .attr("y", d => {
        const label = rightLabels.find(l => l.category === d.category);
        return label.y;
      })
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .text(d => formatNumber(d.year2024));

    categoryGroups.append("text")
      .attr("class", d => `percent-label ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
      .attr("x", innerWidth + 80)
      .attr("y", d => {
        const label = rightLabels.find(l => l.category === d.category);
        return label.y;
      })
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .text(d => (d.percentChange > 0 ? '+' : '') + d.percentChange + '%');

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

    categoryGroups
      .on("mouseenter", function(event, d) {
        const selectedCategory = d.category;
        categoryGroups
          .filter(d => d.category !== selectedCategory)
          .style("opacity", 0.2);
      })
      .on("mouseleave", function(event, d) {
        categoryGroups.style("opacity", 1);
      });
  }
})();
