width = 1250;
height = 630;

async function plot_Predictions(X_predict, X, y, y_UpperCI, y_LowerCI, y_mean, sensor){

    let plot_train = {
        x: X,
        y: y,
        line: {color: "rgb(0,100,80)"}, 
        mode: 'lines+markers',
        type: 'scatter',
        name: "Reading",
        line: {
          shape: 'spline',
          size: 3,  
        },
        marker: { 
          size: 8,
          color: 'rgb(219, 64, 82)'
        }};
      let plot_predict = {
        x: X_predict,
        y: y_mean,
        line: {color: "rgb(0,100,80)"}, 
        mode: "lines", 
        name: "Forecast",
        line: {
          shape: 'spline',
          color: 'rgb(55, 128, 191)',
          width: 3
        }
      };
      
      let UpperCI = {
        x: X_predict, 
        y: y_UpperCI, 
        fill: 'tonexty',
        fillcolor: "rgba(0,100,80,0.2)", 
        line: {color: "transparent"}, 
        name: "Uncertainty", 
        type: "scatter"
      };
      
      let LowerCI = {
        x: X_predict, 
        y: y_LowerCI, 
        fill: 'tonexty',
        fillcolor: "rgba(0,100,80,0.2)", 
        line: {color: "transparent"}, 
        name: "Uncertainty", 
        showlegend: false, 
        type: "scatter"
      };
      
      let data = [plot_train, plot_predict, UpperCI, LowerCI];
      let layout = {
        responsive: true,
        xaxis: { title: "Minute"},
        yaxis: { title: "Prediction"},  
        title: {
            text: sensor + ' Forecast',
            font: {
              size: 32
            },
            xref: 'paper',
            x: 0.05,
        },
        width: width,
        height: height,

        xaxis: {
            title: {
              text: 'Minute',
              font: {
                size: 22,
                color: '#000000'
              }
            },
          },
          yaxis: {
            title: {
              text: sensor,
              font: {
                size: 22,
                color: '#000000'
              }
            }
          }

      };
      Plotly.newPlot('chart-' + sensor, data, layout);
}

