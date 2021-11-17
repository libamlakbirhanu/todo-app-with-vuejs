import { reactive } from '@vue/reactivity';
import en from './languages/english';
import amh from './languages/amharic';

export default {
	state: reactive({
		isAuthenticated: false,
		currentUser: null,
		loadingUser: false,
		searchResults: null,
		filterResults: null,
		language: en,
	}),

	toggleLoadingUser() {
		this.state.loadingUser = !this.state.loadingUser;
	},

	sortTasks(tasks) {
		tasks.sort(function (task1, task2) {
			return Date.parse(task2.createdAt) - Date.parse(task1.createdAt);
		});
	},

	resetTasks() {
		this.state.searchResults = null;
		this.state.filterResults = null;
	},

	setCurrentUser(user) {
		this.state.currentUser = user;
		this.state.isAuthenticated = true;

		if (this.state.currentUser && this.state.currentUser.tasks) {
			let tempTasks = [...this.state.currentUser.tasks];
			const tempComplete = [];
			const tempIncomplete = [];

			tempTasks.forEach((tempTask, index) => {
				if (tempTask.completed === true) {
					tempComplete.push(tempTask);
				} else {
					tempIncomplete.push(tempTask);
				}
			});

			this.sortTasks(tempIncomplete);
			this.sortTasks(tempComplete);

			this.state.currentUser.tasks = [...tempIncomplete, ...tempComplete];
		}
	},

	removeCurrentUser() {
		this.state.currentUser = null;
		this.state.isAuthenticated = false;
	},

	showSearchResults(target) {
		if (this.state.currentUser.tasks) {
			this.state.searchResults = this.state.currentUser.tasks.filter((task) => {
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

	clearSearchResults() {
		this.state.searchResults = null;
	},

	showFilterResults(target) {
		if (this.state.currentUser.tasks) {
			switch (target) {
				case 'incomplete':
					this.state.filterResults = this.state.currentUser.tasks.filter(
						(task) => !task.completed
					);
					break;
				case 'complete':
					this.state.filterResults = this.state.currentUser.tasks.filter(
						(task) => task.completed
					);
					break;
				case 'all':
					this.state.filterResults = null;
					break;
			}
		}

		this.state.searchResults = null;
	},

	addTask(task) {
		this.state.currentUser.tasks.unshift(task);
	},

	editTask(id, task) {
		const index = this.state.currentUser.tasks.findIndex(
			(task) => task.id === id
		);

		this.state.currentUser.tasks[index] = task;
	},

	removeTask(id) {
		this.state.currentUser.tasks = this.state.currentUser.tasks.filter(
			(task) => task.id !== id
		);
	},

	markTaskComplete(id) {
		const index = this.state.currentUser.tasks.findIndex(
			(target) => target.id === id
		);
		const tempTasks = [...this.state.currentUser.tasks];
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

		this.sortTasks(tempIncomplete);
		this.sortTasks(tempComplete);

		this.state.currentUser.tasks = [...tempIncomplete, ...tempComplete];
	},

	selectLanguage(lang) {
		switch (lang) {
			case 'en':
				this.state.language = en;
				break;
			case 'amh':
				this.state.language = amh;
				break;
		}
	},
};
