socket.on('Forecast', async function(data) {
    console.log(data);
    //gauge2.setValueAnimated(data.y[data.y.length - 1], 1);
    if (data[0][data[1]].X.date?.[1]){
        const worker = new Worker('index.worker.js');
        worker.addEventListener("message", async (event) => {
            let data = event.data;
            await plot_Predictions(data.X_predict, data.X, data.y, data.y_UpperCI, data.y_LowerCI, data.y_mean, data.sensor);
            let element = document.getElementById("banner_loading");
            element.setAttribute("hidden", "hidden");
        });
        worker.postMessage([data[1], data[0][data[1]]]);
    }
})

socket.on('temp-update', async (data) => {
    gauge2.setValueAnimated(data,1);
})

socket.on('hum-update', async (data) => {
    gauge1.setValueAnimated(data,1);
})

/*worker.postMessage(['Temperature', 0]);
worker.postMessage(['Humidity', 0]);*/


