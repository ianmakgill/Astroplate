(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        const data = [
            { category: "Baby care", year2022: 40.8, year2024: 24.0 },
            { category: "Clin. forensics", year2022: 36.0, year2024: 32.8 },
            { category: "Anaesthesia", year2022: 34.3, year2024: 8.8 },
            { category: "Cadaver trans.", year2022: 31.0, year2024: 40.2 },
            { category: "Med. consumables", year2022: 29.4, year2024: 31.9 },
            { category: "Recording sys.", year2022: 24.8, year2024: 16.1 },
            { category: "Eye care", year2022: 24.3, year2024: 30.8 },
            { category: "Med. products", year2022: 23.4, year2024: 29.5 }
        ];

        // Add percent change calculation
        data.forEach(d => {
            d.percentChange = ((d.year2024 - d.year2022) / d.year2022 * 100).toFixed(1);
        });

        const container = document.getElementById('health-framework-patterns');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const width = container.offsetWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 200, bottom: 40, left: 200 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select(container).selectAll("svg").remove();

        const svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scale for y-axis (months)
        const yScale = d3.scaleLinear()
            .domain([0, Math.max(d3.max(data, d => d.year2022), d3.max(data, d => d.year2024))])
            .range([innerHeight, 0])
            .nice();

        // Add vertical guides
        g.append("line")
            .attr("class", "vertical-guide")
            .style("stroke", "rgba(3, 71, 55, 0.2)")
            .style("stroke-width", "1")
            .style("stroke-dasharray", "4,4")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", innerHeight);

        g.append("line")
            .attr("class", "vertical-guide")
            .style("stroke", "rgba(3, 71, 55, 0.2)")
            .style("stroke-width", "1")
            .style("stroke-dasharray", "4,4")
            .attr("x1", innerWidth)
            .attr("x2", innerWidth)
            .attr("y1", 0)
            .attr("y2", innerHeight);

        // Year labels
        g.append("text")
            .attr("class", "year-label")
            .style("font-family", "inherit")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "#034737")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .text("2022");

        g.append("text")
            .attr("class", "year-label")
            .style("font-family", "inherit")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "#034737")
            .attr("x", innerWidth)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .text("2024");

        // Create groups for each category
        const categoryGroups = g.selectAll(".slope-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "slope-group");

        // Draw lines
        categoryGroups.append("line")
            .attr("class", d => `slope-line ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("stroke", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
            .style("stroke-width", "1.5")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d.year2022))
            .attr("y2", d => yScale(d.year2024));

        // Add points
        categoryGroups.append("circle")
            .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
            .attr("cx", 0)
            .attr("cy", d => yScale(d.year2022))
            .attr("r", 4);

        categoryGroups.append("circle")
            .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
            .attr("cx", innerWidth)
            .attr("cy", d => yScale(d.year2024))
            .attr("r", 4);

        // Function to prevent label overlap
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

        // Add left labels (2022) with adjusted positions
        data.forEach((d, i) => {
            const labelY = getLabelY(d.year2022, i, data.map(d => d.year2022));
            categoryGroups.filter(dd => dd === d)
                .append("text")
                .attr("class", "left-label")
                .style("font-family", "inherit")
                .style("font-size", "12px")
                .style("fill", "#034737")
                .style("cursor", "pointer")
                .attr("x", -10)
                .attr("y", labelY)
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .text(`${d.category} (${d.year2022})`);
        });

        // Add right labels (2024) with adjusted positions
        data.forEach((d, i) => {
            const labelY = getLabelY(d.year2024, i, data.map(d => d.year2024));
            categoryGroups.filter(dd => dd === d)
                .append("text")
                .attr("class", "right-label")
                .style("font-family", "inherit")
                .style("font-size", "12px")
                .style("fill", "#034737")
                .attr("x", innerWidth + 10)
                .attr("y", labelY)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .text(`${d.year2024} months`);

            // Add percent change labels
            categoryGroups.filter(dd => dd === d)
                .append("text")
                .attr("class", d => `value-change ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
                .style("font-family", "inherit")
                .style("font-size", "12px")
                .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
                .attr("x", innerWidth + 90)
                .attr("y", labelY)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .text(d => `${d.percentChange > 0 ? '+' : ''}${d.percentChange}%`);
        });

        // Add hover interaction
        categoryGroups
            .on("mouseenter", function(event, d) {
                const selectedCategory = d.category;
                categoryGroups.style("opacity", g => g.category === selectedCategory ? 1 : 0.2);
            })
            .on("mouseleave", function() {
                categoryGroups.style("opacity", 1);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
