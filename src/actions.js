import axios from 'axios';
import store from 'storejs';

export default {
	async authCheck(routeToLogin) {
		this.commit('toggleLoadingUser');
		axios
			.post(`http://localhost:5000/auth/authcheck`, null, {
				withCredentials: true,
			})
			.then((res) => {
				this.commit('setCurrentUser', res.data);
				this.commit('toggleLoadingUser');

				return this.state.isAuthenticated;
			})
			.catch((err) => {
				this.commit('toggleLoadingUser');
				if (err.response.status === 401) {
					err.response.data.message =
						'your session has expired. Please login again';
					throw err;
				}
			});
	},
	editTask(state, payload) {
		return axios
			.patch(
				`/tasks/${payload.id}`,
				{ body: payload.task.trim() },
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				this.commit('editTask', {
					id: payload.id,
					task: { ...res.data.task },
				});

				payload.cb();
			})
			.catch((err) => {
				throw err;
			});
	},
	removeTask(state, payload) {
		return axios
			.delete(`/tasks/${payload.id}`, {
				withCredentials: true,
			})
			.then((res) => {
				this.commit('removeTask', payload.id);
				payload.cb();
			})
			.catch((err) => {
				throw err;
			});
	},
	markTaskComplete(state, id) {
		return axios
			.patch(
				`/tasks/complete/${id}`,
				{},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				this.commit('markTaskComplete', id);
			})
			.catch((err) => {
				throw err;
			});
	},
	addTask(state, { task, routeToLogin }) {
		return axios
			.post(
				`/tasks`,
				{ body: task.trim() },
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				this.commit('addTask', { ...res.data });
			})
			.catch((err) => {
				throw err;
			});
	},
	login(state, { formData, routeToHome }) {
		return axios
			.post(`/auth/login`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				store.set('accessToken', res.data.accessToken);
				state.accessToken = res.data.accessToken;
				this.commit('toggleLoadingUser');
				this.commit('setCurrentUser', res.data);
				routeToHome();
			})
			.catch((err) => {
				throw err;
			});
	},
	register(state, { formData, routeToLogin }) {
		return axios
			.post(`/auth/register`, formData, {
				withCredentials: true,
			})
			.then((res) => {
				// store.setCurrentUser(res.data);
				routeToLogin();
			})
			.catch((err) => {
				throw err;
			});
	},
};
