const path = require("path");
const util = require("util");
const {spawn} = require("child_process");
const exec = util.promisify(require("child_process").exec);

class InstrumentService {
    constructor(socketio) {
        this.socket = socketio;
    }

    runScript(script) {
        let self = this;
        console.log("running script");
        console.log(script);
        const process = spawn("python", [
            "-u",
            path.join(__dirname, "./python/run_script.py"),
            script,
        ]);
        process.stdout.on("data", function (script_log) {
            console.log(script_log.toString());
            const script_msg = JSON.parse(script_log.toString());
            self.socket.emit("run-script-msg", script_msg);
        })
    }

    fetchInstrumentData() {
        return new Promise(function (resolve, reject) {
            exec("python ./admin/python/fetch_data.py").then(function(value) {
                resolve(JSON.parse(value.stdout.replace(/\bNaN\b/g, "null")));
            }).catch(function(err) {
                reject(err);
            })
        });
    }
}

module.exports = InstrumentService;
