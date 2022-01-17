import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    geoStations: null,
    actionModal: null,
    stations: null,
    modalIsOpened: false
  },
  mutations: {
    SET_STATIONS (state, payload) {
      const features = []

      payload.forEach(ln => {
        ln.stations.forEach(st => {
          features.push({
            type: 'Feature',
            properties: {
              order: st.order,
              name: st.name,
              admArea: st.admArea,
              district: st.district,
              status: st.status,
              line: ln.name
            },
            geometry: {
              type: 'Point',
              coordinates: [st.lng, st.lat]
            }
          })
        })
      })

      state.geoStations = {
        type: 'FeatureCollection',
        features
      }

      state.stations = payload
    },
    SET_MODAL_STATUS (state, payload) {
      state.modalIsOpened = !state.modalIsOpened
      state.actionModal = payload
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
    createModal ({ commit }, data) {
      commit('SET_MODAL_STATUS', data)
    }
  }
})
