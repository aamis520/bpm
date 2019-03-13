import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import globalconfig from './Config'
import pinyin from 'pinyin'
Vue.prototype.globalconfig = globalconfig

Vue.use(iView)
Vue.use(VueResource)
Vue.use(pinyin)

Vue.config.productionTip = false


new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})


