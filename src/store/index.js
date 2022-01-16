import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stations: null
  },
  mutations: {
    SET_STATIONS (state, payload) {
      state.stations = payload
    }
  },
  actions: {
    async fetchStations ({ commit }) {
      try {
        await fetch('./data/metro.json')
          .then(res => res.json())
          .then(data => {
            commit('SET_STATIONS', data)
          })
      } catch (error) {
        alert(error)
      }
    }
  }
})
