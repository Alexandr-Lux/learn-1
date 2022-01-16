<template>
  <div class="branchComp">
    <div class="branchComp__wrapper" @click="openStations()">
      <div class="branchComp__circle" :style="{ 'background-color': '#' + lineObj.hex_color }"></div>
      <span class="branchComp__name">{{ lineObj.name }}</span>
    </div>
    <ul :class="['branchComp__stations-list', {'opened': isOpen}]">
      <li class="branchComp__station station" v-for="st in lineObj.stations" :key="st.order" @click="$emit('clickFromLine', [st.lng, st.lat])">
        <div class="station__name">{{ st.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isOpen: false
    }
  },
  props: {
    lineObj: {
      type: Object,
      required: true
    }
  },
  methods: {
    openStations () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="scss" scoped>
  .branchComp {
    cursor: pointer;

    &__wrapper {
      display: flex;
      align-items: center;
    }
    &__circle {
      width: 25px;
      height: 25px;
      border: 1px solid #333;
      border-radius: 50%;
      margin-right: 10px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    &__stations-list {
      height: 0;
      opacity: 0;
      overflow: hidden;
      transition: .5s;
      &.opened {
        height: auto;
        opacity: 1;
      }
    }
  }

  .station {
    padding: 5px 0 5px 35px;
    &:first-child {
      padding-top: 10px;
    }
  }
</style>
