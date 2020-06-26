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

// OTU Chart
function buildCharts(sample) {
  // Get top ten otu_id_arrays and sample_results
  d3.json("samples.json").then((data) => {
    let samples = data.samples;
    let metadata = data.metadata;
    let samplesArray = samples.filter(sampleObj => sampleObj.id == sample)[0];
    let demographicInfo = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    // console.log(samplesArray);
    console.log(demographicInfo.wfreq);
    let otuIdsarray = samplesArray.otu_ids.slice(0, 10);
    let sampleValues = samplesArray.sample_values.slice(0, 10);
    // let washFreq = metadataArray.wfreq.slice(0, 10);
    // console.log(otuIdsarray);
    // console.log(sampleValues);
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
        title: 'ID Number',
        automargin: true,
        autorange: "reversed", //https://community.plotly.com/t/flipping-horizontal-bar-chart-to-descending-order/15456
        tickformat: ',d'
      }
    };

    let config = {responsive: true}

    Plotly.newPlot("bar", idResults, layout1, config);
  });

  // Gauge Chart
  var washFreq = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 270,
      title: { text: "Washing Frequency" },
      type: "indicator",
      mode: "gauge+number"
    }
  ];
  
  var layout2 = { width: 600, height: 500, margin: { t: 0, b: 0 } };

  Plotly.newPlot('gauge', washFreq, layout2);

}
