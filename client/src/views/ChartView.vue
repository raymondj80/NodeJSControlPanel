<template>
    <div>
        <div style="display: flex; margin-top: 20px;">
            <h2 style="float: left; margin-left: 40px; margin-top: 10px">
            Charts
            </h2>
            <button class="btn btn-light btn-sm" style="margin-left: 10px;" size="sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"><b-icon icon="gear-fill" aria-hidden="true"></b-icon></button>
            <button class="btn btn-danger btn-sm" style="margin-left: 10px;" size="sm" type="button" @click=instantiate><b-icon icon="arrow-counterclockwise" aria-hidden="true"></b-icon></button>
        </div>

        <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
            <div class="offcanvas-header">
                <h5 id="offcanvasTopLabel">Settings</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="selection-container">
                    <div class="selection" v-for="n in numCharts" :key="n">
                        
                        <h5>chart{{ n }}</h5>
                        <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <b-form-select @change="updateGraph" v-model="chartOptions[n-1].x" :options="headers"/>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <b-form-select @change="updateGraph" v-model="chartOptions[n-1].y" :options="headers"/>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>      

        <div class="chart-divs" :key="numCharts">
            <div class="chart" v-for="n in numCharts" :key="n">
                    <button type="button" @click="removeChart(n-1)" style="float:right" class="btn-close" aria-label="Close"></button>
                    <line-chart
                    v-if="loaded && chartOptions[n-1].x == 'time'"
                    :chartData="chartdata[n-1].streamdata_line"
                    :chartTitle="'chart' + n"
                    :options="chartOptions[n-1]"
                    :height="400"
                    :width="windowWidth / 2 - 100"
                    :key="rerender"
                    />
                    <scatter-chart
                    v-else
                    :chartData="chartdata[n-1].streamdata_scatter"
                    :chartTitle="'chart' + n"
                    :options="chartOptions[n-1]"
                    :height="400"
                    :width="windowWidth / 2 - 100"
                    :key="rerender"
                    />
            </div>
            <div class="chart">
                <button type="button" @click="addChart" class="btn btn-success btn-lg btn-block"><b-icon icon="plus" aria-hidden="true"></b-icon></button>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from "../components/LineChart.js"
import ScatterChart from "../components/ScatterChart.js"
import ChartService from "../services/chartservice"
export default {
    name: 'ChartView',
    components: {LineChart, ScatterChart},
    data() {
        return {
        loaded: false,
        numCharts: this.$store.getters.numCharts,
        intervalIds: [],
        chartdata: [],
        headers: [],
        chartOptions: [],
        windowWidth: window.innerWidth,
        rerender: 0
        }
    }, 
    methods: {
        instantiate() {
            this.chartdata.length = 0;
            this.chartOptions = ChartService.xlabels.map((x, i) => ({x, y: ChartService.ylabels[i] }));
            ChartService.streamDatas.forEach((chart) => {
                chart.reset();
                this.chartdata.push(chart);
            });
        },
        updateGraph() {
            ChartService.xlabels = this.chartOptions.map((item) => item['x']);
            ChartService.ylabels = this.chartOptions.map((item) => item['y']);
            this.instantiate();
        },
        addChart() {
            ChartService.addChart().then(() => {
                this.instantiate();
                this.numCharts += 1;
                this.$store.commit('modifyNumCharts', this.numCharts);
            });
        },
        removeChart(n) {
            ChartService.removeChart(n).then(() => {
                this.instantiate();
                this.numCharts -= 1;
                this.$store.commit('modifyNumCharts', this.numCharts);
            });
        },
        onresize() {
            if (Math.abs(this.windowWidth - window.innerWidth) > 10) {
                this.rerender = !this.rerender;
                this.windowWidth = window.innerWidth;
            }
        }
    },
    created() {   
        window.addEventListener("resize", this.onresize);
        this.chartdata = [];
        if (ChartService.streamDatas.length < this.numCharts) {
            ChartService.constructCharts(this.numCharts);
        }
        this.instantiate();
        ChartService.getHeaders().then((headers) => {
            this.headers = headers;
        });
    },
    destroyed() {
        window.removeEventListener("resize", this.onresize);
    },
    mounted () {
    console.log(this.$store.getters.numCharts)
    this.loaded = false
    try {
        // Clear previous setInterval calls
        this.intervalIds.forEach((id) => {
            clearInterval(id);
        })
        this.intervalIds.length = 0;

        // Create new interval 
        let id  = setInterval(() => {
            ChartService.fetchData();
        }, 1000);

        this.intervalIds.push(id);
        this.loaded = true;
    } catch (e) {
      console.error(e)
    }},
    beforeUnmount() {
        ChartService.stopStreamData();
    }
}
</script>

<style scoped>
    .selection-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }

    .selection {
        width: 400px;
    }
    .chart-divs {
        /* height: 100vh; */
        display: grid;
        grid-template-columns: repeat(2, minmax(500px, 2fr));
    }

    .chart {
        margin: 10px 20px 10px 20px;
        min-height: 200px;
        justify-content: center;
        text-align: center;
        overflow:hidden;
    }
</style>