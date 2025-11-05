(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function createHeatmap() {
        // Add styles
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
                font-size: 14px;
                fill: #034737;
            }
            .axis line, .axis path {
                stroke: rgba(3, 71, 55, 0.2);
            }
            .heatmap-tooltip {
                position: absolute;
                padding: 8px;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #ccc;
                border-radius: 4px;
                pointer-events: none;
                font-family: inherit;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 1000;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        const container = document.getElementById('health-demand-heatmap');
        if (!container) {
            console.error('Heatmap container not found');
            return;
        }

        // Clear any existing content
        container.innerHTML = '';

        // Data setup
        const data = [
            { category: "Medical consumables", values: [89580, 47919, 28959, 11829, 128533, 54452, 32713, 11807, 135642, 47977, 27988, 10933] },
            { category: "Various medicinal products", values: [48047, 54452, 32713, 11807, 54452, 47977, 32713, 11807, 47977, 47977, 27988, 10933] },
            { category: "Miscellaneous medical devices", values: [28977, 32713, 27988, 10933, 32713, 27988, 27988, 10933, 27988, 27988, 27988, 10933] },
            { category: "Operating techniques", values: [11820, 11807, 10933, 10339, 11807, 10933, 10933, 10339, 10933, 10933, 10933, 10339] },
            { category: "General anti-infectives", values: [11598, 10489, 9629, 9893, 10537, 9629, 9893, 9893, 9629, 9629, 9893, 9893] }
        ];

        const quarters = ["Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23", "Q1'24", "Q2'24", "Q3'24", "Q4'24"];

        // Add tooltip div
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "heatmap-tooltip");

        // Calculate percentages
        const processedData = data.map(category => ({
            category: category.category,
            values: category.values.map((value, index) => {
                const quarterTotal = data.reduce((sum, cat) => sum + cat.values[index], 0);
                return (value / quarterTotal) * 100;
            })
        }));

        // Set up dimensions
        const width = container.offsetWidth;
        const height = container.offsetHeight || 500;
        const margin = { top: 50, right: 30, bottom: 50, left: 200 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(quarters)
            .range([0, innerWidth])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(processedData.map(d => d.category))
            .range([0, innerHeight])
            .padding(0.05);

        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(processedData, d => d3.max(d.values))])
            .interpolator(d3.interpolateRgbBasis(['#f0fff4', '#034737']));

        // Create cells with interactivity
        processedData.forEach(row => {
            row.values.forEach((value, i) => {
                svg.append('rect')
                    .attr('class', 'heatmap-rect')
                    .attr('x', xScale(quarters[i]))
                    .attr('y', yScale(row.category))
                    .attr('width', xScale.bandwidth())
                    .attr('height', yScale.bandwidth())
                    .attr('fill', colorScale(value))
                    .on('mouseenter', function(event) {
                        tooltip.style('opacity', 1)
                            .html(`Quarter: ${quarters[i]}<br>Category: ${row.category}<br>Share: ${value.toFixed(1)}%<br>Volume: ${data.find(d => d.category === row.category).values[i].toLocaleString()} opportunities`)
                            .style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    })
                    .on('mousemove', function(event) {
                        tooltip.style('left', (event.pageX + 10) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    })
                    .on('mouseleave', function() {
                        tooltip.style('opacity', 0);
                    });
            });
        });

        // Add axes with larger text
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'middle')
            .attr('dy', '1em');

        svg.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .attr('dy', '0.32em');
    }

    // Try to create the heatmap when D3 is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHeatmap);
    } else {
        createHeatmap();
    }
})();
