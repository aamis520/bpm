import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


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
                {
                  path:'/personselectdialog',
                  component: resolve => require(['../pages/framework/personselectdialogmodal.vue'],resolve),
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../pages/login.vue'], resolve),
        }

    ]
})


export default approuter
