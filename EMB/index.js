//use environmental files
require('dotenv').config()

//import files
const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schema')


//express initialization
const app = express();


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

//listen to port (localhost:4000)
var server = app.listen(process.env.PORT, "0.0.0.0", () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port ", process.env.PORT);
})

//Bind socket.io to our express server.
var io = require('socket.io')(server); 


//Send index.html page on GET /
app.use(express.static('public')); 



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
        let passDate = day+"-"+month+"-"+year;
        let passTime = hours+":"+minute+":"+seconds;
        let dt = year+"/"+month+"/"+day+" "+hours+":"+minute;

    io.sockets.emit('temp', {date: passDate, time: passTime, temp:passTemp}); 
    io.sockets.emit('hum', {date: passDate, time: passTime, temp:passHum});
    

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


          
function myLoop(delay) {         
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
    io.sockets.emit('temp', {date: passDate, time: fakeTime, temp:fakeTemp});   
                   
  }, 800*delay)
}

for (let i = 1; i < 50; i++){
    myLoop(i);
    i+=1;
}




//log if there is a connection
io.on('connection', (socket) => {
    console.log(`Someone connected " ${socket}`); //show a log as a new client connects.
}) 