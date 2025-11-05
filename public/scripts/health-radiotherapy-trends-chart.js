(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeHeatmap() {
        // CSS Styles
        const styles = `
            .heatmap-rect {
                stroke: #fff;
                stroke-width: 1px;
                transition: opacity 0.2s ease;
            }
            .heatmap-rect:hover {
                opacity: 0.8;
            }
            .axis text {
                font-family: inherit;
                font-size: 12px;
                fill: #034737;
            }
            .axis line, .axis path {
                stroke: rgba(3, 71, 55, 0.2);
            }
            .tooltip {
                position: absolute;
                padding: 8px;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #ccc;
                border-radius: 4px;
                pointer-events: none;
                font-family: inherit;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 1000;
            }
        `;

        // Add styles to page
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        const data = [
            { category: "Medical consumables", values: [3220185660.12, 4221738843.84, 4604439582.1, 2949268447.62, 5983220924.475, 4438168503.24, 3827229615.6, 4178769477.725, 5260136475.24, 1470386071.68, 3106515383.37, 2676386914.635] },
            { category: "Various medicinal products", values: [1603335495.735, 3761855482.92, 5438516054.44, 4111443337.495, 5516072168.4, 5483310090.45, 4054701215.07, 5284991381.25, 4293698529.92, 576691556.48, 2090828287.8, 1968424191.825] },
            { category: "Misc medical devices and products", values: [907086944.52, 1091723811.66, 1698211298.94, 1412045441.24, 1907294201.4, 1578611719.17, 991503424.8, 1536932453.07, 1431685704.155, 1253329295.18, 826732182.44, 488680812.34] },
            { category: "Operating techniques", values: [183515525.64, 650079871.35, 575467825.68, 512561036.04, 354613248, 494003499.39, 404187438.05, 371543270.28, 413410640.4, 191163323.65, 1487212535.535, 223498751.04] },
            { category: "Anti-infectives for systemic use", values: [945431929.26, 1057029480, 1688094002.91, 682700794.38, 1203242990.4, 920340280.365, 601519473.75, 575794167.38, 1092739733.76, 1037678246.325, 934935199.5, 596041940.88] },
            { category: "Functional support", values: [363620259.775, 635908416.85, 671760000, 856282209.325, 904343723.775, 963494618.03, 907469554.95, 905506783.98, 864969011.1, 144839142.75, 596619002.56, 1799204916.3] },
            { category: "Imaging equipment", values: [245674769.85, 943488000, 919828147.695, 796528979.62, 505810982.17, 583991769.6, 589460504.475, 610804254.2, 644670362.385, 71307981.07, 635303020.85, 456848737.29] },
            { category: "Radio, mechano, electro therapy", values: [97487300.9, 247918005.01, 163395048.39, 201122321.54, 206154192.25, 105484775.08, 219814559.58, 313236801.37, 237599762.4, 33216497.565, 203815648.85, 86453109.65] },
            { category: "Recording and exploration devices", values: [130597719.96, 195460752.27, 384818688, 183682224.22, 120437466.72, 169279883.66, 124475574.6, 154242588.18, 147809178, 20610537.35, 129269109.04, 124740000] },
            { category: "Products for the nervous system etc", values: [56928071.55, 452520325.18, 426002537.76, 153865001.52, 286079344.86, 377070586.24, 261876809.52, 568815187.98, 182697011.86, 122622785.225, 202335701.7, 56217008.365] }
        ];

        const quarters = ["Q1' 2022", "Q2' 2022", "Q3' 2022", "Q4' 2022", "Q1' 2023", "Q2' 2023", "Q3' 2023", "Q4' 2023", "Q1' 2024", "Q2' 2024", "Q3' 2024", "Q4' 2024"];

        // Get container width
        const container = document.getElementById('health-radiotherapy-trends');
        if (!container) {
            console.error('Container not found');
            return;
        }

        const containerWidth = container.offsetWidth;

        // Set dimensions based on container
        const width = containerWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 50, bottom: 100, left: 200 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select(container).selectAll("svg").remove();

        // Create new SVG
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
            .attr("class", "tooltip");

        const xScale = d3.scaleBand()
            .domain(quarters)
            .range([0, innerWidth])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerHeight])
            .padding(0.05);

        const color = d3.scaleSequential(d3.interpolate)
            .domain([d3.min(data, d => d3.min(d.values)), d3.max(data, d => d3.max(d.values))])
            .interpolator(d3.interpolateRgbBasis(["#f0fff4", "#034737"]));

        g.selectAll()
            .data(data)
            .enter()
            .selectAll()
            .data(d => d.values.map((v, i) => ({ category: d.category, quarter: quarters[i], value: v })))
            .enter()
            .append("rect")
            .attr("class", "heatmap-rect")
            .attr("x", d => xScale(d.quarter))
            .attr("y", d => yScale(d.category))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => color(d.value))
            .on("mouseenter", function(event, d) {
                tooltip.style("opacity", 1)
                    .html(`Quarter: ${d.quarter}<br>Category: ${d.category}<br>Value: ${d3.format("$,.2f")(d.value)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function() {
                tooltip.style("opacity", 0);
            });

        g.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .call(d3.axisLeft(yScale));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHeatmap);
    } else {
        initializeHeatmap();
    }
})();
