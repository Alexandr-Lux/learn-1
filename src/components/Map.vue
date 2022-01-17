<template>
  <div class="wrapper">
    <div id="mapContainer" class="mapComp"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import layers from '../helpers/layers'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BaseMap',
  data () {
    return {
      mapgl: null,
      accessToken: 'pk.eyJ1IjoiYWxla3NhbmRybHVrcyIsImEiOiJja3k5cW11OHEwOHozMzJvMDQ3NmNkb3hzIn0.29DVVkWSchzT4Hh210QUBg'
    }
  },
  computed: {
    ...mapState({
      geoStations: state => state.geoStations
    })
  },
  methods: {
    ...mapActions({
      fetchStations: 'fetchStations',
      createModal: 'createModal'
    })
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken

    this.mapgl = new mapboxgl.Map(layers.map)

    this.mapgl.on('load', async () => {
      await this.fetchStations()

      this.mapgl.addSource('stations', {
        type: 'geojson',
        data: this.geoStations
      })

      this.mapgl.addLayer(layers.metroMarkers)
      this.mapgl.addLayer(layers.metroTitles)

      this.mapgl.on('click', 'metro-stations-icon', (e) => {
        this.mapgl.flyTo({
          center: e.features[0].geometry.coordinates
        })
        this.createModal(e.features[0].properties)
      })

      this.mapgl.on('mouseenter', ['metro-stations-icon', 'metro-stations-name'], (e) => {
        this.mapgl.getCanvas().style.cursor = 'pointer'
      })
      this.mapgl.on('mouseleave', ['metro-stations-icon', 'metro-stations-name'], () => {
        this.mapgl.getCanvas().style.cursor = ''
      })
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
