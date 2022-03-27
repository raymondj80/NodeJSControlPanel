let db;
module.exports = function(firebasedb) {
    db = firebasedb;
}

class Record {
    static clients_recording = [];
    static num_clients = 0;

    constructor(time, filename, userid) {
        this.time = time;
        this.filename = filename;
        this.userid = userid;
        this.count = 0;
        this.record_data = [];
        this.stop = false;
    }

    // Check if client has finished recording
    isFinished() {
        if (this.count > this.time) {
            return true;
        } else {
            this.count += 1;
            return this.stop;
        }
    }

    /*
    Static method to iterate over client_recordings and record Data
    */
    static recordData(data) {
        this.clients_recording.forEach((client, index) => {
            if(client.isFinished()) {
                const client_finished = this.clients_recording.pop(index);
                db.collection('record_data').add({
                    user_id: client_finished.userid,
                    name: client_finished.filename,
                    data: client_finished.record_data
                }, err => {
                    console.log(err.message);
                })
            } else {
                client.record_data.push(data);
            }
        });
    }

    static addClient(time, filename, userid) {
        Record.clients_recording.push(new this(time, filename, userid));
    }

    static removeClient(id, filename) {
        Record.clients_recording.forEach((client) => {
            if (client.userid == id && client.filename == filename) {
                client.stop = true;
            }
        })
        console.log(Record.clients_recording);
    }
}

module.exports.Record = Record;