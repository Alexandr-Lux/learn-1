<template>
  <div id="app">
    <div class="map-wrapper" v-loading="mainLoading">
      <div class="map-wrapper__bar">
        <Bar />
      </div>
      <div class="map-wrapper__map">
        <Map />
      </div>
    </div>
    <Modal v-if="!!activeModalConfig" />
  </div>
</template>

<script>
import Map from './components/Map.vue'
import Bar from './components/Bar.vue'
import Modal from './components/Modal.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Map,
    Bar,
    Modal
  },
  computed: {
    ...mapState({
      activeModalConfig: state => state.activeModalConfig,
      mainLoading: state => state.mainLoading
    })
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap');
  *{padding: 0;margin: 0;border: 0;}
  *,*:before,*:after{-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}
  :focus,:active{outline: none;}
  a:focus,a:active{outline: none;}
  address{font-style:inherit;}
  aside,nav,footer,header,main,section{display: block;}
  html,body{height: 100%;width: 100%;min-width: 320px;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
  body{-ms-text-size-adjust: 100%;-moz-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}
  input,button,textarea{font-family: inherit;}
  input::-ms-clear{display: none;}
  button{cursor: pointer;background-color:transparent;}
  button::-moz-focus-inner {padding:0;border:0;}
  a, a:visited{text-decoration: none;color:inherit;}
  a:hover{text-decoration: none;}
  ul li{list-style: none;}
  img{display: block;max-width: 100%;}
  h1,h2,h3,h4,h5,h6{font-weight: inherit;font-size: inherit;margin: 0;}
  cite{font-style: normal;}
  svg{display: block;min-width: 100%;}

  body {
    font-family: 'PT Sans Narrow', sans-serif;
  }

  .map-wrapper {
    display: flex;
    position: relative;
    height: 100vh;
    &__map {
      height: 100%;
      width: 100%;
    }
    &__bar {
      height: 100%;
      width: 350px;
    }
  }
</style>
