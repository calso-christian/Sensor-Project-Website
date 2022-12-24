socket.on('temp', async function(data) {
    if (data[0].X.date?.[1]){
        forecast(data[0], 'Temperature').then(()=>{
            gauge2.setValueAnimated(data[1], 1);
        });
    }
})

async function forecast(data, sensor){
    let points = 1000;
    let X_train = tf.tensor(data.X.feature).reshape([-1, 1]);
    let y_train = tf.tensor(data.y).reshape([-1, 1]);
    let X_predict = tf.linspace(0, data.X.feature[data.X.feature.length - 1] + 15, points).reshape([-1,1]);
    let obj = new GaussianProcessRegression(params[sensor], new model().Kernel);
    [y_mean, y_cov] = await obj.Condition(X_predict, X_train, y_train);
    await plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov, id='chart-' + sensor);
}


//////////////////////////////////Sample Plot

async function SamplePlot(LINK, sensor){
    let X = [], y = [];
    await d3.csv(LINK).then(async function(data) {
        for (let val of Object.values(data)) {
            X.push([Number(val.Min)]);
            y.push(parseFloat(val[sensor]));
        }
        let Database_split = 1;
        let i = X.length - 1;

        Database_split = parseInt(Database_split*i);
    
        let X_train = tf.slice(X, 0, Database_split).reshape([-1,1]);
        let y_train = tf.slice(y, 0, Database_split).reshape([-1,1]);
        let points = 1000;
        let X_predict = tf.linspace(0, 10440, points).reshape([-1,1]);
        let obj = new GaussianProcessRegression(params[sensor], new model().Kernel);
        let [y_mean, y_cov] = await obj.Condition(X_predict, X_train, y_train);
        await plot_Predictions(obj, X_predict, X_train, y_train, y_mean, y_cov, sensor);
    });
};

(async() => {
    await tf.ready 
    tf.setBackend('webgl');
    main();
  })();

async function main(){
    LINK = "https://raw.githubusercontent.com/calso-christian/Sensor-Project-Website/main/EMB/Sensor%20Readings.csv";
    await SamplePlot(LINK, 'Temperature');
    await SamplePlot(LINK, 'Humidity');
    tf.disposeVariables();
}

