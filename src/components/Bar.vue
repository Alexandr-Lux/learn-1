<template>
  <div id="barContainer" class="barComp" v-if="stations">
    <el-tabs v-model="activeTab" @tab-click="openLineId = ''" type="border-card" stretch>
      <el-tab-pane label="Станции" name="stations"></el-tab-pane>
      <el-tab-pane label="Линии" name="lines"></el-tab-pane>
      <div class="barComp__input">
        <el-input
          class="barComp__input-item"
          v-model="filterText"
          clearable>
        </el-input>
      </div>
      <ul class="barComp__lines-list">
        <li class="barComp__lines-item line" v-for="line in sourceByTab()" :key="line.name" ref="line">
          <div
            :class="['line__name', {'borderBottom': activeTab === 'stations', 'borderLeft': activeTab === 'lines'}]"
            @click="linesHandler(line.id)"
            :style="{ 'border-color': `#${line.hex_color}` }">
              {{line.name}}
          </div>
          <ul v-if="activeTab === 'stations'" :class="['line__stations-list', {opened: (openLineId === line.id) || searchText}]">
            <li
              class="line__stations-item"
              @click="SET_ACTIVEMODAL({ id: station.id, type: 'stations'})"
              v-for="station in line.stations"
              :key="station.id">{{station.name}}
            </li>
          </ul>
        </li>
      </ul>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      openLineId: '',
      activeTab: 'stations'
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations.data,
      searchText: state => state.filterText
    }),
    ...mapGetters(['filterStationsBySearch', 'filterLinesBySearch']),
    filterText: {
      get () {
        return this.searchText
      },
      set (value) {
        this.FILTER_STATIONS({ value, type: this.activeTab })
      }
    }
  },
  methods: {
    ...mapMutations(['FILTER_STATIONS', 'SET_ACTIVEMODAL']),
    linesHandler (lineId) {
      switch (this.activeTab) {
        case 'stations':
          this.openLineId === lineId ? this.openLineId = '' : this.openLineId = lineId
          break
        case 'lines':
          this.SET_ACTIVEMODAL({ id: lineId, type: 'lines' })
      }
    },
    sourceByTab () {
      switch (this.activeTab) {
        case 'stations':
          return this.filterStationsBySearch
        case 'lines':
          return this.filterLinesBySearch
      }
    }
  }
}
</script>

<style lang="scss">
  .barComp {
    padding: 0px;
    min-height: 100%;
    max-height: 100vh;
    width: 350px;
    background-color: #fff;
    overflow: auto;
    &__title {
      font-weight: 700;
      font-size: 28px;
      margin-bottom: 15px;
    }
    &__input {
      padding-bottom: 20px;
    }
  }

  .line {
    cursor: pointer;
    &__name {
      padding: 7px;
      margin-bottom: 5px;
      &:hover {
        background-color: #ccc;
      }
      &.borderBottom {
        border-bottom: 2px solid;
      }
      &.borderLeft {
        border-left: 5px solid;
      }
    }
    &__stations-list {
      height: 0;
      overflow: hidden;
      &.opened {
        height: auto;
      }
    }
    &__stations-item {
      padding-left: 20px;
      padding: 5px 0 5px 20px;
      &:hover {
        background-color: #ddd;
      }
    }
  }

  .el-tabs {
    &__item {
      font-size: 24px !important;
      height: 50px !important;
      line-height: 50px !important;
      &.is-active {
        color: #000 !important;
      }
    }
  }
</style>
