import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    numCharts: 2,
    authToken: "",
    folderid: ""
  }
}

export default new Vuex.Store({
  state: {
    numCharts: 2,
    authToken: "",
    folderid: ""
  },
  getters: {
      numCharts: (state) => {return state.numCharts},
      token: (state) => {return state.authToken},
      folderid: (state) => {return state.folderid}
  },
  mutations: {
      modifyNumCharts(state, n) {
        state.numCharts = n;
      },
      modifyToken(state, token) {
        state.authToken = token;
      },
      modifyFolderId(state, folderid) {
        state.folderid = folderid;
      },
      reset(state) {
          state.numCharts = 2;
      },
      resetState(state) {
        Object.assign(state, getDefaultState());
      }
  },
  plugins: [createPersistedState()],
});