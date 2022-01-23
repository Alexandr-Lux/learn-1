<template>
  <div class="mapComp">
    <div id="mapContainer" class="mapComp__map"></div>
    <ul class="mapComp__btn-list">
      <li class="mapComp__btn-item" v-for="(layer, index) in layersOnMap" :key="layer.id">
        <div class="mapComp__btn-name">{{layer.name}}</div>
        <el-switch
          v-model="layersOnMap[index].isActive"
          @change="toggleLayer(index)">
        </el-switch>
      </li>
    </ul>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import maps from '../configs/maps'
import layers from '../configs/layers'
import sources from '../configs/sources'
import jsonToGeojson from '../helpers/jsonToGeojson'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'BaseMap',
  data () {
    return {
      mapgl: null,
      sourcesOnMap: [],
      layersOnMap: [],
      accessToken: 'pk.eyJ1IjoiYWxla3NhbmRybHVrcyIsImEiOiJja3k5cW11OHEwOHozMzJvMDQ3NmNkb3hzIn0.29DVVkWSchzT4Hh210QUBg'
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations.data,
      lines: state => state.lines.data,
      geostations: state => state.stations.geojson,
      geolines: state => state.lines.geojson,
      activeModalConfig: state => state.activeModalConfig,
      searchText: state => state.filterText,
      searchType: state => state.whatToSearch
    })
  },
  methods: {
    ...mapActions(['fetchDataset', 'createModal']),
    ...mapMutations(['SET_GEOJSON', 'SET_ACTIVEMODAL']),

    async addLayerToMap (layerConfig, source) {
      if (source && source.url && this[source.id] === null) {
        await this.fetchDataset({ url: source.url, id: source.id })
        this.SET_GEOJSON({ data: jsonToGeojson(this[source.id], source.type, source.id), id: source.id })
      }

      if (source) {
        if (!this.sourcesOnMap.some(src => src.id === source.id)) {
          this.sourcesOnMap.push({ id: source.id, isActive: true })
          this.mapgl.addSource(source.id, {
            type: 'geojson',
            data: this[`geo${source.id}`]
          })
        }
        this.layersOnMap.push({ isActive: true, ...layerConfig })
      }

      this.mapgl.addLayer(layerConfig)

      this.mapgl.on('click', layerConfig.id, (e) => {
        this.SET_ACTIVEMODAL({ id: e.features[0].properties.id, type: source.id })
      })

      this.mapgl.on('mouseenter', layerConfig.id, () => {
        this.mapgl.getCanvas().style.cursor = 'pointer'
      })

      this.mapgl.on('mouseleave', layerConfig.id, () => {
        this.mapgl.getCanvas().style.cursor = ''
      })
    },
    toggleLayer (index) {
      const currentLayer = this.layersOnMap[index]

      if (!currentLayer.isActive) {
        this.mapgl.removeLayer(currentLayer.id)
      } else {
        this.addLayerToMap(currentLayer)
      }
    }
  },
  watch: {
    activeModalConfig (curModalInfo) {
      if (curModalInfo !== null) {
        if (curModalInfo.type === 'stations') {
          const curStation = this.stations.find(ln => {
            return ln.stations.find(st => st.id === curModalInfo.id)
          }).stations.find(st => st.id === curModalInfo.id)
          this.mapgl.flyTo({ center: [curStation.lng, curStation.lat], zoom: 13 })
        } else if (curModalInfo.type === 'lines') {
          this.mapgl.flyTo({ center: maps.baseMap.center, zoom: maps.baseMap.zoom })
        }
      }
    },
    searchText (cur) {
      this.mapgl.getSource(this.searchType).setData({
        type: 'FeatureCollection',
        features: this[`geo${this.searchType}`].features.filter(feature => {
          return feature.properties.name.toLowerCase().includes(cur.toLowerCase())
        })
      })
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken
    this.mapgl = new mapboxgl.Map(maps.baseMap)
    this.mapgl.on('load', async () => {
      await this.addLayerToMap(layers.markers, sources.stations)
      await this.addLayerToMap(layers.titles, sources.stations)
      await this.addLayerToMap(layers.lines, sources.lines)
    })
  }
}

</script>

<style lang='scss'>
  .mapComp {
    position: relative;
    &__map {
      height: 100vh;
      width: 100%;
    }
    &__btn-list {
      position: absolute;
      top: 1%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, .5);
      padding: 5px;
      border-radius: 10px;
      display: flex;
      width: 300px;
      justify-content: space-around;
    }
    &__btn-item {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    &__btn-name {
      color: #fff;
      margin-bottom: 10px;
    }
  }
</style>
