import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import './index.css';
import router from './router';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheckCircle);
library.add(faThumbsUp);
library.add(faTrashAlt);
library.add(faTimes);
library.add(faEdit);
library.add(faSadTear);

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.headers.Authorization = `Bearer ${store.state.accessToken}`;

const func = async function () {
	const val = await store.dispatch('authCheck');

	createApp(App)
		.component('font-awesome-icon', FontAwesomeIcon)
		.use(router)
		.use(store)
		.mount('#app');
};

func();
