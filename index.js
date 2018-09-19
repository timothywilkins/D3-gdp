const margin = {
        top: 100,
        right: 80,
        bottom: 50,
        left: 80
    },
    w = 1000 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom

const svg = d3.select("#graph")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")

//define tooltip
let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("id", "tooltip")

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(function (data) {

    const gdpYearAndQuarter = data.data.map((item) => item[0]), //The year month and day 
        year = gdpYearAndQuarter.map(x => x.slice(0, 4)), // Only the year
        gdp = data.data.map((item) => item[1])

    const barWidth = (w) / gdp.length //no padding

    const minX = d3.min(year, d => d),
        maxX = d3.max(year, d => d),
        minY = d3.min(gdp, (d) => d),
        maxY = d3.max(gdp, (d) => d);



    const linearScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([0, h]);


    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([0, (w)]),

        yScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([h, 0]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d")),

        yAxis = d3.axisLeft(yScale);


    svg.selectAll("rect") //creation of bars
        .data(gdp)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * barWidth)
        .attr("y", (d) => h - linearScale(d))
        .attr("width", barWidth)
        .attr("height", (d) => linearScale(d))
        .attr("fill", "#7cef80")
        .attr("class", "bar")
        .attr("data-gdp", (d, i) => data.data[i][1])
        .attr("data-date", (d, i) => data.data[i][0])
        .on("mouseover", function (d, i) {
            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(data.data[i][0] + "<br/>" + data.data[i][1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            div.attr('data-date', data.data[i][0])
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("g") //x-axis
        .attr("transform", `translate(0,${h})`)
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("class", "x-axis")

    svg.append("g") //y-axis
        .attr("transform", `translate(0,0)`)
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("class", "y-axis")

    svg.append("text") //graph title
        .attr("x", (w / 2))
        .attr("y", -margin.top / 3)
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .attr("class", "title")
        .text(data.name)
})