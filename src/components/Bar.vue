<template>
  <div id="barContainer" class="barComp">
    <h1 class="barComp__title">Станции метро</h1>
    <el-tree
      v-if="stations"
      :data="stations"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick">
    </el-tree>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      defaultProps: {
        children: 'stations',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapState({
      stations: state => state.stations,
      modalIsOpened: state => state.modalIsOpened,
      actionModal: state => state.actionModal
    })
  },
  methods: {
    ...mapActions({
      createModal: 'createModal'
    }),
    handleNodeClick (data, node) {
      if (node.childNodes.length === 0) {
        this.createModal(data)
      }
    }
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
  }
</style>
