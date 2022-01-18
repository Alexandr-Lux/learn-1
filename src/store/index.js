import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeModal: null,
    stations: null
  },
  getters: {
    getStationById: state => id => {
      return state.stations.find(ln => {
        return ln.stations.find(st => st.id === id)
      }).stations.find(st => st.id === id)
    }
  },
  mutations: {
    SET_STATIONS (state, payload) {
      state.stations = payload.map(ln => {
        ln.stations.map(st => {
          st.id = `${ln.name}-${st.name}`
          st.line = ln.name
          return st
        })
        return ln
      })
    },
    SET_MODAL (state, payload) {
      state.activeModal = payload
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
    },
    createModal ({ commit, getters }, id) {
      if (id === null) {
        commit('SET_MODAL', id)
      } else {
        const modalStation = getters.getStationById(id)
        commit('SET_MODAL', modalStation)
      }
    }
  }
})
