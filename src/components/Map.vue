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
import createPaintPropetyConfig from '../helpers/createPaintPropetyConfig'
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

    async addLayerToMap (layerConfig, sourceConfig) {
      if (sourceConfig && sourceConfig.url) {
        await this.fetchDataset({ url: sourceConfig.url, id: sourceConfig.id })
        this.SET_GEOJSON({ data: jsonToGeojson(this[sourceConfig.id], sourceConfig.type, sourceConfig.id), id: sourceConfig.id })
      }

      if (sourceConfig) {
        if (!this.sourcesOnMap.some(src => src.id === sourceConfig.id)) {
          this.sourcesOnMap.push({ id: sourceConfig.id, activeLayerIds: [layerConfig.id] })
          this.mapgl.addSource(sourceConfig.id, {
            type: 'geojson',
            data: this[`geo${sourceConfig.id}`]
          })
        } else {
          this.sourcesOnMap.find(src => src.id === sourceConfig.id).activeLayerIds.push(layerConfig.id)
        }
      }

      if (!this.layersOnMap.some(lyr => lyr.id === layerConfig.id)) {
        this.layersOnMap.push({ isActive: true, ...layerConfig })
      }

      this.mapgl.addLayer(layerConfig)

      this.mapgl.on('click', layerConfig.id, (e) => {
        this.SET_ACTIVEMODAL({ id: e.features[0].properties.id, type: sourceConfig.id })
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
      const currentSource = this.sourcesOnMap.find(src => src.id === currentLayer.source)

      if (!currentLayer.isActive) {
        this.mapgl.removeLayer(currentLayer.id)

        currentSource.activeLayerIds.splice(currentSource.activeLayerIds.indexOf(currentLayer.id), 1)

        if (currentSource.activeLayerIds.length === 0) {
          this.mapgl.removeSource(currentSource.id)
          this.SET_GEOJSON({ data: null, id: currentSource.id })
          this.sourcesOnMap.splice(this.sourcesOnMap.indexOf(currentSource), 1)
        }
      } else {
        if (!currentSource) {
          this.addLayerToMap(currentLayer, sources[currentLayer.source])
        } else {
          this.sourcesOnMap.find(src => src.id === currentLayer.source).activeLayerIds.push(currentLayer.id)
          this.addLayerToMap(currentLayer)
        }
      }
    }
  },
  watch: {
    activeModalConfig (curModalInfo) {
      if (curModalInfo) {
        if (curModalInfo.type === 'stations') {
          const curStation = this.stations.find(ln => {
            return ln.stations.find(st => st.id === curModalInfo.id)
          }).stations.find(st => st.id === curModalInfo.id)
          this.mapgl.flyTo({ center: [curStation.lng, curStation.lat], zoom: 13 })
          this.mapgl.setPaintProperty('metro-stations-icon', 'circle-radius', [
            'case',
            ['==', ['get', 'id'], curModalInfo.id],
            8,
            4
          ])
          this.mapgl.setLayoutProperty('metro-stations-name', 'text-size', [
            'case',
            ['==', ['get', 'id'], curModalInfo.id],
            20,
            12
          ])
        } else if (curModalInfo.type === 'lines') {
          const coordinates = this.geolines.features.find(geol => geol.properties.id === curModalInfo.id).geometry.coordinates
          const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
          )
          for (const coord of coordinates) {
            bounds.extend(coord)
          }
          this.mapgl.fitBounds(bounds, {
            padding: 50
          })

          this.mapgl.setPaintProperty('metro-lines', 'line-width', [
            'case',
            ['==', ['get', 'id'], curModalInfo.id],
            10,
            4
          ])
        }
      } else {
        this.mapgl.setPaintProperty('metro-lines', 'line-width', 4)
        this.mapgl.setPaintProperty('metro-stations-icon', 'circle-radius', 4)
        this.mapgl.setLayoutProperty('metro-stations-name', 'text-size', 12)
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
      this.mapgl.setPaintProperty('metro-lines', 'line-color', createPaintPropetyConfig(this.geolines))
      this.layersOnMap.find(lyr => lyr.id === 'metro-lines').paint['line-color'] = createPaintPropetyConfig(this.geolines)
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
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 15, 30, .4);
      padding: 5px;
      display: flex;
      width: 100%;
      justify-content: center;
    }
    &__btn-item {
      margin-bottom: 10px;
      margin: 0 20px 10px;
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
