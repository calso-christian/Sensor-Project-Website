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
}))

//read data and callback function
parser.on('data', (temp) => {
    var obj = JSON.parse(temp);
    var passTemp = obj["Temperature"];
    var passHum = obj["Humidity"];
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

    preProcess({date: passDate, time: passTime, temp: passTemp}, 'Temperature');
    io.sockets.emit('temp', [Data['Temperature'], passTemp]); 

    //io.sockets.emit('hum', {date: passDate, time: passTime, temp:passHum});
    

    var min = today.getMinutes();
    
    if(min === 0 || min === 15 || min === 30 || min === 45) {
        const dataSave = new schema({
            Temperature: passTemp,
            Humidity: passHum,
            saveDate: dt,
        });
        dataSave.save()
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
    }
    
});
*/


let Data;

async function Data_reader(){
    Data = JSON.parse(await fs.readFile('./Data.json', 'utf-8'));
}

async function Data_writer(){
    Data.Temperature.y.push(69696969);
    await fs.writeFile('./Data.json', JSON.stringify(Data,null,2), err => {
        if(err){
            console.log(err);
        }
    });
}

io.on('connection', async (socket) => {
    console.log(`Someone connected " ${socket}`);
    await Data_reader();
    await Data_writer();
    console.log(Data.Temperature.y);
    for (let i = 1; i < 20; i++){
       // await myLoop(i);
    }
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

