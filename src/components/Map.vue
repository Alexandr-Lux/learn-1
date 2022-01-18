<template>
  <div class="wrapper">
    <button @click="changeStateToWatch">А ну ка</button>
    <div id="mapContainer" class="mapComp"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import maps from '../configs/maps'
import layers from '../configs/layers'
import * as dataFn from '../configs/dataFunctions'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BaseMap',
  data () {
    return {
      mapgl: null,
      sources: [],
      accessToken: 'pk.eyJ1IjoiYWxla3NhbmRybHVrcyIsImEiOiJja3k5cW11OHEwOHozMzJvMDQ3NmNkb3hzIn0.29DVVkWSchzT4Hh210QUBg'
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations,
      activeModal: state => state.activeModal
    })
  },
  methods: {
    ...mapActions(['fetchStations', 'createModal', 'changeStateToWatch']),
    jsonToGeojson (json, getData, type) {
      const features = getData(json).map(item => {
        return {
          type: 'Feature',
          geometry: {
            type,
            coordinates: item.coordinates
          },
          properties: item.properties
        }
      })

      return {
        type: 'FeatureCollection',
        features
      }
    },
    async addLayerToMap (dataset, fetchFn, sourceId, type) {
      await fetchFn()
      const geoJson = this.jsonToGeojson(this[sourceId], dataFn.stationsFeatures, type)
      if (!this.sources.includes(sourceId)) {
        this.sources.push(sourceId)
        this.mapgl.addSource(sourceId, {
          type: 'geojson',
          data: geoJson
        })
      }
      this.mapgl.addLayer(dataset)

      this.mapgl.on('click', dataset.id, (e) => {
        this.moveCenterTo(e.features[0].geometry.coordinates)
        this.createModal(e.features[0].properties.id)
      })

      this.mapgl.on('mouseenter', dataset.id, () => {
        this.mapgl.getCanvas().style.cursor = 'pointer'
      })
      this.mapgl.on('mouseleave', dataset.id, () => {
        this.mapgl.getCanvas().style.cursor = ''
      })
    },
    moveCenterTo (center) {
      this.mapgl.flyTo({
        center
      })
    }
  },
  watch: {
    activeModal (cur) {
      if (cur) {
        this.moveCenterTo([cur.lng, cur.lat])
      }
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken
    this.mapgl = new mapboxgl.Map(maps.baseMap)
    this.mapgl.on('load', async () => {
      this.addLayerToMap(layers.metroMarkers, this.fetchStations, 'stations', 'Point')
      this.addLayerToMap(layers.metroTitles, this.fetchStations, 'stations', 'Symbol')

      // this.mapgl.on('click', 'metro-stations-icon', (e) => {
      //   this.mapgl.flyTo({
      //     center: e.features[0].geometry.coordinates
      //   })
      //   this.createModal(e.features[0].properties)
      // })
    })
  }
}

</script>

<style lang='scss' scoped>
  .mapComp {
    height: 100vh;
    width: 100%;
  }
</style>
