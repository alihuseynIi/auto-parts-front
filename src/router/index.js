import { createRouter, createWebHistory } from 'vue-router';
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import store from '@/store';
import CartView from "@/views/CartView.vue";

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guestOnly: true }
        },
        {
            path: '/cart',
            name: 'cart',
            component: CartView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const isLoggedIn = store.getters.isLoggedIn;

    if (isLoggedIn && !store.state.userData) {
        try {
            await store.dispatch('fetchUserData');
            proceed();
        } catch (error) {
            console.error('Error fetching user data:', error);
            await store.dispatch('logout');
            next({ name: 'login' });
        }
    } else {
        proceed();
    }

    function proceed() {
        if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
            next({ name: 'login' });
        } else if (to.matched.some(record => record.meta.guestOnly) && isLoggedIn) {
            next({ name: 'home' });
        } else {
            next();
        }
    }
});

export default router;
