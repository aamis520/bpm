import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview'
Vue.use(Router);

function generateRoutesFromMenu () {
	var page = JSON.parse(localStorage.getItem("pages"));
	var adminmenus = JSON.parse(localStorage.getItem("adminmenus"));
    if(!page){
    	return
    }
    var adminMenuIdArr = [];
    //下边两个for循环是把page中后台管理的去掉
    for(let i=0;i<adminmenus.length;i++){  //把管理员的adminmenus的child中的flowid放入adminMenuIdArr中
        for(let j=0;j<adminmenus[i].child.length;j++){
            adminMenuIdArr.push(adminmenus[i].child[j].flowid);
        }
    }
    for(let i=0;i<page.length;i++){
        if(adminMenuIdArr.indexOf(page[i].id)>-1){
            page[i].child = "";
        }
    }
    var json = [{
        path:'/messageList',
        component: resolve => require(['../pages/messageList.vue'],resolve),
      }];
    for (let m = 0, n = page.length; m < n; m++) {
        if(page[m].child){
            for (let h = 0, p = page[m].child.length; h < p; h++) {
                var temp = {};
                temp.path = '/' + page[m].id + '|' + page[m].child[h].node + '|' +page[m].child[h].filename
                temp.component = resolve => require(['../pages/flows/customer/' + page[m].id + '/' + page[m].child[h].node + '/' + page[m].child[h].filename + '.vue'], resolve);
                json.push(temp)
            }
        }
    }
    return json;
}
function generateRoutesFromAdminMenu () {
	var page = JSON.parse(localStorage.getItem("pages"));
	var adminmenus = JSON.parse(localStorage.getItem("adminmenus"));
    if(!page){
    	return
    }
    var adminMenuIdArr = [];
    //下边两个for循环是把page中不是后台管理的去掉
    for(let i=0;i<adminmenus.length;i++){  //把管理员的adminmenus的child中的flowid放入adminMenuIdArr中
        for(let j=0;j<adminmenus[i].child.length;j++){
            adminMenuIdArr.push(adminmenus[i].child[j].flowid);
        }
    }
    for(let i=0;i<page.length;i++){
        if(adminMenuIdArr.indexOf(page[i].id) < 0){
            page[i].child = "";
        }
    }
    var json = [{
      path:'/messageList',
      component: resolve => require(['../pages/messageList.vue'],resolve),
    }];
    for (let m = 0, n = page.length; m < n; m++) {
        if(page[m].child){
            for (let h = 0, p = page[m].child.length; h < p; h++) {
                var temp = {};
                temp.path = '/' + page[m].id + '|' + page[m].child[h].node + '|' +page[m].child[h].filename
                temp.component = resolve => require(['../pages/flows/customer/' + page[m].id + '/' + page[m].child[h].node + '/' + page[m].child[h].filename + '.vue'], resolve);
                json.push(temp)
            }
        }
    }
    // 这是后台需要的路由
    json.push(
      	{
            path: '/logo',
            component: resolve => require(['../pages/framework/logo.vue'], resolve)
        },
        {
            path: '/department',
            component: resolve => require(['../pages/framework/department.vue'], resolve)
        },
        {
            path:'/person',
            component: resolve => require(['../pages/framework/person.vue'], resolve)

        },
        {
            path:'/position',
            component: resolve => require(['../pages/framework/position.vue'], resolve)

        },
        {
            path:'/personprofile',
            component: resolve => require(['../pages/framework/personprofile.vue'], resolve)

        },
        {
            path:'/personedit',
            component: resolve => require(['../pages/framework/personedit.vue'], resolve)

        });
    return json;
}

let approuter = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../pages/index.vue'], resolve),
            children: generateRoutesFromMenu(),
        },
        {
            path: '/backstage',
            component: resolve => require(['../pages/backstage.vue'], resolve),
            children:generateRoutesFromAdminMenu(),
        },
        {
            path: '/login',
            component: resolve => require(['../pages/login.vue'], resolve)
        }
    ]
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
