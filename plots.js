// Create drop-down menu
function init() {
  let selector = d3.select("#selDataset");

// Populate drop-down menu
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

// Create individiuals' information panels
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographic panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let demographicInfo = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // console.log('Result Array: ', demographicInfo.length);
    let PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + demographicInfo.id);
    PANEL.append("h6").text("Ethnicity: " + demographicInfo.ethnicity);
    PANEL.append("h6").text("Gender: " + demographicInfo.gender);
    PANEL.append("h6").text("Age: " + demographicInfo.age);
    PANEL.append("h6").text("Location: " + demographicInfo.location);
    PANEL.append("h6").text("Blood Type: " + demographicInfo.bbtype);
    PANEL.append("h6").text("Washing Frequency: " + demographicInfo.wfreq);
  });
}

// OTU Charts
function buildCharts(sample) {

  // Get otu_id_arrays and sample_results
  d3.json("samples.json").then((data) => {

    // Accessing metadata and samples objects
    let samples = data.samples;
    let metadata = data.metadata;
    let metadataArray = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    let samplesArray = samples.filter(sampleObj => sampleObj.id == sample)[0];
    // console.log(metadataArray);
    // console.log(samplesArray);

    // Select top ten ids and values from samples object
    let otuIdsarray = samplesArray.otu_ids.slice(0, 10);
    let sampleValues = samplesArray.sample_values.slice(0, 10);

    // Select washing frequency from metadata object
    let washFreq = metadataArray.wfreq
    // console.log(washFreq);

    // Convert otuIDs to string for bar chart
    let otuIDs = otuIdsarray.map(otuID => 'OTU ID ' + otuID.toString());
    // console.log(otuIDs);

    // Generate OTU Bar Chart
    let trace1 = {
      y: otuIDs,
      x: sampleValues,
      type: 'bar',
      orientation: 'h',
      text: 'Count'
    };
  
    let idResults = [trace1];
  
    let layout1 = {
      autosize: true,
      tick0: 0,
      dtick: 25,
      title: {
        text: 'OTU Sample Results',
        },
      yaxis: {
        automargin: true,
        autorange: "reversed", //https://community.plotly.com/t/flipping-horizontal-bar-chart-to-descending-order/15456
        tickformat: ',d'
      }
    };

    let config = {responsive: true}

    Plotly.newPlot("bar", idResults, layout1, config);
  
  
    // Gauge Chart
    var washFreqcount = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Weekly Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          bar: {color: 'black'},
          steps: [
            {range: [0, 1], color: '#ec1212'},
            {range: [1, 2], color: '#ec6812'},
            {range: [2, 3], color: '#ece512'},
            {range: [3, 4], color: '#82ec12'},
            {range: [4, 5], color: '#12ec65'},
            {range: [5, 6], color: '#1FE1A0'},
            {range: [6, 7], color: '#12ecd8'},
            {range: [7, 8], color: '#12a7ec'},
            {range: [8, 9], color: '#1215ec'},
            {range: [9, 10], color: '#b112ec'}
          ]
        }
      }
    ];
    
    var layout2 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  
    Plotly.newPlot('gauge', washFreqcount, layout2);
  
    // Bubble Chart
    var trace2 = {
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color:['#eb9818', '#ebeb18', '#20c65a', '#20c69b', '#20bcc6', '#2096c6', '#5220c6', '#9920c6', '#c620a3', '#Sc62020'],
        size: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
        sizemode: 'area'
      }
    };
    
    var idResultsbubble = [trace2];
    
    var layout3 = {
      title: 'Top Ten OTU ID Results By Count',
      showlegend: false
    };
    
    Plotly.newPlot('bubble', idResultsbubble, layout3);
  });
}
