import SocketService from "./socketservice";
const MAX_LENGTH = 500;
class ChartService {
    static streamDatas = [];
    static numCharts = 2;
    static headers;
    static xlabels = [];
    static ylabels = [];
    static recording = false;

    constructor() {
        this.time = 0,
        this.streamdata_scatter = [],
        this.streamdata_line = {
            xs: [],
            ys: []
        }
    }

    reset() {
        this.streamdata_line['xs'].length = 0;
        this.streamdata_line['ys'].length = 0;
        this.streamdata_scatter.length = 0;
        this.time = 0;
        return;
    }

    appendData(data, ind) {
        if (this.time > MAX_LENGTH) {
            this.reset();
        }
        if (ChartService.xlabels[ind] == "time") {
            this.streamdata_line['xs'].push(this.time);
            this.streamdata_line['ys'].push(data[ChartService.ylabels[ind]]);
        }
        else {
            this.streamdata_scatter.push({
                x: data[ChartService.xlabels[ind]],
                y: data[ChartService.ylabels[ind]]
            });
        }
        this.time += 1;
    }

    static async getHeaders() {
        return new Promise((resolve) => {
            SocketService.fetchData().then((data) => {
                console.log(data);
                let res = [];
                Object.keys(data).forEach((header) => {
                    if (!header.includes("state")) {
                        res.push(header);
                    }
                })
                res.push("time");
                resolve(res);
            });
        })
    }

    static async fetchData() {
        SocketService.fetchData().then((data) => {
            ChartService.streamDatas.forEach((chart, index) => {
                chart.appendData(data, index);
            });
        });

    }

    static async addChart() {
        return new Promise((resolve) => {
            ChartService.xlabels.push('time');
            ChartService.ylabels.push('temp (K)');
            ChartService.streamDatas.push(new this());
            resolve();
        })
    }

    static async removeChart(n) {
        return new Promise((resolve) => {
            ChartService.xlabels.splice(n, 1);
            ChartService.ylabels.splice(n, 1);
            ChartService.streamDatas.splice(n, 1);
            resolve();
        })
    }

    static constructCharts(number) {
        ChartService.streamDatas = [];
        ChartService.xlabels = new Array(number).fill('time');
        ChartService.ylabels = new Array(number).fill('temp (K)');
        for (let i = 0; i < number; i++) {
            ChartService.streamDatas.push(new this());
        } 
    }

    static stopStreamData() {
        this.streamDatas = [];
        this.time = 0;
    }
    
}

export default ChartService;