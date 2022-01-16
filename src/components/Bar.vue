<template>
  <div id="barContainer" class="barComp">
    <h1 class="barComp__title">Станции метро</h1>
    <ul class="barComp__lines-list">
      <li class="barComp__line" v-for="line in lines" :key="line.name">
        <Branch :lineObj="line"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Branch from './Branch.vue'

export default {
  components: {
    Branch
  },
  computed: {
    ...mapState({
      lines: state => state.stations
    })
  },
  methods: {
    ...mapActions({
      displayPopup: 'displayPopup'
    })
  }
}
</script>

<style lang="scss">
  .barComp {
    padding: 15px;
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
    &__line {
      padding: 10px 5px;
      border-bottom: 1px solid #ccc;
      &:last-child {
        border: none;
      }
    }
  }
</style>
