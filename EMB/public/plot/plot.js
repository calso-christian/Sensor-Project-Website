function plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov, id_='plotDiv'){
    X_predict = X_predict.squeeze().arraySync();
    y_std = tf.sqrt(obj.getDiag(y_cov, y_cov.shape[0]));
    let y_UpperCI = tf.squeeze(y_mean.add(tf.mul(y_std, 2))).arraySync();
    let y_LowerCI = tf.squeeze(y_mean.sub(tf.mul(y_std, 2))).arraySync();
    y_mean = y_mean.squeeze().arraySync();
    
    let plot_train = {
        x: X_train.squeeze().arraySync(),
        y: y_train.squeeze().arraySync(),
        line: {color: "rgb(0,100,80)"}, 
        mode: "lines", 
        name: "Diesel Prices",
        line: {
          color: 'rgb(219, 64, 82)',
          width: 3
        }
      };
      
      let plot_predict = {
        x: X_predict,
        y: y_mean,
        line: {color: "rgb(0,100,80)"}, 
        mode: "lines", 
        name: "Mean Prediction",
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
        xaxis: { title: "Day"},
        yaxis: { title: "Prediction"},  
        title: {
            text:'Sample Gaussian Process Regression',
            font: {
              size: 24
            },
            xref: 'paper',
            x: 0.05,
        },
        width: 1300,
        height: 720,

        xaxis: {
            title: {
              text: 'Day',
              font: {
                size: 18,
                color: '#7f7f7f'
              }
            },
          },
          yaxis: {
            title: {
              text: 'PHP',
              font: {
                size: 18,
                color: '#7f7f7f'
              }
            }
          }
      };
      Plotly.newPlot(id_, data, layout);
}

