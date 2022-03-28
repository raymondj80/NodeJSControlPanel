import { io } from "socket.io-client";
import { Parser } from "json2csv";
import FireBase from "./firebase";
import store from "../store/index";
const url = 'https://njscontrolwebapp.herokuapp.com/';
// const url = 'http://localhost:3000/';

class SocketService {
    static socket;
    static temp_store_files = [];
    static connect() {
        this.socket = io.connect(url);
        this.socket.on("connect", () => {
            // console.log("client connected via", this.socket.id);
        });
        this.socket.on("client", (client) => {
            console.log(client);
        });
        this.socket.on("stopped_recording", (filename) => {
            console.log('pushing ', filename);
            SocketService.temp_store_files.push(filename);
        });
        this.socket.on("finished_script", () => {
            SocketService.temp_store_files.forEach((filename) => {
                console.log('uploading ', filename);
                SocketService.uploadFile(filename).then(() => {
                    SocketService.temp_store_files.pop()
                });
            });
        })
    }

    static async fetchData() {
        return new Promise((resolve) => {
            this.socket.on("return_data", async(data) => {
                Object.keys(data).forEach(key => {
                    if (data[key] == null) {
                        delete data[key];
                    }
                });
                resolve(data);
            });
        })
    }

    static async startManualRecord(time, filename) {
        console.log("start manual record");
        this.socket.emit("start_manual_record", time, filename, FireBase.auth.currentUser.uid);
        return new Promise((resolve) => {
            this.socket.on("finished_recording", async () => {
                resolve("finished recording");
            });
        })
    }

    static stopManualRecord(filename) {
        console.log("stop manual record");
        this.socket.emit("stop_manual_record", filename, FireBase.auth.currentUser.uid);
    }

    static runScript(script) {
        console.log("socketService running script");
        this.socket.emit("run_script", script, FireBase.auth.currentUser.uid);
    }

    static disconnect() {
        if (this.socket) {
            this.socket.close();
            console.log("socket disconnected");
        }
    }

    static #parseJSONtoCSV(jsonData) {
        const parser = new Parser({header: true});
        return parser.parse(jsonData);
    }

    static async uploadFile(filename) {
        const fileData = await FireBase.getFileData(filename);
        const CSV = SocketService.#parseJSONtoCSV(fileData);
        var file = new Blob([CSV], {type: "text/csv"});
        var metadata = {
            "name": filename,
            "mimeType": "text/csv",
            "parents": [store.getters.folderid], // Google Drive folder id
        };

        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true", {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + store.getters.token }),
            body: form,
        }).then((res) => {
            return res.json();
        }).then(function(val) {
            console.log(val);
        });
    }
}

export default SocketService;