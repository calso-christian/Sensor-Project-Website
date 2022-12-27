socket.on('Forecast', async function(data) {
    //gauge2.setValueAnimated(data.y[data.y.length - 1], 1);
    if (data[0][data[1]].X.date?.[1]){
        worker.postMessage([data[1], data[0][data[1]]]);
    }
})

const worker = new Worker('index.worker.js');
/*worker.postMessage(['Temperature', 0]);
worker.postMessage(['Humidity', 0]);*/
worker.addEventListener("message", (event) => {
	let data = event.data;
    plot_Predictions(data.X_predict, data.X, data.y, data.y_UpperCI, data.y_LowerCI, data.y_mean, data.sensor, data.date_0);
    
});

