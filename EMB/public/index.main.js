socket.on('Temperature', async function(data) {
    gauge2.setValueAnimated(data.y[data.y.length - 1], 1);
    if (data.X.date?.[1]){
        worker.postMessage(['Temperature', 0]);
        /*forecast(data[0], 'Temperature').then(()=>{
            gauge2.setValueAnimated(data[1], 1);
        });*/
    }
    else{
        worker.postMessage(['Temperature', 0]);
    }
})

let done = 0;

const worker = new Worker('index.worker.js');
/*worker.postMessage(['Temperature', 0]);
worker.postMessage(['Humidity', 0]);*/
worker.addEventListener("message", (event) => {
	let data = event.data;
    plot_Predictions(data.X_predict, data.X, data.y, data.y_UpperCI, data.y_LowerCI, data.y_mean, data.sensor, data.date_init);
    
});

