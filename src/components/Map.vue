<template>
  <div class="wrapper">
    <div id="mapContainer" class="mapComp"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BaseMap',
  data () {
    return {
      mapgl: null,
      popup: null,
      accessToken: 'pk.eyJ1IjoiYWxla3NhbmRybHVrcyIsImEiOiJja3k5cW11OHEwOHozMzJvMDQ3NmNkb3hzIn0.29DVVkWSchzT4Hh210QUBg'
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations
    })
  },
  methods: {
    ...mapActions({
      fetchStations: 'fetchStations'
    }),
    stationsToGeojson (data) {
      const features = []

      data.forEach(ln => {
        ln.stations.forEach(st => {
          features.push({
            type: 'Feature',
            properties: {
              order: st.order,
              name: st.name,
              admArea: st.admArea,
              district: st.district,
              status: st.status
            },
            geometry: {
              type: 'Point',
              coordinates: [st.lng, st.lat]
            }
          })
        })
      })

      return {
        type: 'FeatureCollection',
        features: features
      }
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken

    this.mapgl = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [37.58, 55.748],
      zoom: 11,
      bearing: 0
    })

    this.mapgl.on('load', async () => {
      await this.fetchStations()

      this.mapgl.addSource('stations', {
        type: 'geojson',
        data: this.stationsToGeojson(this.stations)
      })

      this.mapgl.addLayer({
        id: 'metro-stations-icon',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-color': '#4264fb',
          'circle-radius': 5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })

      this.mapgl.addLayer({
        id: 'metro-stations-name',
        type: 'symbol',
        source: 'stations',
        layout: {
          'text-field': ['get', 'name'],
          'text-offset': [0.5, 0],
          'text-anchor': 'left'
        },
        paint: {
          'text-color': '#555'
        }
      })

      this.mapgl.on('click', 'metro-stations-icon', (e) => {
        this.mapgl.flyTo({
          center: e.features[0].geometry.coordinates
        })

        const coordinates = e.features[0].geometry.coordinates
        const description = e.features[0].properties.name

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.mapgl)
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
