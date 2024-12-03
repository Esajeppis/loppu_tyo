async function drawChart() {

    myApiKey=import.meta.env.MYAPIKEY
    
    // beginDate = "2021-01-11"
    // endDate = "2022-01-11"
    // idNum= 124
    //1. Lue data
    const myHeaders = new Headers()
    myHeaders.append("x-api-key", myApiKey)
    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    }

    d3.select("#button").on("click", async function() {
        const selectedRadio = d3.select("input[name='datasource1']:checked").property("value");
        const dateStartValue = d3.select("#dateStart").property("value");
        const dateEndValue = d3.select("#dateEnd").property("value");
        console.log(selectedRadio);
        const apiURL = `https://api.fingrid.fi/v1/variable/${selectedRadio}/events/csv?start_time=${dateStartValue}T00:00:00Z&end_time=${dateEndValue}T23:00:00Z`;
    
        try {
            const dataSet = await d3.csv(apiURL, requestOptions);
            console.log(dataSet);

            const dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S+0000")
            const xAccessor = d => dateParser(d.start_time);
            const yAccessor = d => + d.value
            console.log(xAccessor(dataSet[0]));
            console.log(yAccessor(dataSet[0]));
        


        //2. Määritä mitat

        let dimensions = {
            width: window.innerWidth * 0.9,
            height: 600,
            margin: {
                top: 15,
                right: 15,
                bottom: 40,
                left: 60
            }
        }

        dimensions.boundedWidth = dimensions.width
            -dimensions.margin.left
            -dimensions.margin.right

        dimensions.boundedHeight=dimensions.height
            -dimensions.margin.top
            -dimensions.margin.bottom


        console.table(dimensions);
        //3. Piirrä pohja-svg

        let wrapper = d3.select("#wrapper").select("svg");

        if (!wrapper.empty()) {
        // If an SVG already exists, clear its contents
        wrapper.selectAll("*").remove();
        } else {
        // If no SVG exists, append a new one
        wrapper = d3.select("#wrapper")
            .append("svg")
            .attr("height", dimensions.height)
            .attr("width", dimensions.width);
        }







        // const wrapper= d3.select("#wrapper")
        //         .append("svg")
        //         .attr("height",dimensions.height)
        //         .attr("width",dimensions.width);

        // console.log(wrapper)

        const boundingBox = wrapper.append("g")
            .style("transform", `translate(
                ${dimensions.margin.left}px,
                ${dimensions.margin.top}px)`);

    

        //4. Määritä skaalaimet
        
        const yScale= d3
            .scaleLinear()
            .domain([0, d3.max(dataSet, yAccessor)])
            //.domain(d3.extent(dataSet, yAccessor))
            .range([dimensions.boundedHeight,0 ])
            .nice();
        
        console.log(d3.max);
        console.log(yScale(32));
        
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(dataSet,xAccessor))
            .range([0,dimensions.boundedWidth])
            


        // const freezingPoint = 0;
        // const freezingPointPosition = yScale(freezingPoint);
        boundingBox
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", dimensions.boundedHeight)
                .attr("width", dimensions.boundedWidth)
                .attr("fill","lightblue");
            
        const lineGenerator = d3
            .line()
            .x((d) => xScale(xAccessor(d)))
            .y((d) => yScale(yAccessor(d)))
    
        boundingBox
            .append("path")
            .attr("d", lineGenerator(dataSet))
            .attr("stroke","black")
            .attr("fill","none")
            
        //6. Piirrä akselit ja otsikot
    
        const yAxisGenerator = d3.axisLeft().scale(yScale);
        const yAxis = boundingBox.append("g")
                .call(yAxisGenerator)
    
        
        const xAxisGenerator = d3.axisBottom().scale(xScale);
        const xAxis = boundingBox.append("g")
                .call(xAxisGenerator)
                .style("transform", `translateY(${dimensions.boundedHeight}px)`);
        //7. Määritä interaktiiviset toiminnot






        }catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    // const dateParser = d3.timeParse("%Y-%m-%d");
    // const xAccessor = d => dateParser(d.date);
    // const yAccessor = d => (d.value)
    // console.log(xAccessor(dataSet[0]));
    




    //const apiURL = `https://api.fingrid.fi/v1/variable/${idSelector}/events/csv?start_time=${beginDate}T00:00:00Z&end_time=${endDate}T23:00:00Z`

    // const dataSet = await d3.csv(apiURL , requestOptions)
    // console.log(dataSet)


}
drawChart()


// async function getData() {
//     const radio = d3.select("#consumption");
//     if (radio.property("checked")) {
//         try {
//             const data = await d3.csv(apiURL, requestOptions);
//             console.log(data);
//             console.log("Electricity consumption in Finland is selected!");
//             // Further processing, like updating the visualization, can go here
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     } else {
//         console.log("The radio button is not selected.");
//     }
// }


// const button = d3.select("button")
// .on("click", getData)