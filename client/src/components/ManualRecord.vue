<template>
  <div class="container">
            <h2 style=" float:left; display:inline-block; margin-left: 0; margin-bottom: 20px;">
                    Record
            </h2>
            <div>
                <div style=" float: right; margin-left: -50%;">

                    <b-button-group>
                        <b-form-input v-model="record_name" placeholder="Filename"></b-form-input>
                        <b-button @click="startManualRecord" variant="outline-success">Start</b-button>
                        <b-button @click="stopManualRecord" variant="outline-danger">Stop</b-button>
                    </b-button-group>
                </div>
            </div>
            <div>
                <b-form>
                    <b-input-group class="record-inputs" style="margin-bottom: 40px">
                        <b-form-input id="record-time" v-model="time" type="text" placeholder="HH:mm:ss" required>
                        </b-form-input>
                    </b-input-group>
                </b-form>
            </div>
    </div>
</template>

<script>
import SocketService from "../services/socketservice";
export default {
  name: 'ManualRecord',
  props: {
    msg: String
  },
  data() {
      return {
        time: '',
        record_name: '',
      }
  },
  methods: {
      startManualRecord() {
        const time = this.time.split(':');
        const converted_time = (+time[0] * 60 * 60 + +time[1] * 60 + +time[2] - 2);
        SocketService.startManualRecord(converted_time, this.record_name);
      },
      stopManualRecord() {
        SocketService.stopManualRecord(this.record_name);
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 20px 0 0;
}
ul {
  list-style-type: none;
  padding: 20;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

div.container {
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 40px;
}

.build-script {
  max-width: 100%;
  margin: 0 auto;
}
p.run {
  margin-top: 10px;
}
</style>
