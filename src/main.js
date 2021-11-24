import { createApp } from 'vue';
import vueXStore from './vueXStore';
import store from 'storejs';
import App from './App.vue';
import './index.css';
import router from './router';
import axios from 'axios';
import messages from './languages/texts';
import { createI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheckCircle);
library.add(faThumbsUp);
library.add(faTrashAlt);
library.add(faTimes);
library.add(faEdit);
library.add(faSadTear);
library.add(faFlag);

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.headers.Authorization = vueXStore.state.aceseeToken
	? vueXStore.state.aceseeToken
	: `Bearer ${store.get('accessToken')}`;

const i18n = createI18n({
	locale: store.get('lang') ? store.get('lang') : 'amh',
	fallbackLocale: 'en',
	messages,
});

const func = async function () {
	const val = await vueXStore.dispatch('authCheck');

	createApp(App)
		.component('font-awesome-icon', FontAwesomeIcon)
		.use(i18n)
		.use(router)
		.use(vueXStore)
		.mount('#app');
};

func();
