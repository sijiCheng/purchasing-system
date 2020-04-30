import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './normalize.css'
import i18n from './i18n';

Vue.use(MintUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  i18n
}).$mount('#app')
