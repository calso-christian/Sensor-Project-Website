//globals
require('dotenv').config()
let jsonData;

//requirements
const express = require('express');
const fs = require('fs').promises;
const Data = require('./Data');
const app = express();
let minify = require('express-minify');

//use minify for express app
app.use(minify());

//listen to port
let server = app.listen(process.env.PORT, () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port ", process.env.PORT);
})
let io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
}); 

//Send index.html page on GET /

app.use(express.static('public')); 


/*
//connect serial communication to arduino
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline');
const { json } = require('express');
const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({
    delimiter: '\n'
}))

//Event listener for Arduino


parser.on('data', async (temp) => {

    await Data_reader();
    if(jsonData.Temperature.X.date.length > 1000) {
        Data_shift();
    }


    let obj = JSON.parse(temp);
    let passTemp = obj["Temperature"];
    let passHum = obj["Humidity"];
    let passWat = obj["Water"];

    console.log(obj);
    
    const today = new Date();
        let month = today.getMonth()+1; 
        let day = today.getDate(); 
        let year = today.getFullYear();
        let hours = today.getHours(); 
        let minute = today.getMinutes(); 
        let seconds = today.getSeconds();
        let passDate = year + "/" + month + "/" + day;
        let passTime = hours+":"+minute+":"+seconds;
        let dt = year+"-"+month+"-"+day+" "+hours+":"+minute;
        
    let min = today.getMinutes();
    let cond = min % 10;

    io.sockets.emit('temp-update', passTemp);
    io.sockets.emit('hum-update', passHum);
    console.log(`Seconds: ${seconds} JSON Length: ${jsonData.Temperature.X.date.length} Modulo: ${cond}`);


    if(seconds === 30 && (cond === 0)) {
        
        jsonData.Temperature.X.date.push(dt);
        jsonData.Temperature.y.push(passTemp);
        jsonData.Humidity.X.date.push(dt);
        jsonData.Humidity.y.push(passHum);

        if(jsonData.Temperature.X.date?.[1]){
            let date_0 =  jsonData.Temperature.X.date[0];
            let date_T = dt;
            jsonData.Temperature.X.feature.push(Math.floor((Math.abs(new Date(date_0) - new Date(date_T))/1000)/60));
        }
        else {
            jsonData.Temperature.X.feature.push(0);
        }

        if(jsonData.Humidity.X.date?.[1]){
            let date_0 =  jsonData.Humidity.X.date[0];
            let date_T = dt;
            jsonData.Humidity.X.feature.push(Math.floor((Math.abs(new Date(date_0) - new Date(date_T))/1000)/60));
        }
        else {
            jsonData.Humidity.X.feature.push(0);
        }

        console.log(jsonData);
        io.sockets.emit('Forecast', [jsonData, 'Temperature']);   
        io.sockets.emit('Forecast', [jsonData, 'Humidity']);
        Data_writer(jsonData);
    }
});
*/


io.on('connection', async (socket) => {
    console.log(`Someone connected. ID: ${socket.id}`);
    await Data_reader();
    await Data_truncate(900);
    io.sockets.emit('Forecast', [jsonData, 'Temperature']);   
    io.sockets.emit('Forecast', [jsonData, 'Humidity']);
    
    setInterval(() => {

        io.sockets.emit('temp-update', Math.floor(Math.random()*100));
        io.sockets.emit('hum-update', Math.floor(Math.random()*90));
        io.sockets.emit('wat-update', Math.floor(Math.random()*100));
    

    }, 1000)

    socket.on('disconnect', () => {
         console.log(`Someone disconnected. ID: ${socket.id}`);
    })
})

async function Data_truncate(points){
    for (sensor in jsonData){
        jsonData[sensor].X.date = await jsonData[sensor].X.date.slice(0, points);
        jsonData[sensor].X.feature = await jsonData[sensor].X.feature.slice(0, points);
        jsonData[sensor].y = await jsonData[sensor].y.slice(0, points);
    }
    console.log("JSON data truncated to the first " + points + " points. Operation is temporary.")
}

async function Data_shift(){
    await Data_reader();
    for (sensor in jsonData){
        jsonData[sensor].X.date.shift();
        jsonData[sensor].X.feature.shift();
        jsonData[sensor].y.shift();
        const init = jsonData[sensor].X.feature[0];
        jsonData[sensor].X.feature = await jsonData[sensor].X.feature.map(x => x - init);
    }
    await fs.writeFile('./data.json', JSON.stringify(jsonData, null,2));

    console.log("shifted");
}

async function Data_reader(){
    try {
        jsonData = JSON.parse(await fs.readFile('./data.json', 'utf-8'));
        console.log("JSON file succesfully read");
    }
    catch(error) {
        console.log(error);
    }
    
}

async function Data_writer(obj){
    await fs.writeFile('./data.json', JSON.stringify(obj,null,2), err => {
        if(err){
            console.log(err);
        }
    });
}


//ACCUMULATION HERE


  /*        
async function myLoop(delay) {         
  setTimeout(() => {   
    const today = new Date();
        let month = today.getMonth() + 1; 
        let day = today.getDate();
        let year = today.getFullYear();
        let hours = today.getHours(); 
        let minute = today.getMinutes(); 
        let seconds = today.getSeconds();
        let passDate = year + "/" + month + "/" + day;
        let passTime = hours + ":" + minute + ":" + seconds;
        let dt = year + "/" + month + "/" + day + " " + hours + ":" + minute;

    let fakeTime = hours + ":" + String( 1 + delay ) + ":" + seconds;   
    let fakeTemp = Math.floor(Math.random()*50);

    preProcess({date: passDate, time: fakeTime, temp: fakeTemp}, 'Temperature');
    io.sockets.emit('temp', [Data['Temperature'], fakeTemp]);   
                   
  }, 2000*delay)
}

function preProcess (data, sensor){
    Data[sensor].X.date.push(data.date + " " + data.time);
    Data[sensor].y.push(data.temp);

    if (Data[sensor].X.date?.[1]){
        let date_0 =  Data[sensor].X.date[0];
        let date_T = data.date + " " + data.time;
        Data[sensor].X.feature.push( Math.floor((Math.abs(new Date(date_0) - new Date(date_T))/1000)/60));
    }
    else{
        Data[sensor].X.feature.push(0);
    }
}
*/

