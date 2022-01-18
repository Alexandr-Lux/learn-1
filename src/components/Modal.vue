<template>
  <div class="modalComp" v-if="activeModal">
    <el-dialog
      :visible="activeModal !== null"
      width="40%"
      :before-close="closeModal"
      >
        <div slot="title" class="modalComp__title">{{activeModal.name}}</div>
        <div class="modalComp__text">Станция находится на линии {{activeModal.line}} в районе {{activeModal.district}}, {{activeModal.admArea}}. На данный момент станция {{activeModal.status}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      activeModal: state => state.activeModal
    })
  },
  methods: {
    ...mapActions({
      createModal: 'createModal'
    }),
    closeModal () {
      this.createModal(null)
    }
  }
}
</script>

<style lang="scss" scoped>
  .modalComp {
    &__text {
      text-align: center;
      font-size: 20px;
    }
    &__title {
      font-size: 30px;
      text-align: center;
    }
  }
</style>
