socket.on('temp', async function(data) {
    if (data[0].X.date?.[1]){
        forecast(data[0], 'Temperature').then(()=>{
            gauge2.setValueAnimated(data[1], 1);
        });
    }
})

let done = 0;

const worker = new Worker('index.worker.js');
worker.postMessage('Temperature');
worker.postMessage('Humidity');
worker.addEventListener("message", (event) => {
	let data = event.data;
    plot_Predictions(data.X_predict, data.X, data.y, data.y_UpperCI, data.y_LowerCI, data.y_mean, data.sensor);
    
});

