width = 1250;
height = 630;

async function plot_Predictions(X_predict, X, y, y_UpperCI, y_LowerCI, y_mean, sensor, date_0="2022-12-26 21:6"){

  X = feature_to_date(X, date_0);
  X_predict = feature_to_date(X_predict, X[0]);
  console.log(X, X_predict);
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
          size: 5,
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
      };
      
      let LowerCI = {
        x: X_predict, 
        y: y_LowerCI, 
        fill: 'tonexty',
        fillcolor: "rgba(0,100,80,0.2)", 
        line: {color: "transparent"}, 
        name: "Uncertainty", 
        showlegend: false, 
      };
      
      let data = [plot_train, plot_predict, UpperCI, LowerCI];
      let config = {responsive: true}
      let layout = {
        xaxis: { 
          title: "Minute",
          type: 'date'},
        yaxis: { title: "Prediction"},  
        title: {
            text: sensor + ' Forecast',
            font: {
              size: 29
            },
            xref: 'paper',
            x: 0.05,
        },
        xaxis: {
            title: {
              text: 'Time',
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

      Plotly.newPlot('chart-'+ sensor, data, layout, config);
}

function feature_to_date(feature, date_0){
  let date = [];
  for (const item of feature){
    let date_T =  new Date(date_0);
    let min = String(date_T.getMinutes());
    if (date_T.getMinutes() < 10){
      min = "0" + min;  
    }
    date_T.setMinutes(date_T.getMinutes() + Number(item));
    date.push(String(date_T.getFullYear() + "-" + String(date_T.getMonth() + 1) +  "-"
                     + date_T.getDate() + " " + date_T.getHours() + ":" + min));
  }
  return date
}

