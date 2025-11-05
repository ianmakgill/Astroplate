(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        // CSS Styles
        const styles = `
            .bar {
                fill: #034737;
                transition: opacity 0.2s ease;
            }

            .bar:hover {
                fill: #FB8500;
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
            { category: "Baby care products", duration: 24 },
            { category: "Medicinal products for dermatology", duration: 20 },
            { category: "Cadaver transport and storage", duration: 40 },
            { category: "Clinical forensics equipment", duration: 33 },
            { category: "Anaesthesia and resuscitation", duration: 9 },
            { category: "Medical consumables", duration: 32 },
            { category: "Functional support", duration: 27 },
            { category: "General anti-infectives", duration: 28 },
            { category: "Miscellaneous medical devices", duration: 29 },
            { category: "Eye care products", duration: 31 },
            { category: "Recording systems", duration: 15 },
            { category: "Imaging equipment", duration: 23 },
            { category: "Various medicinal products", duration: 30 }
        ];

        // Sort data by duration
        data.sort((a, b) => b.duration - a.duration);

        // Get container width
        const container = document.getElementById('health-contract-durations');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;

        // Set dimensions
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 60, bottom: 100, left: 200 };
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
            .domain([0, d3.max(data, d => d.duration) * 1.1])
            .range([0, innerWidth]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.category))
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
            .attr("transform", d => `translate(0,${yScale(d.category)})`);

        // Add bars
        barGroups.append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => xScale(d.duration))
            .attr("height", yScale.bandwidth());

        // Add value labels
        barGroups.append("text")
            .attr("class", "value-label")
            .attr("x", d => xScale(d.duration) + 5)
            .attr("y", yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => `${d.duration} months`);

        // Add hover areas
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

        // Add y-axis
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale))
            .select(".domain").remove();

        // Add x-axis
        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .ticks(5)
                .tickFormat(d => `${d} months`));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
