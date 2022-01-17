<template>
  <div class="modalComp">
    <el-button type="text" @click="createModal">click to open the Dialog</el-button>
    <el-dialog
      :title="actionModal.name"
      :visible.sync="modalIsOpened"
      width="30%"
      :before-close="createModal"
      v-if="modalIsOpened">
      <div>Станция {{actionModal.name}} находится на линии {{actionModal.line}} в районе {{actionModal.district}}, {{actionModal.admArea}}. На данный момент станция {{actionModal.status}}</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      modalIsOpened: state => state.modalIsOpened,
      actionModal: state => state.actionModal
    })
  },
  methods: {
    ...mapActions({
      createModal: 'createModal'
    })
  }
}
</script>

<style lang="scss" scoped>
  .modalComp {
    padding: 20px;
  }
</style>
