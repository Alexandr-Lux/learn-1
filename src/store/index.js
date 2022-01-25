import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeModalConfig: null,
    whatToSearch: '',
    mainLoading: true,
    stations: {
      data: null,
      geojson: null
    },
    lines: {
      data: null,
      geojson: null
    },
    filterText: ''
  },
  getters: {
    filterStationsBySearch: state => {
      return state.stations.data.filter(line => {
        return line.stations.filter(station => {
          return station.name.toLowerCase().indexOf(state.filterText.toLowerCase()) !== -1
        }).length !== 0
      }).map(line => {
        return {
          ...line,
          stations: line.stations.filter(station => {
            return station.name.toLowerCase().indexOf(state.filterText.toLowerCase()) !== -1
          })
        }
      })
    },
    filterLinesBySearch: state => {
      return state.lines.data.filter(line => {
        return line.name.toLowerCase().includes(state.filterText.toLowerCase())
      })
    }
  },
  mutations: {
    SET_SOURCES_DATA (state, payload) {
      state[payload.id].data = payload.data
      state.mainLoading = false
    },
    SET_ACTIVEMODAL (state, payload) {
      state.activeModalConfig = payload
    },
    FILTER_STATIONS (state, payload) {
      state.filterText = payload.value
      state.whatToSearch = payload.type
    },
    SET_GEOJSON (state, payload) {
      state[payload.id].geojson = payload.data
    }
  },
  actions: {
    async fetchDataset ({ commit }, { url, id }) {
      try {
        await fetch(url)
          .then(res => res.json())
          .then(data => {
            commit('SET_SOURCES_DATA', { data, id })
          })
      } catch (error) {
        alert(error)
      }
    }
  }
})
