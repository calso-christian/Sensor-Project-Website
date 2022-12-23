let params = {
    EQ_params: {
        'amplitude': 0.3710075772745033,
        'length_scale': 81.24192660090051
    }, 
    RQ_params: {
        'amplitude': 0.7258569367724819,
        'length_scale': 247.15194613725987,
        'scale_mixture_rate': 0.033220246849394716
    },
    LP_params: {
        EQ: {
            'amplitude': 0.12953368120990774,
            'length_scale': 1.4157372199331388
        },
        ESS: {
            'amplitude': 1.0,
            'length_scale': 18.954174013668947,
            'period': 91.83853453999933
        }
    },
    ESS_params: {
        'amplitude': 9.491499171850727,
        'length_scale': 2.8379838188885054,
        'period': 1420.632631693691
    },
    noise: 0.023506654839978346
}

tf.setBackend('webgl');


/*socket.on('temp', function(data) {
    var x = data.time;
    var y = data.temp;
    
    if(chartT.series[0].data.length > 40) {
    chartT.series[0].addPoint([x, y], true, true, true);
  } else {
    chartT.series[0].addPoint([x, y], true, false, true);
  }

})*/

Sensor_temp = {
    X: {
        date: [],
        feature: []
    },
    y: [],
}

socket.on('temp', async function(data) {
    if (data[0].X.date?.[1]){
        forecast(data[0]).then(()=>{
            gauge2.setValueAnimated(data[1], 1);
        });
    }
})

async function forecast(data){
    let points = 1000;
    let X_train = tf.tensor(data.X.feature).reshape([-1, 1]);
    let y_train = tf.tensor(data.y).reshape([-1, 1]);
    let X_predict = tf.linspace(0, data.X.feature[data.X.feature.length - 1] + 15, points).reshape([-1,1]);
    let obj = new GaussianProcessRegression(params, new model().Kernel);
    [y_mean, y_cov] = await obj.Condition(X_predict, X_train, y_train);
    await plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov);
}
