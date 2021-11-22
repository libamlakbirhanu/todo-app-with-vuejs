import { createWebHistory, createRouter } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
// import store from './../store';

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
	},
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: { requiresAuth: true },
	},
	{
		path: '/:catchAll(.*)',
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		if (!store.state.isAuthenticated) {
			next({
				name: 'Login',
			});
		}
	} else {
		next();
	}
});

export default router;
