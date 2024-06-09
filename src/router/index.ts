import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


// 定义路由
const routes: Array<RouteRecordRaw> = [
    { path: '/loginRegister', name: 'loginRegister', component: () => import('../views/LoginRegister.vue') },
    { path: '/profile', name: 'profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },

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
    if (to.meta.requiresAuth && !localStorage.getItem('authToken')) {
        next({ name: 'loginRegister', query: { redirect: to.fullPath } });
    } else {
        next();
    }
});

// 路由守卫


export default router;
