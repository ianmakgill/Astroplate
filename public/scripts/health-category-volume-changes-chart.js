(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        const data = [
            { category: "Medical consumables", year2022: 89567, year2024: 137759 },
            { category: "Various medicinal products", year2022: 48047, year2024: 48518 },
            { category: "Miscellaneous medical devices", year2022: 28977, year2024: 28177 },
            { category: "Operating techniques", year2022: 11820, year2024: 11060 },
            { category: "General anti-infectives", year2022: 11598, year2024: 9708 }
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

        const container = document.getElementById('health-category-volume-changes');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 180, bottom: 40, left: 250 };
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

        g.append("line")
            .attr("class", "vertical-guide")
            .style("stroke", "rgba(3, 71, 55, 0.2)")
            .style("stroke-width", "1")
            .style("stroke-dasharray", "4,4")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", -10)
            .attr("y2", innerHeight);

        g.append("line")
            .attr("class", "vertical-guide")
            .style("stroke", "rgba(3, 71, 55, 0.2)")
            .style("stroke-width", "1")
            .style("stroke-dasharray", "4,4")
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
            .style("stroke", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
            .style("stroke-width", "1.5")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d.year2022))
            .attr("y2", d => yScale(d.year2024));

        categoryGroups.append("line")
            .attr("class", "hover-line")
            .style("stroke", "transparent")
            .style("stroke-width", "10")
            .style("cursor", "pointer")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d.year2022))
            .attr("y2", d => yScale(d.year2024));

        categoryGroups.append("circle")
            .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
            .attr("cx", 0)
            .attr("cy", d => yScale(d.year2022))
            .attr("r", 3);

        categoryGroups.append("circle")
            .attr("class", d => `endpoint-circle ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
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
                    .style("stroke", "rgba(3, 71, 55, 0.4)")
                    .style("stroke-width", "1")
                    .style("stroke-dasharray", "2,2")
                    .style("fill", "none")
                    .attr("d", `
                        M 0 ${yScale(d.year2022)}
                        L ${-10} ${leftLabel.y}
                    `);
            }

            if (Math.abs(rightLabel.y - yScale(d.year2024)) > 1) {
                group.append("path")
                    .attr("class", "label-line")
                    .style("stroke", "rgba(3, 71, 55, 0.4)")
                    .style("stroke-width", "1")
                    .style("stroke-dasharray", "2,2")
                    .style("fill", "none")
                    .attr("d", `
                        M ${innerWidth} ${yScale(d.year2024)}
                        L ${innerWidth + 10} ${rightLabel.y}
                    `);
            }
        });

        categoryGroups.append("text")
            .attr("class", "city-label")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .style("fill", "#034737")
            .style("cursor", "pointer")
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
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .style("fill", "#034737")
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

        // Add percentage change labels
        categoryGroups.append("text")
            .attr("class", d => `percent-label ${d.year2024 >= d.year2022 ? 'increase' : 'decrease'}`)
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .style("fill", d => d.year2024 >= d.year2022 ? '#034737' : '#FB8500')
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
