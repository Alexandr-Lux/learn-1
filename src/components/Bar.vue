<template>
  <div id="barContainer" class="barComp" v-if="stations">
    <h1 class="barComp__title">Станции метро</h1>
    <div class="barComp__input">
      <el-input
        class="barComp__input-item"
        v-model="search"
        clearable>
      </el-input>
    </div>
    <ul class="barComp__lines-list">
      <li class="barComp__lines-item line" v-for="line in filteredStations" :key="line.name" ref="line">
        <div class="line__name" @click="accordeon(line.name)" :style="{ borderBottom: `2px solid #${line.hex_color}` }">{{line.name}}</div>
        <ul :class="['line__stations-list', {opened: openLine === line.name}]">
          <li class="line__stations-item" @click="createModal(station.id)" v-for="station in line.stations" :key="station.id">{{station.name}}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      openLine: '',
      search: ''
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations
    }),
    filteredStations () {
      return this.stations.filter(line => {
        return line.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    ...mapActions({
      createModal: 'createModal'
    }),
    accordeon (line) {
      this.openLine === line ? this.openLine = '' : this.openLine = line
    }
  }
}
</script>

<style lang="scss">
  .barComp {
    padding: 15px 50px 15px 15px;
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
      &:hover {
        background-color: #ccc;
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
</style>
