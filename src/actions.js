import axios from 'axios';
import store from 'storejs';

export default {
	async authCheck() {
		this.commit('toggleLoadingUser');
		this.commit('selectLanguage', 'amh');
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
				console.error(err);
				this.commit('toggleLoadingUser');
				return Promise;
			});
	},
	editTask(state, payload) {
		axios
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
				console.error(err);
			});
	},
	removeTask(state, payload) {
		axios
			.delete(`/tasks/${payload.id}`, {
				withCredentials: true,
			})
			.then((res) => {
				this.commit('removeTask', payload.id);
				payload.cb();
			})
			.catch((err) => console.log(err.response));
	},
	markTaskComplete(state, id) {
		axios
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
			.catch((err) => console.log(err));
	},
	addTask(state, { cb, task }) {
		try {
			axios
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
					if (err.response.status === 401) {
						this.$router.push({ name: 'Login' });
					} else {
						cb();
					}
				});
		} catch (err) {
			console.error(err);
		}
	},
	login(state, { formData, routeToHome }) {
		try {
			axios
				.post(`/auth/login`, formData, {
					withCredentials: true,
				})
				.then((res) => {
					store.set('accessToken', res.data.accessToken);
					this.commit('toggleLoadingUser');
					this.commit('setCurrentUser', res.data);
					routeToHome();
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.error(err);
		}
	},
	register(state, { formData, routeToLogin }) {
		try {
			axios
				.post(`/auth/register`, formData, {
					withCredentials: true,
				})
				.then((res) => {
					// store.setCurrentUser(res.data);
					routeToLogin();
				});
		} catch (err) {
			console.error(err);
		}
	},
};
