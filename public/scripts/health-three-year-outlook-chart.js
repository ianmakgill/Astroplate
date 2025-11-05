(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        // CSS Styles
        const styles = `
            .data-point {
                stroke: #fff;
                stroke-width: 2;
                cursor: pointer;
                transition: opacity 0.3s ease;
            }

            .faded {
                opacity: 0.2;
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

            .value-label {
                font-family: inherit;
                font-size: 12px;
                fill: #034737;
                transition: opacity 0.3s ease;
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

            .legend-item {
                font-family: inherit;
                font-size: 12px;
                cursor: pointer;
            }

            .legend-item:hover {
                opacity: 0.8;
            }

            .trendline {
                stroke-dasharray: 5,5;
                stroke-width: 2;
                opacity: 0.7;
            }
        `;

        // Add styles to page
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Data with multiple series
        const data = [
            {
                name: "Medical consumables",
                color: "#034737",
                values: [
                    { quarter: "Q1 2022", value: 89580 },
                    { quarter: "Q2 2022", value: 47919 },
                    { quarter: "Q3 2022", value: 28959 },
                    { quarter: "Q4 2022", value: 11829 },
                    { quarter: "Q1 2023", value: 128533 },
                    { quarter: "Q2 2023", value: 54452 },
                    { quarter: "Q3 2023", value: 32713 },
                    { quarter: "Q4 2023", value: 11807 },
                    { quarter: "Q1 2024", value: 135642 },
                    { quarter: "Q2 2024", value: 47977 },
                    { quarter: "Q3 2024", value: 27988 },
                    { quarter: "Q4 2024", value: 10933 }
                ]
            },
            {
                name: "Various medicinal products",
                color: "#0D6986",
                values: [
                    { quarter: "Q1 2022", value: 47919 },
                    { quarter: "Q2 2022", value: 54452 },
                    { quarter: "Q3 2022", value: 32713 },
                    { quarter: "Q4 2022", value: 11807 },
                    { quarter: "Q1 2023", value: 54452 },
                    { quarter: "Q2 2023", value: 47977 },
                    { quarter: "Q3 2023", value: 32713 },
                    { quarter: "Q4 2023", value: 11807 },
                    { quarter: "Q1 2024", value: 47977 },
                    { quarter: "Q2 2024", value: 47977 },
                    { quarter: "Q3 2024", value: 27988 },
                    { quarter: "Q4 2024", value: 10933 }
                ]
            },
            {
                name: "Miscellaneous medical devices",
                color: "#219EBC",
                values: [
                    { quarter: "Q1 2022", value: 28959 },
                    { quarter: "Q2 2022", value: 32713 },
                    { quarter: "Q3 2022", value: 27988 },
                    { quarter: "Q4 2022", value: 10933 },
                    { quarter: "Q1 2023", value: 32713 },
                    { quarter: "Q2 2023", value: 27988 },
                    { quarter: "Q3 2023", value: 27988 },
                    { quarter: "Q4 2023", value: 10933 },
                    { quarter: "Q1 2024", value: 27988 },
                    { quarter: "Q2 2024", value: 27988 },
                    { quarter: "Q3 2024", value: 27988 },
                    { quarter: "Q4 2024", value: 10933 }
                ]
            },
            {
                name: "Operating techniques",
                color: "#FFB703",
                values: [
                    { quarter: "Q1 2022", value: 11829 },
                    { quarter: "Q2 2022", value: 11807 },
                    { quarter: "Q3 2022", value: 10933 },
                    { quarter: "Q4 2022", value: 10339 },
                    { quarter: "Q1 2023", value: 11807 },
                    { quarter: "Q2 2023", value: 10933 },
                    { quarter: "Q3 2023", value: 10933 },
                    { quarter: "Q4 2023", value: 10339 },
                    { quarter: "Q1 2024", value: 10933 },
                    { quarter: "Q2 2024", value: 10933 },
                    { quarter: "Q3 2024", value: 10933 },
                    { quarter: "Q4 2024", value: 10339 }
                ]
            },
            {
                name: "Functional support",
                color: "#FB8500",
                values: [
                    { quarter: "Q1 2022", value: 11619 },
                    { quarter: "Q2 2022", value: 10537 },
                    { quarter: "Q3 2022", value: 9629 },
                    { quarter: "Q4 2022", value: 9893 },
                    { quarter: "Q1 2023", value: 10537 },
                    { quarter: "Q2 2023", value: 9629 },
                    { quarter: "Q3 2023", value: 9893 },
                    { quarter: "Q4 2023", value: 9893 },
                    { quarter: "Q1 2024", value: 9629 },
                    { quarter: "Q2 2024", value: 9629 },
                    { quarter: "Q3 2024", value: 9893 },
                    { quarter: "Q4 2024", value: 9893 }
                ]
            }
        ];

        // Get all quarters for x-axis
        const quarters = data[0].values.map(d => d.quarter);

        // Get container width
        const container = document.getElementById('health-three-year-outlook');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;

        // Set dimensions
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 40, bottom: 100, left: 60 };
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

        // Create scales
        const xScale = d3.scaleBand()
            .domain(quarters)
            .range([0, innerWidth])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, series => d3.max(series.values, d => d.value)) * 1.1])
            .range([innerHeight, 0]);

        // Add grid
        g.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1)
            .call(d3.axisLeft(yScale)
                .tickSize(-innerWidth)
                .tickFormat(""));

        // Create line generator
        const lineGenerator = d3.line()
            .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        // Function to calculate linear regression
        function linearRegression(data) {
            const n = data.length;
            const sumX = data.reduce((sum, d, i) => sum + i, 0);
            const sumY = data.reduce((sum, d) => sum + d.value, 0);
            const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
            const sumX2 = data.reduce((sum, d, i) => sum + i * i, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return { slope, intercept };
        }

        // Add lines, points, and trendlines for each series
        data.forEach(series => {
            const group = g.append("g")
                .attr("class", `series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`);

            // Add line
            group.append("path")
                .datum(series.values)
                .attr("class", "data-series")
                .attr("fill", "none")
                .attr("stroke", series.color)
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);

            // Add points
            const points = group.selectAll(".data-point")
                .data(series.values)
                .enter()
                .append("circle")
                .attr("class", "data-point")
                .attr("cx", d => xScale(d.quarter) + xScale.bandwidth() / 2)
                .attr("cy", d => yScale(d.value))
                .attr("r", 5)
                .attr("fill", series.color);

            // Add hover effects
            points.on("mouseenter", function(event, d) {
                // Highlight current series
                d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
                    .style("opacity", 1);

                // Fade other series
                data.forEach(otherSeries => {
                    if (otherSeries.name !== series.name) {
                        d3.selectAll(`.series-group-${otherSeries.name.replace(/\s+/g, '-').toLowerCase()}`)
                            .style("opacity", 0.2);
                    }
                });

                // Show tooltip
                tooltip.style("opacity", 1)
                    .html(`${series.name}<br>${d.quarter}<br>Volume: ${d.value.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function() {
                // Reset all series
                data.forEach(series => {
                    d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
                        .style("opacity", 1);
                });

                // Hide tooltip
                tooltip.style("opacity", 0);
            });

            // Calculate trendline
            const regression = linearRegression(series.values);
            const trendlineData = series.values.map((d, i) => ({
                quarter: d.quarter,
                value: regression.intercept + regression.slope * i
            }));

            // Extend trendline into the future
            const futureQuarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];
            const extendedTrendlineData = [
                ...trendlineData,
                ...futureQuarters.map((quarter, i) => ({
                    quarter,
                    value: regression.intercept + regression.slope * (series.values.length + i)
                }))
            ];

            // Add trendline
            group.append("path")
                .datum(extendedTrendlineData)
                .attr("class", "trendline")
                .attr("fill", "none")
                .attr("stroke", series.color)
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);
        });

        // Add axes
        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "middle");

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale)
                .ticks(5)
                .tickFormat(d => d.toLocaleString()));

        // Add legend at the bottom
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left},${height - margin.bottom + 20})`);

        const legendItems = legend.selectAll(".legend-item")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(${(i % 3) * 200},${Math.floor(i / 3) * 25})`);

        legendItems.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", d => d.color);

        legendItems.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(d => d.name);

        // Add legend interactivity
        legendItems
            .on("mouseenter", function(event, d) {
                // Highlight selected series
                d3.selectAll(`.series-group-${d.name.replace(/\s+/g, '-').toLowerCase()}`)
                    .style("opacity", 1);

                // Fade other series
                data.forEach(series => {
                    if (series.name !== d.name) {
                        d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
                            .style("opacity", 0.2);
                    }
                });
            })
            .on("mouseleave", function() {
                // Reset all series
                data.forEach(series => {
                    d3.selectAll(`.series-group-${series.name.replace(/\s+/g, '-').toLowerCase()}`)
                        .style("opacity", 1);
                });
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
