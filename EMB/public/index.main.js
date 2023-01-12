let l = 2;
socket.on('Forecast', async function(data) {
    //gauge2.setValueAnimated(data.y[data.y.length - 1], 1);
    if (data[0][data[1]].X.date?.[1]){
        const worker = new Worker('index.worker.js');
        worker.addEventListener("message", (event) => {
            let data = event.data;
            plot_Predictions(data.X_predict, data.X, data.y, data.y_UpperCI, data.y_LowerCI, data.y_mean, data.sensor, data.date_0);
            l -= 1;
            if (l == 0){
                let element = document.getElementById("banner_loading");
                element.setAttribute("hidden", "hidden");
            }
        });
        worker.postMessage([data[1], data[0][data[1]]]);
    }
})

socket.on('temp-update', async (data) => {
    gauge2.setValueAnimated(data,1);

    if(data <= 26 && data >= 24) {
        var stats = document.getElementById("temp-stats");
        stats.innerHTML = "Temperature: Normal";
        stats.style.color = "#5ee432";
      }
      else if(data < 24) {
        var stats = document.getElementById("temp-stats");
        stats.innerHTML = "Temperature: Cold";
        stats.style.color = "#549ded";
      }
      else if(data > 26 && data < 40) {
        var stats = document.getElementById("temp-stats");
        stats.innerHTML = "Temperature: Hot";
        stats.style.color = "#f7aa38";
      }else {
        var stats = document.getElementById("temp-stats");
        stats.innerHTML = "Temperature: Warning! Dangerous Level";
        stats.style.color = "#ef4655";
      } 

})

socket.on('hum-update', async (data) => {

    gauge1.setValueAnimated(data,1);
    
    if(data < 70 && data > 50) {
        var stats = document.getElementById("hum-stats");
        stats.innerHTML = "Humidity: Risk";
        stats.style.color = "#fffa50";
      }
      else if(data >= 70 && data <= 90) {
        var stats = document.getElementById("hum-stats");
        stats.innerHTML = "Humidity: Normal";
        stats.style.color = "#5ee432";
      }
      else if(data > 90) {
        var stats = document.getElementById("hum-stats");
        stats.innerHTML = "Humidity: Warning! ";
        stats.style.color = "#f7aa38";
      }
      else {
        var stats = document.getElementById("hum-stats");
        stats.innerHTML = "Humidity: Warning! Dangerous Level";
        stats.style.color = "#ef4655";
      }
})


socket.on('wat-update', async (data) => {
    gauge3.setValueAnimated(data,1);
    
    if(data < 20) {
        var stats = document.getElementById("water-stats");
        stats.innerHTML = "Water: Normal";
        stats.style.color = "#5ee432";
    }
    else if(data > 40 && data < 60) {
        var stats = document.getElementById("water-stats");
        stats.innerHTML = "Water: Normal with Risk";
        stats.style.color = "#fffa50";
    }
    else if(data > 60) {
        var stats = document.getElementById("water-stats");
        stats.innerHTML = "Water: WARNING! Dangerous Level";
        stats.style.color = "#ef4655";
    }
    
})

/*async (data, id) => {
        var stats = document.getElementById(id);
        stats.innerHTML = id;
} */


