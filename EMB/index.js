require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schema');

const fs = require('fs').promises;
const Data = require('./Data');
const app = express();

//listen to port (localhost:4000)
var server = app.listen(process.env.PORT, "0.0.0.0", () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port ", process.env.PORT);
})

//Bind socket.io to our express server.
var io = require('socket.io')(server); 

//Send index.html page on GET /
app.use(express.static('public')); 


/*
//connect to database
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
async function connect() {
    try {
        await mongoose.connect(process.env.dbURI, connectionParams);
        console.log('Connected to Database');
    }
    catch(err){
        console.error(err);
    } 
}

//call function to connect to database
connect();
*/

/*

//connect serial communication to arduino
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({
    delimiter: '\n'
}))*/

//read data and callback function



let jsonData;

async function Data_reader(){
    jsonData = JSON.parse(await fs.readFile('./Data.json', 'utf-8'));
}

async function Data_writer(obj){
    await fs.writeFile('./Data.json', JSON.stringify(obj,null,2), err => {
        if(err){
            console.log(err);
        }
    });
}

io.on('connection', async (socket) => {

    console.log(`Someone connected. ID: ${socket.id}`);
    await Data_reader();
    io.sockets.emit('Temperature', jsonData.Temperature);   
    
    /*parser.on('data', (temp) => {
        let obj = JSON.parse(temp);
        let passTemp = obj["Temperature"];
        let passHum = obj["Humidity"];

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
            let dt = year+"/"+month+"/"+day+" "+hours+":"+minute;
    
        //io.sockets.emit('temp', [Data['Temperature'], passTemp]); 
        //io.sockets.emit('hum', {date: passDate, time: passTime, temp:passHum});
    
        let min = today.getMinutes();
        
        if(min === 0 || min === 15 || min === 30 || min === 45) {
            /*const dataSave = new schema({
                Temperature: passTemp,
                Humidity: passHum,
                saveDate: dt,
            });
            dataSave.save()
                .then((result) => console.log(result))
                .catch((err) => console.log(err));
    
            jsonData.Temperature.X.date.push(dt);
            jsonData.Temperature.y.push(passTemp);

            if(jsonData.Temperature.X.date?.[1]){
                let date_0 =  jsonData.Temperature.X.date[0];
                let date_T = dt;
                jsonData.Temperature.X.feature.push(Math.floor((Math.abs(new Date(date_0) - new Date(date_T))/1000)/60));
            }
            else {
                jsonData.Temperature.X.feature.push(0);
            }

            console.log(jsonData);
            Data_writer(jsonData);
    
        }
        
    });*/


})


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

