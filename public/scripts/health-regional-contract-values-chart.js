(function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded');
        return;
    }

    function initializeChart() {
        // Extended dataset
        const data = [
            {category: "General Anti-infectives & Vaccines", europe: 3338847305, asia: 921863641, namerica: 30056175413},
            {category: "Medical Consumables", europe: 174935737, asia: 54622106, namerica: 387600403},
            {category: "Functional Support", europe: 3212699, asia: 32331170, namerica: 30953314},
            {category: "Imaging Equipment", europe: 9154311, asia: 8148352, namerica: 12025047},
            {category: "Dental/Specialty Instruments", europe: 1536701, asia: 1200000, namerica: 1800000},
            {category: "Anaesthesia & Resuscitation", europe: 158798, asia: 414417, namerica: 1691758},
            {category: "Baby Care Products", europe: 2693692, asia: 1500000, namerica: 2000000},
            {category: "Eye Care Products", europe: 400000, asia: 314264, namerica: 500000},
            {category: "Laboratory Glassware", europe: 590451, asia: 400000, namerica: 600000},
            {category: "Alimentary Tract Medicine", europe: 800000, asia: 700000, namerica: 965239},
            {category: "Cardiovascular Medicine", europe: 2500000, asia: 2000000, namerica: 3000000},
            {category: "Dermatology Products", europe: 1200000, asia: 1000000, namerica: 1500000}
        ];

        // Sort data by maximum value across regions
        data.sort((a, b) => Math.max(b.europe, b.asia, b.namerica) - Math.max(a.europe, a.asia, a.namerica));

        // Set up dimensions
        const margin = {top: 50, right: 50, bottom: 60, left: 200};
        const container = document.getElementById('health-regional-contract-values');
        if (!container) {
            console.error('Container not found');
            return;
        }

        let width = container.offsetWidth;
        let height = container.offsetHeight || 500;
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

        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('padding', '8px')
            .style('background', 'rgba(255, 255, 255, 0.9)')
            .style('border', '1px solid #ccc')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('font-family', 'inherit')
            .style('font-size', '12px')
            .style('opacity', 0)
            .style('box-shadow', '2px 2px 6px rgba(0, 0, 0, 0.1)');

        // Set up scales
        const yScale = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerHeight])
            .padding(0.3);

        const xScale = d3.scaleLog()
            .domain([100000, d3.max(data, d => Math.max(d.europe, d.asia, d.namerica))])
            .range([0, innerWidth]);

        // Add grid lines
        svg.append('g')
            .attr('class', 'grid')
            .style('opacity', 0.1)
            .call(d3.axisTop(xScale)
                .tickSize(-innerHeight)
                .tickFormat(''));

        // Create bar groups for each region
        const regions = ['europe', 'asia', 'namerica'];
        const regionColors = {
            'europe': '#034737',   // Deep Blue
            'asia': '#E6842A',     // Orange
            'namerica': '#a9ff9b'  // Teal
        };
        const regionLabels = {
            'europe': 'Europe',
            'asia': 'Asia',
            'namerica': 'North America'
        };

        regions.forEach((region, i) => {
            const categoryGroup = svg.selectAll(`.category-group-${region}`)
                .data(data)
                .enter()
                .append('g')
                .attr('class', `category-group category-group-${region}`)
                .attr('transform', d => `translate(0,${yScale(d.category) + (i * yScale.bandwidth()/3)})`);

            categoryGroup.append('rect')
                .attr('class', 'bar')
                .style('transition', 'opacity 0.2s ease')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', d => xScale(d[region]))
                .attr('height', yScale.bandwidth()/3)
                .style('fill', regionColors[region]); // Explicitly set fill using style

            categoryGroup.append('rect')
                .attr('class', 'hover-area')
                .style('fill', 'transparent')
                .style('pointer-events', 'all')
                .style('cursor', 'pointer')
                .attr('x', 0)
                .attr('y', -yScale.bandwidth() * 0.05)
                .attr('width', innerWidth)
                .attr('height', yScale.bandwidth()/3 * 1.1)
                .on('mouseenter', function(event, d) {
                    // Fade out all other bars
                    svg.selectAll('.category-group')
                        .style('opacity', 0.3);

                    // Highlight this group
                    d3.select(this.parentNode)
                        .style('opacity', 1);

                    tooltip.style('opacity', 1)
                        .html(`${d.category}<br>${regionLabels[region]}: $${d3.format(',.0f')(d[region])}`)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseleave', function() {
                    // Restore all bars
                    svg.selectAll('.category-group')
                        .style('opacity', 1);

                    tooltip.style('opacity', 0);
                });

            categoryGroup.append('text')
                .attr('class', 'value-label')
                .style('font-family', 'inherit')
                .style('font-size', '12px')
                .style('fill', '#034737')
                .style('transition', 'opacity 0.2s ease')
                .attr('x', d => xScale(d[region]) + 5)
                .attr('y', yScale.bandwidth()/6)
                .attr('dy', '0.35em')
                .text(d => `$${d3.format('.2s')(d[region])}`);
        });

        // Add y-axis
        svg.append('g')
            .attr('class', 'axis')
            .style('font-family', 'inherit')
            .style('font-size', '12px')
            .call(d3.axisLeft(yScale))
            .select('.domain').remove();

        // Add x-axis
        svg.append('g')
            .attr('class', 'axis')
            .style('font-family', 'inherit')
            .style('font-size', '12px')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .ticks(5)
                .tickFormat(d => `$${d3.format('.2s')(d)}`));

        // Add title
        svg.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#034737')
            .text('Average Contract Values by Region and Category');

        // Add legend at the bottom
        const legend = svg.append('g')
            .attr('class', 'legend')
            .style('font-size', '12px')
            .attr('transform', `translate(0,${innerHeight + 40})`);

        const legendItems = legend.selectAll('.legend-item')
            .data(regions)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 120}, 0)`);

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => regionColors[d]);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .style('fill', '#034737')
            .text(d => regionLabels[d]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChart);
    } else {
        initializeChart();
    }
})();
