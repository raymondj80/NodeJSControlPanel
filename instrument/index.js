const {io} = require('socket.io-client');
const InstrumentService = require('./instrumentService');
const socket = io.connect("https://njscontrolwebapp.herokuapp.com/admin");

// const socket = io.connect("http://localhost:3000/admin");

var instrumentService = new InstrumentService(socket);

socket.on("connect", () => {
    console.log("Admin connected");
});

let refreshIntervalId = null;
socket.on("start_fetch_data", async () => {
    if (refreshIntervalId == null) {
        console.log("start fetching data");
        refreshIntervalId = setInterval(() => {
            instrumentService.fetchInstrumentData().then((res) => {
                socket.emit("return_data", res);
            });
        },
        1000);
    }
});

socket.on("stop_fetch_data", () => {
    console.log("stop_fetch_data");
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
});

socket.on("run_script", (script)=> {
    console.log("admin received running script");
    instrumentService.runScript(script);
});


