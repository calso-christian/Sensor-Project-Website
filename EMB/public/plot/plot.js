width = 1425;
height = 630;

async function plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov, sensor){
    X_train = await X_train.squeeze().array();
    y_train = await y_train.squeeze().array();
    X_predict = await X_predict.squeeze().array();
    y_cov = await y_cov.array();
    y_cov = await y_cov.map(x => x.map(x => x || 1e-9));
    y_cov = tf.tensor(y_cov);

    y_std = tf.sqrt(obj.getDiag(y_cov, y_cov.shape[0]));
    y_std.print();
    let y_UpperCI = await tf.squeeze(y_mean.add(tf.mul(y_std, 2))).array();
    let y_LowerCI = await tf.squeeze(y_mean.sub(tf.mul(y_std, 2))).array();

    console.log(y_UpperCI, y_LowerCI);

    y_mean = await y_mean.squeeze().array();
    let plot_train = {
        x: X_train,
        y: y_train,
        line: {color: "rgb(0,100,80)"}, 
        mode: 'markers',
        type: 'scatter',
        name: "Reading",
        line: {
          color: 'rgb(219, 64, 82)',
        },
        marker: { size: 12 }
      };
      
      let plot_predict = {
        x: X_predict,
        y: y_mean,
        line: {color: "rgb(0,100,80)"}, 
        mode: "lines", 
        name: "Forecast",
        line: {
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
        xaxis: { title: "Minute"},
        yaxis: { title: "Prediction"},  
        title: {
            text: sensor + ' Forecast',
            font: {
              size: 20
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
                size: 18,
                color: '#7f7f7f'
              }
            },
          },
          yaxis: {
            title: {
              text: sensor,
              font: {
                size: 18,
                color: '#7f7f7f'
              }
            }
          }
      };
      Plotly.newPlot('chart-' + sensor, data, layout);
}

