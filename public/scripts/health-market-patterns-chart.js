(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        const data = [
            {
                year: 2022,
                "Medical Consumables": 15.52,
                "Various Med Products": 15.55,
                "Imaging Equipment": 2.79,
                "Misc Medical Devices": 5.07,
                "Operating Techniques": 1.87,
                "Functional Support": 2.67,
                "Anti-infectives": 3.96,
                "Other": 5.54
            },
            {
                year: 2023,
                "Medical Consumables": 19.05,
                "Various Med Products": 19.36,
                "Imaging Equipment": 2.26,
                "Misc Medical Devices": 6.07,
                "Operating Techniques": 1.66,
                "Functional Support": 3.72,
                "Anti-infectives": 3.33,
                "Other": 5.54
            },
            {
                year: 2024,
                "Medical Consumables": 14.40,
                "Various Med Products": 12.13,
                "Imaging Equipment": 2.04,
                "Misc Medical Devices": 3.49,
                "Operating Techniques": 1.23,
                "Functional Support": 3.72,
                "Anti-infectives": 3.29,
                "Other": 6.44
            }
        ];

        const categories = Object.keys(data[0]).filter(d => d !== 'year');
        const colors = ["#034737", "#0D6986", "#219EBC", "#FFB703", "#FB8500", "#a9ff9b", "#034737", "#0D6986"];

        const margin = {top: 50, right: 50, bottom: 120, left: 60};
        const container = document.getElementById('health-market-patterns');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("padding", "8px")
            .style("background", "rgba(255, 255, 255, 0.9)")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .style("opacity", 0);

        const stack = d3.stack().keys(categories);
        const stackedData = stack(data);

        const xScale = d3.scalePoint()
            .domain(data.map(d => d.year))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, 70])
            .range([innerHeight, 0]);

        const area = d3.area()
            .x(d => xScale(d.data.year))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))
            .curve(d3.curveMonotoneX);

        svg.append("g")
            .attr("class", "grid")
            .style("opacity", 0.1)
            .call(d3.axisLeft(yScale)
                .tickSize(-innerWidth)
                .tickFormat("")
            );

        const layers = svg.selectAll(".area")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "layer");

        layers.append("path")
            .attr("class", "area")
            .style("fill", (d, i) => colors[i])
            .style("transition", "all 0.3s ease")
            .attr("d", area);

        // Add interactive hover areas
        layers.append("path")
            .attr("class", "hover-area")
            .style("fill", "transparent")
            .style("pointer-events", "all")
            .attr("d", area)
            .on("mouseover", function(event, d) {
                const category = d.key;

                // Dim all areas
                d3.selectAll(".area").style("opacity", 0.2);

                // Highlight current area
                d3.select(this.parentNode).select(".area").style("opacity", 1);

                // Update legend
                d3.selectAll(".legend-item")
                    .style("opacity", function(item) {
                        return item.key === category ? 1 : 0.2;
                    });

                const mouseX = d3.pointer(event)[0];
                const year = data[Math.round((mouseX / innerWidth) * (data.length - 1))].year;
                const yearData = data.find(item => item.year === year);
                const value = yearData[d.key];

                tooltip.style("opacity", 1)
                    .html(`${d.key}<br>${year}: $${value.toFixed(2)}B`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                // Reset all areas and legend
                d3.selectAll(".area, .legend-item").style("opacity", 1);
                tooltip.style("opacity", 0);
            });

        svg.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.format("d")));

        svg.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .call(d3.axisLeft(yScale)
                .tickFormat(d => `$${d}B`));

        svg.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("fill", "#034737")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Healthcare Market Value Composition (2022-2024)");

        // Interactive legend at the bottom (split into two rows)
        const legend = svg.append("g")
            .attr("class", "legend")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight + 40})`);

        const legendItems = legend.selectAll(".legend-item")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => {
                // Split legend into two rows
                const row = i < 4 ? 0 : 1;
                const col = i < 4 ? i : i - 4;
                return `translate(${col * 150}, ${row * 20})`;
            })
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                // Dim all areas
                d3.selectAll(".area").style("opacity", 0.2);
                // Highlight associated area
                d3.selectAll(".area").filter(a => a.key === d.key).style("opacity", 1);
                // Dim other legend items
                d3.selectAll(".legend-item").style("opacity", function(item) {
                    return item.key === d.key ? 1 : 0.2;
                });
            })
            .on("mouseout", function() {
                // Reset all
                d3.selectAll(".area, .legend-item").style("opacity", 1);
            });

        legendItems.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", (d, i) => colors[i]);

        legendItems.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d => d.key);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
