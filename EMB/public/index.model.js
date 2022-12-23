let params = {
    EQ_params: {
        'amplitude': Math.exp(1.080263054),
        'length_scale': Math.exp(3.160075042)
    }, 
    RQ_params: {
        'amplitude': Math.exp(-0.455801576),
        'length_scale': 1*Math.exp(1),
        'scale_mixture_rate': 1*Math.exp(-0.00002)
    },
    LP_params: {
        EQ: {
            'amplitude': 1.0,
            'length_scale': Math.exp(1)
        },
        ESS: {
            'amplitude': 1,
            'length_scale': 2,
            'period': 4
        }
    },
    ESS_params: {
        'amplitude': 1,
        'length_scale': 2,
        'period': 4
    },
    L_params: {
        'amplitude': 1,
        'bias_variance': 0.01,
        'slope_variance': 0.01,
        'shift': 10*Math.exp(-0.000277507)
    },
    noise: 0.00034
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
    let obj = new GaussianProcessRegression(params);
    [y_mean, y_cov] = await obj.Condition(X_predict, X_train, y_train);
    await plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov);
}
