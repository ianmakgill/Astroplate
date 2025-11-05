(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        const data = [
            {
                category: "Medical Consumables",
                metrics: [
                    {name: "Opportunities", change: ((137759-89567)/89567*100).toFixed(1)},
                    {name: "Value", change: ((19048196481-15515784698)/15515784698*100).toFixed(1)},
                    {name: "Duration", change: ((31.9-23.3)/23.3*100).toFixed(1)}
                ]
            },
            {
                category: "Various Medicinal Products",
                metrics: [
                    {name: "Opportunities", change: ((48518-48047)/48047*100).toFixed(1)},
                    {name: "Value", change: ((12134543450-19359680695)/19359680695*100).toFixed(1)},
                    {name: "Duration", change: ((29.5-18.8)/18.8*100).toFixed(1)}
                ]
            },
            {
                category: "Imaging Equipment",
                metrics: [
                    {name: "Opportunities", change: ((9883-11522)/11522*100).toFixed(1)},
                    {name: "Value", change: ((2039790707-2790650190)/2790650190*100).toFixed(1)},
                    {name: "Duration", change: 0}
                ]
            },
            {
                category: "Functional Support",
                metrics: [
                    {name: "Opportunities", change: ((10363-9579)/9579*100).toFixed(1)},
                    {name: "Value", change: ((3718658607-2666746808)/2666746808*100).toFixed(1)},
                    {name: "Duration", change: ((26.6-27.8)/27.8*100).toFixed(1)}
                ]
            },
            {
                category: "Misc Medical Devices",
                metrics: [
                    {name: "Opportunities", change: ((28177-28977)/28977*100).toFixed(1)},
                    {name: "Value", change: ((3492370734-5073308103)/5073308103*100).toFixed(1)},
                    {name: "Duration", change: ((28.9-25.7)/25.7*100).toFixed(1)}
                ]
            },
            {
                category: "Anti-infectives & Vaccines",
                metrics: [
                    {name: "Opportunities", change: ((9708-11598)/11598*100).toFixed(1)},
                    {name: "Value", change: ((3290370347-3961321373)/3961321373*100).toFixed(1)},
                    {name: "Duration", change: ((27.7-20.6)/20.6*100).toFixed(1)}
                ]
            },
            {
                category: "Operating Techniques",
                metrics: [
                    {name: "Opportunities", change: ((11060-11820)/11820*100).toFixed(1)},
                    {name: "Value", change: ((1232073143-1871996400)/1871996400*100).toFixed(1)},
                    {name: "Duration", change: 0}
                ]
            },
            {
                category: "Recording Systems",
                metrics: [
                    {name: "Opportunities", change: ((3628-4338)/4338*100).toFixed(1)},
                    {name: "Value", change: ((473474708-857964438)/857964438*100).toFixed(1)},
                    {name: "Duration", change: ((25.2-24.8)/24.8*100).toFixed(1)}
                ]
            }
        ];

        // Set up dimensions
        const margin = {top: 50, right: 50, bottom: 100, left: 200};
        const container = document.getElementById('health-duration-changes');
        if (!container) {
            console.error('Container not found');
            return;
        }

        let width = container.offsetWidth;
        let height = container.offsetHeight || 500;

        // Create SVG
        const svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Set up scales
        const categories = data.map(d => d.category);
        const groupScale = d3.scaleBand()
            .domain(categories)
            .range([0, innerHeight])
            .padding(0.2);

        const metricScale = d3.scaleBand()
            .domain(["Opportunities", "Value", "Duration"])
            .range([0, groupScale.bandwidth()])
            .padding(0.05);

        const xScale = d3.scaleLinear()
            .domain([-50, 70])
            .range([0, innerWidth]);

        // Color scheme
        const colorScale = d3.scaleOrdinal()
            .domain(["Opportunities", "Value", "Duration"])
            .range(["#034737", "#a9ff9b", "#FB8500"]);

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(groupScale))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("font-size", "11px");

        // Add X axis
        svg.append("g")
            .attr("class", "axis")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d => d + "%"));

        // Add bars
        const bars = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(0,${groupScale(d.category)})`);

        bars.selectAll("rect")
            .data(d => d.metrics)
            .enter()
            .append("rect")
            .attr("y", d => metricScale(d.name))
            .attr("x", d => xScale(Math.min(0, d.change)))
            .attr("height", metricScale.bandwidth())
            .attr("width", d => Math.abs(xScale(d.change) - xScale(0)))
            .attr("fill", d => colorScale(d.name));

        // Add value labels
        bars.selectAll("text")
            .data(d => d.metrics)
            .enter()
            .append("text")
            .attr("x", d => d.change >= 0 ? xScale(d.change) + 5 : xScale(d.change) - 5)
            .attr("y", d => metricScale(d.name) + metricScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.change >= 0 ? "start" : "end")
            .style("font-size", "10px")
            .text(d => `${d.change}%`);

        // Add title
        svg.append("text")
            .attr("class", "title")
            .style("font-size", "12px")
            .style("fill", "#034737")
            .attr("x", innerWidth / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .text("Total Changes 2022-2024 by Category and Metric");

        // Add legend at the bottom
        const legend = svg.append("g")
            .attr("class", "legend")
            .style("font-size", "12px")
            .attr("transform", `translate(0,${innerHeight + 40})`);

        const legendItems = legend.selectAll(".legend-item")
            .data(["Opportunities", "Value", "Duration"])
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(${i * 120}, 0)`);

        legendItems.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => colorScale(d));

        legendItems.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(d => d);

        // Add X axis label
        svg.append("text")
            .attr("class", "axis-label")
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 80)
            .text("Percent Change");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
