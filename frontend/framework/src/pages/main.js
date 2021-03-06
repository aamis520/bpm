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
// 设置超时时间为30秒
Vue.http.interceptors.push((request, next) => {
    let timeout = 30 * 1000;
    // 這裡改用 _timeout
    // if (request._timeout) {
    timeout = setTimeout(() => {
        //自定义响应体 status:408,statustext:"请求超时"，并返回给下下边的next
        next(request.respondWith(request.body, {
            status: 408,
            statusText: '请求超时'
        }));

    }, timeout);
    // }
    next((response) => {
        if(response.status == 408){
            console.log('status:' + response.status)//如果超时输出408
            console.log("request:" + request.url)
        }

        return response;
    })
})