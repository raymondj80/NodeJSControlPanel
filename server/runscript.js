class ScriptRunner {
    static io;
    static isRunning = false;
    static startedRecording = false;
    static filename = '';
    static client_id = '';
    static socket_id = '';

    static sendScriptToAdmin(script, clientid, socketid) {
        if (!this.isRunning) {
            console.log("start recording...");
            this.client_id = clientid;
            this.socket_id = socketid;
            this.io.of("/admin").emit("run_script", script);
            this.io.of("/").to(socketid).emit("started_running");
            this.isRunning = true;
        } else {
            console.log("already running");
            this.io.of("/").to(socketid).emit("already_running");
        }
    }
}

module.exports = ScriptRunner;
