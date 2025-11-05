(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        // CSS Styles
        const styles = `
            .bar-total {
                fill: #a9ff9b;
                transition: opacity 0.2s ease;
            }

            .bar-subset {
                fill: #034737;
                transition: opacity 0.2s ease;
            }

            .hover-area {
                fill: transparent;
                pointer-events: all;
                cursor: pointer;
            }

            .value-label {
                font-family: inherit;
                font-size: 12px;
                fill: #034737;
                transition: opacity 0.2s ease;
            }

            .subset-label {
                font-family: inherit;
                font-size: 12px;
                fill: #666666;
                transition: opacity 0.2s ease;
            }

            .axis text {
                font-family: inherit;
                font-size: 12px;
                fill: #034737;
            }

            .axis line, .axis path {
                stroke: rgba(3, 71, 55, 0.2);
            }

            .grid line {
                stroke: rgba(3, 71, 55, 0.1);
                stroke-dasharray: 2,2;
            }

            .grid path {
                stroke-width: 0;
            }

            .tooltip {
                position: absolute;
                padding: 8px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #ccc;
                border-radius: 4px;
                pointer-events: none;
                font-family: inherit;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
        `;

        // Add styles to page
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Data
        const data = [
            { continent: "Europe", total: 163807, subset: 87413 },
            { continent: "South America", total: 76576, subset: 34604 },
            { continent: "Asia", total: 19399, subset: 7047 },
            { continent: "North America", total: 9403, subset: 4123 },
            { continent: "Africa", total: 1452, subset: 735 },
            { continent: "Central America", total: 389, subset: 352 },
            { continent: "Oceania", total: 93, subset: 38 }
        ];

        // Sort data by total value descending
        data.sort((a, b) => b.total - a.total);

        // Get container width
        const container = document.getElementById('health-geographic-distribution');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;

        // Set dimensions
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 20, bottom: 20, left: 120 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select(container).selectAll("svg").remove();

        // Create SVG
        const svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Create chart group
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        // Set up scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total) * 1.1])
            .range([0, innerWidth]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.continent))
            .range([0, innerHeight])
            .padding(0.3);

        // Add grid lines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisTop(xScale)
                .tickSize(-innerHeight)
                .tickFormat(""));

        // Create bar groups
        const barGroups = g.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(0,${yScale(d.continent)})`);

        // Add total bars (background)
        barGroups.append("rect")
            .attr("class", "bar-total")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => xScale(d.total))
            .attr("height", yScale.bandwidth());

        // Add subset bars (foreground)
        barGroups.append("rect")
            .attr("class", "bar-subset")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => xScale(d.subset))
            .attr("height", yScale.bandwidth());

        // Add hover areas
        barGroups.append("rect")
            .attr("class", "hover-area")
            .attr("x", 0)
            .attr("y", -yScale.bandwidth() * 0.1)
            .attr("width", innerWidth)
            .attr("height", yScale.bandwidth() * 1.2)
            .on("mouseenter", function(event, d) {
                const group = d3.select(this.parentNode);

                // Highlight current bars
                group.select(".bar-total")
                    .style("opacity", 0.8);
                group.select(".bar-subset")
                    .style("opacity", 1);

                // Fade other bars
                barGroups.filter(bd => bd !== d)
                    .style("opacity", 0.3);

                // Show tooltip
                tooltip.style("opacity", 1)
                    .html(`${d.continent}<br>2024: ${d.subset.toLocaleString()}<br>Previous: ${(d.total - d.subset).toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function() {
                // Reset bars
                barGroups.style("opacity", 1)
                    .selectAll(".bar-total, .bar-subset")
                    .style("opacity", 1);

                // Hide tooltip
                tooltip.style("opacity", 0);
            });

        // Add remaining value labels
        barGroups.append("text")
            .attr("class", "value-label")
            .attr("x", d => {
                // If the total is small, position label further right
                const minSpace = 60; // Minimum space needed between labels
                const subsetEnd = xScale(d.subset);
                const totalEnd = xScale(d.total);
                const defaultPosition = totalEnd + 5;

                // If there's not enough space between subset and total labels
                if ((totalEnd - subsetEnd) < minSpace) {
                    return Math.max(subsetEnd + minSpace, defaultPosition);
                }
                return defaultPosition;
            })
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("fill", "#666666")
            .text(d => (d.total - d.subset).toLocaleString());

        // Add subset value labels
        barGroups.append("text")
            .attr("class", "subset-label")
            .attr("x", d => xScale(d.subset) + 5)
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("fill", "#034737")
            .text(d => d.subset.toLocaleString());

        // Add y-axis
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("text-anchor", "end");

        // Add x-axis
        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .ticks(5)
                .tickFormat(d => d.toLocaleString()));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
