import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
Vue.use(Router);
Vue.use(iView);

let approuter = new Router({
    routes: [
        {
	        path: '/',
	        redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../pages/index.vue'], resolve),
            children: [
                {
                    path: '/flow',
                    component: resolve => require(['../pages/framework/flow.vue'], resolve),
                },
                {
                    path: '/keywordgenerate',
                    component: resolve => require(['../pages/framework/keywordgenerate.vue'], resolve),
                },
                {
                  path: '/flowDesign',
                    component: resolve => require(['../pages/framework/flowDesign.vue'], resolve),
                },
                {
                    path: '/list',
                    component: resolve => require(['../pages/framework/flownodepages.vue'], resolve),
                },
                {
                    path: '/submitform',
                    component: resolve => require(['../pages/framework/pageedit/submitform.vue'], resolve),
                },
                {
                    path: '/approval',
                    component: resolve => require(['../pages/framework/pageedit/approval.vue'], resolve),
                },
                {
                    path: '/blankPage',
                    component: resolve => require(['../pages/framework/pageedit/blankPage.vue'], resolve),
                },
                {
                    path: '/tabpage',
                    component: resolve => require(['../pages/framework/pageedit/tabpage.vue'], resolve),
                },
                {
                    path: '/tabsubmitform',
                    component: resolve => require(['../pages/framework/pageedit/tabsubmitform.vue'], resolve),
                },
                {
                    path: '/test',
                    component: resolve => require(['../pages/framework/pageedit/test1.vue'], resolve),
                },
                {
                    path: '/yanglftest',
                    component: resolve => require(['../pages/framework/yanglftest.vue'], resolve),
                },
                {
                    path: '/keywordgenerate',
                    component: resolve => require(['../pages/framework/keywordgenerate.vue'],resolve),
                },
                {
                    path:'/listallcks',
                    component: resolve => require(['../pages/framework/listallcks.vue'],resolve),
                },

                {
                  path:'/messageList',
                  component: resolve => require(['../pages/framework/messageList.vue'],resolve),
                },
                {
                  path:'/messageCard',
                  component: resolve => require(['../pages/framework/messageCard.vue'],resolve),
                },
//              {
//                path:'/personselectdialog',
//                component: resolve => require(['../pages/framework/personselectdialogmodal.vue'],resolve),
//              }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../pages/login.vue'], resolve),
        }

    ]
})

iView.LoadingBar.config({
    color: 'primary',
    failedColor: '#f0ad4e',
    height: 5
});

approuter.beforeEach((to,from,next) =>{
	//设置标题
//	window.document.title = to.meta.titile
	//可以在这里判断登陆状态  是否跳转到登录页
//	if(window.localStorage.getItem(token)){
//		next()
//	}else{
//		next('./login')
//	}
	
	iView.LoadingBar.start()
	next()
})

approuter.afterEach((to,from,next) =>{
	window.scrollTo(0,0)
	iView.LoadingBar.finish()
})

export default approuter
