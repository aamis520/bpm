import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import globalconfig from './Config'
Vue.prototype.globalconfig = globalconfig

Vue.use(iView)
Vue.use(VueResource);
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})

// 设置超时时间为30秒
Vue.http.interceptors.push((request, next) => {
    var date = new Date()
    let id = Math.random()*700
    console.log("start request " + id + ":" + request.url + " time " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
let timeout = 30 * 1000;
  // 這裡改用 _timeout
  // if (request._timeout) {
    var timer = setTimeout(() => {
      //自定义响应体 status:408,statustext:"请求超时"，并返回给下下边的next
      console.log("timeout request " + id + ":" + request.url + " time " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
    }, timeout);
  // }
  next((response) => {
    clearTimeout(timer);
    var date = new Date()
    console.log("complete request " + id + ":" + request.url + " time " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
    console.log(response.status)//如果超时输出408
    return response;
  })
})

