const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const cors = require('cors');
const {Record} = require("./record.js");
const RunScript = require("./runscript");
const socketIO = require('socket.io');
const admin = require('firebase-admin');

const PORT = process.env.PORT || 8080;

const io = socketIO(http, {
    cors: {
        origin: "http://njscontrolwebapp.herokuapp.com",
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

// Serve distribution folder
app.use(express.static(path.join(__dirname, '/dist')));

// app.use(cors);

app.get('/*', function(req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});

// //Admin connection
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
            io.of("/").to(RunScript.socket_id).emit("finished_script");
            RunScript.isRunning = false;
        } else if(msg["record"] == true && !RunScript.startedRecording) {
            Record.clients_recording.push(new Record(1440, msg["file"], RunScript.client_id));
            RunScript.startedRecording = true;
            RunScript.filename = msg["file"];
            console.log("filename", msg["file"]);
            // console.log("started script recording", Record.clients_recording);

        } else if (msg["record"] == false && RunScript.startedRecording) {
            io.of("/").to(RunScript.socket_id).emit("stopped_recording", RunScript.filename);
            Record.removeClient(RunScript.client_id, RunScript.filename);
            RunScript.startedRecording = false;
            console.log("stopped script recording", Record.clients_recording);
        }
    });
});

// // // Client side connection
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