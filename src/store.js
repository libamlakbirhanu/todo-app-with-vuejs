import en from './languages/english';
import amh from './languages/amharic';

import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
	state() {
		return {
			isAuthenticated: false,
			currentUser: null,
			loadingUser: false,
			searchResults: null,
			filterResults: null,
			showNavbar: false,
			accessToken: null,
			language: en,
		};
	},
	actions: {
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
	},
	mutations: {
		showNavbar(state, path) {
			if (path === '/login') {
				state.showNavbar = false;
			} else if (path === '/register') {
				state.showNavbar = false;
			} else {
				state.showNavbar = true;
			}
		},

		toggleLoadingUser(state) {
			state.loadingUser = !state.loadingUser;
		},

		sortTasks(state, tasks) {
			tasks.sort(function (task1, task2) {
				return Date.parse(task2.createdAt) - Date.parse(task1.createdAt);
			});
		},

		resetTasks(state) {
			state.searchResults = null;
			state.filterResults = null;
		},

		setCurrentUser(state, user) {
			state.currentUser = user;
			state.isAuthenticated = true;

			if (state.currentUser && state.currentUser.tasks) {
				let tempTasks = [...state.currentUser.tasks];
				const tempComplete = [];
				const tempIncomplete = [];

				tempTasks.forEach((tempTask, index) => {
					if (tempTask.completed === true) {
						tempComplete.push(tempTask);
					} else {
						tempIncomplete.push(tempTask);
					}
				});

				this.commit('sortTasks', tempIncomplete);
				this.commit('sortTasks', tempComplete);

				state.currentUser.tasks = [...tempIncomplete, ...tempComplete];
			}
		},

		removeCurrentUser(state) {
			state.currentUser = null;
			state.isAuthenticated = false;
		},

		showSearchResults(state, target) {
			if (state.currentUser.tasks) {
				state.searchResults = state.currentUser.tasks.filter((task) => {
					const words = target.toLowerCase().split(' ');
					let flag = false;
					for (let i = 0; i < words.length; i++) {
						if (task.body.toLowerCase().split(' ').includes(words[i])) {
							flag = true;
							break;
						}
					}
					return flag;
				});
			}
		},

		clearSearchResults(state) {
			state.searchResults = null;
		},

		showFilterResults(state, target) {
			if (state.currentUser.tasks) {
				switch (target) {
					case 'incomplete':
						state.filterResults = state.currentUser.tasks.filter(
							(task) => !task.completed
						);
						break;
					case 'complete':
						state.filterResults = state.currentUser.tasks.filter(
							(task) => task.completed
						);
						break;
					case 'all':
						state.filterResults = null;
						break;
				}
			}

			state.searchResults = null;
		},

		addTask(state, task) {
			state.currentUser.tasks.unshift(task);
		},

		editTask(state, payload) {
			const index = state.currentUser.tasks.findIndex(
				(task) => task.id === payload.id
			);

			state.currentUser.tasks[index] = payload.task;
		},

		removeTask(state, id) {
			state.currentUser.tasks = state.currentUser.tasks.filter(
				(task) => task.id !== id
			);
		},

		markTaskComplete(state, id) {
			const index = state.currentUser.tasks.findIndex(
				(target) => target.id === id
			);
			const tempTasks = [...state.currentUser.tasks];
			tempTasks[index] = {
				...tempTasks[index],
				completed: true,
			};

			const tempComplete = [];
			const tempIncomplete = [];

			tempTasks.forEach((tempTask, index) => {
				if (tempTask.completed === true) {
					tempComplete.push(tempTask);
				} else {
					tempIncomplete.push(tempTask);
				}
			});

			this.commit('sortTasks', tempIncomplete);
			this.commit('sortTasks', tempComplete);

			state.currentUser.tasks = [...tempIncomplete, ...tempComplete];
		},

		selectLanguage(state, lang) {
			switch (lang) {
				case 'en':
					state.language = en;
					break;
				case 'amh':
					state.language = amh;
					break;
			}
		},
	},
});

export default store;
