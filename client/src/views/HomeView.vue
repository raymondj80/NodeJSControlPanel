<template>
  <div>
      <DataHeader :headers='headers'/>
      <ScriptBuilder/>
      <Record/>
  </div>
</template>

<script>
import ScriptBuilder from "../components/ScriptBuilder.vue";
import DataHeader from "../components/DataHeader.vue";
import Record from "../components/ManualRecord.vue";
import SocketService from '../services/socketservice';


export default {
  name: 'HomeView',
  props: ['authToken'],
  components: {
    ScriptBuilder,
    DataHeader,
    Record
  },
  data() {
      return {
          headers: {},
          error: '',
          response: 'No data yet...',
          authStatus: 'No Auth Status',
          intervalid: null
      }
  },
  methods: {
  },
  beforeMount() {
    this.intervalid = setInterval(() => {
      SocketService.fetchData().then((res) => {
        this.headers= res;
      })
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalid);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.header {
  position: relative;
  border: 1px solid #5bd658;
  background-color:  #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.home {
  display: flex;
  position: relative;
  max-width: 100%;
  margin: 0 auto;
}

p.text {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
