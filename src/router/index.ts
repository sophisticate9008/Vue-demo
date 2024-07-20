import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


// 定义路由
const routes: Array<RouteRecordRaw> = [
    { path: '/loginRegister', name: 'loginRegister', component: () => import('../views/LoginRegister.vue'), meta: { title: "登录/注册"} },
    { path: '/profile', name: 'profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true, title: "个人资料" } },
    { path: "/setting", name: "setting", component: () => import('../views/Setting.vue'), meta: { requiresAuth: true, title: "设置" } },
    { path: "/addOrUpdateCommission/:id", name: "setting", component: () => import('../views/AddOrUpdateCommission.vue'), meta: { requiresAuth: true , title: "添加/更新委托" } },
    { path: "/", name: "home", component: () => import('../views/Home.vue'), meta: { title: "首页" }} ,
    { path: "/commissionDetail/:id", name: "commissionDetail", component: () => import('../views/CommissionDetail.vue'),meta: { requiresAuth: true , title: "委托详情" } }
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// const loadComponent = (component: string) => {
//     return () => import(`../views/${component}.vue`);
// };


// 模拟一个简单的认证服务
router.beforeEach((to, from, next) => {
    
    if(to.meta.title) {
        window.document.title = to.meta.title as string;
    }
    
    if (to.meta.requiresAuth && !window.localStorage.getItem('authToken')) {
        next({ name: 'loginRegister', query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

// 路由守卫


export default router;
