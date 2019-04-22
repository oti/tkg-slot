import '@babel/polyfill'
import '@/assets/app.styl'
import { setDayjsLocaleToJa } from '@/plugins/dayjs'
import useVeeValidate from '@/plugins/validator'
import useVuetify from '@/plugins/vuetify'
import createRouter from '@/router'
import createStore from '@/store'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// プラグインを引き当てる
setDayjsLocaleToJa()
useVuetify()
useVeeValidate()
const router = createRouter()
const store = createStore()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
