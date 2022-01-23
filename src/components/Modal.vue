<template>
  <div class="modalComp" v-if="modal">
    <div class="modalComp__dialog">
      <el-dialog
        :visible="modal !== null"
        width="40%"
        :before-close="closeModal"
        v-loading="loading"
        element-loading-text="wait for it..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        >
          <div v-if="!loading">
            <div slot="title" class="modalComp__title">{{modal.name}}</div>
            <div v-if="activeModalConfig.type === 'stations'" class="modalComp__text">Станция находится на линии {{modal.line}} в районе {{modal.district}}, {{modal.admArea}}. На данный момент станция {{modal.status}}</div>
            <div v-else class="modalComp__text">Здесь может быть информация о линии</div>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      modal: null,
      loading: true
    }
  },
  computed: {
    ...mapState({
      activeModalConfig: state => state.activeModalConfig,
      stations: state => state.stations.data,
      lines: state => state.lines.data
    })
  },
  methods: {
    ...mapMutations(['SET_ACTIVEMODAL']),
    closeModal () {
      this.SET_ACTIVEMODAL(null)
      this.modal = null
    }
  },
  mounted () {
    switch (this.activeModalConfig.type) {
      case 'stations':
        this.modal = this.stations.find(ln => {
          return ln.stations.find(st => st.id === this.activeModalConfig.id)
        }).stations.find(st => st.id === this.activeModalConfig.id)

        break
      case 'lines':
        this.modal = this.lines.find(ln => ln.id === this.activeModalConfig.id)
    }

    setTimeout(() => {
      this.loading = false
    }, 500)
  }
}
</script>

<style lang="scss">
  .modalComp {
    &__text {
      text-align: center;
      font-size: 20px;
      padding: 20px;
    }
    &__title {
      font-size: 30px;
      text-align: center;
      padding-top: 20px;
    }
  }

  .el-dialog {
    &__header {
      padding: 0 !important;
    }
    &__body {
      padding: 0 !important;
    }
  }
</style>
