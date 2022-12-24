width = 1425;
height = 630;

async function plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov, id_){
    X_predict = X_predict.squeeze().arraySync();
    y_std = tf.sqrt(obj.getDiag(y_cov, y_cov.shape[0]));
    let y_UpperCI = tf.squeeze(y_mean.add(tf.mul(y_std, 2))).arraySync();
    let y_LowerCI = tf.squeeze(y_mean.sub(tf.mul(y_std, 2))).arraySync();
    y_mean = y_mean.squeeze().arraySync();
    
    let plot_train = {
        x: X_train.squeeze().arraySync(),
        y: y_train.squeeze().arraySync(),
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
            text:'Temperature Forecast',
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
              text: '°Celsius',
              font: {
                size: 18,
                color: '#7f7f7f'
              }
            }
          }
      };
      Plotly.newPlot(id_, data, layout);
}

