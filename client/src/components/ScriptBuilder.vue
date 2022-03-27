<template>
  <div class="container">
                <h2 style=" float:left; display:inline-block; margin-left: 0; margin-bottom: 15px;">
                    Script
                </h2>
                <div style=" float: right;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                      <input type="text" class="form-control" v-model="script_name" required="true" placeholder="Filename">
                        <b-button @click="saveScript" variant="outline-primary">Save</b-button>
                        <b-button v-b-modal.load-script-modal @click="getScriptNames" variant="outline-success">Load</b-button>
                    </div>

                    <b-modal id="load-script-modal" title="Load Script">
                        <b-form-select v-model="selected_script" :options="script_names"></b-form-select>
                        <template #modal-footer>
                            <b-button size="sm" variant="success" @click="loadScript">
                                Load
                            </b-button>
                            <b-button size="sm" variant="danger" @click="deleteScript">
                                Delete
                            </b-button>
                        </template>
                    </b-modal>
            </div>

            <b-form-textarea class="text-area" id="script" v-model="script" placeholder="Write script..." rows="10"
                max-rows="10">
            </b-form-textarea>
            <p class="run">
                <button class="btn btn-outline-warning" style="margin-right:40px; width:200px" @click="selectFolder">Select Upload Folder <b-icon icon="upload" aria-hidden="true"></b-icon></button>
                <button class="btn btn-outline-danger" style="width:75px" @click="runScript">Run</button>
            </p>
</div>
</template>

<script>
import FireBase from "../services/firebase";
import SocketService from "../services/socketservice";
export default {
  name: 'ScriptBuilder',
  props: {
    msg: String
  },
  data() {
      return {
        script_name: '',
        script: '',
        selected_script: null,
        script_names: [],
        folder_id: '',
      }
  },
  async mounted() {
      let gDrive = document.createElement("script");
      gDrive.setAttribute("type", "text/javascript");
      gDrive.setAttribute("src", "https://apis.google.com/js/api.js");
      document.head.appendChild(gDrive);
  },
  methods: {
      saveScript(event) {
          event.preventDefault();
          FireBase.saveScript(this.script_name, this.script);
      },
      getScriptNames(event) {
          event.preventDefault();
          FireBase.getFileNames("scripts").then((res) => {
            this.script_names = res;
          });
      },
      loadScript(event) {
          event.preventDefault();
          console.log('load');
          this.$root.$emit('bv::hide::modal', 'load-script-modal');
          FireBase.getScript(this.selected_script).then((res) => {
            this.script_name = this.selected_script;
            this.script = res;
          })
      },
      deleteScript(event) {
        event.preventDefault();
        FireBase.deleteScript(this.selected_script).then((res) => {
            this.script_names = res;
        })
      },
      runScript(event) {
        console.log("running script");
        event.preventDefault();
        SocketService.runScript(this.script);

      },
      selectFolder() {
        gapi.load("picker", () => {
          console.log("Picker Loaded");
          this.pickerApiLoaded = true;
          this.createPicker();
        });
      },
      createPicker() {
        var docs_view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(this.folder_id)
            .setOAuthToken(this.$store.getters.token)
            .setTitle('Select Folder')
            .addView(docs_view)
            .setCallback(this.pickerCallback)
            .build();
        picker.setVisible(true);
      },
      pickerCallback(data) {
        
        if (data.action == google.picker.Action.PICKED) {
          this.folder_id = data.docs[0].id;
          this.$store.commit('modifyFolderId', this.folder_id);
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
  clear: both;
}

.build-script {
  max-width: 100%;
  margin: 0 auto;
}
p.run {
  margin-top: 10px;
  margin-bottom: 75px;
  text-align: right;
}
</style>
