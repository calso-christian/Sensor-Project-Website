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
    let start = data.X.feature.length - 1;
    let X_predict = tf.linspace(start, start + 15, points).reshape([-1,1]);
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
        let i = X.length - 2;
        let start = X[i][0];
        X = await tf.slice(X, 0, i).reshape([-1,1]);
        y = await tf.slice(y, 0, i).reshape([-1,1]);
        let points = 1000;

        let X_predict = tf.linspace(start, start + 2000, points).reshape([-1,1]);
        let obj = new GaussianProcessRegression(params[sensor], new model().Kernel);
        let [y_mean, y_cov] = await obj.Condition(X_predict, X, y);
        await plot_Predictions(obj, X_predict, X, y, y_mean, y_cov, sensor);
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

