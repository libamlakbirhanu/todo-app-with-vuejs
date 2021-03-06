import actions from './actions';

import { createStore } from 'vuex';

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
		};
	},
	actions: { ...actions },
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
	},
});

export default store;
