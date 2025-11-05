(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        const data = [
            { quarter: "Q1 2022", barValue: 15447272475, lineValue: 89580 },
            { quarter: "Q2 2022", barValue: 14289909591, lineValue: 47919 },
            { quarter: "Q3 2022", barValue: 5090229584, lineValue: 28959 },
            { quarter: "Q4 2022", barValue: 4064391725, lineValue: 11829 },
            { quarter: "Q1 2023", barValue: 18968912083, lineValue: 128533 },
            { quarter: "Q2 2023", barValue: 21090107115, lineValue: 54452 },
            { quarter: "Q3 2023", barValue: 6081380407, lineValue: 32713 },
            { quarter: "Q4 2023", barValue: 3430814902, lineValue: 11807 },
            { quarter: "Q1 2024", barValue: 14318932564, lineValue: 135642 }
        ];

        const container = document.getElementById('health-market-value-trends');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;

        // Adjusted margins to prevent y-axis label overlap
        const margin = { top: 50, right: 100, bottom: 50, left: 100 };
        const width = containerWidth;
        const height = container.offsetHeight || 500;
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

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.quarter))
            .range([0, innerWidth])
            .padding(0.4);

        const yScaleBar = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.barValue) * 1.1])
            .range([innerHeight, 0]);

        const yScaleLine = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.lineValue) * 1.1])
            .range([innerHeight, 0]);

        g.append("g")
            .attr("class", "grid")
            .style("opacity", 0.1)
            .call(d3.axisLeft(yScaleBar)
                .tickSize(-innerWidth)
                .tickFormat(""));

        const barGroups = g.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(${xScale(d.quarter)},0)`);

        barGroups.append("rect")
            .attr("class", "bar")
            .style("fill", "#034737")
            .attr("x", 0)
            .attr("y", d => yScaleBar(d.barValue))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScaleBar(d.barValue));

        const lineGenerator = d3.line()
            .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
            .y(d => yScaleLine(d.lineValue))
            .curve(d3.curveMonotoneX);

        const lineGroup = g.append("g")
            .attr("class", "line-group");

        lineGroup.append("path")
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "#FB8500")
            .style("stroke-width", "2.5")
            .attr("d", lineGenerator(data));

        lineGroup.selectAll(".line-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "line-point")
            .style("fill", "#FB8500")
            .style("stroke", "#fff")
            .style("stroke-width", "2")
            .attr("cx", d => xScale(d.quarter) + xScale.bandwidth() / 2)
            .attr("cy", d => yScaleLine(d.lineValue))
            .attr("r", 4);

        barGroups.append("rect")
            .attr("class", "hover-area")
            .attr("x", -xScale.bandwidth() * 0.1)
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 1.2)
            .attr("height", innerHeight)
            .style("fill", "transparent")
            .style("pointer-events", "all")
            .on("mouseenter", function(event, d) {
                d3.select(this.parentNode).select(".bar")
                    .style("fill", "#0D6986");

                barGroups.filter(bd => bd !== d)
                    .style("opacity", 0.2);
                lineGroup.style("opacity", 0.2);

                tooltip.style("opacity", 1)
                    .html(`${d.quarter}<br>Value: $${(d.barValue/1000000000).toFixed(2)}B<br>Volume: ${d.lineValue.toLocaleString()} opportunities`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function() {
                barGroups.style("opacity", 1)
                    .selectAll(".bar")
                    .style("fill", "#034737");
                lineGroup.style("opacity", 1);

                tooltip.style("opacity", 0);
            });

        // Updated x-axis with horizontal labels
        g.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", "0")
            .attr("dy", "1em");

        // Left y-axis with more space for labels
        g.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .call(d3.axisLeft(yScaleBar)
                .ticks(5)
                .tickFormat(d => `$${(d/1000000000).toFixed(1)}B`));

        // Right y-axis with more space
        g.append("g")
            .attr("class", "axis y-axis-line")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .attr("transform", `translate(${innerWidth},0)`)
            .call(d3.axisRight(yScaleLine)
                .ticks(5)
                .tickFormat(d => d.toLocaleString()));

        // Updated y-axis labels position
        svg.append("text")
            .attr("class", "axis-label")
            .style("font-size", "12px")
            .style("fill", "#034737")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left/3)
            .attr("x", -height/2)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Value (USD)");

        svg.append("text")
            .attr("class", "axis-label")
            .style("font-size", "12px")
            .style("fill", "#034737")
            .attr("transform", "rotate(-90)")
            .attr("y", width - margin.right/3)
            .attr("x", -height/2)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Number of Opportunities");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
