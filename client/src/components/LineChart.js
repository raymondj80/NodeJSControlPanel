import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  methods: {
    render() {
      this.renderChart({
        labels: this.chartData.xs,
        datasets: [
          {
            data: this.chartData.ys,
            tension: 0.1
          }
        ],

      }, {
        responsive: false,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: this.chartTitle
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.options.y
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.options.x
            }
          }],
        },
        elements: {
          line: {
            borderColor: '#FF0000'
          }
        }
      });
    }
  },
  props: ['chartData', 'options', 'chartTitle'],
  mounted () {
    this.render()
  },
  watch: {
    'chartData.xs' () {
      this.$data._chart.update()
    },
    "options.y" () {
      console.log(this.options.y);
      this.render()
    }
  },
}


