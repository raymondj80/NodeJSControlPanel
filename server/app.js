const express = require('express');
const path = require('path')
const app = express();
const serveStatic = require('serve-static');
require('dotenv').config();
const http = require('http').Server(app);
const cors = require('cors');
const {Record} = require("./record.js");
const RunScript = require("./runscript");
const socketIO = require('socket.io');
const admin = require('firebase-admin');

const PORT = process.env.PORT || 3000;

const io = socketIO(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

RunScript.io = io;

// Initialize Firebase Admin App
const serviceAccount = require('./config/fbconfig');
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const db = firebaseApp.firestore();
require("./record.js")(db);

app.use(cors);
app.use('/', serveStatic(path.join(__dirname,"../public/dist/static/"))); 

//Admin connection
io.of("/admin").on("connection", (socket) => {
    console.log("New admin client");
    socket.on("return_data", (data) => {
        io.of("/").emit("return_data", data);
        Record.recordData(data);
    });
    socket.on("run-script-msg", (msg) => {
        console.log(msg);
        if (msg["num"] == -1) {
            console.log("finished script");
            RunScript.isRunning = false;
        } else if(msg["record"] == true && !RunScript.startedRecording) {
            Record.clients_recording.push(new Record(1440, msg["file"], RunScript.client_id));
            RunScript.startedRecording = true;
            RunScript.filename = msg["file"];

        } else if (msg["record"] == false && RunScript.startedRecording) {
            io.of("/").to(RunScript.socket_id).emit("stopped_recording", RunScript.filename);
            Record.removeClient(RunScript.client_id, RunScript.filename);
            RunScript.startedRecording = false;
            console.log("stopped script recording", Record.clients_recording);
        }
    });
});

// // Client side connection
io.on("connection", (socket) => {
    console.log("client connected");
    if (io.of("/").sockets.size > 0) {
        console.log('hi');
        io.of("/admin").emit("start_fetch_data");
    }
    socket.on("disconnect", () => {
        if (io.of("/").sockets.size == 0) {
            console.log("disconnect");
            io.of("/admin").emit("stop_fetch_data");
        }
    });
    socket.on("start_manual_record", (time, filename, client_id) => {
        console.log("start recording");
        Record.clients_recording.push(new Record(time, filename, client_id));
    });
    socket.on("stop_manual_record", (filename, client_id) => {
        console.log("stop recording");
        Record.clients_recording.forEach((client) => {
          if (client.userid == client_id && client.filename == filename) {
            client.stop = true;
          }
        });
    });
    socket.on("run_script", (script, clientid) => {
        console.log("cloud server received running script");
        RunScript.sendScriptToAdmin(script, clientid, socket.id);
    });

})

http.listen(PORT, console.log(`Listening to port ${PORT}`));