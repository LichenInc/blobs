import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    looping: false,
    repetition: 0
  },
  mutations: {
    set_looping (state, payload) {
      state.looping = payload
    },
    set_repetition (state, payload) {
      state.repetition = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
