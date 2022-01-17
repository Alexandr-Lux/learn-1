import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI, { locale })

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
