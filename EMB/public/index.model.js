let params = {
    EQ_params: {
        'amplitude': Math.exp(1.080263054),
        'length_scale': Math.exp(3.160075042)
    }, 
    RQ_params: {
        'amplitude': Math.exp(-0.455801576),
        'length_scale': 6*Math.exp(4.797290182),
        'scale_mixture_rate': 2*Math.exp(-0.00002)
    },
    LP_params: {
        EQ: {
            'amplitude': 1.0,
            'length_scale': Math.exp(-0.5)
        },
        ESS: {
            'amplitude': 0.18,
            'length_scale': 10,
            'period': 10
        }
    },
    L_params: {
        'amplitude': 0.0001,
        'bias_variance': 0.01,
        'slope_variance': Math.exp(1.27037609),
        'shift': 10*Math.exp(-0.000277507)
    },
    noise: 0.00034
}

tf.setBackend('webgl');


socket.on('temp', function(data) {
    var x = data.time;
    var y = data.temp;

/*
    if(chartT.series[0].data.length > 40) {
    chartT.series[0].addPoint([x, y], true, true, true);
  } else {
    chartT.series[0].addPoint([x, y], true, false, true);
  }*/
  gauge1.setValueAnimated(y, 1);

})

Sensor_temp = {
    X: {
        date: [],
        feature: []
    },
    y: [],
}

socket.on('temp', function(data) {
    Sensor_temp.X.date.push(data.date + " " + data.time);
    Sensor_temp.y.push(data.temp);
    if (Sensor_temp.X.date?.[0]){
        let date_0 = Sensor_temp.X.date[0];
        let date_T = data.date + " " + data.time;
        Sensor_temp.X.feature.push( Math.floor((Math.abs(new Date(date_0) - new Date(date_T))/1000)/60));
        forecast();
    }
    else{
        Sensor_temp.X.feature.push(0);
    }
})

function forecast(){
    let points = 1000;
    let X_train = tf.tensor(Sensor_temp.X.feature).reshape([-1, 1]);
    let y_train = tf.tensor(Sensor_temp.y).reshape([-1, 1]);
    let X_predict = tf.linspace(0, Sensor_temp.X.feature[Sensor_temp.X.feature.length - 1] + 15, points).reshape([-1,1]);
    let obj = new GaussianProcessRegression(params);
    [y_mean, y_cov] = obj.Condition(X_predict, X_train, y_train);

    plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov);
}
/*
d3.csv("https://raw.githubusercontent.com/CorpuzKB/Gaussian-Process-Regression-using-Armadillo/master/MPPD.csv", function(data){
    let X = [], y = [], i = 0, Database_split = 1;
    for (let val of Object.values(data)) {
        X.push([Number(val.DAY)]);
        y.push(Number([val.DIESEL]));
        i += 1;
    }
    Database_split = parseInt(Database_split*i);

    let X_train = tf.slice(X, 0, Database_split).reshape([-1,1]);
    let y_train = tf.slice(y, 0, Database_split).reshape([-1,1]);

    let points = 1000;
    let X_predict = tf.linspace(0, 900, points).reshape([-1,1]);
    //let X_predict = tf.stack([tf.linspace(0, 1000, points).reshape([-1,1]), tf.mul(tf.ones([points, 1], tf.float32), 58.0)], 1).squeeze();

    let obj = new GaussianProcessRegression(params);

    [y_mean, y_cov] = obj.Condition(X_predict, X_train, y_train);

    plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov);
    plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov);
    //Plot(obj, X_predict.slice([0,0], [X_predict.shape[0],1]), X_train.slice([0,0], [X_train.shape[0],1]), y_train, y_mean, y_cov);
});*/


