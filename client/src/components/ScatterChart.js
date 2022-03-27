import { Scatter, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  methods: {
    render() {
      this.renderChart({
        datasets: [
          {
            label: this.chartTitle,
            data: this.chartData,
            tension: 0.1,
            backgroundColor: '#FF0000'

          }
        ], 
      }, {
        responsive: false,
        maintainAspectRatio: true,
        },
      );
    }
  },
  props: ['chartData', 'chartTitle', 'options'],
  mounted () {
    this.render()
  },
  watch: {
    'chartData' () {
      this.$data._chart.update();
    },
    'options' () {
      this.$data._chart.update();
    }
  },
}


